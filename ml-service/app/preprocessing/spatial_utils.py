"""Spatial utility functions used across preprocessing and routing."""
from typing import Tuple


def bbox_area(bbox: Tuple[float, float, float, float]) -> float:
    minx, miny, maxx, maxy = bbox
    return max(0.0, (maxx - minx) * (maxy - miny))
