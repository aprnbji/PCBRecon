from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class ProjectBase(BaseModel):
    name: str


class ProjectCreate(ProjectBase):
    image_path: str
    image_base64: str


class ProjectResponse(ProjectBase):
    id: int
    image_path: str
    image_base64: str
    analysis: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ChatMessageBase(BaseModel):
    message: str


class ChatMessageCreate(ChatMessageBase):
    pass


class ChatMessageResponse(ChatMessageBase):
    id: int
    project_id: int
    sender: str
    created_at: datetime

    class Config:
        from_attributes = True


class ProjectWithMessages(ProjectResponse):
    chat_messages: List[ChatMessageResponse] = []
