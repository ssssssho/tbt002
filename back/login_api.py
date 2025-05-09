from flask import Blueprint, request, jsonify
from flask_cors import CORS


auth_login = Blueprint('auth', __name__)
# 仮のユーザー情報
USER_DATA = {
    "admin": "password"
}

@auth_login.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if username in USER_DATA and USER_DATA[username] == password:
        return jsonify({"token": "fake-jwt-token", "username": username})
    else:
        return jsonify({"message": "Invalid credentials"}), 401
