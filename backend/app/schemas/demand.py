from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime


class ProductBase(BaseModel):
    name: str = Field(..., max_length=255)
    category: str = Field(..., pattern="^(fruit|vegetable)$")
    unit: str = Field(default="kg", max_length=50)


class ProductCreate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TNDistrictBase(BaseModel):
    name: str = Field(..., max_length=255)
    code: str = Field(..., max_length=10)
    population: int = Field(..., gt=0)
    urban_ratio: float = Field(..., ge=0, le=1)
    hotels_count: int = Field(default=0, ge=0)
    restaurants_count: int = Field(default=0, ge=0)
    markets_count: int = Field(default=0, ge=0)


class TNDistrictCreate(TNDistrictBase):
    pass


class TNDistrictUpdate(BaseModel):
    population: Optional[int] = Field(None, gt=0)
    urban_ratio: Optional[float] = Field(None, ge=0, le=1)
    hotels_count: Optional[int] = Field(None, ge=0)
    restaurants_count: Optional[int] = Field(None, ge=0)
    markets_count: Optional[int] = Field(None, ge=0)


class TNDistrictResponse(TNDistrictBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DistrictProductSupplyBase(BaseModel):
    district_id: str
    product_id: str
    local_production_level: str = Field(..., pattern="^(low|medium|high)$")
    growing_season_months: list[int] = Field(..., min_length=1)


class DistrictProductSupplyCreate(DistrictProductSupplyBase):
    pass


class DistrictProductSupplyUpdate(BaseModel):
    local_production_level: Optional[str] = Field(None, pattern="^(low|medium|high)$")
    growing_season_months: Optional[list[int]] = Field(None, min_length=1)


class DistrictProductSupplyResponse(DistrictProductSupplyBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DemandInsightResponse(BaseModel):
    id: str
    product_id: str
    district_id: str
    horizon_days: int
    demand_score: float
    demand_level: str
    predicted_quantity_kg: Optional[float]
    confidence_level: str
    factor_breakdown: Dict[str, Any]
    prediction_method: str
    model_version: Optional[str]
    cached_at: datetime

    class Config:
        from_attributes = True


class DemandInsightsRequest(BaseModel):
    product_id: str
    horizon_days: int = Field(default=7, ge=1, le=30)


class DemandInsightDetail(BaseModel):
    district_name: str
    district_code: str
    rank: int
    demand_score: float
    demand_level: str
    predicted_quantity_kg: Optional[float]
    confidence_level: str
    factor_breakdown: Dict[str, Any]
    prediction_method: str


class DemandInsightsResponse(BaseModel):
    product_name: str
    product_category: str
    horizon_days: int
    insights: list[DemandInsightDetail]
    total_districts: int
    generated_at: datetime
