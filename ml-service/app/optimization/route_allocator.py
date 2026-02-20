from typing import List, Dict
import math


def allocate_buses(routes: List[List[tuple]], num_buses: int, avg_speed_kmph: float):
    """Allocate buses to routes using simple proportional allocation by route length.

    routes: list of routes, each route is list of (lng,lat) coords
    """
    # compute approximate lengths from coordinate lists using osmnx lengths is better, but approximate using haversine

    def haversine(a, b):
        # a,b are (lon,lat)
        lon1, lat1 = a
        lon2, lat2 = b
        R = 6371.0
        import math
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlambda = math.radians(lon2 - lon1)
        x = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
        return 2 * R * math.asin(math.sqrt(x))

    lengths_km = []
    for r in routes:
        L = 0.0
        for a, b in zip(r[:-1], r[1:]):
            L += haversine(a, b)
        lengths_km.append(L)

    total = sum(lengths_km) if lengths_km else 1.0
    allocation = []
    for idx, L in enumerate(lengths_km):
        share = L / total if total > 0 else 0
        buses = max(1, int(round(share * num_buses)))
        allocation.append({"route_index": idx, "length_km": L, "buses": buses})

    return allocation
"""Allocate routes to vehicles or resources."""


def allocate_routes(routes, fleet_size: int):
    """Assign routes to fleet (placeholder)."""
    assignments = []
    for i, r in enumerate(routes):
        assignments.append({"route": r, "vehicle_id": i % max(1, fleet_size)})
    return assignments
