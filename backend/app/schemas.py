from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class MedicineBase(BaseModel):
    name: str = Field(..., min_length=1, description="Название лекарства")
    category: str = Field(..., min_length=1, description="Категория")
    packs: int = Field(1, ge=1, description="Количество упаковок")
    blisters_per_pack: int = Field(1, ge=1, description="Блистеров в упаковке")
    pills_per_blister: int = Field(1, ge=1, description="Таблеток в блистере")
    expiry: date = Field(..., description="Срок годности")
    note: Optional[str] = Field("", description="Заметка")

class MedicineCreate(MedicineBase):
    pass

class MedicineUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    packs: Optional[int] = None
    blisters_per_pack: Optional[int] = None
    pills_per_blister: Optional[int] = None
    expiry: Optional[date] = None
    note: Optional[str] = None

class MedicineResponse(MedicineBase):
    id: int

    class Config:
        from_attributes = True