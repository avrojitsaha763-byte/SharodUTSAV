from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Pandal(Base):
    __tablename__ = "pandals"

    id = Column(Integer, primary_key=True, index=True)
    name_en = Column(String(120), nullable=False, index=True)
    name_bn = Column(String(120), nullable=False)
    zone = Column(String(50), nullable=False, index=True)  # North, South, Central, Salt Lake, Behala
    landmark = Column(String(150), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    description_en = Column(Text, nullable=False)
    description_bn = Column(Text, nullable=False)
    theme_2026 = Column(String(200), nullable=True)
    current_wait_minutes = Column(Integer, default=20)
    crowd_level = Column(String(20), default="moderate")  # low, moderate, heavy, packed
    heritage_status = Column(Boolean, default=False)
    nearest_metro = Column(String(80), nullable=False)
    metro_exit_gate = Column(String(40), default="Gate 1")
    metro_walking_mins = Column(Integer, default=7)
    vip_pass_accepted = Column(Boolean, default=True)
    wheelchair_accessible = Column(Boolean, default=True)
    image_url = Column(String(255), nullable=True)
    best_visiting_time = Column(String(100), default="1:00 AM - 4:00 AM (Late Night)")
    upvotes = Column(Integer, default=42)
    last_updated = Column(DateTime, default=datetime.utcnow)

    # Relationships
    gates = relationship("PandalGate", back_populates="pandal", cascade="all, delete-orphan")
    queue_reports = relationship("QueueReport", back_populates="pandal", cascade="all, delete-orphan")


class PandalGate(Base):
    __tablename__ = "pandal_gates"

    id = Column(Integer, primary_key=True, index=True)
    pandal_id = Column(Integer, ForeignKey("pandals.id"), nullable=False)
    gate_name = Column(String(80), nullable=False)
    gate_type = Column(String(30), nullable=False)  # general, vip, senior_citizen, exit
    barricade_notes = Column(String(255), nullable=True)
    avg_wait_mins = Column(Integer, default=25)
    is_accessible = Column(Boolean, default=True)
    mermaid_flow = Column(Text, nullable=True)

    pandal = relationship("Pandal", back_populates="gates")


class QueueReport(Base):
    __tablename__ = "queue_reports"

    id = Column(Integer, primary_key=True, index=True)
    pandal_id = Column(Integer, ForeignKey("pandals.id"), nullable=False)
    wait_minutes = Column(Integer, nullable=False)
    crowd_level = Column(String(20), nullable=False)  # low, moderate, heavy, packed
    visitor_tag = Column(String(50), default="Verified Visitor")
    upvotes = Column(Integer, default=1)
    reported_at = Column(DateTime, default=datetime.utcnow)

    pandal = relationship("Pandal", back_populates="queue_reports")


class TransitHub(Base):
    __tablename__ = "transit_hubs"

    id = Column(Integer, primary_key=True, index=True)
    station_name = Column(String(100), nullable=False, unique=True)
    line_name = Column(String(80), default="Blue Line (North-South)")
    exit_gates_json = Column(Text, nullable=False)  # JSON string of gates and nearby pandals
    parking_lots_json = Column(Text, nullable=True)  # JSON string of Kolkata Police parking
    night_buses_json = Column(Text, nullable=True)   # JSON string of special WBTC night routes


class Amenity(Base):
    __tablename__ = "amenities"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(30), nullable=False)  # washroom, food, medical, police_booth
    name = Column(String(120), nullable=False)
    name_bn = Column(String(120), nullable=True)
    zone = Column(String(50), nullable=False)
    address = Column(String(200), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    rating = Column(Float, default=4.5)
    open_hours = Column(String(80), default="24 Hours (Festive Special)")
    is_all_night = Column(Boolean, default=True)
    is_wheelchair_accessible = Column(Boolean, default=True)
    details_json = Column(Text, nullable=True)  # JSON features, menu highlights, emergency contact


class TrafficAlert(Base):
    __tablename__ = "traffic_alerts"

    id = Column(Integer, primary_key=True, index=True)
    road_name = Column(String(120), nullable=False)
    restriction_type = Column(String(60), nullable=False)  # One-Way, No Entry, Pedestrian Only
    description_en = Column(String(255), nullable=False)
    description_bn = Column(String(255), nullable=False)
    active_from = Column(String(30), default="3:00 PM")
    active_until = Column(String(30), default="4:00 AM")
    severity = Column(String(20), default="warning")  # info, warning, danger
