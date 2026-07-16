from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from sqlalchemy.ext.compiler import compiles
from geoalchemy2.types import Geometry, Geography

@compiles(Geometry, "sqlite")
def compile_geometry_sqlite(element, compiler, **kw):
    return "TEXT"

@compiles(Geography, "sqlite")
def compile_geography_sqlite(element, compiler, **kw):
    return "TEXT"

# Monkeypatch GeoAlchemy2 SQLite dialect hooks to bypass SpatiaLite functions in development
if settings.DATABASE_URL.startswith("sqlite"):
    try:
        import geoalchemy2.admin.dialects.sqlite as geo_sqlite
        geo_sqlite.before_create = lambda *args, **kwargs: None
        geo_sqlite.after_create = lambda *args, **kwargs: None
        geo_sqlite.before_drop = lambda *args, **kwargs: None
        geo_sqlite.after_drop = lambda *args, **kwargs: None
    except ImportError:
        pass

import socket
import urllib.parse

def resolve_ipv4(host: str, port: int = 5432) -> str:
    try:
        addr_info = socket.getaddrinfo(host, port, socket.AF_INET)
        if addr_info:
            return addr_info[0][4][0]
    except Exception as e:
        print(f"Error resolving IPv4 address for host {host} on port {port}: {e}")
    return None

# For SQLite during test mode or fallback, check the URL
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    try:
        parsed = urllib.parse.urlparse(settings.DATABASE_URL)
        if parsed.hostname:
            port = parsed.port if parsed.port is not None else 5432
            ipv4_ip = resolve_ipv4(parsed.hostname, port)
            if ipv4_ip:
                connect_args["hostaddr"] = ipv4_ip
                connect_args["connect_timeout"] = 10
                print(f"Bypassed Render IPv6 boundary: mapped {parsed.hostname} -> {ipv4_ip}")
    except Exception as e:
        print(f"Failed to resolve IPv4 hostaddr fallback: {e}")

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    connect_args=connect_args
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
