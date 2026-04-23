from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# MODELS
# -------------------------------

class Project(BaseModel):
    task: str
    profession: str
    setup: dict
    candidate: dict
    team: List[dict] = []

# -------------------------------
# IN-MEMORY DB
# -------------------------------

projects_db = []

# -------------------------------
# ROUTES
# -------------------------------

@app.get("/")
def root():
    return {"message": "Backend Running"}

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

@app.post("/projects")
def create_project(project: Project):
    new_project = {
        "id": str(uuid.uuid4()),
        **project.dict()
    }

    projects_db.append(new_project)

    return {
        "success": True,
        "project": new_project
    }

@app.get("/projects")
def get_projects():
    return {"projects": projects_db}