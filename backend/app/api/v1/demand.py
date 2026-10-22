"""
Demand Insights API (Admin Only)

All endpoints require admin role.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.demand import (
    DemandInsightsRequest,
    DemandInsightsResponse,
    DemandInsightDetail,
    ProductCreate,
    ProductResponse,
    TNDistrictCreate,
    TNDistrictResponse,
    TNDistrictUpdate,
    DistrictProductSupplyCreate,
    DistrictProductSupplyResponse,
    DistrictProductSupplyUpdate,
)
from app.models.product import Product
from app.models.tn_district import TNDistrict
from app.models.district_product_supply import DistrictProductSupply
from app.services.demand import get_demand_service

router = APIRouter()


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to require admin role"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


# --- Demand Insights Endpoints ---

@router.get("/insights", response_model=DemandInsightsResponse)
def get_demand_insights(
    product_id: str,
    horizon_days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Get demand insights for a product across all districts.

    Returns ranked districts with demand scores, levels, and factor breakdowns.
    """
    demand_service = get_demand_service(db)

    try:
        insights_data = demand_service.get_demand_insights(product_id, horizon_days)

        # Convert to response format
        insights = [
            DemandInsightDetail(
                district_name=insight["district_name"],
                district_code=insight["district_code"],
                rank=insight["rank"],
                demand_score=insight["demand_score"],
                demand_level=insight["demand_level"],
                predicted_quantity_kg=insight["predicted_quantity_kg"],
                confidence_level=insight["confidence_level"],
                factor_breakdown=insight["factor_breakdown"],
                prediction_method=insight["prediction_method"],
            )
            for insight in insights_data["insights"]
        ]

        return DemandInsightsResponse(
            product_name=insights_data["product_name"],
            product_category=insights_data["product_category"],
            horizon_days=insights_data["horizon_days"],
            insights=insights,
            total_districts=insights_data["total_districts"],
            generated_at=insights_data["generated_at"],
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.post("/insights/cache")
def cache_demand_insights(
    product_id: str,
    horizon_days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Cache demand insights in the database.

    This endpoint is useful for pre-computing insights for faster retrieval.
    """
    demand_service = get_demand_service(db)

    try:
        demand_service.cache_demand_insights(product_id, horizon_days)
        return {"message": "Demand insights cached successfully"}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


# --- Product Management Endpoints ---

@router.post("/products", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create a new product (admin only)"""
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@router.get("/products", response_model=List[ProductResponse])
def list_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """List all products (admin only)"""
    products = db.query(Product).all()
    return products


# --- District Management Endpoints ---

@router.post("/districts", response_model=TNDistrictResponse)
def create_district(
    district: TNDistrictCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create a new TN district (admin only)"""
    db_district = TNDistrict(**district.model_dump())
    db.add(db_district)
    db.commit()
    db.refresh(db_district)
    return db_district


@router.get("/districts", response_model=List[TNDistrictResponse])
def list_districts(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """List all TN districts (admin only)"""
    districts = db.query(TNDistrict).all()
    return districts


@router.put("/districts/{district_id}", response_model=TNDistrictResponse)
def update_district(
    district_id: str,
    district_update: TNDistrictUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update a TN district (admin only)"""
    db_district = db.query(TNDistrict).filter(TNDistrict.id == district_id).first()
    if not db_district:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="District not found"
        )

    update_data = district_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_district, field, value)

    db.commit()
    db.refresh(db_district)
    return db_district


# --- District Product Supply Management Endpoints ---

@router.post("/supply", response_model=DistrictProductSupplyResponse)
def create_district_product_supply(
    supply: DistrictProductSupplyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create or update district-product supply data (admin only)"""
    # Check if already exists
    existing = db.query(DistrictProductSupply).filter(
        DistrictProductSupply.district_id == supply.district_id,
        DistrictProductSupply.product_id == supply.product_id
    ).first()

    if existing:
        # Update existing
        update_data = supply.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(existing, field, value)
        db.commit()
        db.refresh(existing)
        return existing
    else:
        # Create new
        db_supply = DistrictProductSupply(**supply.model_dump())
        db.add(db_supply)
        db.commit()
        db.refresh(db_supply)
        return db_supply


@router.get("/supply", response_model=List[DistrictProductSupplyResponse])
def list_district_product_supply(
    district_id: str = None,
    product_id: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """List district-product supply data (admin only)"""
    query = db.query(DistrictProductSupply)

    if district_id:
        query = query.filter(DistrictProductSupply.district_id == district_id)
    if product_id:
        query = query.filter(DistrictProductSupply.product_id == product_id)

    supplies = query.all()
    return supplies


@router.put("/supply/{supply_id}", response_model=DistrictProductSupplyResponse)
def update_district_product_supply(
    supply_id: str,
    supply_update: DistrictProductSupplyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Update district-product supply data (admin only)"""
    db_supply = db.query(DistrictProductSupply).filter(
        DistrictProductSupply.id == supply_id
    ).first()
    if not db_supply:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supply data not found"
        )

    update_data = supply_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_supply, field, value)

    db.commit()
    db.refresh(db_supply)
    return db_supply
