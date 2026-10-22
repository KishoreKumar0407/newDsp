"""
Scoring logic for Demand Insights (Phase 1)

Implements the transparent scoring model based on reference data and calendar features.
"""
from datetime import datetime
from typing import Dict, Any, Optional
from app.services.demand.scoring_config import (
    SCORING_WEIGHTS,
    PRODUCTION_LEVEL_SCORES,
    PER_CAPITA_DEMAND_KG,
    DEMAND_LEVEL_THRESHOLDS,
    HORIZON_MULTIPLIERS,
)
from app.services.demand.calendar import get_festival_boost, get_season_match_score


class ScoringModel:
    """Transparent scoring model for demand prediction"""

    def __init__(self):
        self.weights = SCORING_WEIGHTS

    def calculate_score(
        self,
        district_data: Dict[str, Any],
        product_data: Dict[str, Any],
        supply_data: Optional[Dict[str, Any]],
        horizon_days: int = 7
    ) -> Dict[str, Any]:
        """
        Calculate demand score for a district-product pair.

        Args:
            district_data: Dict with population, urban_ratio, hotels_count, restaurants_count, markets_count
            product_data: Dict with name, category
            supply_data: Dict with local_production_level, growing_season_months (can be None)
            horizon_days: Time horizon in days (7 or 30)

        Returns:
            Dict with demand_score, demand_level, predicted_quantity_kg, confidence_level, factor_breakdown
        """
        # Edge case: missing reference data
        if supply_data is None:
            return {
                "demand_score": 0.0,
                "demand_level": "Low",
                "predicted_quantity_kg": None,
                "confidence_level": "Low",
                "factor_breakdown": {
                    "error": "Insufficient data: supply data missing",
                },
                "prediction_method": "scoring",
            }

        # Edge case: zero population
        if district_data.get("population", 0) == 0:
            return {
                "demand_score": 0.0,
                "demand_level": "Low",
                "predicted_quantity_kg": None,
                "confidence_level": "Low",
                "factor_breakdown": {
                    "error": "Insufficient data: population is zero",
                },
                "prediction_method": "scoring",
            }

        # Extract data
        population = district_data["population"]
        urban_ratio = float(district_data["urban_ratio"])
        hotels_count = district_data.get("hotels_count", 0)
        restaurants_count = district_data.get("restaurants_count", 0)
        markets_count = district_data.get("markets_count", 0)
        product_category = product_data["category"]
        local_production_level = supply_data.get("local_production_level")
        growing_season_months = supply_data.get("growing_season_months", [])

        # Calculate individual factors
        current_date = datetime.now()
        current_month = current_date.month

        # 1. Population factor (normalized)
        max_population = 5000000  # Chennai approximate population as baseline
        population_factor = min((population / max_population) * 100, 100)

        # 2. Production gap factor
        production_gap_factor = PRODUCTION_LEVEL_SCORES.get(local_production_level, 0)

        # 3. Season match factor
        season_match_factor = get_season_match_score(
            current_month,
            product_category,
            growing_season_months
        )

        # 4. Festival boost factor
        festival_boost, festival_name = get_festival_boost(
            current_date,
            product_category,
            horizon_days
        )
        festival_boost_factor = festival_boost

        # 5. Urban ratio factor
        urban_ratio_factor = urban_ratio * 100

        # 6. Commercial buyers factor
        max_commercial = 1000  # Baseline for normalization
        commercial_total = hotels_count + restaurants_count + markets_count
        commercial_buyers_factor = min((commercial_total / max_commercial) * 100, 100)

        # Calculate weighted score
        demand_score = (
            (population_factor * self.weights["population"]) +
            (production_gap_factor * self.weights["production_gap"]) +
            (season_match_factor * self.weights["season_match"]) +
            (festival_boost_factor * self.weights["festival_boost"]) +
            (urban_ratio_factor * self.weights["urban_ratio"]) +
            (commercial_buyers_factor * self.weights["commercial_buyers"])
        )

        # Normalize to 0-100
        demand_score = min(max(demand_score, 0), 100)

        # Determine demand level
        if demand_score >= DEMAND_LEVEL_THRESHOLDS["high"]:
            demand_level = "High"
        elif demand_score >= DEMAND_LEVEL_THRESHOLDS["medium"]:
            demand_level = "Medium"
        else:
            demand_level = "Low"

        # Calculate predicted quantity
        per_capita = PER_CAPITA_DEMAND_KG.get(product_category, 0.5)
        horizon_multiplier = HORIZON_MULTIPLIERS.get(horizon_days, 1.0)
        predicted_quantity_kg = (demand_score / 100) * population * per_capita * horizon_multiplier

        # Determine confidence level
        if local_production_level is None:
            confidence_level = "Low"
        elif local_production_level == "medium":
            confidence_level = "Medium"
        else:
            confidence_level = "High"

        # Build factor breakdown for "Why?" column
        factor_breakdown = {
            "population": {
                "value": population,
                "score": round(population_factor, 2),
                "weight": self.weights["population"],
                "contribution": round(population_factor * self.weights["population"], 2),
            },
            "production_gap": {
                "value": local_production_level,
                "score": round(production_gap_factor, 2),
                "weight": self.weights["production_gap"],
                "contribution": round(production_gap_factor * self.weights["production_gap"], 2),
            },
            "season_match": {
                "value": f"Month {current_month} in season: {current_month in growing_season_months}",
                "score": round(season_match_factor, 2),
                "weight": self.weights["season_match"],
                "contribution": round(season_match_factor * self.weights["season_match"], 2),
            },
            "festival_boost": {
                "value": festival_name if festival_name else "None",
                "score": round(festival_boost_factor, 2),
                "weight": self.weights["festival_boost"],
                "contribution": round(festival_boost_factor * self.weights["festival_boost"], 2),
            },
            "urban_ratio": {
                "value": round(urban_ratio, 4),
                "score": round(urban_ratio_factor, 2),
                "weight": self.weights["urban_ratio"],
                "contribution": round(urban_ratio_factor * self.weights["urban_ratio"], 2),
            },
            "commercial_buyers": {
                "value": commercial_total,
                "score": round(commercial_buyers_factor, 2),
                "weight": self.weights["commercial_buyers"],
                "contribution": round(commercial_buyers_factor * self.weights["commercial_buyers"], 2),
            },
        }

        return {
            "demand_score": round(demand_score, 2),
            "demand_level": demand_level,
            "predicted_quantity_kg": round(predicted_quantity_kg, 2),
            "confidence_level": confidence_level,
            "factor_breakdown": factor_breakdown,
            "prediction_method": "scoring",
        }


# Global scoring model instance
scoring_model = ScoringModel()
