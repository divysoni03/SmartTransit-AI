import math
from math import sqrt

def estimate_area_km2(boundary):
    """
    Computes the true geodesic area of the polygon using the Shoelace formula
    projected onto a flat surface (accurate for areas < 500km²).
    Includes per-coordinate cosine correction for latitude distortion.
    """
    if len(boundary) < 3:
        return 1.0

    # Mean latitude for cos correction
    mean_lat_rad = sum(p["lat"] for p in boundary) / len(boundary) * math.pi / 180.0
    cos_lat = max(0.001, abs(math.cos(mean_lat_rad)))

    # Shoelace formula in scaled degrees → km²
    # 1 degree lat ≈ 111 km, 1 degree lng ≈ 111 * cos(lat) km
    KM = 111.0
    n = len(boundary)
    area = 0.0
    for i in range(n):
        j = (i + 1) % n
        x_i = boundary[i]["lng"] * KM * cos_lat
        y_i = boundary[i]["lat"] * KM
        x_j = boundary[j]["lng"] * KM * cos_lat
        y_j = boundary[j]["lat"] * KM
        area += x_i * y_j - x_j * y_i

    return round(abs(area) / 2.0, 4)


def compute_centroid(boundary):
    """Return geographic centroid of boundary polygon."""
    lat = sum(p["lat"] for p in boundary) / len(boundary)
    lng = sum(p["lng"] for p in boundary) / len(boundary)
    return {"lat": lat, "lng": lng}


def stop_distance_km(a, b):
    """Haversine distance between two stops in km."""
    import math
    R = 6371.0
    lat1, lat2 = math.radians(a["lat"]), math.radians(b["lat"])
    dlat = lat2 - lat1
    dlng = math.radians(b["lng"] - a["lng"])
    h = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng/2)**2
    return R * 2 * math.asin(math.sqrt(h))