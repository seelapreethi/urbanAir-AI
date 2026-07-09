from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.role import Role


class UserRepository:
    @staticmethod
    def get_by_id(db: Session, user_id: str) -> Optional[User]:
        return db.query(User).filter(User.user_id == user_id, User.is_active == True).first()

    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email, User.is_active == True).first()

    @staticmethod
    def create(db: Session, user: User) -> User:
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_role_by_id(db: Session, role_id: str) -> Optional[Role]:
        return db.query(Role).filter(Role.role_id == role_id).first()

    @staticmethod
    def get_role_by_name(db: Session, role_name: str) -> Optional[Role]:
        return db.query(Role).filter(Role.role_name == role_name).first()

    @staticmethod
    def create_role(db: Session, role: Role) -> Role:
        db.add(role)
        db.commit()
        db.refresh(role)
        return role
