import random

def simulate_demand(points):
    weighted = []
    for p in points:
        weight = random.randint(1, 5)
        for _ in range(weight):
            weighted.append(p)
    return weighted