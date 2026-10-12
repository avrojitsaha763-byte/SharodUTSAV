import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import TransitHub
from schemas import TransitHubResponse

router = APIRouter(prefix="/api/transit", tags=["Transit & Parking"])


@router.get("/stations", response_model=List[TransitHubResponse])
def get_stations(db: Session = Depends(get_db)):
    return db.query(TransitHub).all()


@router.get("/parking")
def get_all_parking_lots(db: Session = Depends(get_db)):
    hubs = db.query(TransitHub).all()
    all_parking = []
    for hub in hubs:
        if hub.parking_lots_json:
            lots = json.loads(hub.parking_lots_json)
            for lot in lots:
                all_parking.append({
                    "station_area": hub.station_name,
                    **lot
                })
    return all_parking


@router.get("/night-buses")
def get_night_buses(db: Session = Depends(get_db)):
    hubs = db.query(TransitHub).all()
    routes = []
    for hub in hubs:
        if hub.night_buses_json:
            buses = json.loads(hub.night_buses_json)
            for bus in buses:
                routes.append({
                    "hub": hub.station_name,
                    **bus
                })
    # Add citywide trunk night routes
    trunk_routes = [
        {"route": "NS-10 (Howrah Station to Garia via Rashbehari)", "frequency": "Every 12 mins all night", "hub": "Central / South Arterial"},
        {"route": "NS-21 (Shyambazar 5-Point to Kudghat)", "frequency": "Every 15 mins", "hub": "North-South Corridor"},
        {"route": "EB-3 (Howrah Maidan to Salt Lake Karunamoyee via Sealdah)", "frequency": "Every 10 mins", "hub": "East-West Transit"}
    ]
    return routes + trunk_routes
