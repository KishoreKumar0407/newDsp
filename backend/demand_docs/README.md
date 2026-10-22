# Demand Insights - Documentation

## Overview

Demand Insights is an admin-only feature that predicts demand for agricultural products across Tamil Nadu districts. It uses a transparent scoring model based on reference data and calendar features.

**Current Version:** Phase 1 (Scoring Model Only)
**Status:** No ML dependencies yet. ML model will be added in Phase 2 when order history accumulates.

---

## How Prediction Works (Phase 1)

### Scoring Model Formula

The demand score is calculated using a weighted sum of six factors:

```
demand_score =
  (population_factor * 30) +
  (production_gap_factor * 25) +
  (season_match_factor * 15) +
  (festival_boost_factor * 15) +
  (urban_ratio_factor * 10) +
  (commercial_buyers_factor * 5)
```

### Factor Calculations

| Factor | Description | Calculation |
|--------|-------------|-------------|
| **Population** | District population size | `(district.population / max_population) * 100` |
| **Production Gap** | Local production level | Low = 100, Medium = 50, High = 0 |
| **Season Match** | Current month in growing season | In season = 100, Not in season = 50 |
| **Festival Boost** | Upcoming festival impact | Festival impact score (0-35) if within horizon |
| **Urban Ratio** | Urban population percentage | `urban_ratio * 100` |
| **Commercial Buyers** | Hotels, restaurants, markets | `(total / max_total) * 100` |

### Output

- **Demand Score:** 0-100 (weighted sum of factors)
- **Demand Level:** High (≥70), Medium (40-69), Low (<40)
- **Predicted Quantity:** `score/100 * population * per_capita_demand * horizon_multiplier`
- **Confidence Level:** High (production known), Medium (medium production), Low (missing data)

### Example

For Cabbage in Madurai:
- Population: 3,034,325 → Population factor: 60.7
- Production: Low → Production gap: 100
- Season: December (in growing season) → Season match: 100
- Festival: Pongal (7 days away) → Festival boost: 30
- Urban ratio: 0.58 → Urban factor: 58
- Commercial buyers: 620 → Commercial factor: 62

**Score = (60.7*30) + (100*25) + (100*15) + (30*15) + (58*10) + (62*5) = 6801 → Normalized to 100**

---

## Configuration

### Scoring Weights

Edit `backend/app/services/demand/scoring_config.py` to tune weights:

```python
SCORING_WEIGHTS = {
    "population": 30,
    "production_gap": 25,
    "season_match": 15,
    "festival_boost": 15,
    "urban_ratio": 10,
    "commercial_buyers": 5,
}
```

### Festival Calendar

Add or modify festivals in `backend/app/services/demand/scoring_config.py`:

```python
FESTIVALS = [
    {
        "name": "Pongal",
        "month": 1,
        "day": 14,
        "duration_days": 4,
        "impact_score": 30,
        "affected_products": ["vegetable"],
    },
    # Add more festivals...
]
```

### Demand Level Thresholds

Edit thresholds in `backend/app/services/demand/scoring_config.py`:

```python
DEMAND_LEVEL_THRESHOLDS = {
    "high": 70,
    "medium": 40,
    "low": 0,
}
```

---

## How to Edit Reference Data

### Method 1: Admin UI (Recommended)

1. Navigate to Admin Portal → Demand Insights
2. Click on "Manage Reference Data" (to be added in future update)
3. Edit district population, urban ratio, hotels, restaurants, markets
4. Edit district-product supply data (production level, growing seasons)

### Method 2: API Endpoints

**Update District Reference Data:**
```bash
PUT /api/v1/demand/districts/{district_id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "population": 3500000,
  "urban_ratio": 0.55,
  "hotels_count": 120,
  "restaurants_count": 300,
  "markets_count": 65
}
```

**Update District-Product Supply Data:**
```bash
PUT /api/v1/demand/supply/{supply_id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "local_production_level": "high",
  "growing_season_months": [10, 11, 12, 1, 2, 3]
}
```

### Method 3: Direct Database

Connect to PostgreSQL and update tables directly:

```sql
-- Update district reference data
UPDATE tn_districts
SET population = 3500000,
    urban_ratio = 0.55,
    hotels_count = 120,
    restaurants_count = 300,
    markets_count = 65
WHERE code = 'TN19';  -- Salem

-- Update supply data
UPDATE district_product_supply
SET local_production_level = 'high',
    growing_season_months = '{10,11,12,1,2,3}'
WHERE district_id = '...' AND product_id = '...';
```

---

## How to Retrain (Phase 2 - Future)

When ML model is implemented in Phase 2:

### Manual Retrain

```bash
POST /api/v1/demand/retrain
Authorization: Bearer {admin_token}
```

### Scheduled Retrain

Add a cron job to retrain weekly:

```bash
# Crontab entry (every Sunday at 2 AM)
0 2 * * 0 curl -X POST http://localhost:8000/api/v1/demand/retrain \
  -H "Authorization: Bearer {admin_token}"
```

### Retrain Process

1. Fetch order history from last 6 months
2. Aggregate orders by district, product, and week
3. Prepare features (district, product, month, festival, past orders, reference data)
4. Split data chronologically (80% train, 20% test)
5. Train XGBoost/GradientBoosting model
6. Evaluate metrics (MAE, MAPE, R²)
7. Save model with version number
8. Update model weights for auto-blending

---

## Seeding Data

### Run Seed Scripts

```bash
cd backend

# Seed products (Cabbage, Tomato, Onion)
python scripts/seed/seed_products.py

# Seed 38 TN districts with reference data
python scripts/seed/seed_tn_districts.py

# Seed district-product supply data
python scripts/seed/seed_district_product_supply.py
```

### Database Migration

After updating `schema.sql`, run:

```bash
psql -U postgres -d agrimap_dsp -f schema.sql
```

---

## API Endpoints

### Demand Insights

- `GET /api/v1/demand/insights?product_id={id}&horizon_days={7|30}` - Get demand insights
- `POST /api/v1/demand/insights/cache` - Cache insights for faster retrieval

### Product Management

- `POST /api/v1/demand/products` - Create product
- `GET /api/v1/demand/products` - List products

### District Management

- `POST /api/v1/demand/districts` - Create district
- `GET /api/v1/demand/districts` - List districts
- `PUT /api/v1/demand/districts/{id}` - Update district

### Supply Data Management

- `POST /api/v1/demand/supply` - Create/update supply data
- `GET /api/v1/demand/supply` - List supply data
- `PUT /api/v1/demand/supply/{id}` - Update supply data

**All endpoints require admin role. Non-admins receive 403 Forbidden.**

---

## Unit Tests

Run unit tests for scoring logic:

```bash
cd backend
pytest tests/test_scoring.py -v
```

Test coverage includes:
- Normal scoring with valid data
- Zero population edge case
- Missing supply data edge case
- Low/high production levels
- Season match detection
- Festival boost calculation
- Urban ratio factor
- Commercial buyers factor
- Confidence level rules
- Horizon multiplier
- Demand level thresholds

---

## Future Enhancements (Phase 2)

### ML Model Integration

- **Algorithm:** XGBoost or GradientBoostingRegressor
- **Features:** District, product, month, week, festival, past order aggregates, reference features
- **Target:** Next 7/30-day order quantity
- **Train/Test Split:** Time-based (not random)
- **Metrics:** MAE, MAPE, R²

### Auto-Blending Rule

```
if order_count < 50:
    weight_scoring = 0.9, weight_ml = 0.1
elif order_count < 200:
    weight_scoring = 0.5, weight_ml = 0.5
else:
    weight_scoring = 0.2, weight_ml = 0.8
```

### Order Aggregation Function

The `aggregate_orders_by_district_product_week()` function is already written in `demand_service.py` for Phase 2 readiness. It will be activated when order tables are created.

---

## Troubleshooting

### Insufficient Data Error

If you see "Insufficient data" for a district:
- Check that the district exists in `tn_districts` table
- Check that supply data exists in `district_product_supply` table
- Verify population is not zero
- Verify local_production_level is not NULL

### Zero Scores

If all scores are zero:
- Check production levels (may all be "high")
- Check festival calendar (no upcoming festivals)
- Check urban ratios (may be very low)
- Tune weights in `scoring_config.py`

### API 403 Forbidden

If you receive 403 errors:
- Verify user role is "admin"
- Check JWT token is valid
- Ensure `require_admin` dependency is working

---

## Security Notes

- All demand endpoints are admin-only
- Backend enforces role check (`user.role == 'admin'`)
- Frontend hides menu item for non-admins
- Never expose demand predictions to consumers or dealers
- Do not commit `.env` files or downloaded data to Git

---

## License & Attribution

This feature uses:
- Reference data for Tamil Nadu districts (approximate, admin-editable)
- Festival calendar for Tamil Nadu
- No external APIs or government portals
- No LLM guessing for numeric predictions

All data is sourced from admin-edited reference tables.
