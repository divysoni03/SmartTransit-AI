from math import sqrt
import random

KM_PER_DEGREE = 111


def geo_distance(a, b):
    return sqrt(
        (a["lat"] - b["lat"])**2 +
        (a["lng"] - b["lng"])**2
    ) * KM_PER_DEGREE


def route_distance(route):
    if len(route) < 2:
        return 0.8

    total = 0
    for i in range(len(route) - 1):
        total += geo_distance(route[i], route[i + 1])
    return total


def estimate_route_demand(route):
    """
    Simulate passenger demand based on clustering density
    (central routes get higher demand)
    """
    lat_center = sum(s["lat"] for s in route) / len(route)
    lng_center = sum(s["lng"] for s in route) / len(route)

    # simulate urban core near center of map
    density_factor = 1 + random.uniform(0.4, 1.6)

    return len(route) * density_factor


def calculate_frequency(routes, total_buses, avg_speed_kmph):

    route_stats = []

    # compute route stats
    for r in routes:
        length = route_distance(r)
        demand = estimate_route_demand(r)
        score = demand * 1.5 + length  # demand weighted more

        route_stats.append({
            "route": r,
            "length": length,
            "demand": demand,
            "score": score
        })

    total_score = sum(r["score"] for r in route_stats)

    results = []

    for i, r in enumerate(route_stats):

        share = r["score"] / total_score
        buses = max(1, round(total_buses * share))

        # round trip cycle time
        round_trip_time = (r["length"] / avg_speed_kmph) * 60 * 2
        dwell_delay = len(r["route"]) * 0.5
        cycle_time = round_trip_time + dwell_delay

        headway = cycle_time / buses
        avg_wait = headway / 2

        results.append({
            "route_id": f"R{i+1}",
            "stops": len(r["route"]),
            "distance_km": round(r["length"], 2),
            "travel_time_min": round(round_trip_time/2, 1),
            "buses_assigned": buses,
            "frequency_min": round(headway, 1),
            "avg_wait_time_min": round(avg_wait, 1),
            "demand_score": round(r["demand"], 1)
        })

    return results