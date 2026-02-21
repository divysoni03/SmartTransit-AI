def estimate_route_count(num_buses, area_km2, avg_speed_kmph=19, target_headway_min=20):
    """
    Level-of-Service (LOS) based route count estimator.

    Calculates the number of routes needed so that, on average, each route 
    achieves the target headway given the bus fleet available.

    LOS Formula:
        cycle_time_per_route ≈ (2 * avg_route_len / speed) * 60 + dwell_time
        buses_per_route = cycle_time / target_headway
        route_count = total_buses / buses_per_route

    Inputs:
        avg_speed_kmph: average bus operating speed
        target_headway_min: desired maximum gap between buses (minutes)
    """
    # Estimate average route length from area (heuristic: diameter / 3)
    import math
    estimated_diameter_km = 2 * math.sqrt(area_km2 / math.pi)
    avg_route_len_km = estimated_diameter_km / 3.0

    # One-way travel time + 2 min dwell per stop (assume ~8 stops avg per route)
    one_way_time_min = (avg_route_len_km / avg_speed_kmph) * 60
    dwell_total = 8 * 0.5  # 0.5 min per stop
    cycle_time_min = one_way_time_min * 2 + dwell_total

    # Buses needed per route to hit target headway
    buses_per_route = max(1.0, cycle_time_min / target_headway_min)

    # Total routes possible with fleet
    routes = int(num_buses / buses_per_route)

    # Clamp: minimum 3 routes, cap at 16 to keep UI manageable
    return max(3, min(routes, 16))