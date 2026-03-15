from flask import Flask
from .auth_routes import auth_routes_bp
from .main_routes import main_routes_bp

def init_routes(app: Flask):
    app.register_blueprint(auth_routes_bp)
    app.register_blueprint(main_routes_bp)