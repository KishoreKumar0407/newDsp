import uuid
from datetime import datetime
from sqlalchemy import String, ARRAY, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.models.base import Base


class DistrictProductSupply(Base):
    __tablename__ = "district_product_supply"
    __table_args__ = (
        CheckConstraint(
            "local_production_level IN ('low', 'medium', 'high')",
            name="chk_local_production_level"
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )
    district_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("tn_districts.id", ondelete="CASCADE"),
        nullable=False
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False
    )
    local_production_level: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )
    growing_season_months: Mapped[list[int]] = mapped_column(
        ARRAY(Integer),
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
    district = relationship("TNDistrict", back_populates="district_product_supplies")
    product = relationship("Product")
