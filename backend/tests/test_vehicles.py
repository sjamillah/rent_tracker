import pytest
import json
from app import create_app
 
 
@pytest.fixture
def client():
    """
    This is a pytest fixture. It creates a temporary Flask test client
    that is shared across all tests in this file.
    """
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client
 
 
def test_get_vehicles_returns_list(client):
    """GET /api/vehicles should return a 200 status and a list."""
    response = client.get('/api/vehicles/')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)
 
 
def test_get_vehicles_returns_correct_fields(client):
    """Each vehicle should have the required fields."""
    response = client.get('/api/vehicles/')
    data = json.loads(response.data)
    assert len(data) > 0
    vehicle = data[0]
    assert 'id'           in vehicle
    assert 'name'         in vehicle
    assert 'type'         in vehicle
    assert 'rate_per_hour' in vehicle
    assert 'status'       in vehicle
 
 
def test_filter_by_type_car(client):
    """Filtering by type=car should only return cars."""
    response = client.get('/api/vehicles/?type=car')
    data = json.loads(response.data)
    for vehicle in data:
        assert vehicle['type'] == 'car'
