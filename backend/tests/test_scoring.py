"""
Unit tests for scoring logic

Tests edge cases: zero population, missing supply data, festival and non-festival months
"""
import pytest
from datetime import datetime
from app.services.demand.scoring import ScoringModel


class TestScoringModel:
    """Test cases for the scoring model"""

    def setup_method(self):
        """Setup test fixtures"""
        self.scoring_model = ScoringModel()

        self.sample_district_data = {
            "population": 1000000,
            "urban_ratio": 0.5,
            "hotels_count": 50,
            "restaurants_count": 100,
            "markets_count": 30,
        }

        self.sample_product_data = {
            "name": "Cabbage",
            "category": "vegetable",
        }

        self.sample_supply_data = {
            "local_production_level": "medium",
            "growing_season_months": [11, 12, 1, 2],
        }

    def test_normal_scoring(self):
        """Test normal scoring with valid data"""
        result = self.scoring_model.calculate_score(
            self.sample_district_data,
            self.sample_product_data,
            self.sample_supply_data,
            horizon_days=7
        )

        assert result["demand_score"] >= 0
        assert result["demand_score"] <= 100
        assert result["demand_level"] in ["High", "Medium", "Low"]
        assert result["confidence_level"] in ["High", "Medium", "Low"]
        assert result["predicted_quantity_kg"] is not None
        assert "factor_breakdown" in result
        assert "error" not in result.get("factor_breakdown", {})

    def test_zero_population(self):
        """Test scoring with zero population"""
        district_data = self.sample_district_data.copy()
        district_data["population"] = 0

        result = self.scoring_model.calculate_score(
            district_data,
            self.sample_product_data,
            self.sample_supply_data,
            horizon_days=7
        )

        assert result["demand_score"] == 0.0
        assert result["demand_level"] == "Low"
        assert result["predicted_quantity_kg"] is None
        assert result["confidence_level"] == "Low"
        assert "error" in result["factor_breakdown"]
        assert "population is zero" in result["factor_breakdown"]["error"]

    def test_missing_supply_data(self):
        """Test scoring with missing supply data"""
        result = self.scoring_model.calculate_score(
            self.sample_district_data,
            self.sample_product_data,
            supply_data=None,
            horizon_days=7
        )

        assert result["demand_score"] == 0.0
        assert result["demand_level"] == "Low"
        assert result["predicted_quantity_kg"] is None
        assert result["confidence_level"] == "Low"
        assert "error" in result["factor_breakdown"]
        assert "supply data missing" in result["factor_breakdown"]["error"]

    def test_low_production_level(self):
        """Test scoring with low production level (should have high demand gap)"""
        supply_data = self.sample_supply_data.copy()
        supply_data["local_production_level"] = "low"

        result = self.scoring_model.calculate_score(
            self.sample_district_data,
            self.sample_product_data,
            supply_data,
            horizon_days=7
        )

        assert result["demand_score"] > 0
        assert result["confidence_level"] == "High"
        assert result["factor_breakdown"]["production_gap"]["value"] == "low"
        assert result["factor_breakdown"]["production_gap"]["score"] == 100

    def test_high_production_level(self):
        """Test scoring with high production level (should have low demand gap)"""
        supply_data = self.sample_supply_data.copy()
        supply_data["local_production_level"] = "high"

        result = self.scoring_model.calculate_score(
            self.sample_district_data,
            self.sample_product_data,
            supply_data,
            horizon_days=7
        )

        assert result["demand_score"] >= 0
        assert result["confidence_level"] == "High"
        assert result["factor_breakdown"]["production_gap"]["value"] == "high"
        assert result["factor_breakdown"]["production_gap"]["score"] == 0

    def test_season_match(self):
        """Test scoring with season match"""
        # Set current month to December (should match growing season [11, 12, 1, 2])
        supply_data = self.sample_supply_data.copy()
        supply_data["growing_season_months"] = [11, 12, 1, 2]

        result = self.scoring_model.calculate_score(
            self.sample_district_data,
            self.sample_product_data,
            supply_data,
            horizon_days=7
        )

        # Season match factor should be 100 if current month is in growing season
        current_month = datetime.now().month
        if current_month in supply_data["growing_season_months"]:
            assert result["factor_breakdown"]["season_match"]["score"] == 100
        else:
            assert result["factor_breakdown"]["season_match"]["score"] == 50

    def test_festival_boost(self):
        """Test scoring with festival boost"""
        # This test depends on current date and festival calendar
        # Festival boost should be > 0 if a festival is within the horizon
        result = self.scoring_model.calculate_score(
            self.sample_district_data,
            self.sample_product_data,
            self.sample_supply_data,
            horizon_days=7
        )

        festival_boost = result["factor_breakdown"]["festival_boost"]["score"]
        assert festival_boost >= 0

    def test_urban_ratio_factor(self):
        """Test urban ratio factor calculation"""
        district_data = self.sample_district_data.copy()
        district_data["urban_ratio"] = 0.8

        result = self.scoring_model.calculate_score(
            district_data,
            self.sample_product_data,
            self.sample_supply_data,
            horizon_days=7
        )

        assert result["factor_breakdown"]["urban_ratio"]["score"] == 80.0

    def test_commercial_buyers_factor(self):
        """Test commercial buyers factor calculation"""
        district_data = self.sample_district_data.copy()
        district_data["hotels_count"] = 100
        district_data["restaurants_count"] = 200
        district_data["markets_count"] = 50

        result = self.scoring_model.calculate_score(
            district_data,
            self.sample_product_data,
            self.sample_supply_data,
            horizon_days=7
        )

        assert result["factor_breakdown"]["commercial_buyers"]["value"] == 350
        assert result["factor_breakdown"]["commercial_buyers"]["score"] >= 0

    def test_confidence_level_high(self):
        """Test confidence level with high/low production"""
        supply_data = self.sample_supply_data.copy()
        supply_data["local_production_level"] = "high"

        result = self.scoring_model.calculate_score(
            self.sample_district_data,
            self.sample_product_data,
            supply_data,
            horizon_days=7
        )

        assert result["confidence_level"] == "High"

    def test_confidence_level_medium(self):
        """Test confidence level with medium production"""
        supply_data = self.sample_supply_data.copy()
        supply_data["local_production_level"] = "medium"

        result = self.scoring_model.calculate_score(
            self.sample_district_data,
            self.sample_product_data,
            supply_data,
            horizon_days=7
        )

        assert result["confidence_level"] == "Medium"

    def test_horizon_multiplier(self):
        """Test predicted quantity with different horizons"""
        result_7_days = self.scoring_model.calculate_score(
            self.sample_district_data,
            self.sample_product_data,
            self.sample_supply_data,
            horizon_days=7
        )

        result_30_days = self.scoring_model.calculate_score(
            self.sample_district_data,
            self.sample_product_data,
            self.sample_supply_data,
            horizon_days=30
        )

        # 30-day prediction should be higher than 7-day
        assert result_30_days["predicted_quantity_kg"] > result_7_days["predicted_quantity_kg"]

    def test_demand_level_thresholds(self):
        """Test demand level classification"""
        # High demand (score >= 70)
        district_data = self.sample_district_data.copy()
        district_data["population"] = 5000000  # Very high population

        result = self.scoring_model.calculate_score(
            district_data,
            self.sample_product_data,
            self.sample_supply_data,
            horizon_days=7
        )

        # With very high population and low production, should be high demand
        if result["demand_score"] >= 70:
            assert result["demand_level"] == "High"
        elif result["demand_score"] >= 40:
            assert result["demand_level"] == "Medium"
        else:
            assert result["demand_level"] == "Low"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
