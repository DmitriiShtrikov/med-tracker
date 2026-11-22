from sqlalchemy.orm import Session
from . import models, schemas
from .security import get_password_hash

# --- CRUD для User ---
def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- CRUD для Medicine (ТЕПЕРЬ С ФИЛЬТРАЦИЕЙ ПО USER_ID) ---
def get_medicines(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Medicine).filter(models.Medicine.user_id == user_id).offset(skip).limit(limit).all()

def get_medicine(db: Session, medicine_id: int, user_id: int):
    return db.query(models.Medicine).filter(models.Medicine.id == medicine_id, models.Medicine.user_id == user_id).first()

def create_medicine(db: Session, medicine: schemas.MedicineCreate, user_id: int):
    db_medicine = models.Medicine(**medicine.dict(), user_id=user_id)
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

def update_medicine(db: Session, medicine_id: int, medicine: schemas.MedicineUpdate, user_id: int):
    db_medicine = get_medicine(db, medicine_id, user_id)
    if not db_medicine:
        return None
    update_data = medicine.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_medicine, key, value)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

def delete_medicine(db: Session, medicine_id: int, user_id: int):
    db_medicine = get_medicine(db, medicine_id, user_id)
    if not db_medicine:
        return None
    db.delete(db_medicine)
    db.commit()
    return db_medicine