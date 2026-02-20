"""Estimate operational cost for routes."""


def estimate_cost(route, cost_per_km: float = 1.0):
    """Return estimated cost for a single route (placeholder)."""
    distance = route.get("distance", 0)
    return distance * cost_per_km
