from fastapi import FastAPI
from app.schemas.request_schema import OptimizeRequest

from app.preprocessing.grid_generator import generate_grid
from app.preprocessing.demand_simulator import simulate_demand
from app.clustering.stop_generator import generate_bus_stops
from app.routing.route_builder import build_routes
from app.optimization.frequency_calculator import calculate_frequency
from app.analytics.metrics_engine import compute_metrics
from app.optimization.route_estimator import estimate_route_count
from app.preprocessing.spatial_utils import estimate_area_km2

app = FastAPI(title="SmartTransit AI")

@app.post("/optimize")
def optimize(req: OptimizeRequest):

    # 1 demand points
    grid = generate_grid([p.model_dump() for p in req.boundary])
    demand = simulate_demand(grid)

    # 2 stops
    stops = generate_bus_stops(demand, 20)

    # 3 routes
    
    area = estimate_area_km2([p.model_dump() for p in req.boundary])
    route_count = estimate_route_count(req.num_buses, area)

    routes_raw = build_routes(stops, route_count)

    # 4 scheduling
    routes = calculate_frequency(routes_raw, req.num_buses, req.avg_speed_kmph)

    # 5 analytics
    metrics = compute_metrics(routes)

    return {
        "status":"completed",
        "city":req.city_name,
        "stops":stops,
        "routes":routes,
        "metrics":metrics
    }