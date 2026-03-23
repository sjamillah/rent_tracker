from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)

    # Allowing the frontend to call the API
    CORS(app)

    @app.route("/")
    def index():
        return {
            "message": "RentTrack API",
            "endpoints": ["/api/vehicles", "/api/rentals"],
        }, 200

    # Registration of the route blueprints
    from app.routes.vehicles import vehicles_bp
    from app.routes.rentals import rentals_bp

    app.register_blueprint(vehicles_bp, url_prefix="/api/vehicles")
    app.register_blueprint(rentals_bp, url_prefix="/api/rentals")

    return app
