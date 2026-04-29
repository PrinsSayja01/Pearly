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

# 🔥 RELATED ROLES (ONLY FOR FUTURE TEAM BUILDING)
RELATED_ROLES = {
    "roofer": ["carpenter"],
    "plumber": ["helper"],
    "electrician": ["helper"],
    "carpenter": ["roofer"],
    "painter": ["tiler"],
    "tiler": ["painter"],
    "cleaner": [],
    "helper": [],
}

# 🔥 DATASET
candidates_db = [
# ===== ROOFER =====
{"id":1,"name":"Lukas Schmidt","role":"roofer","languages":["de"],"skill":4,"location":"munich","availability":["2026-05-01","2026-05-02","2026-05-03"],"rating":4.6},
{"id":2,"name":"Thomas Weber","role":"roofer","languages":["de","en"],"skill":5,"location":"munich","availability":["2026-05-10","2026-05-11","2026-05-12"],"rating":4.9},
{"id":3,"name":"John Smith","role":"roofer","languages":["en"],"skill":3,"location":"berlin","availability":["2026-05-03","2026-05-04"],"rating":4.3},
{"id":4,"name":"Marco Rossi","role":"roofer","languages":["en","it"],"skill":4,"location":"hamburg","availability":["2026-05-15","2026-05-16"],"rating":4.5},
{"id":5,"name":"Sergey Ivanov","role":"roofer","languages":["ru","de"],"skill":4,"location":"berlin","availability":["2026-05-05","2026-05-06"],"rating":4.4},
{"id":6,"name":"Oleksii Bondar","role":"roofer","languages":["ua"],"skill":5,"location":"munich","availability":["2026-05-18","2026-05-19"],"rating":4.8},

# ===== PLUMBER =====
{"id":7,"name":"Max Müller","role":"plumber","languages":["de"],"skill":5,"location":"munich","availability":["2026-05-01","2026-05-02"],"rating":4.8},
{"id":8,"name":"Ivan Petrov","role":"plumber","languages":["ru","de"],"skill":4,"location":"berlin","availability":["2026-05-10"],"rating":4.6},
{"id":9,"name":"Ali Khan","role":"plumber","languages":["en"],"skill":3,"location":"hamburg","availability":["2026-05-07","2026-05-08"],"rating":4.4},
{"id":10,"name":"Ahmed Hassan","role":"plumber","languages":["en","ar"],"skill":4,"location":"berlin","availability":["2026-05-12","2026-05-13"],"rating":4.5},
{"id":11,"name":"Piotr Nowak","role":"plumber","languages":["pl","en"],"skill":5,"location":"munich","availability":["2026-05-15"],"rating":4.9},

# ===== ELECTRICIAN =====
{"id":12,"name":"David Klein","role":"electrician","languages":["de"],"skill":3,"location":"berlin","availability":["2026-05-02","2026-05-03"],"rating":4.3},
{"id":13,"name":"Carlos Ruiz","role":"electrician","languages":["en"],"skill":4,"location":"hamburg","availability":["2026-05-08"],"rating":4.6},
{"id":14,"name":"Mehmet Yilmaz","role":"electrician","languages":["tr","de"],"skill":3,"location":"berlin","availability":["2026-05-09"],"rating":4.4},
{"id":15,"name":"George Brown","role":"electrician","languages":["en"],"skill":5,"location":"munich","availability":["2026-05-18","2026-05-19"],"rating":4.9},

# ===== CARPENTER =====
{"id":16,"name":"Hans Becker","role":"carpenter","languages":["de"],"skill":5,"location":"munich","availability":["2026-05-20"],"rating":4.8},
{"id":17,"name":"Jan Kowalski","role":"carpenter","languages":["pl"],"skill":5,"location":"munich","availability":["2026-05-21"],"rating":4.8},
{"id":18,"name":"Liam Scott","role":"carpenter","languages":["en"],"skill":4,"location":"berlin","availability":["2026-05-05","2026-05-06"],"rating":4.5},
{"id":19,"name":"Ivan Horvat","role":"carpenter","languages":["hr","en"],"skill":3,"location":"hamburg","availability":["2026-05-14"],"rating":4.2},

# ===== PAINTER =====
{"id":20,"name":"Marco Bianchi","role":"painter","languages":["en"],"skill":3,"location":"berlin","availability":["2026-05-23"],"rating":4.4},
{"id":21,"name":"Luis Garcia","role":"painter","languages":["es","en"],"skill":4,"location":"hamburg","availability":["2026-05-11","2026-05-12"],"rating":4.6},
{"id":22,"name":"Jean Dupont","role":"painter","languages":["fr"],"skill":5,"location":"munich","availability":["2026-05-16"],"rating":4.9},

# ===== TILER =====
{"id":23,"name":"Piotr Zielinski","role":"tiler","languages":["pl"],"skill":5,"location":"berlin","availability":["2026-05-18"],"rating":4.9},
{"id":24,"name":"Oleksandr Petrenko","role":"tiler","languages":["ua"],"skill":4,"location":"hamburg","availability":["2026-05-22"],"rating":4.6},
{"id":25,"name":"David White","role":"tiler","languages":["en"],"skill":3,"location":"munich","availability":["2026-05-07"],"rating":4.3},

# ===== CLEANER =====
{"id":26,"name":"Sofia Rossi","role":"cleaner","languages":["en"],"skill":5,"location":"hamburg","availability":["2026-05-20"],"rating":4.9},
{"id":27,"name":"Olena Ivanova","role":"cleaner","languages":["ua","ru"],"skill":4,"location":"berlin","availability":["2026-05-11"],"rating":4.5},
{"id":28,"name":"Anna Schmidt","role":"cleaner","languages":["de"],"skill":3,"location":"munich","availability":["2026-05-03"],"rating":4.2},

# ===== HELPERS =====
{"id":29,"name":"Ahmet Kaya","role":"helper","languages":["tr"],"skill":2,"location":"berlin","availability":["2026-05-10"],"rating":4.1},
{"id":30,"name":"Tom Walker","role":"helper","languages":["en"],"skill":3,"location":"munich","availability":["2026-05-06"],"rating":4.3},

# ===== EXTRA MIXED USERS (to reach ~50) =====
{"id":31,"name":"Worker31","role":"roofer","languages":["de","en"],"skill":4,"location":"berlin","availability":["2026-05-25"],"rating":4.5},
{"id":32,"name":"Worker32","role":"plumber","languages":["en"],"skill":3,"location":"hamburg","availability":["2026-05-26"],"rating":4.4},
{"id":33,"name":"Worker33","role":"electrician","languages":["de"],"skill":4,"location":"munich","availability":["2026-05-27"],"rating":4.6},
{"id":34,"name":"Worker34","role":"carpenter","languages":["en"],"skill":3,"location":"berlin","availability":["2026-05-28"],"rating":4.3},
{"id":35,"name":"Worker35","role":"painter","languages":["en"],"skill":4,"location":"hamburg","availability":["2026-05-29"],"rating":4.5},
{"id":36,"name":"Worker36","role":"tiler","languages":["pl"],"skill":5,"location":"munich","availability":["2026-05-30"],"rating":4.9},
{"id":37,"name":"Worker37","role":"cleaner","languages":["de"],"skill":3,"location":"berlin","availability":["2026-05-24"],"rating":4.2},
{"id":38,"name":"Worker38","role":"helper","languages":["en"],"skill":2,"location":"hamburg","availability":["2026-05-23"],"rating":4.1},

{"id":39,"name":"Worker39","role":"roofer","languages":["en"],"skill":5,"location":"munich","availability":["2026-05-08"],"rating":4.8},
{"id":40,"name":"Worker40","role":"plumber","languages":["de"],"skill":4,"location":"berlin","availability":["2026-05-09"],"rating":4.5},
{"id":41,"name":"Worker41","role":"electrician","languages":["en"],"skill":3,"location":"hamburg","availability":["2026-05-10"],"rating":4.3},
{"id":42,"name":"Worker42","role":"carpenter","languages":["pl"],"skill":5,"location":"munich","availability":["2026-05-11"],"rating":4.9},
{"id":43,"name":"Worker43","role":"painter","languages":["en"],"skill":4,"location":"berlin","availability":["2026-05-12"],"rating":4.5},
{"id":44,"name":"Worker44","role":"tiler","languages":["ua"],"skill":4,"location":"hamburg","availability":["2026-05-13"],"rating":4.6},
{"id":45,"name":"Worker45","role":"cleaner","languages":["de"],"skill":3,"location":"munich","availability":["2026-05-14"],"rating":4.2},
{"id":46,"name":"Worker46","role":"helper","languages":["en"],"skill":2,"location":"berlin","availability":["2026-05-15"],"rating":4.1},

{"id":47,"name":"Worker47","role":"roofer","languages":["de"],"skill":4,"location":"hamburg","availability":["2026-05-16"],"rating":4.6},
{"id":48,"name":"Worker48","role":"plumber","languages":["en"],"skill":3,"location":"munich","availability":["2026-05-17"],"rating":4.4},
{"id":49,"name":"Worker49","role":"electrician","languages":["de"],"skill":4,"location":"berlin","availability":["2026-05-18"],"rating":4.7},
{"id":50,"name":"Worker50","role":"carpenter","languages":["en"],"skill":5,"location":"hamburg","availability":["2026-05-19"],"rating":4.9},
]

# 🧠 DATE LOGIC
def is_available(worker_dates: List[str], start: Optional[str], end: Optional[str]):
    if not start:
        return True
    if not end:
        return start in worker_dates
    return any(start <= d <= end for d in worker_dates)


# 🔥 FINAL MATCHING API (STRICT)
@app.get("/candidates")
def get_candidates(
    startDate: Optional[str] = None,
    endDate: Optional[str] = None,
    role: Optional[str] = None,
    language: Optional[str] = None,
    location: Optional[str] = None,
    minSkill: Optional[int] = None,
):
    results = []
    fallback = []

    for w in candidates_db:

        # ✅ STRICT ROLE FILTER (MAIN FIX)
        if role and w["role"] != role:
            continue

        # ✅ HARD FILTERS
        if minSkill and w["skill"] < minSkill:
            continue

        if language and language not in w["languages"]:
            continue

        if location and location.lower() != w["location"].lower():
            continue

        available = is_available(w["availability"], startDate, endDate)

        score = 0
        reasons = []

        # availability
        if available:
            score += 3
            reasons.append("available")
        else:
            score -= 2

        # exact role
        if role and w["role"] == role:
            score += 3
            reasons.append("exact role")

        # skill + rating
        score += w["skill"] * 0.5

        if w["rating"] >= 4.7:
            score += 0.5
            reasons.append("top rated")

        worker = {
            **w,
            "match_score": round(score, 2),
            "match_reasons": reasons,
        }

        if available:
            results.append(worker)
        else:
            fallback.append(worker)

    # ✅ SORT AFTER FILTER
    results.sort(key=lambda x: x["match_score"], reverse=True)

    # fallback
    if not results:
        fallback.sort(key=lambda x: x["match_score"], reverse=True)
        results = fallback

    return {
        "candidates": results,
        "count": len(results),
    }


@app.get("/")
def root():
    return {
        "status": "Pearly backend running 🚀",
        "mode": "strict-filter-v3",
    }