from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.dependencies import get_db
from app.core.security import hash_password, verify_password
from app.core.jwt import create_access_token, create_refresh_token, verify_token
from app.models.user import User
from app.schemas.user import UserCreate

router = APIRouter()

@router.post("/register")
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(email=user_data.email, password_hash=hash_password(user_data.password))
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return {
        "access_token": create_access_token({"sub": str(new_user.user_id)}),
        "refresh_token": create_refresh_token({"sub": str(new_user.user_id)}),
        "token_type": "bearer"
    }

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "access_token": create_access_token({"sub": str(user.user_id)}),
        "refresh_token": create_refresh_token({"sub": str(user.user_id)}),
        "token_type": "bearer"
    }

@router.post("/refresh")
async def refresh_token_endpoint(refresh_token: str = Body(..., embed=True)):
    payload = verify_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    user_id = payload.get("sub")
    return {
        "access_token": create_access_token({"sub": user_id}),
        "token_type": "bearer"
    }