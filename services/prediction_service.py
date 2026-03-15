import joblib
import pandas as pd
import os
from flask import session
from utils.file_ops import append_prediction

model_path = os.path.join("model", "disease_model.pkl")
model = joblib.load(model_path)

columns_path = os.path.join("model", "symbipredict_2022.csv")
columns = pd.read_csv(columns_path, nrows=1).drop(columns=["prognosis"]).columns.tolist()


def predict_disease_from_symptoms(symptom_list, username=None, top_n=3):
    clean_list = [s.strip().lower() for s in symptom_list]
    input_vector = [1 if col in clean_list else 0 for col in columns]

    if sum(input_vector) == 0:
        return [("No symptoms found", 1.0)]

    df_input = pd.DataFrame([input_vector], columns=columns)
    
    proba = model.predict_proba(df_input)[0]
    classes = model.classes_

    top_predictions = sorted(zip(classes, proba), key=lambda x: x[1], reverse=True)[:top_n]

    if username:
        append_prediction(username, clean_list, top_predictions[0][0])

    return top_predictions
