from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from typing import List
import uvicorn 
import os

from database import SessionLocal, engine, Base
import crud
from schemas import ProjectCreate, ProjectResponse, ChatMessageCreate, ChatMessageResponse, ProjectWithMessages

from dotenv import load_dotenv
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not set")

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/", response_class=HTMLResponse)
def frontend(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

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
    
    bot_message = crud.create_chat_message_and_get_bot_response(db, project_id, msg, GEMINI_API_KEY)
    if not bot_message:
         raise HTTPException(status_code=500, detail="Failed to get bot response from the API")
    return bot_message

@app.get("/projects/{project_id}/chat", response_model=List[ChatMessageResponse])
def get_chat_messages(project_id: int, db: Session = Depends(get_db)):
    return crud.get_chat_messages(db, project_id)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)