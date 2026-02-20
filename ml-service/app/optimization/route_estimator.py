def estimate_route_count(num_buses, area_km2):

    # basic planning rules
    buses_per_route_target = 12   # ideal operational size
    density_factor = max(1, min(3, area_km2 / 25))

    routes = int((num_buses / buses_per_route_target) * density_factor)

    return max(3, min(routes, 12))