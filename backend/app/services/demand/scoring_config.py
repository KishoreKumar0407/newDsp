"""
Scoring Model Configuration for Demand Insights (Phase 1)

This file contains all configurable weights and parameters for the scoring model.
Admins can tune these weights without changing code logic.
"""

# Scoring weights (sum to 100)
SCORING_WEIGHTS = {
    "population": 30,
    "production_gap": 25,
    "season_match": 15,
    "festival_boost": 15,
    "urban_ratio": 10,
    "commercial_buyers": 5,
}

# Production level mappings to production gap factor
PRODUCTION_LEVEL_SCORES = {
    "low": 100,      # Low production = high demand gap
    "medium": 50,    # Medium production = moderate demand gap
    "high": 0,       # High production = no demand gap
    None: 0,         # Missing data = no score (will be marked as insufficient data)
}

# Festival configuration for Tamil Nadu
FESTIVALS = [
    {
        "name": "Pongal",
        "month": 1,           # January
        "day": 14,            # Approximate
        "duration_days": 4,   # 4-day festival
        "impact_score": 30,   # High impact on vegetable demand
        "affected_products": ["vegetable"],  # Affects all vegetables
    },
    {
        "name": "Thai Pongal",
        "month": 1,
        "day": 15,
        "duration_days": 1,
        "impact_score": 25,
        "affected_products": ["vegetable"],
    },
    {
        "name": "Deepavali",
        "month": 10,          # October or November (varies)
        "day": 24,            # Approximate
        "duration_days": 3,
        "impact_score": 35,   # Very high impact
        "affected_products": ["fruit", "vegetable"],
    },
    {
        "name": "Aadi Perukku",
        "month": 7,           # July
        "day": 18,
        "duration_days": 1,
        "impact_score": 20,
        "affected_products": ["vegetable"],
    },
    {
        "name": "Karthigai Deepam",
        "month": 11,          # November or December (varies)
        "day": 25,            # Approximate
        "duration_days": 1,
        "impact_score": 25,
        "affected_products": ["fruit", "vegetable"],
    },
    {
        "name": "Tamil New Year",
        "month": 4,           # April
        "day": 14,
        "duration_days": 1,
        "impact_score": 20,
        "affected_products": ["fruit", "vegetable"],
    },
]

# Season calendar (month numbers 1-12)
SEASONAL_CROPS = {
    "vegetable": {
        "summer": [3, 4, 5],           # March, April, May
        "monsoon": [6, 7, 8, 9, 10],    # June to October
        "winter": [11, 12, 1, 2],       # November to February
    },
    "fruit": {
        "summer": [3, 4, 5, 6],
        "monsoon": [7, 8, 9],
        "winter": [10, 11, 12, 1, 2],
    },
}

# Per capita demand baseline (kg per person per week)
PER_CAPITA_DEMAND_KG = {
    "vegetable": 0.5,
    "fruit": 0.3,
}

# Demand level thresholds
DEMAND_LEVEL_THRESHOLDS = {
    "high": 70,
    "medium": 40,
    "low": 0,
}

# Horizon multipliers (adjust predicted quantity based on time horizon)
HORIZON_MULTIPLIERS = {
    7: 1.0,   # 7 days = baseline
    30: 4.3,  # 30 days = ~4.3x weekly
}

# Confidence level rules
CONFIDENCE_RULES = {
    "high": "local_production_level in ['low', 'medium', 'high']",
    "medium": "local_production_level == 'medium'",
    "low": "local_production_level is None",
}
