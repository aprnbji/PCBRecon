from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
import os
import uvicorn

from database import SessionLocal, engine, Base
from models import Project, ChatMessage
import crud
from schemas import (
    ProjectCreate,
    ProjectResponse,
    ChatMessageCreate,
    ChatMessageResponse,
    ProjectWithMessages,
)
from prometheus_fastapi_instrumentator import Instrumentator
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware - MUST be added before other routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Next.js default ports
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

Instrumentator().instrument(app).expose(app)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/projects", response_model=ProjectResponse)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    return crud.create_project(db, project, GEMINI_API_KEY)


@app.get("/projects", response_model=List[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    return crud.get_projects(db)


@app.get("/projects/{project_id}", response_model=ProjectWithMessages)
def get_project_with_messages(project_id: int, db: Session = Depends(get_db)):
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@app.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    if not crud.delete_project(db, project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    return {"status": "deleted"}


@app.post("/projects/{project_id}/chat", response_model=ChatMessageResponse)
def post_chat_message(project_id: int, msg: ChatMessageCreate, db: Session = Depends(get_db)):
    project = crud.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    bot_message = crud.create_chat_message_and_get_bot_response(
        db, project_id, msg, GEMINI_API_KEY
    )
    if not bot_message:
        raise HTTPException(status_code=500, detail="Failed to get bot response from the API")
    return bot_message


@app.get("/projects/{project_id}/chat", response_model=List[ChatMessageResponse])
def get_chat_messages(project_id: int, db: Session = Depends(get_db)):
    return crud.get_chat_messages(db, project_id)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/ready")
def readiness_check(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ready"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)