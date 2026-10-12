from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from seed_data import seed_database
from routers import pandals, transit, itinerary, amenities, groups, traffic, heritage

# Initialize database schema
Base.metadata.create_all(bind=engine)

# Seed with 35+ verified Kolkata pandals and amenities
try:
    seed_database()
except Exception as e:
    print(f"Database seed check: {e}")

app = FastAPI(
    title="SharodUTSAV API - Kolkata Durga Puja Intelligence Platform",
    description=(
        "Production-grade backend powering Kolkata's premier Durga Puja companion platform. "
        "Engineered with typed asynchronous endpoints, relational schemas (3NF/ACID), "
        "crowdsourced time-decay queue estimation, and transit optimization."
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for local React/Vite development and mobile testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Sub-Routers
app.include_router(pandals.router)
app.include_router(transit.router)
app.include_router(itinerary.router)
app.include_router(amenities.router)
app.include_router(groups.router)
app.include_router(traffic.router)
app.include_router(heritage.router)


@app.get("/api/health", tags=["System Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "SharodUTSAV API",
        "version": "2.0.0",
        "timestamp_iso": "2026-10-11T15:00:00Z"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
