import joblib
import pandas as pd

model = joblib.load("model/disease_model.pkl")
columns = pd.read_csv("model/symbipredict_2022.csv", nrows=1).drop(columns=["prognosis"]).columns.tolist()

sample_input = [0] * len(columns)
sample_input[0] = 1
sample_input[1] = 1
sample_input[2] = 1

df_input = pd.DataFrame([sample_input], columns=columns)
prediction = model.predict(df_input)

print("Prediction:", prediction[0])