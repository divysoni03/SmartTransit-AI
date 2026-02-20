from typing import List, Dict
import networkx as nx
import osmnx as ox


def snap_stops_to_nodes(G, stops: List[Dict]):
    # osmnx nearest_nodes expects x(lon), y(lat)
    xs = [s["lng"] for s in stops]
    ys = [s["lat"] for s in stops]
    nodes = ox.nearest_nodes(G, xs, ys)
    return nodes


def build_routes_from_stops(G, stops: List[Dict], num_routes: int = None):
    """Create simple routes by grouping stops (nearest neighbor order) and concatenating shortest paths.

    Returns list of routes where each route is list of (lng,lat) tuples.
    """
    if not stops:
        return []

    nodes = snap_stops_to_nodes(G, stops)

    # For now, create one route that visits all stops ordered by proximity (greedy)
    remaining = list(range(len(nodes)))
    route_nodes_idx = []
    current = remaining.pop(0)
    route_nodes_idx.append(current)
    while remaining:
        # find nearest remaining in graph distance
        best = None
        best_dist = float("inf")
        for r in remaining:
            try:
                length = nx.shortest_path_length(G, nodes[current], nodes[r], weight="length")
            except Exception:
                length = float("inf")
            if length < best_dist:
                best_dist = length
                best = r
        if best is None:
            break
        remaining.remove(best)
        route_nodes_idx.append(best)
        current = best

    # build path segments
    route_coords = []
    for a, b in zip(route_nodes_idx[:-1], route_nodes_idx[1:]):
        try:
            path = nx.shortest_path(G, nodes[a], nodes[b], weight="length")
            coords = [(G.nodes[n]["x"], G.nodes[n]["y"]) for n in path]
            route_coords.extend(coords)
        except Exception:
            continue

    # deduplicate consecutive coords
    dedup = []
    for c in route_coords:
        if not dedup or dedup[-1] != c:
            dedup.append(c)

    return [dedup]
"""High-level route building utilities.

Compose stops and paths into route objects.
"""


def build_route(stops, graph):
    """Return a route structure covering the given stops (placeholder)."""
    return {"stops": stops, "geometry": []}
