"""
Calendar helpers for festival and season detection
"""
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from app.services.demand.scoring_config import FESTIVALS, SEASONAL_CROPS


def get_current_month() -> int:
    """Get current month number (1-12)"""
    return datetime.now().month


def get_festival_boost(
    current_date: datetime,
    product_category: str,
    horizon_days: int = 7
) -> tuple[float, Optional[str]]:
    """
    Calculate festival boost factor based on upcoming festivals.

    Args:
        current_date: Current date
        product_category: 'fruit' or 'vegetable'
        horizon_days: Time horizon in days

    Returns:
        Tuple of (boost_score, festival_name)
    """
    max_boost = 0
    active_festival = None

    for festival in FESTIVALS:
        # Check if festival affects this product category
        if product_category not in festival["affected_products"]:
            continue

        # Calculate festival date for current year
        festival_date = datetime(current_date.year, festival["month"], festival["day"])

        # Check if festival is within horizon
        days_until_festival = (festival_date - current_date).days

        if 0 <= days_until_festival <= horizon_days:
            # Festival is upcoming or ongoing
            boost = festival["impact_score"]
            if boost > max_boost:
                max_boost = boost
                active_festival = festival["name"]

    return max_boost, active_festival


def get_season_match_score(
    current_month: int,
    product_category: str,
    growing_season_months: list[int]
) -> float:
    """
    Calculate season match score based on current month and growing season.

    Args:
        current_month: Current month number (1-12)
        product_category: 'fruit' or 'vegetable'
        growing_season_months: List of month numbers when product grows

    Returns:
        Season match score (0-100)
    """
    if current_month in growing_season_months:
        return 100.0  # Perfect match
    else:
        return 50.0  # Partial match (product available but not peak season)


def is_festival_month(current_month: int) -> bool:
    """Check if current month has any major festivals"""
    festival_months = [f["month"] for f in FESTIVALS]
    return current_month in festival_months


def get_season_name(current_month: int, product_category: str) -> str:
    """Get season name for current month and product category"""
    seasons = SEASONAL_CROPS.get(product_category, {})
    for season_name, months in seasons.items():
        if current_month in months:
            return season_name
    return "unknown"
