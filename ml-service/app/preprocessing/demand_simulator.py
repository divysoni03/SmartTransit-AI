import math

def simulate_demand(points):
    """
    Urban Gravity Model: assigns demand weights using spatial distance falloff 
    from the geographic centroid (simulates urban core density patterns).
    Points closer to the center get exponentially higher demand.
    """
    if not points:
        return []

    # Compute geographic centroid
    lat_c = sum(p[0] for p in points) / len(points)
    lng_c = sum(p[1] for p in points) / len(points)

    # Compute max distance for normalization
    def dist(p):
        return math.sqrt((p[0] - lat_c)**2 + (p[1] - lng_c)**2)

    max_d = max(dist(p) for p in points) or 1.0

    weighted = []
    for p in points:
        d = dist(p)
        # Gravity falloff: weight = e^(-2 * normalized_distance)
        # Results in ~7x more demand at center vs boundary
        normalized = d / max_d
        gravity_weight = math.exp(-2.5 * normalized)

        # Convert to integer repetitions (1 to 10 scale)
        repeat = max(1, round(gravity_weight * 10))
        for _ in range(repeat):
            weighted.append(p)

    return weighted