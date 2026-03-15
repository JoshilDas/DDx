# main_routes.py
from flask import Blueprint, render_template, request, redirect, session, url_for, jsonify
from services.prediction_service import predict_disease_from_symptoms
from utils.file_ops import (get_user_predictions, delete_prediction, clear_user_predictions)
import database  # <-- database modülünü import edelim

main_routes_bp = Blueprint("main_routes_bp", __name__)

# Yeni eklenecek: /api/symptoms endpoint'i. GET ile MongoDB'deki "Symptom" koleksiyonunu sorgular.
@main_routes_bp.route("/api/symptoms", methods=["GET"])
def get_symptoms():
    """
    MongoDB'de her doküman şu formatta kayıtlı:
      { "_id": ObjectId(...), "symptom": "itching" }
    Biz frontend'in beklediği şuna dönüştürüyoruz:
      { "label": "Itching", "value": "itching" }
    """
    cursor = database.coll_symptoms.find({}, {"_id": 0, "symptom": 1})
    result = []
    for doc in cursor:
        raw = doc.get("symptom", "").strip()
        label = raw.replace('_', ' ').title()   # Örnek: "skin_rash" -> "Skin Rash"
        value = raw                              # Örnek: "skin_rash"
        result.append({"label": label, "value": value})
    return jsonify(result)


# Ana sayfa (semptom girişi)
@main_routes_bp.route("/", methods=["GET", "POST"])
def home():
    if "username" not in session:
        return redirect(url_for("auth_routes_bp.login"))

    if request.method == "POST":
        # JS tarafında hidden <input name="symptoms"> olarak gönderilen listeyi alıyoruz
        selected_symptoms = request.form.getlist("symptoms")
        predictions = predict_disease_from_symptoms(selected_symptoms, session["username"])
        return render_template("result.html", predictions=predictions, symptoms=selected_symptoms)

    return render_template("home.html")


# Tahmin geçmişi görüntüleme
@main_routes_bp.route("/history")
def history():
    if "username" not in session:
        return redirect(url_for("auth_routes_bp.login"))

    predictions = get_user_predictions(session["username"])
    return render_template("history.html", predictions=predictions)


# Belirli bir tahmini silme
@main_routes_bp.route("/delete_prediction", methods=["POST"])
def delete_prediction_route():
    if "username" not in session:
        return redirect(url_for("auth_routes_bp.login"))

    timestamp = request.form.get("timestamp")
    delete_prediction(session["username"], timestamp)
    return redirect(url_for("main_routes_bp.history"))


# Tüm geçmişi temizleme
@main_routes_bp.route("/clear_history", methods=["POST"])
def clear_history():
    if "username" not in session:
        return redirect(url_for("auth_routes_bp.login"))

    clear_user_predictions(session["username"])
    return redirect(url_for("main_routes_bp.history"))
