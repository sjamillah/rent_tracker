from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)

    # Allowing the frontend to call the API
    CORS(app)

    # Registration of the route blueprints
    from app.routes.vehicles import vehicles_bp

    app.register_blueprint(vehicles_bp, url_prefix="/api/vehicles")

    return app
