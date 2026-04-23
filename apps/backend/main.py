from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Pearly Backend Running"}

@app.get("/candidates")
def get_candidates(date: str = None, role: str = None, language: str = None, location: str = None):
    return {
        "candidates": [
            {
                "id": 1,
                "name": "Max Müller",
                "role": "plumber",
                "language": "de",
                "location": "munich",
                "rating": 4.8,
                "available": date
            },
            {
                "id": 2,
                "name": "John Smith",
                "role": "technician",
                "language": "en",
                "location": "berlin",
                "rating": 4.5,
                "available": date
            }
        ]
    }