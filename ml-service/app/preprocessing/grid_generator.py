import random

def generate_grid(boundary, samples=400):
    if not boundary:
        return []

    lat_max = max(p["lat"] for p in boundary)
    lat_min = min(p["lat"] for p in boundary)
    lng_max = max(p["lng"] for p in boundary)
    lng_min = min(p["lng"] for p in boundary)

    points = []
    for _ in range(samples):
        lat = random.uniform(lat_min, lat_max)
        lng = random.uniform(lng_min, lng_max)
        points.append([lat, lng])

    return points