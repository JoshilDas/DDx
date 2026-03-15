import pymongo
from config import Config

MONGODB= None
medicheck_db = None
coll_symptoms = None
coll_diseases = None
coll_users = None
coll_prediction_history = None

def init_db():
    global MONGODB, medicheck_db, coll_symptoms, coll_diseases, coll_users, coll_prediction_history

    MONGODB = pymongo.MongoClient(Config.MONGODB_URI)

    medicheck_db = MONGODB[Config.MEDICHECK_DB_NAME]

    coll_symptoms = medicheck_db["Symptom"]
    coll_diseases = medicheck_db["Disease"]
    coll_users = medicheck_db["User"]
    coll_prediction_history = medicheck_db["PredictionHistory"]