from sqlalchemy.orm import Session
from . import models, schemas

def get_medicines(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Medicine).offset(skip).limit(limit).all()

def get_medicine(db: Session, medicine_id: int):
    return db.query(models.Medicine).filter(models.Medicine.id == medicine_id).first()

def create_medicine(db: Session, medicine: schemas.MedicineCreate):
    db_medicine = models.Medicine(**medicine.dict())
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

def update_medicine(db: Session, medicine_id: int, medicine: schemas.MedicineUpdate):
    db_medicine = get_medicine(db, medicine_id)
    if not db_medicine:
        return None
    update_data = medicine.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_medicine, key, value)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

def delete_medicine(db: Session, medicine_id: int):
    db_medicine = get_medicine(db, medicine_id)
    if not db_medicine:
        return None
    db.delete(db_medicine)
    db.commit()
    return db_medicine