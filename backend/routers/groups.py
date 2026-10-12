import math
from typing import List
from fastapi import APIRouter
from schemas import BondhuMidpointRequest, BondhuMidpointResponse

router = APIRouter(prefix="/api/groups", tags=["Bondhu Finder & SOS"])

METRO_HUBS = [
    {
        "name": "Esplanade Metro Interchange",
        "line": "Blue Line & Green Line Interchange",
        "lat": 22.5647,
        "lon": 88.3518,
        "landmark": "Curzon Park / Metro Gate 4 Fountain",
        "nearby_pandals": ["College Square", "Mohammad Ali Park", "Janbazar Durgotsav"],
        "police_station": "Bowbazar / Taltala Police Station"
    },
    {
        "name": "Central Metro Station",
        "line": "Blue Line (North-South)",
        "lat": 22.5710,
        "lon": 88.3580,
        "landmark": "Medical College Gate / CR Avenue Junction",
        "nearby_pandals": ["College Square", "Santosh Mitra Square", "Mohammad Ali Park"],
        "police_station": "Jorasanko Police Station"
    },
    {
        "name": "Rabindra Sadan Metro",
        "line": "Blue Line (North-South)",
        "lat": 22.5401,
        "lon": 88.3472,
        "landmark": "Nandan Cultural Complex / Academy of Fine Arts",
        "nearby_pandals": ["Maddox Square", "Bhowanipore 76 Pally", "Suruchi Sangha"],
        "police_station": "Bhowanipore Police Station"
    },
    {
        "name": "Kalighat Metro Station",
        "line": "Blue Line (North-South)",
        "lat": 22.5190,
        "lon": 88.3470,
        "landmark": "Lake Mall Entrance / Rashbehari Crossing",
        "nearby_pandals": ["Badamtala Ashar Sangha", "Tridhara Sammilani", "Mudiali Club"],
        "police_station": "Kalighat Police Station"
    },
    {
        "name": "Karunamoyee Metro (Salt Lake)",
        "line": "Green Line (East-West)",
        "lat": 22.5850,
        "lon": 88.4110,
        "landmark": "Central Park Fairgrounds Gate 2",
        "nearby_pandals": ["FD Block Salt Lake", "BJ Block Salt Lake", "Labony Estate"],
        "police_station": "Bidhannagar North Police Station"
    }
]


def distance(lat1, lon1, lat2, lon2):
    return math.sqrt((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2)


@router.post("/midpoint", response_model=BondhuMidpointResponse)
def calculate_midpoint(request: BondhuMidpointRequest):
    if not request.friends:
        # Default to Esplanade
        hub = METRO_HUBS[0]
        return BondhuMidpointResponse(
            recommended_hub_name=hub["name"],
            hub_metro_line=hub["line"],
            central_latitude=hub["lat"],
            central_longitude=hub["lon"],
            average_travel_time_mins=18,
            meeting_landmark=hub["landmark"],
            nearby_pandals=hub["nearby_pandals"],
            emergency_police_station=hub["police_station"]
        )

    # Calculate average geographic centroid
    avg_lat = sum(f.latitude for f in request.friends) / len(request.friends)
    avg_lon = sum(f.longitude for f in request.friends) / len(request.friends)

    # Find closest major hub
    best_hub = min(METRO_HUBS, key=lambda h: distance(avg_lat, avg_lon, h["lat"], h["lon"]))

    return BondhuMidpointResponse(
        recommended_hub_name=best_hub["name"],
        hub_metro_line=best_hub["line"],
        central_latitude=best_hub["lat"],
        central_longitude=best_hub["lon"],
        average_travel_time_mins=22,
        meeting_landmark=best_hub["landmark"],
        nearby_pandals=best_hub["nearby_pandals"],
        emergency_police_station=best_hub["police_station"]
    )


@router.get("/emergency-contacts")
def get_emergency_contacts():
    return {
        "police_control_room": {
            "title": "Kolkata Police Dial 100",
            "phone": "100",
            "alt_phone": "033-2214-3230",
            "portal": "https://kolkatapolice.gov.in"
        },
        "women_helpline": {
            "title": "Women Security & Shakti Squad Helpline",
            "phone": "1091"
        },
        "child_helpline": {
            "title": "Child In Distress Helpdesk",
            "phone": "1098"
        },
        "ambulance": {
            "title": "West Bengal Emergency Ambulance",
            "phone": "102"
        },
        "traffic_helpline": {
            "title": "Kolkata Traffic Police Control Room",
            "phone": "1073",
            "whatsapp": "8433949400"
        },
        "police_bondhu_app": {
            "name": "Kolkata Police Bondhu Mobile Portal",
            "url": "https://kolkatapolice.gov.in/bondhu/"
        }
    }
