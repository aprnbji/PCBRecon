from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Project schemas
class ProjectBase(BaseModel):
    name: str

class ProjectCreate(ProjectBase):
    image_path: str
    image_base64: str

class ProjectResponse(ProjectBase):
    id: int
    image_path: str
    image_base64: str  # <<< FIX: This field was missing
    analysis: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Chat message schemas
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

# Project with chat messages
class ProjectWithMessages(ProjectResponse):
    chat_messages: List[ChatMessageResponse] = []