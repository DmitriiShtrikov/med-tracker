from sqlalchemy import Column, Integer, String, Date, Text
from sqlalchemy.sql import func
from .database import Base

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False)
    packs = Column(Integer, default=1, nullable=False)
    blisters_per_pack = Column(Integer, default=1, nullable=False)
    pills_per_blister = Column(Integer, default=1, nullable=False)
    expiry = Column(Date, nullable=False)
    note = Column(Text, default="")