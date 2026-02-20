from shapely.geometry import Polygon
from typing import List, Tuple


def coords_to_polygon(boundary: List[dict]) -> Polygon:
    """Convert list of {lat,lng} to Shapely Polygon (lon,lat order)."""
    coords = [(pt["lng"], pt["lat"]) for pt in boundary]
    return Polygon(coords)
"""Polygon processing utilities (placeholder implementations)."""
from typing import List, Tuple


def normalize_polygon(coords: List[Tuple[float, float]]) -> List[Tuple[float, float]]:
    """Return coordinates in a normalized order (placeholder)."""
    if not coords:
        return []
    return coords
