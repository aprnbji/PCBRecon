from sqlalchemy.orm import Session
from typing import List, Optional
import base64
import google.generativeai as genai

from models import Project, ChatMessage
from schemas import ProjectCreate, ChatMessageCreate


def run_gemini_pcb_analysis(image_base64: str, api_key: str) -> str:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")

    if "," in image_base64:
        image_base64_for_api = image_base64.split(",")[1]
    else:
        image_base64_for_api = image_base64

    image_bytes = base64.b64decode(image_base64_for_api)

    prompt = """
    Analyze this PCB image. Provide a concise, high-level summary in Markdown format using the following bolded headings: `**Board Overview**`, `**Key Components**`, and `**Notable Features**`.

    IMPORTANT: Under each heading, provide a very brief, 2-3 sentence summary only. The goal is a quick, at-a-glance overview.
    """

    response = model.generate_content([
        prompt,
        {"mime_type": "image/jpeg", "data": image_bytes},
    ])
    return response.text.strip()


def run_gemini_chat(db: Session, project_id: int, api_key: str, user_message: str) -> str:
    genai.configure(api_key=api_key)

    project = db.query(Project).filter(Project.id == project_id).first()

    if "," in project.image_base64:
        image_base64_for_api = project.image_base64.split(",")[1]
    else:
        image_base64_for_api = project.image_base64

    image_bytes = base64.b64decode(image_base64_for_api)

    messages_from_db = (
        db.query(ChatMessage)
        .filter(ChatMessage.project_id == project_id)
        .order_by(ChatMessage.created_at)
        .all()
    )

    system_prompt = (
        "You are a world-class embedded hardware reverse engineer. "
        "You infer board details by using: visual traits of the PCB image, "
        "silkscreen labels, package shapes, regulator layout patterns, "
        "crystal placement, trace routing, and connector styles.\n\n"
        "Rules:\n"
        "- Always reason using the PCB image context.\n"
        "- When unsure, provide best-effort engineering hypothesis and explain clues.\n"
        "- Identify microcontrollers, power circuits, memory, sensors, RF modules.\n"
        "- Detect debug interfaces such as SWD, JTAG, UART, SPI, ISP, Tag-Connect.\n"
        "- Assign component labels like U1, U2, C3, R10, J1.\n"
        "- If a component seems like Flash, SDRAM, PMIC, signal buffer, or RF transceiver, state so.\n"
        "- Provide hierarchy: power, logic core, comms, sensors, IO.\n"
        "- Refer to pads, routing direction, and functional grouping when giving answers.\n"
        f"\nInitial analysis: {project.analysis}"
    )

    chat_history = [
        {
            "role": "user",
            "parts": [
                system_prompt,
                {"mime_type": "image/jpeg", "data": image_bytes}
            ]
        },
        {
            "role": "model",
            "parts": ["Understood. I have analyzed the PCB image and am ready to help with your questions."]
        }
    ]

    for msg in messages_from_db:
        chat_history.append({
            "role": "user" if msg.sender == "user" else "model",
            "parts": [msg.message]
        })

    model = genai.GenerativeModel("gemini-2.5-flash")
    chat = model.start_chat(history=chat_history)
    response = chat.send_message(user_message)

    return response.text.strip()


def generate_welcome_message(api_key: str, project_name: str) -> str:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")
    prompt = (
        f"Write a 50 character welcome message for a new hardware analysis project named '{project_name}' with no emojis. "
    )
    response = model.generate_content(prompt)
    return response.text.strip()


def create_project(db: Session, project: ProjectCreate, api_key: str) -> Project:
    analysis_result = run_gemini_pcb_analysis(project.image_base64, api_key)

    new_project = Project(
        name=project.name,
        image_path=project.image_path,
        image_base64=project.image_base64,
        analysis=analysis_result,
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    welcome_text = generate_welcome_message(api_key, new_project.name)
    welcome_message = ChatMessage(
        project_id=new_project.id, sender="bot", message=welcome_text
    )
    db.add(welcome_message)
    db.commit()
    db.refresh(new_project)

    return new_project


def create_chat_message_and_get_bot_response(
    db: Session, project_id: int, user_msg: ChatMessageCreate, api_key: str
) -> Optional[ChatMessage]:

    user_message = ChatMessage(
        project_id=project_id, message=user_msg.message, sender="user"
    )
    db.add(user_message)
    db.commit()

    bot_response_text = run_gemini_chat(
        db=db, project_id=project_id, api_key=api_key, user_message=user_msg.message
    )

    bot_message = ChatMessage(
        project_id=project_id, message=bot_response_text, sender="bot"
    )
    db.add(bot_message)
    db.commit()
    db.refresh(bot_message)

    return bot_message


def get_project(db: Session, project_id: int) -> Optional[Project]:
    return db.query(Project).filter(Project.id == project_id).first()


def get_projects(db: Session, skip: int = 0, limit: int = 100) -> List[Project]:
    return (
        db.query(Project)
        .order_by(Project.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_chat_messages(db: Session, project_id: int) -> List[ChatMessage]:
    return (
        db.query(ChatMessage)
        .filter(ChatMessage.project_id == project_id)
        .order_by(ChatMessage.created_at)
        .all()
    )


def delete_project(db: Session, project_id: int) -> bool:
    project = get_project(db, project_id)
    if not project:
        return False

    db.delete(project)
    db.commit()
    return True