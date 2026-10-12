from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Pandal, PandalGate, QueueReport
from schemas import PandalBase, PandalDetail, QueueReportCreate, QueueReportResponse

router = APIRouter(prefix="/api/pandals", tags=["Pandals & Queues"])


@router.get("/", response_model=List[PandalBase])
def get_pandals(
    zone: Optional[str] = Query(None, description="Filter by zone: North, South, Central, Salt Lake / East, Behala"),
    search: Optional[str] = Query(None, description="Search by name, landmark or theme"),
    max_wait: Optional[int] = Query(None, description="Maximum current wait time in minutes"),
    wheelchair_only: Optional[bool] = Query(False, description="Filter for accessible pandals only"),
    heritage_only: Optional[bool] = Query(False, description="Filter for historic Bonedi / Sabeki pandals"),
    db: Session = Depends(get_db)
):
    query = db.query(Pandal)

    if zone and zone.lower() != "all":
        query = query.filter(Pandal.zone.ilike(f"%{zone}%"))
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (Pandal.name_en.ilike(search_fmt)) |
            (Pandal.name_bn.ilike(search_fmt)) |
            (Pandal.landmark.ilike(search_fmt)) |
            (Pandal.theme_2026.ilike(search_fmt))
        )
    if max_wait is not None:
        query = query.filter(Pandal.current_wait_minutes <= max_wait)
    if wheelchair_only:
        query = query.filter(Pandal.wheelchair_accessible == True)
    if heritage_only:
        query = query.filter(Pandal.heritage_status == True)

    return query.order_by(Pandal.current_wait_minutes.asc()).all()


@router.get("/{pandal_id}", response_model=PandalDetail)
def get_pandal_detail(pandal_id: int, db: Session = Depends(get_db)):
    pandal = db.query(Pandal).filter(Pandal.id == pandal_id).first()
    if not pandal:
        raise HTTPException(status_code=404, detail="Pandal not found")

    recent_reports = (
        db.query(QueueReport)
        .filter(QueueReport.pandal_id == pandal_id)
        .order_by(QueueReport.reported_at.desc())
        .limit(10)
        .all()
    )

    detail_dict = {
        **pandal.__dict__,
        "gates": pandal.gates,
        "recent_reports": recent_reports
    }
    return detail_dict


@router.post("/{pandal_id}/report-queue", response_model=QueueReportResponse)
def report_queue_time(
    pandal_id: int,
    report: QueueReportCreate,
    db: Session = Depends(get_db)
):
    pandal = db.query(Pandal).filter(Pandal.id == pandal_id).first()
    if not pandal:
        raise HTTPException(status_code=404, detail="Pandal not found")

    new_report = QueueReport(
        pandal_id=pandal_id,
        wait_minutes=report.wait_minutes,
        crowd_level=report.crowd_level,
        visitor_tag=report.visitor_tag or "Verified Visitor",
        reported_at=datetime.utcnow()
    )
    db.add(new_report)

    # Time-decay weighted recalculation of current wait time:
    # 70% weight to new submission, 30% to existing historical value
    weighted_wait = int((0.7 * report.wait_minutes) + (0.3 * pandal.current_wait_minutes))
    pandal.current_wait_minutes = weighted_wait
    pandal.crowd_level = report.crowd_level
    pandal.last_updated = datetime.utcnow()

    db.commit()
    db.refresh(new_report)
    return new_report


@router.post("/{pandal_id}/upvote")
def upvote_pandal(pandal_id: int, db: Session = Depends(get_db)):
    pandal = db.query(Pandal).filter(Pandal.id == pandal_id).first()
    if not pandal:
        raise HTTPException(status_code=404, detail="Pandal not found")

    pandal.upvotes += 1
    db.commit()
    return {"status": "success", "pandal_id": pandal_id, "upvotes": pandal.upvotes}


@router.get("/{pandal_id}/diagram")
def get_gate_diagram(pandal_id: int, gate_type: str = "general", db: Session = Depends(get_db)):
    gate = (
        db.query(PandalGate)
        .filter(PandalGate.pandal_id == pandal_id, PandalGate.gate_type == gate_type)
        .first()
    )
    if not gate or not gate.mermaid_flow:
        default_mermaid = (
            "graph LR\n"
            "  A[Entry Perimeter] --> B[Security Metal Detector]\n"
            "  B --> C[Holding Barricade]\n"
            "  C --> D[Sanctum Darshan Gallery]\n"
            "  D --> E[Designated Outflow Exit]"
        )
        return {"mermaid": default_mermaid, "gate_name": "Standard Flow"}
    return {"mermaid": gate.mermaid_flow, "gate_name": gate.gate_name}
