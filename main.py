from flask import Flask
from routes import init_routes
from database import init_db
from config import Config
import joblib

model = joblib.load("model/disease_model.pkl")
# Initiate databases
init_db()

def create_app():
    app = Flask(__name__)
    app.secret_key = Config.SECRET_KEY
    # Save blueprints
    init_routes(app)
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
