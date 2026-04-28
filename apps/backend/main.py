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
    {"id":1,"name":"Max Müller","role":"plumber","languages":["de"],"skill":5,"location":"munich","availability":["2026-04-10","2026-04-11"],"rating":4.8},
    {"id":2,"name":"Ivan Petrov","role":"plumber","languages":["ru","de"],"skill":4,"location":"berlin","availability":["2026-04-12"],"rating":4.6},
    {"id":3,"name":"Ali Khan","role":"electrician","languages":["en","de"],"skill":4,"location":"munich","availability":["2026-04-15"],"rating":4.7},
    {"id":4,"name":"Mehmet Yilmaz","role":"electrician","languages":["tr","de"],"skill":3,"location":"hamburg","availability":["2026-04-14"],"rating":4.4},
    {"id":5,"name":"Piotr Nowak","role":"tiler","languages":["pl","en"],"skill":5,"location":"berlin","availability":["2026-04-18"],"rating":4.9},
    {"id":6,"name":"Olena Ivanova","role":"cleaner","languages":["ua","ru"],"skill":4,"location":"berlin","availability":["2026-04-11"],"rating":4.5},
    {"id":7,"name":"Hans Becker","role":"carpenter","languages":["de"],"skill":5,"location":"munich","availability":["2026-04-20"],"rating":4.8},
    {"id":8,"name":"Carlos Ruiz","role":"painter","languages":["en"],"skill":3,"location":"hamburg","availability":["2026-04-15"],"rating":4.3},
    {"id":9,"name":"Ahmet Kaya","role":"helper","languages":["tr"],"skill":2,"location":"berlin","availability":["2026-04-10"],"rating":4.1},
    {"id":10,"name":"Sofia Rossi","role":"cleaner","languages":["en"],"skill":5,"location":"hamburg","availability":["2026-04-20"],"rating":4.9},
    {"id":11,"name":"David Klein","role":"electrician","languages":["de"],"skill":3,"location":"berlin","availability":["2026-04-13"],"rating":4.3},
]

# 🧠 DATE MATCH
def is_available(worker_dates: List[str], start: Optional[str], end: Optional[str]):
    if not start:
        return True
    if not end:
        return start in worker_dates
    return any(start <= d <= end for d in worker_dates)


# 🔥 MATCHING API (FINAL PROGRESSIVE)
@app.get("/candidates")
def get_candidates(
    startDate: Optional[str] = None,
    endDate: Optional[str] = None,
    role: Optional[str] = None,
    language: Optional[str] = None,
    location: Optional[str] = None,
):
    results = []
    fallback_results = []

    for w in candidates_db:

        available = is_available(w["availability"], startDate, endDate)

        score = 0
        reasons = []
        relaxed = False

        # ✅ DATE (primary weight)
        if available:
            score += 3
            reasons.append("available on selected date")
        else:
            score -= 2
            relaxed = True

        # ✅ ROLE
        if role:
            if role == w["role"]:
                score += 2
                reasons.append("role match")
            else:
                score -= 0.5
                relaxed = True

        # ✅ LOCATION
        if location:
            if location.lower() == w["location"].lower():
                score += 1
                reasons.append("location match")
            else:
                score -= 0.3
                relaxed = True

        # ✅ LANGUAGE
        if language:
            if language in w["languages"]:
                score += 1
                reasons.append("language match")
            else:
                score -= 0.3
                relaxed = True

        # 🧠 SKILL + RATING
        score += w["skill"] * 0.5
        if w["rating"] >= 4.7:
            score += 0.5
            reasons.append("top rated")

        worker = {
            **w,
            "match_score": round(score, 2),
            "match_reasons": reasons,
            "relaxed": relaxed
        }

        if available:
            results.append(worker)
        else:
            fallback_results.append(worker)

    # 🔥 MAIN SORT
    results.sort(key=lambda x: x["match_score"], reverse=True)

    # 🔁 FALLBACK (IMPORTANT UX FIX)
    if len(results) == 0:
        fallback_results.sort(key=lambda x: x["match_score"], reverse=True)
        results = fallback_results

    return {
        "candidates": results,
        "count": len(results)
    }


@app.post("/projects")
async def create_project(data: dict):
    return {
        "status": "success",
        "message": "Project created successfully",
        "data": data
    }


@app.get("/")
def root():
    return {
        "status": "Pearly backend running 🚀",
        "mode": "progressive-filter-final"
    }