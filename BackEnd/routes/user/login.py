from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from database import get_connection
import bcrypt

# ==========================================
# Blueprint
# ==========================================

user_bp = Blueprint(
    "user",
    __name__,
    url_prefix="/user"
)


# ==========================================
# User Login
# POST : /user/login
# ==========================================

@user_bp.route("/login", methods=["POST"])
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

        # =====================================
        # MASTER LOGIN
        # =====================================

        if username.startswith("mst_"):

            cursor.execute("""
                SELECT *
                FROM systems
                WHERE masterUsername=%s
                LIMIT 1
            """, (username,))

            system = cursor.fetchone()

            if system is None:

                cursor.close()
                conn.close()

                return jsonify({
                    "success": False,
                    "message": "Master Username not found."
                }), 401

            if system["status"] != "Active":

                cursor.close()
                conn.close()

                return jsonify({
                    "success": False,
                    "message": "System is Inactive."
                }), 401

            if not bcrypt.checkpw(
                password.encode("utf-8"),
                system["masterPasswordHash"].encode("utf-8")
            ):

                cursor.close()
                conn.close()

                return jsonify({
                    "success": False,
                    "message": "Invalid Password."
                }), 401

            token = create_access_token(

                identity=str(system["sysID"]),

                additional_claims={

                    "role": "master",

                    "systemID": system["sysID"],

                    "systemName": system["systemName"],

                    "username": system["masterUsername"]

                }

            )

            cursor.close()
            conn.close()

            return jsonify({

                "success": True,

                "message": "Master Login Successful",

                "token": token,

                "role": "master",

                "systemID": system["sysID"],

                "systemName": system["systemName"],

                "username": system["masterUsername"]

            }), 200

        # =====================================
        # PUBLIC LOGIN
        # =====================================

        elif username.startswith("pub_"):

            cursor.execute("""
                SELECT *
                FROM systems
                WHERE publicUsername=%s
                LIMIT 1
            """, (username,))

            system = cursor.fetchone()

            if system is None:

                cursor.close()
                conn.close()

                return jsonify({
                    "success": False,
                    "message": "Public Username not found."
                }), 401

            if system["status"] != "Active":

                cursor.close()
                conn.close()

                return jsonify({
                    "success": False,
                    "message": "System is Inactive."
                }), 401

            if not bcrypt.checkpw(
                password.encode("utf-8"),
                system["publicPasswordHash"].encode("utf-8")
            ):

                cursor.close()
                conn.close()

                return jsonify({
                    "success": False,
                    "message": "Invalid Password."
                }), 401

            token = create_access_token(

                identity=str(system["sysID"]),

                additional_claims={

                    "role": "public",

                    "systemID": system["sysID"],

                    "systemName": system["systemName"],

                    "username": system["publicUsername"]

                }

            )

            cursor.close()
            conn.close()

            return jsonify({

                "success": True,

                "message": "Public Login Successful",

                "token": token,

                "role": "public",

                "systemID": system["sysID"],

                "systemName": system["systemName"],

                "username": system["publicUsername"]

            }), 200

        else:

            cursor.close()
            conn.close()

            return jsonify({

                "success": False,

                "message": "Username must start with mst_ or pub_"

            }), 400

    except Exception as e:

        print("User Login Error:", e)

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500

  
@user_bp.route("/verify-token", methods=["GET"])
@jwt_required()
def verify_token():

    return jsonify({
        "success": True,
        "user": get_jwt_identity()
    }), 200