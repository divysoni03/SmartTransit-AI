from pydantic import BaseModel
from typing import List, Dict, Any


class GeoFeature(BaseModel):
    type: str
    geometry: Dict
    properties: Dict[str, Any] = {}


class OptimizationResponse(BaseModel):
    stops: List[GeoFeature]
    routes: List[GeoFeature]
    allocation: List[Dict[str, Any]]
    coverage_percent: float
    metrics: Dict[str, Any]
    execution_time_s: float
"""Response schema dataclasses/placeholders."""
from dataclasses import dataclass
from typing import List, Dict, Any


@dataclass
class RouteResponse:
    routes: List[Dict[str, Any]]
    coverage: float = 0.0
