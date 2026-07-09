from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.dependencies import get_current_user
from app.schemas.auth import LoginRequest, RefreshRequest, TokenResponse, UserMeResponse
from app.services.auth_service import AuthService
from app.repositories.user_repository import UserRepository
from app.models.user import User

router = APIRouter()


@router.post("/login")
def login(
    request_data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = AuthService.authenticate_user(
        db, email=request_data.email, password=request_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    tokens = AuthService.generate_auth_tokens(user)
    return {
        "success": True,
        "message": "Login successful",
        "data": tokens.model_dump(),
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }


@router.post("/refresh")
def refresh(
    request_data: RefreshRequest,
    db: Session = Depends(get_db)
):
    tokens = AuthService.refresh_session_token(db, refresh_token=request_data.refresh_token)
    if not tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    return {
        "success": True,
        "message": "Token refresh successful",
        "data": tokens.model_dump(),
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    # Standard JWT logout is stateless client-side discard.
    # In a full production build, we could blacklist tokens in Redis.
    return {
        "success": True,
        "message": "Logged out successfully",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }


@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    role = UserRepository.get_role_by_id(db, current_user.role_id)
    role_name = role.role_name if role else "Citizen"
    
    # Define role permissions lists
    permissions = []
    if role_name == "Administrator":
        permissions = ["all"]
    elif role_name == "City Officer":
        permissions = ["read:dashboard", "read:reports", "run:simulations"]
    elif role_name == "Pollution Board":
        permissions = ["read:dashboard", "run:forecasts"]
    elif role_name == "Health Department":
        permissions = ["read:dashboard", "manage:advisories"]

    me_data = UserMeResponse(
        user_id=current_user.user_id,
        email=current_user.email,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        role_name=role_name,
        city_id=current_user.city_id,
        permissions=permissions
    )
    
    return {
        "success": True,
        "message": "User profile retrieved successfully",
        "data": me_data.model_dump(),
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
