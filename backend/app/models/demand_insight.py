import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Numeric, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.models.base import Base


class DemandInsight(Base):
    __tablename__ = "demand_insights"
    __table_args__ = (
        CheckConstraint(
            "horizon_days IN (7, 30)",
            name="chk_horizon_days"
        ),
        CheckConstraint(
            "demand_level IN ('High', 'Medium', 'Low')",
            name="chk_demand_level"
        ),
        CheckConstraint(
            "confidence_level IN ('High', 'Medium', 'Low')",
            name="chk_confidence_level"
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False
    )
    district_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("tn_districts.id", ondelete="CASCADE"),
        nullable=False
    )
    horizon_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )
    demand_score: Mapped[float] = mapped_column(
        Numeric(5, 2),
        nullable=False
    )
    demand_level: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )
    predicted_quantity_kg: Mapped[float | None] = mapped_column(
        Numeric(12, 2),
        nullable=True
    )
    confidence_level: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )
    factor_breakdown: Mapped[dict] = mapped_column(
        default=dict,
        nullable=False
    )
    prediction_method: Mapped[str] = mapped_column(
        String(50),
        default='scoring',
        nullable=False
    )
    model_version: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )
    cached_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Relationships
    product = relationship("Product")
    district = relationship("TNDistrict", back_populates="demand_insights")
