import logging
from sqlalchemy.orm import Session
from app.models.role import Role
from app.models.user import User
from app.security.password import get_password_hash
from app.repositories.user_repository import UserRepository
from app.core.config import settings

logger = logging.getLogger(__name__)


def seed_db(db: Session) -> None:
    if settings.ENVIRONMENT != "development":
        logger.warning("Seeding skipped. Optional seeding is only allowed in development mode.")
        return

    logger.info("Initializing optional development database seeding...")

    # Define standard roles
    roles_to_seed = [
        {"name": "Administrator", "desc": "Full administrative permissions"},
        {"name": "City Officer", "desc": "Dashboard, reports, simulator access"},
        {"name": "Citizen", "desc": "Public health advisory and AI chat access"},
        {"name": "Pollution Board", "desc": "Forecast validation and enforcement tracking"},
        {"name": "Health Department", "desc": "Health advisories control"}
    ]

    seeded_roles = {}
    for role_data in roles_to_seed:
        existing_role = UserRepository.get_role_by_name(db, role_data["name"])
        if not existing_role:
            role = Role(
                role_name=role_data["name"],
                description=role_data["desc"]
            )
            seeded_role = UserRepository.create_role(db, role)
            seeded_roles[role_data["name"]] = seeded_role
            logger.info(f"Seeded role: {role_data['name']}")
        else:
            seeded_roles[role_data["name"]] = existing_role

    # Define standard users
    users_to_seed = [
        {
            "email": "admin@urbanair.ai",
            "password": "Admin@123",
            "first_name": "Admin",
            "last_name": "User",
            "role": "Administrator"
        },
        {
            "email": "officer@urbanair.ai",
            "password": "Officer@123",
            "first_name": "City",
            "last_name": "Officer",
            "role": "City Officer"
        },
        {
            "email": "citizen@urbanair.ai",
            "password": "Citizen@123",
            "first_name": "Citizen",
            "last_name": "User",
            "role": "Citizen"
        }
    ]

    for user_data in users_to_seed:
        existing_user = UserRepository.get_by_email(db, user_data["email"])
        if not existing_user:
            role_obj = seeded_roles.get(user_data["role"])
            if not role_obj:
                logger.error(f"Cannot seed user {user_data['email']}, missing role object.")
                continue
            
            user = User(
                email=user_data["email"],
                password_hash=get_password_hash(user_data["password"]),
                first_name=user_data["first_name"],
                last_name=user_data["last_name"],
                role_id=role_obj.role_id,
                is_verified=True,
                is_active=True
            )
            UserRepository.create(db, user)
            logger.info(f"Seeded user: {user_data['email']}")
        else:
            logger.info(f"User {user_data['email']} already exists.")

    logger.info("Optional development seeding completed successfully.")
