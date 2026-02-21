import math


# CO₂ emissions saved vs car travel (kg CO₂ per passenger-km)
# Average car: ~0.171 kg CO₂/km. Bus: ~0.089 kg CO₂/pkm. Saving ≈ 0.082 per shift.
CO2_SAVING_PER_PASSENGER_KM = 0.082

# Average bus occupancy at moderate ridership (%)
AVG_OCCUPANCY_RATE = 0.55

# Average trip distance (km) a rider makes on the network
AVG_TRIP_DISTANCE_KM = 4.5


def compute_metrics(routes, parameters=None):
    """
    Multi-factor analytics engine using transport planning models.

    Metrics:
    - coverage: computed from stop walkability radii vs polygon area
    - ridership: frequency-adjusted, peak/off-peak split, density-scaled
    - co2_saved: modal shift model (passengers switched from cars to buses)
    - avg_wait: harmonic mean of per-route wait times weighted by demand
    - los_score: Level of Service composite index (0-100)
    """
    if not parameters:
        parameters = {}

    if not routes:
        return {"coverage": 0, "estimated_ridership": 0, "co2_saved_kg_day": 0, "avg_wait_time": 0, "los_score": 0}

    max_walk_m = float(parameters.get("max_walk_distance_m", 500))
    pop_density = parameters.get("population_density", "urban")
    c_weight = float(parameters.get("commercial_weight", 1.5))
    r_weight = float(parameters.get("residential_weight", 1.2))
    s_weight = float(parameters.get("school_weight", 1.3))

    # ── Population density multiplier (ridership demand scaler) ──
    density_scale = {"metro": 1.8, "urban": 1.2, "suburban": 0.7, "rural": 0.4}
    pop_mult = density_scale.get(pop_density, 1.0)

    # ── Land use weight score (higher commercial/school areas = more riders) ──
    land_use_score = (c_weight * 0.4 + r_weight * 0.35 + s_weight * 0.25) / 1.5

    # ── Total route distances ──
    total_dist_km = sum(r["distance_km"] for r in routes)
    total_stops = sum(r["stops"] for r in routes)

    # ── Coverage: walkability-based ──
    # Each stop covers a circle of radius max_walk_m
    # Coverage = min(1, total_stop_area / estimated_service_area)
    # Estimate service area from total route length (buffer model)
    walk_radius_km = max_walk_m / 1000.0
    covered_area_km2 = total_stops * math.pi * walk_radius_km**2
    service_area_km2 = total_dist_km * (2 * walk_radius_km)  # corridor buffer
    if service_area_km2 > 0:
        raw_coverage = covered_area_km2 / service_area_km2
    else:
        raw_coverage = 0.5
    coverage = round(min(0.98, 0.35 + raw_coverage * 0.6), 2)

    # ── Daily ridership: frequency-adjusted, peak/off-peak model ──
    # Higher frequency → more spontaneous riders → +30% pickup
    avg_frequency = sum(r["frequency_min"] for r in routes) / len(routes)
    frequency_bonus = max(0.5, 1.3 - (avg_frequency / 60))  # better frequency = more riders

    base_ridership_per_km = 90  # riders/km/day in standard urban conditions
    estimated_ridership = int(
        total_dist_km * base_ridership_per_km * pop_mult * land_use_score * frequency_bonus
    )

    # ── CO₂ saved: modal shift model ──
    # Estimate daily passenger-km moved by the network
    total_buses = sum(r["buses_assigned"] for r in routes)
    daily_capacity = total_buses * AVG_OCCUPANCY_RATE * 2 * 12 * 50  # 2 directions * 12hrs * 50 cap
    daily_passenger_km = min(estimated_ridership, daily_capacity) * AVG_TRIP_DISTANCE_KM
    co2_saved = round(daily_passenger_km * CO2_SAVING_PER_PASSENGER_KM, 1)

    # ── Average wait time (demand-weighted harmonic mean) ──
    demand_scores = [r.get("demand_score", 1) for r in routes]
    total_demand = sum(demand_scores) or 1
    wait_times = [r["avg_wait_time_min"] for r in routes]
    weighted_wait = sum(w * d for w, d in zip(wait_times, demand_scores)) / total_demand
    avg_wait = round(weighted_wait, 1)

    # ── Level of Service score (0–100 composite index) ──
    # Combines coverage, frequency, and wait time into a single score
    freq_score = max(0, 100 - avg_frequency * 2)   # 0 min headway = 100, 50 min = 0
    wait_score = max(0, 100 - avg_wait * 3)         # 0 min wait = 100, 33 min = 0
    cov_score = coverage * 100
    los_score = round((freq_score * 0.4 + wait_score * 0.35 + cov_score * 0.25), 1)

    return {
        "coverage": coverage,
        "estimated_ridership": estimated_ridership,
        "co2_saved_kg_day": co2_saved,
        "avg_wait_time": avg_wait,
        "los_score": los_score,
        "total_routes": len(routes),
        "total_buses": total_buses,
        "avg_frequency_min": round(avg_frequency, 1),
        "network_km": round(total_dist_km, 1)
    }