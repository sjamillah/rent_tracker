from datetime import datetime, timezone
from app.models.billing import calculate_charge


def test_minimum_1_hour_for_short_rentals():
    """A 45-minute rental should still be charged as 1 full hour"""
    start = datetime(2024, 1, 1, 10, 0, 0, tzinfo=timezone.utc)
    end = datetime(2024, 1, 1, 10, 45, 0, tzinfo=timezone.utc)
    result = calculate_charge(start, end, rate_per_hour=10)
    assert result["duration_hours"] == 1
    assert result["total_charge"] == 10


def test_partial_hour_rounds_up():
    """A 1hr 1min rental should be charged as 2 full hours"""
    start = datetime(2024, 1, 1, 10, 0, 0, tzinfo=timezone.utc)
    end = datetime(2024, 1, 1, 11, 1, 0, tzinfo=timezone.utc)
    result = calculate_charge(start, end, rate_per_hour=10)
    assert result["duration_hours"] == 2
    assert result["total_charge"] == 20


def test_exact_hours_calculated_correctly():
    """Exactly 3 hours at $5/hr should be $15"""
    start = datetime(2024, 1, 1, 8, 0, 0, tzinfo=timezone.utc)
    end = datetime(2024, 1, 1, 11, 0, 0, tzinfo=timezone.utc)
    result = calculate_charge(start, end, rate_per_hour=5)
    assert result["duration_hours"] == 3
    assert result["total_charge"] == 15


def test_bike_rate_calculated_correctly():
    """Exactly 5 hours at $5/hr should be $25"""
    start = datetime(2024, 1, 1, 9, 0, 0, tzinfo=timezone.utc)
    end = datetime(2024, 1, 1, 14, 0, 0, tzinfo=timezone.utc)
    result = calculate_charge(start, end, rate_per_hour=5)
    assert result["duration_hours"] == 5
    assert result["total_charge"] == 25


def test_total_charge_is_duration_times_rate():
    """total_charge should always equal duration_hours * rate_per_hour"""
    start = datetime(2024, 1, 1, 6, 0, 0, tzinfo=timezone.utc)
    end = datetime(2024, 1, 1, 10, 0, 0, tzinfo=timezone.utc)
    result = calculate_charge(start, end, rate_per_hour=8)
    assert result["total_charge"] == result["duration_hours"] * 8
