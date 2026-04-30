from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import random
from datetime import datetime, timedelta

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 ROLES
ROLES = [
    "roofer","plumber","electrician","carpenter",
    "painter","tiler","cleaner","helper"
]

# 🔥 LANGUAGES (multi combo)
LANGUAGES_POOL = ["de","en","pl","ua","ru","tr","fr","es"]

# 🔥 10 CITIES
CITIES = [
    "munich","berlin","hamburg","stuttgart","frankfurt",
    "cologne","dusseldorf","leipzig","dortmund","nuremberg"
]

# 🧠 GENERATE AVAILABILITY WINDOWS
def generate_dates(start_day: int):
    base = datetime(2026, 5, start_day)
    return [
        (base + timedelta(days=i)).strftime("%Y-%m-%d")
        for i in range(random.randint(2, 5))
    ]

# 🔥 GENERATE 250 CANDIDATES (REAL TEST DATA)
def generate_candidates(n=250):
    data = []

    for i in range(1, n + 1):
        role = random.choice(ROLES)

        # 1–3 languages per user
        langs = random.sample(LANGUAGES_POOL, random.randint(1, 3))

        # distributed availability buckets
        bucket = random.choice([1, 10, 20])
        availability = generate_dates(bucket)

        data.append({
            "id": i,
            "name": f"Worker{i}",
            "role": role,
            "languages": langs,
            "skill": random.randint(2, 5),
            "location": random.choice(CITIES),
            "availability": availability,
            "rating": round(random.uniform(4.0, 5.0), 1),
        })

    return data


candidates_db = generate_candidates(250)


# 🧠 DATE CHECK
def is_available(worker_dates: List[str], start: Optional[str], end: Optional[str]):
    if not start:
        return True
    if not end:
        return start in worker_dates
    return any(start <= d <= end for d in worker_dates)


# 🔥 MAIN MATCHING API
@app.get("/candidates")
def get_candidates(
    startDate: Optional[str] = None,
    endDate: Optional[str] = None,
    role: Optional[str] = None,
    language: Optional[str] = None,   # comma-separated
    location: Optional[str] = None,
    minSkill: Optional[int] = None,
):
    results = []
    fallback = []

    requested_langs = language.split(",") if language else []

    for w in candidates_db:

        # ✅ STRICT ROLE
        if role and w["role"] != role:
            continue

        # ✅ SKILL FILTER
        if minSkill and w["skill"] < minSkill:
            continue

        # ✅ LOCATION FILTER
        if location and w["location"].lower() != location.lower():
            continue

        # ✅ LANGUAGE OR LOGIC (FIXED)
        if requested_langs:
            if not any(lang in w["languages"] for lang in requested_langs):
                continue

        available = is_available(w["availability"], startDate, endDate)

        score = 0
        reasons = []

        # ✅ AVAILABILITY PRIORITY
        if available:
            score += 3
            reasons.append("available")
        else:
            score -= 2

        # ✅ ROLE BOOST
        if role and w["role"] == role:
            score += 3
            reasons.append("exact role")

        # ✅ SKILL IMPACT
        score += w["skill"] * 0.5

        # ✅ RATING BOOST
        if w["rating"] >= 4.7:
            score += 0.5
            reasons.append("top rated")

        # ✅ LANGUAGE BONUS (priority logic base)
        if requested_langs:
            overlap = len(set(requested_langs) & set(w["languages"]))
            score += overlap * 0.5

        worker = {
            **w,
            "match_score": round(score, 2),
            "match_reasons": reasons,
            "available": available
        }

        if available:
            results.append(worker)
        else:
            fallback.append(worker)

    # ✅ SORT AFTER FILTER (IMPORTANT)
    results.sort(key=lambda x: x["match_score"], reverse=True)

    # 🔁 FALLBACK
    if not results:
        fallback.sort(key=lambda x: x["match_score"], reverse=True)
        results = fallback

    return {
        "candidates": results,
        "count": len(results),
    }


# 🔥 HEALTH
@app.get("/")
def root():
    return {
        "status": "Pearly backend running 🚀",
        "mode": "v4-production-ready",
        "candidates": len(candidates_db)
    }