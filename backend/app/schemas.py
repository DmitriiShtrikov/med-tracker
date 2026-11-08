from pydantic import BaseModel, Field
from datetime import date
from typing import Optional, List

# --- Пользователи ---
class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    class Config:
        from_attributes = True

# --- Категории ---
class CategoryBase(BaseModel):
    name: str
class CategoryResponse(CategoryBase):
    id: int
    class Config:
        from_attributes = True

# --- Симптомы ---
class SymptomBase(BaseModel):
    name: str
class SymptomResponse(SymptomBase):
    id: int
    class Config:
        from_attributes = True

# --- Лекарства ---
class MedicineBase(BaseModel):
    name: str
    user_id: int
    category_id: int
    symptom_id: Optional[int] = None
    packs: int = 1
    blisters_per_pack: int = 1
    pills_per_blister: int = 1
    expiry: date
    note: Optional[str] = ""

class MedicineCreate(MedicineBase):
    pass

class MedicineUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[int] = None
    symptom_id: Optional[int] = None
    packs: Optional[int] = None
    blisters_per_pack: Optional[int] = None
    pills_per_blister: Optional[int] = None
    expiry: Optional[date] = None
    note: Optional[str] = None

class MedicineResponse(MedicineBase):
    id: int
    category_rel: Optional[CategoryResponse] = None
    symptom_rel: Optional[SymptomResponse] = None
    class Config:
        from_attributes = True