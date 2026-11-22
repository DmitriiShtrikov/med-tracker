from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from jose import jwt, JWTError

from . import crud, models, schemas, security
from .database import engine, get_db

# Создаем таблицы
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Med Tracker API", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. ЭНДПОИНТЫ АУТЕНТИФИКАЦИИ (Публичные)
@app.post("/api/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Пользователь с таким именем уже существует")
    return crud.create_user(db=db, user=user)

@app.post("/api/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=form_data.username)
    
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверное имя пользователя или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = security.create_access_token(data={"sub": user.username})
    refresh_token = security.create_refresh_token(data={"sub": user.username})
    
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@app.post("/api/refresh", response_model=schemas.Token)
def refresh_token(token_data: schemas.TokenRefresh, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token_data.refresh_token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        username: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if username is None or token_type != "refresh":
            raise HTTPException(status_code=401, detail="Неверный тип токена")
    except JWTError:
        raise HTTPException(status_code=401, detail="Недействительный refresh токен")
        
    access_token = security.create_access_token(data={"sub": username})
    new_refresh_token = security.create_refresh_token(data={"sub": username})
    
    return {"access_token": access_token, "refresh_token": new_refresh_token, "token_type": "bearer"}

# 2. СПРАВОЧНИКИ (Публичные)
@app.get("/api/symptoms/", response_model=List[schemas.SymptomResponse])
def read_symptoms(db: Session = Depends(get_db)):
    return db.query(models.Symptom).all()

@app.get("/api/categories/", response_model=List[schemas.CategoryResponse])
def read_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

# 3. ЗАЩИЩЕННЫЕ ЭНДПОИНТЫ (Только для авторизованных)
@app.get("/api/medicines/", response_model=List[schemas.MedicineResponse])
def read_medicines(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(security.get_current_user) # ЗАЩИТА
):
    # Берем только лекарства текущего пользователя
    return crud.get_medicines(db, user_id=current_user.id)

@app.get("/api/medicines/{medicine_id}", response_model=schemas.MedicineResponse)
def read_medicine(
    medicine_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user) # ЗАЩИТА
):
    db_medicine = crud.get_medicine(db, medicine_id, user_id=current_user.id)
    if db_medicine is None:
        raise HTTPException(status_code=404, detail="Лекарство не найдено")
    return db_medicine

@app.get("/api/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(security.get_current_user)):
    return current_user

@app.post("/api/medicines/", response_model=schemas.MedicineResponse)
def create_medicine(
    medicine: schemas.MedicineCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user) # ЗАЩИТА
):
    return crud.create_medicine(db=db, medicine=medicine, user_id=current_user.id)

@app.put("/api/medicines/{medicine_id}", response_model=schemas.MedicineResponse)
def update_medicine(
    medicine_id: int, 
    medicine: schemas.MedicineUpdate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user) # ЗАЩИТА
):
    db_medicine = crud.update_medicine(db, medicine_id, medicine, user_id=current_user.id)
    if db_medicine is None:
        raise HTTPException(status_code=404, detail="Лекарство не найдено или нет прав доступа")
    return db_medicine

@app.delete("/api/medicines/{medicine_id}")
def delete_medicine(
    medicine_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user) # ЗАЩИТА
):
    db_medicine = crud.delete_medicine(db, medicine_id, user_id=current_user.id)
    if db_medicine is None:
        raise HTTPException(status_code=404, detail="Лекарство не найдено или нет прав доступа")
    return {"ok": True}