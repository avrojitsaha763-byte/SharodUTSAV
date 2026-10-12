from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


# Queue reporting
class QueueReportCreate(BaseModel):
    wait_minutes: int = Field(..., ge=0, le=300, description="Estimated wait time in minutes")
    crowd_level: str = Field(..., description="low, moderate, heavy, packed")
    visitor_tag: Optional[str] = "Verified Visitor"


class QueueReportResponse(BaseModel):
    id: int
    pandal_id: int
    wait_minutes: int
    crowd_level: str
    visitor_tag: str
    upvotes: int
    reported_at: datetime

    class Config:
        from_attributes = True


# Pandal Gate
class PandalGateResponse(BaseModel):
    id: int
    gate_name: str
    gate_type: str
    barricade_notes: Optional[str]
    avg_wait_mins: int
    is_accessible: bool
    mermaid_flow: Optional[str]

    class Config:
        from_attributes = True


# Pandal schemas
class PandalBase(BaseModel):
    id: int
    name_en: str
    name_bn: str
    zone: str
    landmark: str
    latitude: float
    longitude: float
    description_en: str
    description_bn: str
    theme_2026: Optional[str]
    current_wait_minutes: int
    crowd_level: str
    heritage_status: bool
    nearest_metro: str
    metro_exit_gate: str
    metro_walking_mins: int
    vip_pass_accepted: bool
    wheelchair_accessible: bool
    image_url: Optional[str]
    best_visiting_time: str
    upvotes: int
    last_updated: datetime

    class Config:
        from_attributes = True


class PandalDetail(PandalBase):
    gates: List[PandalGateResponse] = []
    recent_reports: List[QueueReportResponse] = []


# Transit
class TransitHubResponse(BaseModel):
    id: int
    station_name: str
    line_name: str
    exit_gates_json: str
    parking_lots_json: Optional[str]
    night_buses_json: Optional[str]

    class Config:
        from_attributes = True


# Amenities
class AmenityResponse(BaseModel):
    id: int
    category: str
    name: str
    name_bn: Optional[str]
    zone: str
    address: str
    latitude: float
    longitude: float
    rating: float
    open_hours: str
    is_all_night: bool
    is_wheelchair_accessible: bool
    details_json: Optional[str]

    class Config:
        from_attributes = True


# Traffic & Surge
class TrafficAlertResponse(BaseModel):
    id: int
    road_name: str
    restriction_type: str
    description_en: str
    description_bn: str
    active_from: str
    active_until: str
    severity: str

    class Config:
        from_attributes = True


# Itinerary
class ItineraryRequest(BaseModel):
    origin: str = Field(..., description="Starting point or Metro station, e.g. 'Dum Dum' or 'Garia'")
    start_time: str = Field("16:00", description="Start time (HH:MM)")
    end_time: str = Field("23:30", description="End time (HH:MM)")
    mode: str = Field("metro_walk", description="metro_walk, two_wheeler, car")
    target_zones: Optional[List[str]] = None
    preferred_pandal_ids: Optional[List[int]] = None


class ItineraryStep(BaseModel):
    step_number: int
    pandal_id: int
    pandal_name_en: str
    pandal_name_bn: str
    arrival_time: str
    estimated_stay_mins: int
    wait_time_mins: int
    departure_time: str
    transit_mode: str
    transit_instruction: str
    transit_duration_mins: int
    metro_station: str
    metro_gate: str


class ItineraryResponse(BaseModel):
    total_pandals: int
    total_duration_hours: float
    estimated_crowd_index: str
    total_walking_km: float
    recommended_metro_pass: str
    steps: List[ItineraryStep]


# Bondhu & Midpoint
class FriendLocation(BaseModel):
    name: str
    latitude: float
    longitude: float
    starting_station: Optional[str] = None


class BondhuMidpointRequest(BaseModel):
    friends: List[FriendLocation]


class BondhuMidpointResponse(BaseModel):
    recommended_hub_name: str
    hub_metro_line: str
    central_latitude: float
    central_longitude: float
    average_travel_time_mins: int
    meeting_landmark: str
    nearby_pandals: List[str]
    emergency_police_station: str
