import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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


# Production Static Serving: Look for compiled frontend dist
frontend_dist_dirs = [
    os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"),
    os.path.join(os.path.dirname(__file__), "dist"),
    os.path.join(os.getcwd(), "frontend", "dist")
]

dist_dir = next((d for d in frontend_dist_dirs if os.path.exists(d)), None)

if dist_dir:
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend_spa(full_path: str):
        # Do not catch API or docs routes
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("redoc") or full_path.startswith("openapi.json"):
            raise HTTPException(status_code=404, detail="Not Found")
        
        target_file = os.path.join(dist_dir, full_path)
        if os.path.exists(target_file) and os.path.isfile(target_file):
            return FileResponse(target_file)
        
        index_file = os.path.join(dist_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Frontend index.html not found")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
