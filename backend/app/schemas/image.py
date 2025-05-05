from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ImageBase(BaseModel):
    filename: str
    filepath: str
    features: Optional[str] = None

class ImageCreate(ImageBase):
    pass

class Image(ImageBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ImageSearchResponse(BaseModel):
    image_path: str
    similarity: float 