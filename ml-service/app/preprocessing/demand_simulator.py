from typing import List, Dict
import random
import math


def assign_weights(cells: List[Dict], center_bias: float = 1.0) -> List[Dict]:
    """Assign synthetic demand weights to grid cell centroids.

    Weight = random component + center bias (closer to polygon centroid gets higher weight)
    """
    if not cells:
        return []

    # compute centroid of all points
    avg_lat = sum(c["lat"] for c in cells) / len(cells)
    avg_lng = sum(c["lng"] for c in cells) / len(cells)

    weighted = []
    for c in cells:
        # distance (approx degrees) to center
        d = math.hypot(c["lat"] - avg_lat, c["lng"] - avg_lng)
        # center bias inversely proportional to distance
        bias = center_bias / (1 + d * 100)  # scale distance
        rand = random.random()
        weight = rand + bias
        weighted.append({"lat": c["lat"], "lng": c["lng"], "weight": weight})

    # normalize weights
    total = sum(w["weight"] for w in weighted)
    if total > 0:
        for w in weighted:
            w["weight"] = w["weight"] / total

    return weighted
"""Demand simulation helpers (simple stubs)."""
from typing import List, Tuple


def simulate_demand(points: List[Tuple[float, float]], samples: int = 100):
    """Return a list of demand values for input points (placeholder)."""
    return [1.0 for _ in points]
