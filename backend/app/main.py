from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from . import crud, models, schemas
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)
app = FastAPI(title="Med Tracker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Med Tracker API is running"}

# --- Эндпоинты для лекарств ---

@app.get("/api/medicines/", response_model=List[schemas.MedicineResponse])
def read_medicines(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    medicines = crud.get_medicines(db, skip=skip, limit=limit)
    return medicines

@app.get("/api/medicines/{medicine_id}", response_model=schemas.MedicineResponse)
def read_medicine(medicine_id: int, db: Session = Depends(get_db)):
    db_medicine = crud.get_medicine(db, medicine_id=medicine_id)
    if db_medicine is None:
        raise HTTPException(status_code=404, detail="Лекарство не найдено")
    return db_medicine

@app.post("/api/medicines/", response_model=schemas.MedicineResponse, status_code=status.HTTP_201_CREATED)
def create_medicine(medicine: schemas.MedicineCreate, db: Session = Depends(get_db)):
    return crud.create_medicine(db=db, medicine=medicine)

@app.put("/api/medicines/{medicine_id}", response_model=schemas.MedicineResponse)
def update_medicine(medicine_id: int, medicine: schemas.MedicineUpdate, db: Session = Depends(get_db)):
    db_medicine = crud.update_medicine(db, medicine_id=medicine_id, medicine=medicine)
    if db_medicine is None:
        raise HTTPException(status_code=404, detail="Лекарство не найдено")
    return db_medicine

@app.delete("/api/medicines/{medicine_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medicine(medicine_id: int, db: Session = Depends(get_db)):
    db_medicine = crud.delete_medicine(db, medicine_id=medicine_id)
    if db_medicine is None:
        raise HTTPException(status_code=404, detail="Лекарство не найдено")
    return None