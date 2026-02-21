import math
from sklearn.cluster import SpectralClustering
import numpy as np


def geo_dist(a, b):
    """Haversine distance between two stops in km."""
    R = 6371.0
    lat1, lat2 = math.radians(a["lat"]), math.radians(b["lat"])
    dlat = lat2 - lat1
    dlng = math.radians(b["lng"] - a["lng"])
    h = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng/2)**2
    return R * 2 * math.asin(math.sqrt(min(1.0, h)))


def build_distance_matrix(stops):
    """Build NxN pairwise distance matrix for spectral clustering."""
    n = len(stops)
    D = np.zeros((n, n))
    for i in range(n):
        for j in range(i+1, n):
            d = geo_dist(stops[i], stops[j])
            D[i][j] = d
            D[j][i] = d
    return D


def cluster_stops_spectral(stops, route_count):
    """
    Use Spectral Clustering on a stop affinity matrix to discover
    natural geographic corridor groupings rather than arbitrary stripes.
    """
    n = len(stops)
    if n <= route_count:
        # Not enough stops for spectral — simple round-robin
        return [[s] for s in stops][:route_count]

    D = build_distance_matrix(stops)
    # Affinity = Gaussian RBF kernel on distances
    sigma = D.mean() or 1.0
    affinity = np.exp(-(D ** 2) / (2 * sigma ** 2))

    try:
        sc = SpectralClustering(
            n_clusters=route_count,
            affinity='precomputed',
            assign_labels='kmeans',
            random_state=42,
            n_init=10
        )
        labels = sc.fit_predict(affinity)
    except Exception:
        # Fallback: longitude stripe assignment
        stops_sorted = sorted(range(n), key=lambda i: stops[i]["lng"])
        labels = [i % route_count for i in range(n)]
        for idx, orig in enumerate(stops_sorted):
            labels[orig] = idx % route_count

    groups = [[] for _ in range(route_count)]
    for i, label in enumerate(labels):
        groups[label].append(stops[i])

    return [g for g in groups if g]


def order_route_nn(stops):
    """
    Nearest-Neighbor greedy ordering of stops within a route corridor.
    This is a fast TSP approximation — much better than arbitrary order.
    """
    if not stops:
        return []
    remaining = list(stops)
    # Start from northernmost stop (intuitive for north-south corridors)
    start = max(remaining, key=lambda s: s["lat"])
    remaining.remove(start)
    ordered = [start]
    while remaining:
        nxt = min(remaining, key=lambda s: geo_dist(ordered[-1], s))
        ordered.append(nxt)
        remaining.remove(nxt)
    return ordered


def build_routes(stops, route_count=4, G=None):
    """
    Advanced route builder:
      1. Spectral clustering to discover natural geographic clusters
      2. Nearest-Neighbor TSP ordering within each cluster
      3. OSMnx graph path snapping for realistic road geometry
    """
    if not stops:
        return []

    # 1. Pre-compute OSMnx node cache (vectorized)
    node_cache = {}
    if G is not None:
        try:
            import osmnx as ox
            X = [float(s["lng"]) for s in stops]
            Y = [float(s["lat"]) for s in stops]
            nearest = ox.distance.nearest_nodes(G, X, Y)
            if hasattr(nearest, 'tolist'):
                nearest = nearest.tolist()
            elif not isinstance(nearest, (list, tuple)):
                nearest = [nearest]
            for i, s in enumerate(stops):
                node_cache[s["id"]] = nearest[i]
        except Exception as e:
            print("node_cache fallback:", e)

    # 2. Spectral clustering to form route groups
    groups = cluster_stops_spectral(stops, route_count)

    # 3. Order stops within each group via Nearest Neighbor
    import networkx as nx
    final_routes = []
    for group in groups:
        ordered = order_route_nn(group)

        # 4. Snap to real road geometry using the OSMnx graph
        if G is not None and node_cache:
            road_path = []
            for i in range(len(ordered) - 1):
                try:
                    n_a = node_cache[ordered[i]["id"]]
                    n_b = node_cache[ordered[i + 1]["id"]]
                    node_path = nx.shortest_path(G, n_a, n_b, weight='length')
                    for node_id in node_path[:-1]:
                        road_path.append({
                            "lat": float(G.nodes[node_id]["y"]),
                            "lng": float(G.nodes[node_id]["x"])
                        })
                except Exception:
                    road_path.append(ordered[i])

            if ordered:
                try:
                    n_last = node_cache[ordered[-1]["id"]]
                    road_path.append({
                        "lat": float(G.nodes[n_last]["y"]),
                        "lng": float(G.nodes[n_last]["x"])
                    })
                except Exception:
                    road_path.append(ordered[-1])

            final_routes.append({"stops": ordered, "path": road_path})
        else:
            final_routes.append({"stops": ordered, "path": ordered})

    return final_routes