from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from database import get_connection
import bcrypt

# ==========================================
# Blueprint
# ==========================================

admin_login_bp = Blueprint(
    "admin_login",
    __name__,
    url_prefix="/admin"
)

# ==========================================
# Admin Login
# POST: /admin/login
# ==========================================

@admin_login_bp.route("/login", methods=["POST"])
def login():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "No data received."
            }), 400

        username = data.get("username", "").strip()
        password = data.get("password", "")

        if username == "" or password == "":
            return jsonify({
                "success": False,
                "message": "Username and Password are required."
            }), 400

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT *
            FROM admin
            WHERE username=%s
            LIMIT 1
        """, (username,))

        admin = cursor.fetchone()

        cursor.close()
        conn.close()

        if admin is None:

            return jsonify({
                "success": False,
                "message": "Invalid Username"
            }), 401

        if admin["status"] != "Active":

            return jsonify({
                "success": False,
                "message": "Account Disabled"
            }), 401

        password_hash = admin["passwordHash"]

        if not bcrypt.checkpw(
            password.encode("utf-8"),
            password_hash.encode("utf-8")
        ):

            return jsonify({
                "success": False,
                "message": "Invalid Password"
            }), 401

        token = create_access_token(

            identity=str(admin["adminID"]),

            additional_claims={

                "role": "admin",

                "username": admin["username"],

                "fullName": admin["fullName"]

            }

        )

        return jsonify({

            "success": True,

            "message": "Login Successful",

            "token": token,

            "role": "admin",

            "adminID": admin["adminID"],

            "username": admin["username"],

            "fullName": admin["fullName"]

        }), 200

    except Exception as e:

        print("Admin Login Error:", e)

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500


# ==========================================
# Verify Token
# GET: /admin/verify-token
# ==========================================

@admin_login_bp.route("/verify-token", methods=["GET"])
@jwt_required()
def verify_token():

    claims = get_jwt()

    return jsonify({

        "success": True,

        "adminID": get_jwt_identity(),

        "role": claims["role"],

        "username": claims["username"],

        "fullName": claims["fullName"]

    })


# ==========================================
# Admin Profile
# GET: /admin/profile
# ==========================================

@admin_login_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():

    claims = get_jwt()

    return jsonify({

        "success": True,

        "adminID": get_jwt_identity(),

        "username": claims["username"],

        "fullName": claims["fullName"],

        "role": claims["role"]

    })


# ==========================================
# Logout
# POST: /admin/logout
# ==========================================

@admin_login_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():

    return jsonify({

        "success": True,

        "message": "Logout Successful"

    })


# ==========================================
# Check Authentication
# GET: /admin/auth
# ==========================================

@admin_login_bp.route("/auth", methods=["GET"])
@jwt_required()
def auth():

    claims = get_jwt()

    return jsonify({

        "success": True,

        "adminID": get_jwt_identity(),

        "role": claims["role"]

    })