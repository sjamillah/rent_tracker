from flask import Blueprint, jsonify, request
from app.db_helper import read_db

vehicles_bp = Blueprint('vehicles', __name__)


@vehicles_bp.route('/', methods=['GET'])
def get_vehicles():
    """
    GET /api/vehicles
    Returns a list of all vehicles
    Optional query parameter: ?type=car or ?type=bike
    """
    db = read_db()
    vehicles = db['vehicles']

    # Filter by type if provided in the URL
    vehicle_type = request.args.get('type')
    if vehicle_type:
        vehicles = [v for v in vehicles if v['type'] == vehicle_type]

    return jsonify(vehicles), 200
