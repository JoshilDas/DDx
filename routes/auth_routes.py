from flask import Blueprint, request, render_template, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
from utils.file_ops import load_users, save_users

auth_routes_bp = Blueprint("auth_routes_bp", __name__)

@auth_routes_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        users = load_users()

        user = next((u for u in users if u["username"] == username), None)
        if user and check_password_hash(user["password"], password):
            session["username"] = user["username"]
            return redirect(url_for("main_routes_bp.home"))
        else:
            flash("Username or password is wrong.")
            return redirect(url_for("auth_routes_bp.login"))
    
    return render_template("login.html")

@auth_routes_bp.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]
        confirm = request.form["confirm"]

        if password != confirm:
            flash("Passwords do not match.")
            return redirect(url_for("auth_routes_bp.register"))

        users = load_users()
        if any(u["username"] == username or u["email"] == email for u in users):
            flash("This username or e-mail is already in use.")
            return redirect(url_for(".register"))

        hashed = generate_password_hash(password)
        users.append({"username": username, "email": email, "password": hashed})
        save_users(users)

        flash("Registration is successful! You can now sign in.")
        return redirect(url_for("auth_routes_bp.login"))
    
    return render_template("register.html")

@auth_routes_bp.route("/logout")
def logout():
    session.pop("username", None)
    return redirect(url_for("auth_routes_bp.login"))
