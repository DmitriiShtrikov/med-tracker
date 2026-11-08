from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    medicines = relationship("Medicine", back_populates="owner")

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    
    medicines = relationship("Medicine", back_populates="category_rel")

class Symptom(Base):
    __tablename__ = "symptoms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    
    medicines = relationship("Medicine", back_populates="symptom_rel")

class Medicine(Base):
    __tablename__ = "medicines"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    packs = Column(Integer, default=1, nullable=False)
    blisters_per_pack = Column(Integer, default=1, nullable=False)
    pills_per_blister = Column(Integer, default=1, nullable=False)
    expiry = Column(Date, nullable=False)
    note = Column(Text, default="")
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    symptom_id = Column(Integer, ForeignKey("symptoms.id"), nullable=True)
    
    owner = relationship("User", back_populates="medicines")
    category_rel = relationship("Category", back_populates="medicines")
    symptom_rel = relationship("Symptom", back_populates="medicines")