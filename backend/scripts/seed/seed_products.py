"""
Seed script for products table

Seeds initial products: Cabbage, Tomato, Onion
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.product import Product


def seed_products():
    """Seed initial products"""
    db: Session = SessionLocal()

    try:
        # Check if products already exist
        existing_count = db.query(Product).count()
        if existing_count > 0:
            print(f"Products already seeded ({existing_count} found). Skipping.")
            return

        # Define initial products
        products_data = [
            {
                "name": "Cabbage",
                "category": "vegetable",
                "unit": "kg",
            },
            {
                "name": "Tomato",
                "category": "vegetable",
                "unit": "kg",
            },
            {
                "name": "Onion",
                "category": "vegetable",
                "unit": "kg",
            },
        ]

        # Insert products
        for product_data in products_data:
            product = Product(**product_data)
            db.add(product)

        db.commit()
        print(f"Seeded {len(products_data)} products successfully")

        # List seeded products
        products = db.query(Product).all()
        for product in products:
            print(f"  - {product.name} ({product.category})")

    except Exception as e:
        db.rollback()
        print(f"Error seeding products: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_products()
