import math

KM_PER_DEGREE = 111.0


def haversine_km(a, b):
    """Haversine distance between two points in km."""
    R = 6371.0
    lat1, lat2 = math.radians(a["lat"]), math.radians(b["lat"])
    dlat = lat2 - lat1
    dlng = math.radians(b["lng"] - a["lng"])
    h = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng/2)**2
    return R * 2 * math.asin(math.sqrt(min(1.0, h)))


def route_distance(route):
    """Total route length in km using Haversine distances."""
    if len(route) < 2:
        return 0.8
    return sum(haversine_km(route[i], route[i + 1]) for i in range(len(route) - 1))


def compute_stop_demand(stops, all_stops):
    """
    Deterministic demand score based on:
    - Distance from global centroid (central stops get more riders)
    - Cluster tightness (more stops nearby = higher interchange demand)
    """
    if not all_stops:
        return 1.0

    # Global centroid of all stops
    lat_c = sum(s["lat"] for s in all_stops) / len(all_stops)
    lng_c = sum(s["lng"] for s in all_stops) / len(all_stops)

    # Centroid of this route's stops
    lat_r = sum(s["lat"] for s in stops) / len(stops)
    lng_r = sum(s["lng"] for s in stops) / len(stops)

    # Distance of route centroid from global centroid (smaller = more central = higher demand)
    dist_from_core = math.sqrt((lat_r - lat_c)**2 + (lng_r - lng_c)**2)

    # Max possible distance for normalization
    max_dist = max(
        math.sqrt((s["lat"] - lat_c)**2 + (s["lng"] - lng_c)**2)
        for s in all_stops
    ) or 1.0

    centrality_score = 1.0 - (dist_from_core / max_dist)  # 0=peripheral, 1=central

    # Cluster tightness: how close together are stops in this route
    if len(stops) > 1:
        intra_distances = [
            haversine_km(stops[i], stops[j])
            for i in range(len(stops))
            for j in range(i+1, len(stops))
        ]
        avg_intra = sum(intra_distances) / len(intra_distances) if intra_distances else 1.0
        tightness = max(0.1, 1.0 / (1.0 + avg_intra))  # tighter = higher
    else:
        tightness = 0.5

    # Combined demand: central + dense routes get more riders
    demand = len(stops) * (1.5 * centrality_score + 0.8 * tightness + 0.7)

    return max(1.0, demand)


def calculate_frequency(routes, total_buses, avg_speed_kmph):
    """
    Demand-proportional bus allocation with minimum service guarantee.
    Each route gets at least 2 buses regardless of demand share.
    """
    # Flatten all stops across routes for global centroid calculation
    all_stops = []
    route_stats = []

    for r in routes:
        if isinstance(r, dict) and "stops" in r:
            stops_list = r["stops"]
            path_list = r["path"]
        else:
            stops_list = r
            path_list = r

        all_stops.extend(stops_list)
        route_stats.append({
            "stops_list": stops_list,
            "path": path_list,
        })

    # Compute demand scores with global context
    for r in route_stats:
        r["length"] = route_distance(r["path"])
        r["demand"] = compute_stop_demand(r["stops_list"], all_stops)
        r["score"] = r["demand"] * 1.5 + r["length"]

    total_score = sum(r["score"] for r in route_stats) or 1.0

    # First pass: proportional allocation
    allocations = []
    for r in route_stats:
        share = r["score"] / total_score
        buses = max(2, round(total_buses * share))  # MINIMUM 2 buses per route
        allocations.append(buses)

    # Rescale if total exceeds fleet (due to minimum guarantees)
    allocated_total = sum(allocations)
    if allocated_total > total_buses:
        scale = total_buses / allocated_total
        allocations = [max(2, round(b * scale)) for b in allocations]

    results = []
    for i, r in enumerate(route_stats):
        buses = allocations[i]

        round_trip_time = (r["length"] / max(1, avg_speed_kmph)) * 60 * 2
        dwell_delay = len(r["stops_list"]) * 0.5
        cycle_time = round_trip_time + dwell_delay

        headway = cycle_time / buses if buses else 0
        avg_wait = headway / 2

        results.append({
            "route_id": f"R{i+1}",
            "stops": len(r["stops_list"]),
            "stops_list": r["stops_list"],
            "distance_km": round(r["length"], 2),
            "travel_time_min": round(round_trip_time / 2, 1),
            "buses_assigned": buses,
            "frequency_min": round(headway, 1),
            "avg_wait_time_min": round(avg_wait, 1),
            "demand_score": round(r["demand"], 1),
            "path": r["path"]
        })

    return results