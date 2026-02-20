from shapely.geometry import Polygon, mapping
from shapely.ops import transform
import pyproj
from typing import List


def _to_mercator_transformers():
    to_m = pyproj.Transformer.from_crs("EPSG:4326", "EPSG:3857", always_xy=True).transform
    to_wgs = pyproj.Transformer.from_crs("EPSG:3857", "EPSG:4326", always_xy=True).transform
    return to_m, to_wgs


def compute_coverage(polygon: Polygon, routes: List[List[tuple]], buffer_m: int = 400) -> float:
    """Buffer each route by buffer_m meters, union, compute intersection area with polygon and return percent."""
    to_m, to_wgs = _to_mercator_transformers()
    poly_m = transform(to_m, polygon)

    buffers = []
    from shapely.geometry import LineString

    for r in routes:
        if not r:
            continue
        line = LineString(r)
        line_m = transform(to_m, line)
        buffers.append(line_m.buffer(buffer_m))

    if not buffers:
        return 0.0

    union = buffers[0]
    from shapely.ops import unary_union
    union = unary_union(buffers)

    served = union.intersection(poly_m).area
    total = poly_m.area
    if total <= 0:
        return 0.0
    return float((served / total) * 100)
"""Analyze geographic coverage of routes and stops."""


def compute_coverage(routes, population_data=None):
    """Return a simple coverage metric (placeholder)."""
    return 0.0
