from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 DATASET (extended)
candidates_db = [
    {
        "id": 1,
        "name": "Max Müller",
        "role": "plumber",
        "languages": ["de"],
        "skill": 5,
        "location": "munich",
        "availability": ["2026-04-10", "2026-04-11"],
        "rating": 4.8
    },
    {
        "id": 2,
        "name": "John Smith",
        "role": "technician",
        "languages": ["en"],
        "skill": 3,
        "location": "berlin",
        "availability": ["2026-04-15"],
        "rating": 4.5
    },
    {
        "id": 3,
        "name": "Ali Khan",
        "role": "electrician",
        "languages": ["en", "de"],
        "skill": 4,
        "location": "munich",
        "availability": ["2026-04-10", "2026-04-15"],
        "rating": 4.7
    },
    {
        "id": 4,
        "name": "Lucas Weber",
        "role": "plumber",
        "languages": ["de"],
        "skill": 2,
        "location": "augsburg",
        "availability": ["2026-04-12"],
        "rating": 4.2
    }
]

# 🧠 HELPER: DATE RANGE MATCH
def is_available(worker_dates: List[str], start: Optional[str], end: Optional[str]):
    if not start:
        return True

    if not end:
        return start in worker_dates

    for d in worker_dates:
        if start <= d <= end:
            return True

    return False


# 🔥 MATCHING API
@app.get("/candidates")
def get_candidates(
    startDate: str = None,
    endDate: str = None,
    role: str = None,
    language: str = None,
    location: str = None,
):
    result = []

    for w in candidates_db:

        # ✅ DATE RANGE FILTER
        if not is_available(w["availability"], startDate, endDate):
            continue

        # ✅ ROLE FILTER
        if role and role.lower() != w["role"]:
            continue

        # ✅ LOCATION FILTER
        if location and location.lower() not in w["location"]:
            continue

        # ⚠️ LANGUAGE = OPTIONAL FILTER
        if language:
            if language not in w["languages"]:
                continue

        result.append(w)

    # 🧠 SORTING (skill + rating)
    result.sort(key=lambda x: (x["skill"], x["rating"]), reverse=True)

    return {"candidates": result}


# 🔥 PROJECT CREATION (FIX YOUR 404)
@app.post("/projects")
async def create_project(data: dict):
    print("📥 PROJECT RECEIVED:", data)

    return {
        "status": "success",
        "message": "Project created successfully",
        "data": data
    }


# ✅ HEALTH CHECK (VERY USEFUL)
@app.get("/")
def root():
    return {"status": "Pearly backend running"}