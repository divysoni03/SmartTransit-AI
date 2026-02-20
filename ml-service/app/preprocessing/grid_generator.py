import random

def generate_grid(boundary, samples=400):
    lat_max = boundary[0]["lat"]
    lng_min = boundary[0]["lng"]
    lat_min = boundary[2]["lat"]
    lng_max = boundary[2]["lng"]

    points = []
    for _ in range(samples):
        lat = random.uniform(lat_min, lat_max)
        lng = random.uniform(lng_min, lng_max)
        points.append([lat, lng])

    return points