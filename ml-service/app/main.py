from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import time
from typing import List

from app.schemas.request_schema import OptimizationRequest
from app.preprocessing.polygon_processor import coords_to_polygon
from app.preprocessing.grid_generator import generate_grid
from app.preprocessing.demand_simulator import assign_weights
from app.clustering.stop_generator import generate_stops
from app.routing.osm_loader import load_graph_from_polygon
from app.routing.route_builder import build_routes_from_stops
from app.optimization.route_allocator import allocate_buses
from app.analytics.coverage_analyzer import compute_coverage


app = FastAPI(title="Smart Transit AI - ML Service")

# Allow CORS for local development; set via env in production
allow_origins = os.getenv("ML_ALLOWED_ORIGINS", "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[allow_origins] if allow_origins != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"status": "ML Service is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/optimize")
def run_optimization(request: OptimizationRequest):
    start = time.time()
    try:
        # 1. Build polygon
        polygon = coords_to_polygon([p.dict() for p in request.boundary])

        # 2. Generate grid
        cells = generate_grid(polygon, cell_size_m=500)

        # 3. Assign synthetic demand weights
        weighted = assign_weights(cells, center_bias=1.0)

        # 4. Generate stops via clustering
        stops = generate_stops(weighted, num_buses=request.num_buses)

        # 5. Load OSM graph
        G = load_graph_from_polygon(polygon)

        # 6. Build routes (simple greedy route builder)
        routes = build_routes_from_stops(G, stops)

        # 7. Allocate buses
        allocation = allocate_buses(routes, request.num_buses, request.avg_speed_kmph)

        # 8. Coverage
        coverage_percent = compute_coverage(polygon, routes, buffer_m=400)

        # 9. Metrics
        total_km = sum(a.get("length_km", 0) for a in allocation) if allocation else 0

        execution_time = time.time() - start

        # Build GeoJSON features
        stops_features = []
        for s in stops:
            stops_features.append({
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [s["lng"], s["lat"]]},
                "properties": {},
            })

        routes_features = []
        for r in routes:
            routes_features.append({
                "type": "Feature",
                "geometry": {"type": "LineString", "coordinates": r},
                "properties": {},
            })

        response = {
            "stops": stops_features,
            "routes": routes_features,
            "allocation": allocation,
            "coverage_percent": coverage_percent,
            "metrics": {
                "total_km": total_km,
                "execution_time_s": execution_time,
            },
            "execution_time_s": execution_time,
        }

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
