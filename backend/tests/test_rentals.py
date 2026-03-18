import pytest
import json
import copy
from unittest.mock import patch
from app import create_app
from app import db_helper

# A clean database snapshot to use in tests
CLEAN_DB = {
    "vehicles": [
        {
            "id": "v1",
            "name": "Test Car",
            "type": "car",
            "rate_per_hour": 10,
            "status": "available",
        },
        {
            "id": "v2",
            "name": "Test Bike",
            "type": "bike",
            "rate_per_hour": 5,
            "status": "available",
        },
    ],
    "rentals": [],
}


@pytest.fixture
def client(tmp_path):
    """
    Creates a test client with a temporary database.
    tmp_path is a built-in pytest fixture that creates a temporary folder.
    We copy a clean db there so tests don't modify your real db.json.
    """
    db_file = tmp_path / "db.json"
    db_file.write_text(json.dumps(copy.deepcopy(CLEAN_DB)))

    app = create_app()
    app.config["TESTING"] = True

    with patch.object(db_helper, "DB_PATH", str(db_file)):
        with app.test_client() as c:
            yield c


def test_start_rental_success(client):
    """Starting a rental on an available vehicle returns 201."""
    response = client.post("/api/rentals/start", json={"vehicle_id": "v1"})
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data["vehicle_id"] == "v1"
    assert data["status"] == "active"
    assert data["start_time"] is not None


def test_start_rental_unavailable_vehicle(client):
    """Trying to rent an already-rented vehicle should return 400."""
    client.post("/api/rentals/start", json={"vehicle_id": "v1"})
    # Try to rent the same vehicle again
    response = client.post("/api/rentals/start", json={"vehicle_id": "v1"})
    assert response.status_code == 400


def test_start_rental_vehicle_not_found(client):
    """Renting a non-existent vehicle should return 404."""
    response = client.post("/api/rentals/start", json={"vehicle_id": "v999"})
    assert response.status_code == 404


def test_return_rental_success(client):
    """Returning an active rental should complete it and free the vehicle."""
    start_response = client.post("/api/rentals/start", json={"vehicle_id": "v1"})
    rental_id = json.loads(start_response.data)["id"]

    response = client.post(f"/api/rentals/return/{rental_id}")
    assert response.status_code == 200

    data = json.loads(response.data)
    assert data["rental"]["id"] == rental_id
    assert data["rental"]["status"] == "completed"
    assert data["rental"]["end_time"] is not None
    assert data["rental"]["duration_hours"] >= 1
    assert data["rental"]["total_charge"] >= 0
    assert data["vehicle"]["status"] == "available"
    assert data["summary"]["duration_hours"] == data["rental"]["duration_hours"]
    assert data["summary"]["rate_per_hour"] == data["vehicle"]["rate_per_hour"]


def test_return_rental_not_found(client):
    """Returning a non-existent rental should return 404."""
    response = client.post("/api/rentals/return/r999")
    assert response.status_code == 404


def test_return_rental_already_closed(client):
    """Returning an already closed rental should return 400."""
    start_response = client.post("/api/rentals/start", json={"vehicle_id": "v1"})
    rental_id = json.loads(start_response.data)["id"]

    first_return = client.post(f"/api/rentals/return/{rental_id}")
    assert first_return.status_code == 200

    second_return = client.post(f"/api/rentals/return/{rental_id}")
    assert second_return.status_code == 400
