import math
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Amenity
from schemas import AmenityResponse

router = APIRouter(prefix="/api/amenities", tags=["Clean Washrooms & Food Radar"])


def haversine_distance_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)


@router.get("/", response_model=List[AmenityResponse])
def get_amenities(
    category: Optional[str] = Query(None, description="washroom, food, medical, police_booth"),
    zone: Optional[str] = Query(None, description="North, South, Central, Salt Lake"),
    wheelchair_only: Optional[bool] = Query(False),
    all_night_only: Optional[bool] = Query(False),
    db: Session = Depends(get_db)
):
    query = db.query(Amenity)
    if category:
        query = query.filter(Amenity.category == category)
    if zone:
        query = query.filter(Amenity.zone == zone)
    if wheelchair_only:
        query = query.filter(Amenity.is_wheelchair_accessible == True)
    if all_night_only:
        query = query.filter(Amenity.is_all_night == True)
    return query.order_by(Amenity.rating.desc()).all()


@router.get("/nearby", response_model=List[AmenityResponse])
def get_nearby_amenities(
    lat: float = Query(...),
    lng: float = Query(...),
    category: Optional[str] = Query(None),
    radius_km: float = Query(3.0),
    db: Session = Depends(get_db)
):
    query = db.query(Amenity)
    if category:
        query = query.filter(Amenity.category == category)
    all_amenities = query.all()

    nearby = []
    for am in all_amenities:
        dist = haversine_distance_km(lat, lng, am.latitude, am.longitude)
        if dist <= radius_km:
            nearby.append((dist, am))

    nearby.sort(key=lambda x: x[0])
    return [item[1] for item in nearby]
