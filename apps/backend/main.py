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

# 🔥 DATASET
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
    },
    {
        "id": 5,
        "name": "Sofia Rossi",
        "role": "technician",
        "languages": ["en"],
        "skill": 5,
        "location": "hamburg",
        "availability": ["2026-04-20"],
        "rating": 4.9
    },
    {
        "id": 6,
        "name": "David Klein",
        "role": "electrician",
        "languages": ["de"],
        "skill": 3,
        "location": "berlin",
        "availability": ["2026-04-13", "2026-04-18"],
        "rating": 4.3
    }
]

# 🧠 DATE MATCH
def is_available(worker_dates: List[str], start: Optional[str], end: Optional[str]):
    if not start:
        return True
    if not end:
        return start in worker_dates
    return any(start <= d <= end for d in worker_dates)


# 🔥 MATCHING API (PROGRESSIVE)
@app.get("/candidates")
def get_candidates(
    startDate: Optional[str] = None,
    endDate: Optional[str] = None,
    role: Optional[str] = None,
    language: Optional[str] = None,
    location: Optional[str] = None,
):
    results = []

    for w in candidates_db:

        # ❗ HARD FILTER → ONLY DATE
        if not is_available(w["availability"], startDate, endDate):
            continue

        score = 3
        reasons = []
        relaxed = False  # 🔥 new flag

        # ✅ ROLE
        if role:
            if role == w["role"]:
                score += 2
                reasons.append("role match")
            else:
                score -= 1
                relaxed = True

        # ✅ LOCATION
        if location:
            if location.lower() == w["location"].lower():
                score += 1
                reasons.append("location match")
            else:
                score -= 0.5
                relaxed = True

        # ✅ LANGUAGE (optional)
        if language:
            if language in w["languages"]:
                score += 1
                reasons.append("language match")
            else:
                score -= 0.5
                relaxed = True

        # 🧠 SKILL
        score += w["skill"] * 0.5
        reasons.append("skill")

        # ⭐ RATING BOOST
        if w["rating"] >= 4.7:
            score += 0.5
            reasons.append("top rated")

        # 🔒 SAFE COPY
        worker = {
            **w,
            "match_score": round(score, 2),
            "match_reasons": reasons,
            "relaxed": relaxed  # 🔥 important for UI
        }

        results.append(worker)

    # 🔥 SORT
    results.sort(key=lambda x: x["match_score"], reverse=True)

    return {
        "candidates": results,
        "count": len(results)
    }


# 🔥 CREATE PROJECT
@app.post("/projects")
async def create_project(data: dict):
    print("📥 PROJECT RECEIVED:", data)

    return {
        "status": "success",
        "message": "Project created successfully",
        "data": data
    }


# ✅ HEALTH
@app.get("/")
def root():
    return {
        "status": "Pearly backend running 🚀",
        "version": "phase1-progressive-filter"
    }