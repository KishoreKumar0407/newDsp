"""
Simplified Demand API for Demand Insights (SQLite version)
This bypasses PostgreSQL dependencies for testing
"""
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import sqlite3
import uuid

app = FastAPI(title="Demand Insights API (Simplified)")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory database
DB_FILE = "demand_simple.db"

def init_db():
    """Initialize SQLite database"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Create tables
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            unit TEXT NOT NULL DEFAULT 'kg'
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tn_districts (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            code TEXT NOT NULL UNIQUE,
            population INTEGER NOT NULL,
            urban_ratio REAL NOT NULL,
            hotels_count INTEGER DEFAULT 0,
            restaurants_count INTEGER DEFAULT 0,
            markets_count INTEGER DEFAULT 0
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS district_product_supply (
            id TEXT PRIMARY KEY,
            district_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            local_production_level TEXT NOT NULL,
            growing_season_months TEXT NOT NULL,
            UNIQUE(district_id, product_id)
        )
    """)

    conn.commit()
    conn.close()

def seed_db():
    """Seed database with initial data"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Check if already seeded
    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] > 0:
        conn.close()
        return

    # Seed products
    products = [
        (str(uuid.uuid4()), "Cabbage", "vegetable", "kg"),
        (str(uuid.uuid4()), "Tomato", "vegetable", "kg"),
        (str(uuid.uuid4()), "Onion", "vegetable", "kg"),
    ]
    cursor.executemany("INSERT INTO products (id, name, category, unit) VALUES (?, ?, ?, ?)", products)

    # Seed districts (5 major districts for demo)
    districts = [
        (str(uuid.uuid4()), "Chennai", "TN02", 4646732, 0.90, 500, 2000, 150),
        (str(uuid.uuid4()), "Coimbatore", "TN03", 3472378, 0.70, 300, 800, 80),
        (str(uuid.uuid4()), "Madurai", "TN12", 3034325, 0.58, 150, 400, 70),
        (str(uuid.uuid4()), "Salem", "TN19", 3482005, 0.52, 100, 250, 60),
        (str(uuid.uuid4()), "Tiruchirappalli", "TN24", 2722290, 0.55, 120, 300, 65),
    ]
    cursor.executemany(
        "INSERT INTO tn_districts (id, name, code, population, urban_ratio, hotels_count, restaurants_count, markets_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        districts
    )

    # Get product IDs
    cursor.execute("SELECT id, name FROM products")
    product_map = {name: id for id, name in cursor.fetchall()}

    # Get district IDs
    cursor.execute("SELECT id, code FROM tn_districts")
    district_map = {code: id for id, code in cursor.fetchall()}

    # Seed supply data
    supply_data = []
    for district_code, district_id in district_map.items():
        for product_name, product_id in product_map.items():
            level = "high" if district_code in ["TN02", "TN03"] else "medium"
            seasons = "[11, 12, 1, 2]" if product_name == "Cabbage" else "[1, 2, 3, 10, 11, 12]"
            supply_data.append((str(uuid.uuid4()), district_id, product_id, level, seasons))

    cursor.executemany(
        "INSERT INTO district_product_supply (id, district_id, product_id, local_production_level, growing_season_months) VALUES (?, ?, ?, ?, ?)",
        supply_data
    )

    conn.commit()
    conn.close()

# Initialize database on startup
init_db()
seed_db()

# Pydantic models
class ProductResponse(BaseModel):
    id: str
    name: str
    category: str
    unit: str

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
    insights: List[DemandInsightDetail]
    total_districts: int
    generated_at: datetime

# Simple scoring logic (copied from scoring.py)
def calculate_score(district_data, product_data, supply_data, horizon_days=7):
    """Calculate demand score"""
    from datetime import datetime as dt

    population = district_data["population"]
    urban_ratio = district_data["urban_ratio"]
    hotels_count = district_data["hotels_count"]
    restaurants_count = district_data["restaurants_count"]
    markets_count = district_data["markets_count"]
    product_category = product_data["category"]
    local_production_level = supply_data["local_production_level"]

    # Normalize factors
    max_population = 5000000
    population_factor = min((population / max_population) * 100, 100)

    production_gap_factor = {"low": 100, "medium": 50, "high": 0}.get(local_production_level, 0)

    current_month = dt.now().month
    growing_seasons = eval(supply_data["growing_season_months"])
    season_match_factor = 100 if current_month in growing_seasons else 50

    # Festival boost (simplified)
    festival_boost_factor = 35 if current_month in [10, 11, 1] else 0

    urban_ratio_factor = urban_ratio * 100

    max_commercial = 1000
    commercial_total = hotels_count + restaurants_count + markets_count
    commercial_buyers_factor = min((commercial_total / max_commercial) * 100, 100)

    # Weighted score
    demand_score = (
        (population_factor * 30) +
        (production_gap_factor * 25) +
        (season_match_factor * 15) +
        (festival_boost_factor * 15) +
        (urban_ratio_factor * 10) +
        (commercial_buyers_factor * 5)
    )
    demand_score = min(max(demand_score, 0), 100)

    # Demand level
    if demand_score >= 70:
        demand_level = "High"
    elif demand_score >= 40:
        demand_level = "Medium"
    else:
        demand_level = "Low"

    # Predicted quantity
    per_capita = 0.5
    horizon_multiplier = 1.0 if horizon_days == 7 else 4.3
    predicted_quantity_kg = (demand_score / 100) * population * per_capita * horizon_multiplier

    # Confidence
    confidence_level = "High" if local_production_level in ["low", "high"] else "Medium"

    # Factor breakdown
    factor_breakdown = {
        "population": {"value": population, "score": round(population_factor, 2), "weight": 30, "contribution": round(population_factor * 30, 2)},
        "production_gap": {"value": local_production_level, "score": round(production_gap_factor, 2), "weight": 25, "contribution": round(production_gap_factor * 25, 2)},
        "season_match": {"value": f"Month {current_month} in season: {current_month in growing_seasons}", "score": round(season_match_factor, 2), "weight": 15, "contribution": round(season_match_factor * 15, 2)},
        "festival_boost": {"value": "Festival" if festival_boost_factor > 0 else "None", "score": round(festival_boost_factor, 2), "weight": 15, "contribution": round(festival_boost_factor * 15, 2)},
        "urban_ratio": {"value": round(urban_ratio, 4), "score": round(urban_ratio_factor, 2), "weight": 10, "contribution": round(urban_ratio_factor * 10, 2)},
        "commercial_buyers": {"value": commercial_total, "score": round(commercial_buyers_factor, 2), "weight": 5, "contribution": round(commercial_buyers_factor * 5, 2)},
    }

    return {
        "demand_score": round(demand_score, 2),
        "demand_level": demand_level,
        "predicted_quantity_kg": round(predicted_quantity_kg, 2),
        "confidence_level": confidence_level,
        "factor_breakdown": factor_breakdown,
        "prediction_method": "scoring",
    }

# API Endpoints
@app.get("/api/v1/demand/products", response_model=List[ProductResponse])
def get_products():
    """Get all products"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, category, unit FROM products")
    products = [{"id": row[0], "name": row[1], "category": row[2], "unit": row[3]} for row in cursor.fetchall()]
    conn.close()
    return products

@app.get("/api/v1/demand/insights", response_model=DemandInsightsResponse)
def get_demand_insights(product_id: str, horizon_days: int = 7):
    """Get demand insights for a product"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Get product
    cursor.execute("SELECT name, category FROM products WHERE id = ?", (product_id,))
    product = cursor.fetchone()
    if not product:
        conn.close()
        raise HTTPException(status_code=404, detail="Product not found")

    product_name, product_category = product

    # Get all districts
    cursor.execute("SELECT id, name, code, population, urban_ratio, hotels_count, restaurants_count, markets_count FROM tn_districts")
    districts = cursor.fetchall()

    insights = []
    for district in districts:
        district_id, name, code, population, urban_ratio, hotels, restaurants, markets = district

        # Get supply data
        cursor.execute(
            "SELECT local_production_level, growing_season_months FROM district_product_supply WHERE district_id = ? AND product_id = ?",
            (district_id, product_id)
        )
        supply = cursor.fetchone()

        if not supply:
            continue

        local_production_level, growing_season_months = supply

        # Calculate score
        district_data = {
            "population": population,
            "urban_ratio": urban_ratio,
            "hotels_count": hotels,
            "restaurants_count": restaurants,
            "markets_count": markets,
        }

        product_data = {
            "name": product_name,
            "category": product_category,
        }

        supply_data = {
            "local_production_level": local_production_level,
            "growing_season_months": growing_season_months,
        }

        result = calculate_score(district_data, product_data, supply_data, horizon_days)

        insights.append({
            "district_id": district_id,
            "district_name": name,
            "district_code": code,
            "demand_score": result["demand_score"],
            "demand_level": result["demand_level"],
            "predicted_quantity_kg": result["predicted_quantity_kg"],
            "confidence_level": result["confidence_level"],
            "factor_breakdown": result["factor_breakdown"],
            "prediction_method": result["prediction_method"],
        })

    # Sort by score
    insights.sort(key=lambda x: x["demand_score"], reverse=True)

    # Add rank
    for idx, insight in enumerate(insights, 1):
        insight["rank"] = idx

    conn.close()

    return {
        "product_name": product_name,
        "product_category": product_category,
        "horizon_days": horizon_days,
        "insights": insights,
        "total_districts": len(insights),
        "generated_at": datetime.now(),
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
