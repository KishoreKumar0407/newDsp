"""
Seed script for district_product_supply table

Seeds initial supply data for all 38 districts and 3 products (Cabbage, Tomato, Onion)
Growing seasons and production levels are approximate and editable by admin.
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.district_product_supply import DistrictProductSupply
from app.models.product import Product
from app.models.tn_district import TNDistrict


def seed_district_product_supply():
    """Seed district-product supply data"""
    db: Session = SessionLocal()

    try:
        # Check if supply data already exists
        existing_count = db.query(DistrictProductSupply).count()
        if existing_count > 0:
            print(f"Supply data already seeded ({existing_count} records found). Skipping.")
            return

        # Get all products and districts
        products = db.query(Product).all()
        districts = db.query(TNDistrict).all()

        if not products:
            print("No products found. Please run seed_products.py first.")
            return

        if not districts:
            print("No districts found. Please run seed_tn_districts.py first.")
            return

        # Create product map
        product_map = {p.name: p.id for p in products}
        district_map = {d.code: d.id for d in districts}

        # Define supply data for each district-product pair
        # These are approximate values and should be edited by admin
        supply_data = []

        # Helper to add supply data
        def add_supply(district_code, product_name, production_level, growing_months):
            if district_code in district_map and product_name in product_map:
                supply_data.append({
                    "district_id": district_map[district_code],
                    "product_id": product_map[product_name],
                    "local_production_level": production_level,
                    "growing_season_months": growing_months,
                })

        # Cabbage supply data (grown mostly in cooler months: Nov-Feb)
        cabbage_districts = {
            "TN02": "high",  # Chennai
            "TN03": "high",  # Coimbatore
            "TN07": "high",  # Erode
            "TN19": "high",  # Salem
            "TN25": "high",  # Tirunelveli
            "TN12": "medium",  # Madurai
            "TN21": "medium",  # Thanjavur
            "TN24": "medium",  # Tiruchirappalli
        }
        for district_code in district_map:
            level = cabbage_districts.get(district_code, "low")
            add_supply(district_code, "Cabbage", level, [11, 12, 1, 2])

        # Tomato supply data (grown year-round, peak in winter)
        tomato_districts = {
            "TN02": "high",  # Chennai
            "TN03": "high",  # Coimbatore
            "TN07": "high",  # Erode
            "TN19": "high",  # Salem
            "TN26": "high",  # Tiruppur
            "TN12": "medium",  # Madurai
            "TN21": "medium",  # Thanjavur
            "TN30": "medium",  # Vellore
        }
        for district_code in district_map:
            level = tomato_districts.get(district_code, "low")
            add_supply(district_code, "Tomato", level, [1, 2, 3, 10, 11, 12])

        # Onion supply data (grown in Rabi season: Oct-Mar)
        onion_districts = {
            "TN02": "high",  # Chennai
            "TN03": "high",  # Coimbatore
            "TN07": "high",  # Erode
            "TN19": "high",  # Salem
            "TN21": "high",  # Thanjavur
            "TN12": "medium",  # Madurai
            "TN24": "medium",  # Tiruchirappalli
        }
        for district_code in district_map:
            level = onion_districts.get(district_code, "low")
            add_supply(district_code, "Onion", level, [10, 11, 12, 1, 2, 3])

        # Insert supply data
        for data in supply_data:
            supply = DistrictProductSupply(**data)
            db.add(supply)

        db.commit()
        print(f"Seeded {len(supply_data)} district-product supply records successfully")

        # List seeded supply data
        supplies = db.query(DistrictProductSupply).all()
        for supply in supplies:
            district = db.query(TNDistrict).filter(TNDistrict.id == supply.district_id).first()
            product = db.query(Product).filter(Product.id == supply.product_id).first()
            if district and product:
                print(f"  - {district.name} - {product.name}: {supply.local_production_level}")

    except Exception as e:
        db.rollback()
        print(f"Error seeding district-product supply: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_district_product_supply()
