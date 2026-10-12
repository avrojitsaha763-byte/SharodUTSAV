import math
from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Pandal
from schemas import ItineraryRequest, ItineraryResponse, ItineraryStep

router = APIRouter(prefix="/api/itinerary", tags=["Itinerary Optimizer"])


def haversine_distance_km(lat1, lon1, lat2, lon2):
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)


ORIGIN_COORDINATES = {
    "dum dum": (22.6214, 88.3934),
    "shyambazar": (22.6006, 88.3705),
    "howrah": (22.5830, 88.3426),
    "sealdah": (22.5670, 88.3712),
    "esplanade": (22.5647, 88.3518),
    "gariahat": (22.5186, 88.3678),
    "kalighat": (22.5190, 88.3470),
    "garia": (22.4645, 88.3842),
    "salt lake": (22.5856, 88.4114),
    "behala": (22.4978, 88.3156)
}


@router.post("/plan", response_model=ItineraryResponse)
def plan_itinerary(request: ItineraryRequest, db: Session = Depends(get_db)):
    # 1. Parse time window
    try:
        start_h, start_m = map(int, request.start_time.split(":"))
        end_h, end_m = map(int, request.end_time.split(":"))
    except Exception:
        start_h, start_m = 17, 0
        end_h, end_m = 23, 30

    start_total_mins = start_h * 60 + start_m
    end_total_mins = end_h * 60 + end_m
    if end_total_mins <= start_total_mins:
        # Crosses midnight into early morning
        end_total_mins += 24 * 60

    available_budget_mins = end_total_mins - start_total_mins

    # 2. Origin coords
    origin_key = request.origin.strip().lower()
    start_lat, start_lon = ORIGIN_COORDINATES.get(origin_key, (22.5647, 88.3518))  # default Esplanade

    # 3. Fetch candidate pandals
    query = db.query(Pandal)
    if request.target_zones:
        query = query.filter(Pandal.zone.in_(request.target_zones))
    candidates = query.all()

    if not candidates:
        candidates = db.query(Pandal).all()

    # 4. Greedy Nearest-Neighbor Route Optimization with time-budgeting
    visited = []
    current_lat, current_lon = start_lat, start_lon
    current_time_mins = start_total_mins
    unvisited = list(candidates)
    steps = []
    step_num = 1
    total_walk_km = 0.0

    while unvisited and (current_time_mins < end_total_mins - 35):
        # Sort unvisited by distance from current point
        unvisited.sort(key=lambda p: haversine_distance_km(current_lat, current_lon, p.latitude, p.longitude))
        next_pandal = unvisited.pop(0)

        # Distance & transit time
        dist_km = haversine_distance_km(current_lat, current_lon, next_pandal.latitude, next_pandal.longitude)

        if request.mode == "metro_walk":
            # Assume Metro covers major distance at ~30km/h + 5 min wait, then walk
            transit_duration_mins = max(10, int(dist_km * 4) + next_pandal.metro_walking_mins)
            walk_portion = round(min(dist_km, next_pandal.metro_walking_mins * 0.08), 2)
            transit_instruction = f"Take Metro to {next_pandal.nearest_metro}, exit via {next_pandal.metro_exit_gate}, then walk {next_pandal.metro_walking_mins} mins."
        elif request.mode == "two_wheeler":
            transit_duration_mins = max(8, int(dist_km * 3))
            walk_portion = 0.3
            transit_instruction = f"Bike ride ({dist_km} km) via arterial roads to designated police parking near {next_pandal.landmark}."
        else:  # car
            transit_duration_mins = max(15, int(dist_km * 5))
            walk_portion = 0.6
            transit_instruction = f"Cab/Car transit to official parking lot. Watch for festive one-way diversions."

        stay_view_mins = 25  # Sanctum viewing and photo time
        wait_mins = next_pandal.current_wait_minutes
        total_pandal_mins = wait_mins + stay_view_mins

        arrival_mins = current_time_mins + transit_duration_mins
        departure_mins = arrival_mins + total_pandal_mins

        if departure_mins > end_total_mins and len(steps) >= 2:
            # Over budget, finish plan
            break

        # Format times
        arr_h = (arrival_mins // 60) % 24
        arr_m = arrival_mins % 60
        dep_h = (departure_mins // 60) % 24
        dep_m = departure_mins % 60

        arrival_str = f"{arr_h:02d}:{arr_m:02d}"
        departure_str = f"{dep_h:02d}:{dep_m:02d}"

        step = ItineraryStep(
            step_number=step_num,
            pandal_id=next_pandal.id,
            pandal_name_en=next_pandal.name_en,
            pandal_name_bn=next_pandal.name_bn,
            arrival_time=arrival_str,
            estimated_stay_mins=stay_view_mins,
            wait_time_mins=wait_mins,
            departure_time=departure_str,
            transit_mode=request.mode,
            transit_instruction=transit_instruction,
            transit_duration_mins=transit_duration_mins,
            metro_station=next_pandal.nearest_metro,
            metro_gate=next_pandal.metro_exit_gate
        )
        steps.append(step)
        total_walk_km += walk_portion

        current_time_mins = departure_mins
        current_lat, current_lon = next_pandal.latitude, next_pandal.longitude
        step_num += 1

        if len(steps) >= 7:  # Cap at reasonable max per night
            break

    total_duration_hours = round((current_time_mins - start_total_mins) / 60.0, 1)

    crowd_avg = sum(s.wait_time_mins for s in steps) / max(len(steps), 1)
    if crowd_avg < 30:
        crowd_index = "Optimal (Low Congestion)"
    elif crowd_avg < 60:
        crowd_index = "Moderate Festive Flow"
    else:
        crowd_index = "Heavy Rush (Peak Puja Night)"

    return ItineraryResponse(
        total_pandals=len(steps),
        total_duration_hours=total_duration_hours,
        estimated_crowd_index=crowd_index,
        total_walking_km=round(total_walk_km, 1),
        recommended_metro_pass="Metro All-Day Smart Token (₹50 Unlimited)",
        steps=steps
    )
