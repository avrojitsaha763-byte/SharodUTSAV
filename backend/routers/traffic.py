from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import TrafficAlert
from schemas import TrafficAlertResponse

router = APIRouter(prefix="/api/traffic", tags=["Police Diversions & Surge Matrix"])


@router.get("/alerts", response_model=List[TrafficAlertResponse])
def get_traffic_alerts(db: Session = Depends(get_db)):
    return db.query(TrafficAlert).all()


@router.get("/surge-matrix")
def get_surge_matrix():
    current_hour = datetime.now().hour

    # Surge is highest between 8 PM (20) and 3 AM (3)
    if 20 <= current_hour or current_hour < 4:
        period = "Peak Festive Night Rush"
        cab_multiplier = 2.4
        moto_multiplier = 1.7
        taxi_status = "Standard Meter + ₹50-100 Festive Night Tip"
        metro_status = "Flat Official Token Fare (₹10 - ₹25) - Highly Recommended!"
        toto_status = "₹30 - ₹50 per head fixed shared festive rate"
    elif 16 <= current_hour < 20:
        period = "Evening Transition Rush"
        cab_multiplier = 1.8
        moto_multiplier = 1.4
        taxi_status = "Standard Meter + ₹30 Festive Tip"
        metro_status = "Standard Token Fare (₹10 - ₹25)"
        toto_status = "₹25 per head"
    else:
        period = "Daytime Moderate Flow"
        cab_multiplier = 1.2
        moto_multiplier = 1.1
        taxi_status = "Strict Meter Fare"
        metro_status = "Standard Token Fare"
        toto_status = "₹15 - ₹20 normal fare"

    return {
        "current_period": period,
        "indicative_notice": "Festive estimates based on historic Kolkata Durga Puja aggregator rates. Metro is unaffected by surge.",
        "aggregators": {
            "uber_ola_cab": {
                "multiplier": cab_multiplier,
                "surge_level": "High" if cab_multiplier > 1.8 else "Moderate",
                "recommended": False if cab_multiplier > 1.8 else True,
                "advice": "Severe road diversions in South Kolkata. Prefer Metro + Walk."
            },
            "bike_moto": {
                "multiplier": moto_multiplier,
                "surge_level": "Moderate",
                "recommended": True,
                "advice": "Fastest through narrow alleys, but park only in Kolkata Police lots."
            },
            "yellow_taxi": {
                "condition": taxi_status,
                "recommended": True,
                "advice": "Available at designated prepaid booths outside major Metro and Rail terminals."
            },
            "kolkata_metro": {
                "condition": metro_status,
                "recommended": True,
                "highlight": "Zero traffic jamming & air-conditioned relief. Running till 4:00 AM on Saptami, Ashtami, and Nabami."
            },
            "toto_auto_rickshaw": {
                "condition": toto_status,
                "recommended": True,
                "advice": "Great for last-mile connection between Metro and inner pandal gates."
            }
        }
    }


@router.get("/estimate-fare")
def estimate_fare(distance_km: float, mode: str = "cab"):
    surge = get_surge_matrix()
    mult = surge["aggregators"]["uber_ola_cab"]["multiplier"] if mode == "cab" else surge["aggregators"]["bike_moto"]["multiplier"]

    base_rate = 50 + (distance_km * 18) if mode == "cab" else 25 + (distance_km * 9)
    estimated_cost = round(base_rate * mult)
    min_cost = int(estimated_cost * 0.9)
    max_cost = int(estimated_cost * 1.25)

    return {
        "mode": mode,
        "distance_km": distance_km,
        "estimated_range": f"₹{min_cost} - ₹{max_cost}",
        "disclaimer": "Indicative estimation for Durga Puja festive congestion. Subject to real-time driver availability."
    }
