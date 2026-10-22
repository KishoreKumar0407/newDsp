"""
Seed script for TN districts table

Seeds all 38 Tamil Nadu districts with reference data (population, urban_ratio, etc.)
Reference data is approximate and editable by admin.
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.tn_district import TNDistrict


def seed_tn_districts():
    """Seed all 38 Tamil Nadu districts"""
    db: Session = SessionLocal()

    try:
        # Check if districts already exist
        existing_count = db.query(TNDistrict).count()
        if existing_count > 0:
            print(f"Districts already seeded ({existing_count} found). Skipping.")
            return

        # Define 38 Tamil Nadu districts with approximate reference data
        # Note: Population and urban_ratio are approximate and should be verified/edited by admin
        districts_data = [
            # Pre-2011 Census districts
            {"name": "Ariyalur", "code": "TN01", "population": 754894, "urban_ratio": 0.18, "hotels_count": 15, "restaurants_count": 30, "markets_count": 10},
            {"name": "Chennai", "code": "TN02", "population": 4646732, "urban_ratio": 0.90, "hotels_count": 500, "restaurants_count": 2000, "markets_count": 150},
            {"name": "Coimbatore", "code": "TN03", "population": 3472378, "urban_ratio": 0.70, "hotels_count": 300, "restaurants_count": 800, "markets_count": 80},
            {"name": "Cuddalore", "code": "TN04", "population": 2605914, "urban_ratio": 0.30, "hotels_count": 40, "restaurants_count": 120, "markets_count": 40},
            {"name": "Dharmapuri", "code": "TN05", "population": 1502878, "urban_ratio": 0.22, "hotels_count": 25, "restaurants_count": 60, "markets_count": 25},
            {"name": "Dindigul", "code": "TN06", "population": 2159778, "urban_ratio": 0.35, "hotels_count": 45, "restaurants_count": 100, "markets_count": 35},
            {"name": "Erode", "code": "TN07", "population": 2251704, "urban_ratio": 0.55, "hotels_count": 80, "restaurants_count": 200, "markets_count": 50},
            {"name": "Kanchipuram", "code": "TN08", "population": 3998072, "urban_ratio": 0.45, "hotels_count": 120, "restaurants_count": 300, "markets_count": 60},
            {"name": "Kanyakumari", "code": "TN09", "population": 1870374, "urban_ratio": 0.40, "hotels_count": 60, "restaurants_count": 150, "markets_count": 40},
            {"name": "Karur", "code": "TN10", "population": 1064493, "urban_ratio": 0.38, "hotels_count": 30, "restaurants_count": 70, "markets_count": 20},
            {"name": "Krishnagiri", "code": "TN11", "population": 1879809, "urban_ratio": 0.28, "hotels_count": 35, "restaurants_count": 90, "markets_count": 30},
            {"name": "Madurai", "code": "TN12", "population": 3034325, "urban_ratio": 0.58, "hotels_count": 150, "restaurants_count": 400, "markets_count": 70},
            {"name": "Nagapattinam", "code": "TN13", "population": 1615561, "urban_ratio": 0.25, "hotels_count": 30, "restaurants_count": 80, "markets_count": 35},
            {"name": "Namakkal", "code": "TN14", "population": 1720678, "urban_ratio": 0.32, "hotels_count": 40, "restaurants_count": 100, "markets_count": 30},
            {"name": "Nilgiris", "code": "TN15", "population": 735071, "urban_ratio": 0.45, "hotels_count": 80, "restaurants_count": 150, "markets_count": 25},
            {"name": "Perambalur", "code": "TN16", "population": 564511, "urban_ratio": 0.20, "hotels_count": 15, "restaurants_count": 35, "markets_count": 15},
            {"name": "Pudukkottai", "code": "TN17", "population": 1918613, "urban_ratio": 0.28, "hotels_count": 35, "restaurants_count": 80, "markets_count": 30},
            {"name": "Ramanathapuram", "code": "TN18", "population": 1333744, "urban_ratio": 0.22, "hotels_count": 25, "restaurants_count": 60, "markets_count": 25},
            {"name": "Salem", "code": "TN19", "population": 3482005, "urban_ratio": 0.52, "hotels_count": 100, "restaurants_count": 250, "markets_count": 60},
            {"name": "Sivaganga", "code": "TN20", "population": 1339596, "urban_ratio": 0.24, "hotels_count": 25, "restaurants_count": 65, "markets_count": 25},
            {"name": "Thanjavur", "code": "TN21", "population": 2402851, "urban_ratio": 0.32, "hotels_count": 50, "restaurants_count": 120, "markets_count": 45},
            {"name": "Theni", "code": "TN22", "population": 1243858, "urban_ratio": 0.35, "hotels_count": 35, "restaurants_count": 80, "markets_count": 25},
            {"name": "Thoothukudi", "code": "TN23", "population": 1750176, "urban_ratio": 0.48, "hotels_count": 55, "restaurants_count": 130, "markets_count": 40},
            {"name": "Tiruchirappalli", "code": "TN24", "population": 2722290, "urban_ratio": 0.55, "hotels_count": 120, "restaurants_count": 300, "markets_count": 65},
            {"name": "Tirunelveli", "code": "TN25", "population": 3072818, "urban_ratio": 0.42, "hotels_count": 70, "restaurants_count": 180, "markets_count": 50},
            {"name": "Tiruppur", "code": "TN26", "population": 2479772, "urban_ratio": 0.65, "hotels_count": 90, "restaurants_count": 220, "markets_count": 55},
            {"name": "Tiruvallur", "code": "TN27", "population": 3728611, "urban_ratio": 0.48, "hotels_count": 100, "restaurants_count": 250, "markets_count": 55},
            {"name": "Tiruvannamalai", "code": "TN28", "population": 2464775, "urban_ratio": 0.26, "hotels_count": 40, "restaurants_count": 100, "markets_count": 35},
            {"name": "Tiruvarur", "code": "TN29", "population": 1264277, "urban_ratio": 0.20, "hotels_count": 20, "restaurants_count": 50, "markets_count": 20},
            {"name": "Vellore", "code": "TN30", "population": 3936331, "urban_ratio": 0.52, "hotels_count": 110, "restaurants_count": 280, "markets_count": 60},
            {"name": "Villupuram", "code": "TN31", "population": 3458731, "urban_ratio": 0.25, "hotels_count": 45, "restaurants_count": 110, "markets_count": 40},
            {"name": "Virudhunagar", "code": "TN32", "population": 1943169, "urban_ratio": 0.42, "hotels_count": 50, "restaurants_count": 120, "markets_count": 35},
            # Post-2011 districts (formed after 2011 census)
            {"name": "Chengalpattu", "code": "TN33", "population": 2293832, "urban_ratio": 0.50, "hotels_count": 80, "restaurants_count": 200, "markets_count": 45},
            {"name": "Kallakurichi", "code": "TN34", "population": 1368584, "urban_ratio": 0.22, "hotels_count": 25, "restaurants_count": 60, "markets_count": 25},
            {"name": "Mayiladuthurai", "code": "TN35", "population": 918356, "urban_ratio": 0.20, "hotels_count": 18, "restaurants_count": 45, "markets_count": 18},
            {"name": "Ranipet", "code": "TN36", "population": 1196808, "urban_ratio": 0.38, "hotels_count": 30, "restaurants_count": 75, "markets_count": 22},
            {"name": "Tenkasi", "code": "TN37", "population": 787338, "urban_ratio": 0.30, "hotels_count": 22, "restaurants_count": 55, "markets_count": 20},
            {"name": "Tirupathur", "code": "TN38", "population": 870265, "urban_ratio": 0.28, "hotels_count": 20, "restaurants_count": 50, "markets_count": 18},
        ]

        # Insert districts
        for district_data in districts_data:
            district = TNDistrict(**district_data)
            db.add(district)

        db.commit()
        print(f"Seeded {len(districts_data)} TN districts successfully")

        # List seeded districts
        districts = db.query(TNDistrict).order_by(TNDistrict.code).all()
        for district in districts:
            print(f"  - {district.code}: {district.name} (Pop: {district.population}, Urban: {district.urban_ratio})")

    except Exception as e:
        db.rollback()
        print(f"Error seeding TN districts: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_tn_districts()
