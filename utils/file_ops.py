# utils/file_ops.py (MongoDB versiyonu)
from datetime import datetime
import database

def load_users():
    return list(database.coll_users.find({}, {"_id": 0}))

def save_users(users):
    database.coll_users.delete_many({})
    if users:
        database.coll_users.insert_many(users)

def load_history():
    return list(database.coll_prediction_history.find({}, {"_id": 0}))

def append_prediction(username, symptoms, prediction):
    existing = database.coll_prediction_history.find_one({"username": username})

    new_entry = {
        "symptoms": symptoms,
        "prediction": prediction,
        "timestamp": datetime.now().isoformat()
    }

    if existing:
        database.coll_prediction_history.update_one(
            {"username": username},
            {"$push": {"predictions": new_entry}}
        )
    else:
        database.coll_prediction_history.insert_one({
            "username": username,
            "predictions": [new_entry]
        })

def get_user_predictions(username):
    user_doc = database.coll_prediction_history.find_one({"username": username}, {"_id": 0})
    return user_doc.get("predictions", []) if user_doc else []

def delete_prediction(username, timestamp):
    database.coll_prediction_history.update_one(
        {"username": username},
        {"$pull": {"predictions": {"timestamp": timestamp}}}
    )

def clear_user_predictions(username):
    database.coll_prediction_history.update_one(
        {"username": username},
        {"$set": {"predictions": []}}
    )

def delete_multiple_predictions(username, timestamps):
    database.coll_prediction_history.update_one(
        {"username": username},
        {"$pull": {"predictions": {"timestamp": {"$in": timestamps}}}}
    )

