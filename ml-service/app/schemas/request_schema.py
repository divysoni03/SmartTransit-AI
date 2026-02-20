from pydantic import BaseModel
from typing import List, Dict

class Coordinate(BaseModel):
    lat: float
    lng: float

class OptimizeRequest(BaseModel):
    city_name: str
    boundary: List[Coordinate]
    num_buses: int
    operating_hours: int
    avg_speed_kmph: float
    parameters: Dict = {}