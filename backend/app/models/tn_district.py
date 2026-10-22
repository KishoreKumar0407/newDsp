import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.models.base import Base


class TNDistrict(Base):
    __tablename__ = "tn_districts"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False
    )
    code: Mapped[str] = mapped_column(
        String(10),
        unique=True,
        nullable=False
    )
    population: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )
    urban_ratio: Mapped[float] = mapped_column(
        Numeric(5, 4),
        nullable=False
    )
    hotels_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    restaurants_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    markets_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # Relationships
    district_product_supplies = relationship("DistrictProductSupply", back_populates="district")
    demand_insights = relationship("DemandInsight", back_populates="district")
