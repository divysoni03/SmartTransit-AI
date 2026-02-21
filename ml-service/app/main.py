from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.request_schema import OptimizeRequest

from app.preprocessing.grid_generator import generate_grid
from app.preprocessing.demand_simulator import simulate_demand
from app.clustering.stop_generator import generate_bus_stops
from app.routing.route_builder import build_routes
from app.optimization.frequency_calculator import calculate_frequency
from app.analytics.metrics_engine import compute_metrics
from app.optimization.route_estimator import estimate_route_count
from app.preprocessing.spatial_utils import estimate_area_km2
from app.routing.osm_loader import load_graph_from_polygon
from app.preprocessing.polygon_processor import coords_to_polygon

app = FastAPI(title="SmartTransit AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/optimize")
def optimize(req: OptimizeRequest):

    # 1. Geometry processing
    polygon = coords_to_polygon([p.model_dump() for p in req.boundary])
    area = estimate_area_km2([p.model_dump() for p in req.boundary])
    
    # 2. Load Real Road Network using OSMnx!
    try:
        G = load_graph_from_polygon(polygon)
    except Exception as e:
        print(f"OSM network routing failed: {e}")
        G = None # fallback

    # 3. demand & stops
    grid = generate_grid([p.model_dump() for p in req.boundary])
    demand = simulate_demand(grid)
    stops = generate_bus_stops(demand, area_km2=area)

    # 4. routes
    route_count = estimate_route_count(req.num_buses, area)
    
    # We pass G down so build_routes can use real network paths
    routes_raw = build_routes(stops, route_count, G=G)

    # 5. scheduling & analytics 
    routes = calculate_frequency(routes_raw, req.num_buses, req.avg_speed_kmph)

    # 5 analytics
    metrics = compute_metrics(routes, req.parameters)

    return {
        "status":"completed",
        "city":req.city_name,
        "stops":stops,
        "routes":routes,
        "metrics":metrics
    }