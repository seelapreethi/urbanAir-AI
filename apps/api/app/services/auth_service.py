from typing import Optional
from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.security.password import verify_password
from app.security.jwt import create_access_token, create_refresh_token, decode_token
from app.schemas.auth import TokenResponse
from app.core.config import settings


class AuthService:
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        user = UserRepository.get_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return user

    @staticmethod
    def generate_auth_tokens(user: User) -> TokenResponse:
        access_token = create_access_token(subject=user.user_id)
        refresh_token = create_refresh_token(subject=user.user_id)
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )

    @staticmethod
    def refresh_session_token(db: Session, refresh_token: str) -> Optional[TokenResponse]:
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            return None
        
        user_id = payload.get("sub")
        if not user_id:
            return None
            
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            return None
            
        return AuthService.generate_auth_tokens(user)
