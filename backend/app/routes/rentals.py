from flask import Blueprint, jsonify, request
from datetime import datetime, timezone
from app.db_helper import read_db, write_db
from app.models.billing import calculate_charge

rentals_bp = Blueprint("rentals", __name__)


@rentals_bp.route("/start", methods=["POST"])
def start_rental():
    """
    POST /api/rentals/start
    Body: { "vehicle_id": "v1" }
    Starts a new rental session for the given vehicle
    """
    data = request.get_json()
    vehicle_id = data.get("vehicle_id")

    db = read_db()

    # Find the vehicle
    vehicle = next((v for v in db["vehicles"] if v["id"] == vehicle_id), None)
    if not vehicle:
        return jsonify({"error": "Vehicle not found"}), 404
    if vehicle["status"] != "available":
        return jsonify({"error": "Vehicle is not available"}), 400

    # Create the rental record
    rental = {
        "id": "r" + str(int(datetime.now(timezone.utc).timestamp() * 1000)),
        "vehicle_id": vehicle_id,
        "start_time": datetime.now(timezone.utc).isoformat(),
        "end_time": None,
        "status": "active",
    }

    vehicle["status"] = "rented"
    db["rentals"].append(rental)
    write_db(db)

    return jsonify(rental), 201


@rentals_bp.route("/return/<rental_id>", methods=["POST"])
def return_rental(rental_id):
    """
    POST /api/rentals/return/<rental_id>
    Ends the rental, calculates the charge, and frees the vehicle
    """
    db = read_db()

    # Find the rental
    rental = next((r for r in db["rentals"] if r["id"] == rental_id), None)
    if not rental:
        return jsonify({"error": "Rental not found"}), 404
    if rental["status"] != "active":
        return jsonify({"error": "Rental is already closed"}), 400

    # Find the vehicle
    vehicle = next((v for v in db["vehicles"] if v["id"] == rental["vehicle_id"]), None)

    # Calculate the charge
    end_time = datetime.now(timezone.utc)
    start_time = datetime.fromisoformat(rental["start_time"])
    charges = calculate_charge(start_time, end_time, vehicle["rate_per_hour"])

    # Update records
    rental["end_time"] = end_time.isoformat()
    rental["status"] = "completed"
    rental["duration_hours"] = charges["duration_hours"]
    rental["total_charge"] = charges["total_charge"]
    vehicle["status"] = "available"

    write_db(db)

    return (
        jsonify(
            {
                "rental": rental,
                "vehicle": vehicle,
                "summary": {
                    "duration_hours": charges["duration_hours"],
                    "total_charges": charges["total_charge"],
                    "rate_per_hour": vehicle["rate_per_hour"],
                },
            }
        ),
        200,
    )
