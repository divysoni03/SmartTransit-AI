import osmnx as ox
from shapely.geometry import Polygon

def load_graph_from_polygon(polygon: Polygon, network_type: str = "drive"):
    """Load a smaller, optimized road network graph for the area."""
    bounds = polygon.bounds  # (minx, miny, maxx, maxy) = (west, south, east, north)
    
    try:
        # Modern OSMnx API (>=2.0): graph_from_bbox takes a single (left, bottom, right, top) bbox tuple
        bbox = (bounds[0], bounds[1], bounds[2], bounds[3])
        G = ox.graph_from_bbox(bbox=bbox, network_type=network_type)
        return G
    except TypeError:
        # Older OSMnx API: graph_from_bbox(north, south, east, west)
        try:
            G = ox.graph_from_bbox(bounds[3], bounds[1], bounds[2], bounds[0], network_type=network_type)
            return G
        except Exception as e:
            print(f"OSMnx bbox load failed, falling back to pure polygon: {e}")
            G = ox.graph_from_polygon(polygon, network_type=network_type)
            return G


def load_osm(source: str):
    """Load OSM data from `source` (file path or URL)."""
    return {}
