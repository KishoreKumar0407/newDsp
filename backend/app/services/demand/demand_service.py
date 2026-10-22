"""
Demand service - orchestrates scoring, caching, and order aggregation
"""
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.models.product import Product
from app.models.tn_district import TNDistrict
from app.models.district_product_supply import DistrictProductSupply
from app.models.demand_insight import DemandInsight
from app.services.demand.scoring import scoring_model


class DemandService:
    """Service for demand insights and predictions"""

    def __init__(self, db: Session):
        self.db = db

    def get_demand_insights(
        self,
        product_id: str,
        horizon_days: int = 7
    ) -> Dict[str, Any]:
        """
        Get demand insights for a product across all districts.

        Args:
            product_id: Product UUID
            horizon_days: Time horizon in days (7 or 30)

        Returns:
            Dict with product info and ranked district insights
        """
        # Get product
        product = self.db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise ValueError(f"Product not found: {product_id}")

        # Get all districts
        districts = self.db.query(TNDistrict).all()

        insights = []
        for district in districts:
            # Get supply data for this district-product pair
            supply = self.db.query(DistrictProductSupply).filter(
                and_(
                    DistrictProductSupply.district_id == district.id,
                    DistrictProductSupply.product_id == product_id
                )
            ).first()

            # Calculate score
            district_data = {
                "population": district.population,
                "urban_ratio": district.urban_ratio,
                "hotels_count": district.hotels_count,
                "restaurants_count": district.restaurants_count,
                "markets_count": district.markets_count,
            }

            product_data = {
                "name": product.name,
                "category": product.category,
            }

            supply_data = None
            if supply:
                supply_data = {
                    "local_production_level": supply.local_production_level,
                    "growing_season_months": supply.growing_season_months,
                }

            result = scoring_model.calculate_score(
                district_data,
                product_data,
                supply_data,
                horizon_days
            )

            # Check for insufficient data
            if "error" in result.get("factor_breakdown", {}):
                continue  # Skip districts with insufficient data

            insights.append({
                "district_id": str(district.id),
                "district_name": district.name,
                "district_code": district.code,
                "demand_score": result["demand_score"],
                "demand_level": result["demand_level"],
                "predicted_quantity_kg": result["predicted_quantity_kg"],
                "confidence_level": result["confidence_level"],
                "factor_breakdown": result["factor_breakdown"],
                "prediction_method": result["prediction_method"],
            })

        # Sort by demand score (descending)
        insights.sort(key=lambda x: x["demand_score"], reverse=True)

        # Add rank
        for idx, insight in enumerate(insights, 1):
            insight["rank"] = idx

        return {
            "product_name": product.name,
            "product_category": product.category,
            "horizon_days": horizon_days,
            "insights": insights,
            "total_districts": len(insights),
            "generated_at": datetime.now(),
        }

    def cache_demand_insights(
        self,
        product_id: str,
        horizon_days: int
    ) -> None:
        """
        Cache demand insights in the database.

        Args:
            product_id: Product UUID
            horizon_days: Time horizon in days
        """
        # Get insights
        insights_data = self.get_demand_insights(product_id, horizon_days)

        # Clear existing cache for this product-horizon
        self.db.query(DemandInsight).filter(
            and_(
                DemandInsight.product_id == product_id,
                DemandInsight.horizon_days == horizon_days
            )
        ).delete()

        # Insert new cache entries
        for insight in insights_data["insights"]:
            cache_entry = DemandInsight(
                product_id=product_id,
                district_id=insight["district_id"],
                horizon_days=horizon_days,
                demand_score=insight["demand_score"],
                demand_level=insight["demand_level"],
                predicted_quantity_kg=insight["predicted_quantity_kg"],
                confidence_level=insight["confidence_level"],
                factor_breakdown=insight["factor_breakdown"],
                prediction_method=insight["prediction_method"],
            )
            self.db.add(cache_entry)

        self.db.commit()

    def aggregate_orders_by_district_product_week(
        self,
        start_date: datetime,
        end_date: datetime
    ) -> List[Dict[str, Any]]:
        """
        Aggregate orders by district, product, and week.

        This function is written for Phase 2 ML readiness but not used in Phase 1 scoring.

        Args:
            start_date: Start date for aggregation
            end_date: End date for aggregation

        Returns:
            List of dicts with aggregated order data
        """
        # TODO: Implement when order tables are created in Phase 2
        # This will query orders and order_items tables
        # Example query structure (to be implemented):
        #
        # result = self.db.query(
        #     Order.district_id,
        #     OrderItem.product_id,
        #     func.date_trunc('week', Order.created_at).label('week'),
        #     func.sum(OrderItem.quantity).label('total_quantity'),
        #     func.count(Order.id).label('order_count'),
        #     func.count(func.distinct(Order.user_id)).label('unique_buyers'),
        # ).join(OrderItem).filter(
        #     Order.created_at >= start_date,
        #     Order.created_at <= end_date,
        # ).group_by(
        #     Order.district_id,
        #     OrderItem.product_id,
        #     func.date_trunc('week', Order.created_at),
        # ).all()
        #
        # return [
        #     {
        #         "district_id": str(row.district_id),
        #         "product_id": str(row.product_id),
        #         "week": row.week,
        #         "total_quantity": row.total_quantity,
        #         "order_count": row.order_count,
        #         "unique_buyers": row.unique_buyers,
        #     }
        #     for row in result
        # ]

        return []  # Return empty for Phase 1


def get_demand_service(db: Session) -> DemandService:
    """Factory function to get demand service instance"""
    return DemandService(db)
