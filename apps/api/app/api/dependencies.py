from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.security.jwt import decode_token
from app.repositories.user_repository import UserRepository
from app.models.user import User

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login"
)


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(reusable_oauth2)
) -> User:
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload invalid",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    user = UserRepository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


def get_current_admin(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> User:
    role = UserRepository.get_role_by_id(db, current_user.role_id)
    if not role or role.role_name != "Administrator":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privilege required",
        )
    return current_user


def get_current_officer(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> User:
    role = UserRepository.get_role_by_id(db, current_user.role_id)
    if not role or role.role_name not in ["Administrator", "City Officer"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="City Officer privilege required",
        )
    return current_user


def get_current_pcb(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> User:
    role = UserRepository.get_role_by_id(db, current_user.role_id)
    if not role or role.role_name not in ["Administrator", "Pollution Board"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Pollution Board privilege required",
        )
    return current_user

