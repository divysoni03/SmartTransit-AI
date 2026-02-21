import math
import numpy as np
from sklearn.cluster import KMeans


def generate_bus_stops(points, area_km2=None, min_stop_distance_m=300):
    """
    Demand-weighted KMeans stop placement with minimum inter-stop distance filter.

    1. Run KMeans with sample_weight from demand (high-demand areas attract more stops)
    2. Post-filter stops that are too close together (< min_stop_distance_m)
    """
    if not points:
        return []

    arr = np.array(points)  # shape: (N, 2) = [(lat, lng), ...]

    # Compute demand weight per point (gravity: closer to centroid = higher weight)
    centroid = arr.mean(axis=0)
    dists = np.linalg.norm(arr - centroid, axis=1)
    max_d = dists.max() or 1.0
    weights = np.exp(-2.5 * (dists / max_d))  # same gravity model as demand simulator

    # Dynamic k from area
    if area_km2 and area_km2 > 0:
        k = max(5, min(80, int(area_km2 * 4)))
    else:
        k = 20

    if len(points) < k:
        k = max(2, len(points) // 2)

    model = KMeans(n_clusters=k, n_init=15, random_state=42)
    model.fit(arr, sample_weight=weights)

    centers = model.cluster_centers_  # shape: (k, 2)

    # --- Minimum distance deduplication ---
    # Haversine-based filter: remove stops closer than min_stop_distance_m
    R_m = 6371000.0  # Earth radius in meters
    min_dist_deg = min_stop_distance_m / 111000.0  # rough degree equivalent

    accepted = []
    for c in centers:
        lat, lng = float(c[0]), float(c[1])
        too_close = False
        for a in accepted:
            dlat = lat - a["lat"]
            dlng = (lng - a["lng"]) * math.cos(math.radians((lat + a["lat"]) / 2))
            if math.sqrt(dlat**2 + dlng**2) < min_dist_deg:
                too_close = True
                break
        if not too_close:
            accepted.append({"id": len(accepted) + 1, "lat": lat, "lng": lng})

    return accepted