from typing import List, Dict
import numpy as np
from sklearn.cluster import KMeans


def generate_stops(weighted_points: List[Dict], num_buses: int) -> List[Dict]:
    """Generate stop coordinates using KMeans clustering.

    Uses n_clusters = num_buses * 2 by default.
    """
    if not weighted_points:
        return []

    coords = np.array([[p["lat"], p["lng"]] for p in weighted_points])
    weights = np.array([p.get("weight", 1.0) for p in weighted_points])

    n_clusters = max(1, num_buses * 2)
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    # sklearn KMeans doesn't accept sample_weight for fit_predict in older versions, fit then predict
    kmeans.fit(coords, sample_weight=weights)
    centers = kmeans.cluster_centers_

    stops = []
    for c in centers:
        stops.append({"lat": float(c[0]), "lng": float(c[1])})

    return stops
"""Generate candidate stops from grid or demand points."""
from typing import List, Tuple


def generate_stops(points: List[Tuple[float, float]], max_stops: int = 50):
    """Return a trimmed list of stops (placeholder)."""
    return points[:max_stops]
