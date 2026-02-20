from pydantic import BaseModel
from typing import List, Dict


class GeoPoint(BaseModel):
    lat: float
    lng: float


class OptimizationRequest(BaseModel):
    city_name: str = ""
    boundary: List[GeoPoint]
    num_buses: int = 10
    operating_hours: int = 12
    avg_speed_kmph: float = 30.0
    parameters: Dict = {}
"""Request schema dataclasses/placeholders."""
from dataclasses import dataclass
from typing import List, Tuple


@dataclass
class DemandRequest:
    area_bbox: Tuple[float, float, float, float]
    time_window: Tuple[str, str]
    sample_points: int = 100
