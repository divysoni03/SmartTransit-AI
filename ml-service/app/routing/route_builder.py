from math import sqrt

def geo_dist(a, b):
    return sqrt((a["lat"]-b["lat"])**2 + (a["lng"]-b["lng"])**2)

def build_routes(stops, route_count=4):

    # sort stops by longitude (simulate corridors/roads)
    stops = sorted(stops, key=lambda x: x["lng"])

    routes = [[] for _ in range(route_count)]

    # distribute stops spatially instead of equally
    for i, stop in enumerate(stops):
        routes[i % route_count].append(stop)

    # order each route by nearest neighbor path
    final_routes = []
    for r in routes:
        if not r:
            continue
        ordered = [r.pop(0)]
        while r:
            nxt = min(r, key=lambda s: geo_dist(ordered[-1], s))
            ordered.append(nxt)
            r.remove(nxt)
        final_routes.append(ordered)

    return final_routes