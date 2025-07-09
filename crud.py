from sqlalchemy.orm import Session
from models import Project, ChatMessage
from schemas import ProjectCreate, ChatMessageCreate
from typing import List, Optional
import base64
import google.generativeai as genai


def run_gemini_pcb_analysis(image_base64: str, api_key: str) -> str:
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        if "," in image_base64:
            image_base64_for_api = image_base64.split(",")[1]
        else:
            image_base64_for_api = image_base64
        image_bytes = base64.b64decode(image_base64_for_api)
        
        prompt = """
        Analyze this PCB image. Provide a concise, high-level summary in Markdown format using the following bolded headings: `**Board Overview**`, `**Key Components**`, and `**Notable Features**`.

        IMPORTANT: Under each heading, provide a very brief, 2-3 sentence summary only. The goal is a quick, at-a-glance overview.
        """

        response = model.generate_content([prompt, {"mime_type": "image/jpeg", "data": image_bytes}])
        return response.text.strip()
    except Exception as e:
        print(f"Error during Gemini analysis: {e}")
        return f"Error during analysis: {str(e)}"

def run_gemini_chat(api_key: str, user_message: str) -> str:
   
    try:
        genai.configure(api_key=api_key)
        system_instruction = "You are an expert PCB analyst. Answer the user's question clearly and concisely. Use Markdown for formatting if it helps."
        model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=system_instruction)
        response = model.generate_content(user_message)
        return response.text.strip()
    except Exception as e:
        print(f"Error during Gemini chat: {e}")
        return f"Error: {str(e)}"

def generate_welcome_message(api_key: str, project_name: str) -> str:
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"Write a friendly, 50 character welcome message for a new hardware analysis project named '{project_name}'. "
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error generating welcome message: {e}")
        return f"Hello! I've finished analyzing your {project_name}. How can I help?"


def create_project(db: Session, project: ProjectCreate, api_key: str) -> Project:
    analysis_result = run_gemini_pcb_analysis(project.image_base64, api_key)
    new_project = Project(name=project.name, image_path=project.image_path, image_base64=project.image_base64, analysis=analysis_result)
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    
    welcome_text = generate_welcome_message(api_key, new_project.name)
    welcome_message = ChatMessage(project_id=new_project.id, sender="bot", message=welcome_text)
    db.add(welcome_message)
    db.commit()
    db.refresh(new_project)
    return new_project

def create_chat_message_and_get_bot_response(db: Session, project_id: int, user_msg: ChatMessageCreate, api_key: str) -> Optional[ChatMessage]:
    user_message = ChatMessage(project_id=project_id, message=user_msg.message, sender="user")
    db.add(user_message)
    db.commit()

    bot_response_text = run_gemini_chat(api_key=api_key, user_message=user_msg.message)
    bot_message = ChatMessage(project_id=project_id, message=bot_response_text, sender="bot")
    db.add(bot_message)
    db.commit()
    db.refresh(bot_message)
    return bot_message

def get_project(db: Session, project_id: int) -> Optional[Project]:
    return db.query(Project).filter(Project.id == project_id).first()

def get_projects(db: Session, skip: int = 0, limit: int = 100) -> List[Project]:
    return db.query(Project).order_by(Project.created_at.desc()).offset(skip).limit(limit).all()

def delete_project(db: Session, project_id: int) -> bool:
    project = get_project(db, project_id)
    if not project:
        return False
    db.delete(project)
    db.commit()
    return True