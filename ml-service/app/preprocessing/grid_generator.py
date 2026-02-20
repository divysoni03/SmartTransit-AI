from shapely.geometry import Polygon, box, Point, mapping
from shapely.ops import transform
import pyproj
from typing import List, Dict, Any


def _to_mercator_transformers():
    to_m = pyproj.Transformer.from_crs("EPSG:4326", "EPSG:3857", always_xy=True).transform
    to_wgs = pyproj.Transformer.from_crs("EPSG:3857", "EPSG:4326", always_xy=True).transform
    return to_m, to_wgs


def generate_grid(polygon: Polygon, cell_size_m: int = 500) -> List[Dict[str, Any]]:
    """Generate square grid inside polygon in meters and return list of centroids (lat,lng).

    Returns list of dicts: {"lat": float, "lng": float, "cell": GeoJSON}
    """
    to_m, to_wgs = _to_mercator_transformers()
    poly_m = transform(to_m, polygon)

    minx, miny, maxx, maxy = poly_m.bounds
    cols = int(((maxx - minx) // cell_size_m) + 1)
    rows = int(((maxy - miny) // cell_size_m) + 1)

    cells = []
    for i in range(cols + 1):
        for j in range(rows + 1):
            x1 = minx + i * cell_size_m
            y1 = miny + j * cell_size_m
            square = box(x1, y1, x1 + cell_size_m, y1 + cell_size_m)
            if square.intersects(poly_m):
                centroid_m = square.centroid
                centroid_wgs = transform(to_wgs, centroid_m)
                cell_wgs = transform(to_wgs, square)
                cells.append({
                    "lat": centroid_wgs.y,
                    "lng": centroid_wgs.x,
                    "cell": mapping(cell_wgs),
                })

    return cells
"""Grid generation utilities for spatial partitioning."""
from typing import Tuple, List


def generate_grid(bbox: Tuple[float, float, float, float], rows: int, cols: int) -> List[Tuple[float, float, float, float]]:
    """Return list of grid cell bboxes covering `bbox` (placeholder)."""
    minx, miny, maxx, maxy = bbox
    return [(minx, miny, maxx, maxy)]
