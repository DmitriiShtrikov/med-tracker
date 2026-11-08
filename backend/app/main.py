from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import crud, models, schemas
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)
app = FastAPI(title="Med Tracker API", version="2.0.0")

app.add_middleware(
    CORSMiddleware, allow_origins=["http://localhost:5173"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

# --- Эндпоинты для справочников (Symptom, Category) ---
@app.get("/api/symptoms/", response_model=List[schemas.SymptomResponse])
def read_symptoms(db: Session = Depends(get_db)):
    return db.query(models.Symptom).all()

@app.get("/api/categories/", response_model=List[schemas.CategoryResponse])
def read_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

# --- Эндпоинты для лекарств ---
@app.get("/api/medicines/", response_model=List[schemas.MedicineResponse])
def read_medicines(db: Session = Depends(get_db)):
    return db.query(models.Medicine).all()

@app.post("/api/medicines/", response_model=schemas.MedicineResponse)
def create_medicine(medicine: schemas.MedicineCreate, db: Session = Depends(get_db)):
    db_med = models.Medicine(**medicine.dict())
    db.add(db_med)
    db.commit()
    db.refresh(db_med)
    return db_med

@app.delete("/api/medicines/{med_id}")
def delete_medicine(med_id: int, db: Session = Depends(get_db)):
    db_med = db.query(models.Medicine).filter(models.Medicine.id == med_id).first()
    if db_med:
        db.delete(db_med)
        db.commit()
    return {"ok": True}