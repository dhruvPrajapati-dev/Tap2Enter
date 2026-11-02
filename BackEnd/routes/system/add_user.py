from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt
)

from database import get_connection
import random

# ==========================================
# Blueprint
# ==========================================

master_bp = Blueprint(
    "system",
    __name__,
    url_prefix="/system"
)


# ==========================================
# Generate User ID
# Example : USR000001
# ==========================================

def generate_user_id(cursor):

    while True:

        userID = "USR" + str(random.randint(100000, 999999))

        cursor.execute(
            "SELECT userID FROM user WHERE userID=%s",
            (userID,)
        )

        if cursor.fetchone() is None:
            return userID


# ==========================================
# Add User
# POST /system/add-user
# ==========================================

@master_bp.route("/add-user", methods=["POST"])
@jwt_required()
def add_user():

    try:

        # ----------------------------------
        # Verify Login Role
        # ----------------------------------

        claims = get_jwt()

        if claims["role"] != "master":

            return jsonify({

                "success": False,
                "message": "Access Denied."

            }), 403

        sysID = claims["systemID"]

        # ----------------------------------
        # Read JSON
        # ----------------------------------

        data = request.get_json()

        fullName = data.get("fullName", "").strip()
        contactNo = data.get("contactNo", "").strip()
        email = data.get("email", "").strip()
        NFCID = data.get("NFCID", "").strip()
        status = data.get("status", "Active")

        # ----------------------------------
        # Validation
        # ----------------------------------

        if fullName == "":
            return jsonify({

                "success": False,
                "message": "Full Name is required."

            }), 400

        if contactNo == "":
            return jsonify({

                "success": False,
                "message": "Contact Number is required."

            }), 400

        if NFCID == "":
            return jsonify({

                "success": False,
                "message": "NFC ID is required."

            }), 400

        # ----------------------------------
        # Database
        # ----------------------------------

        conn = get_connection()

        cursor = conn.cursor(dictionary=True)

        # Duplicate Contact

        cursor.execute(

            "SELECT userID FROM user WHERE contactNo=%s",

            (contactNo,)

        )

        if cursor.fetchone():

            cursor.close()
            conn.close()

            return jsonify({

                "success": False,
                "message": "Contact Number already exists."

            }), 409

        # Duplicate Email

        if email != "":

            cursor.execute(

                "SELECT userID FROM user WHERE email=%s",

                (email,)

            )

            if cursor.fetchone():

                cursor.close()
                conn.close()

                return jsonify({

                    "success": False,
                    "message": "Email already exists."

                }), 409

        # Duplicate NFC

        cursor.execute(

            "SELECT userID FROM user WHERE NFCID=%s",

            (NFCID,)

        )

        if cursor.fetchone():

            cursor.close()
            conn.close()

            return jsonify({

                "success": False,
                "message": "NFC Card already registered."

            }), 409

        # ----------------------------------
        # Generate User ID
        # ----------------------------------

        userID = generate_user_id(cursor)

        # ----------------------------------
        # Insert User
        # ----------------------------------

        cursor.execute("""

            INSERT INTO user(

                userID,
                sysID,
                fullName,
                contactNo,
                email,
                NFCID,
                photoPath,
                faceEncoding,
                status

            )

            VALUES(

                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s

            )

        """,

        (

            userID,
            sysID,
            fullName,
            contactNo,
            email,
            NFCID,
            None,
            None,
            'Active'

        )

        )

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({

            "success": True,
            "message": "User Added Successfully.",
            "userID": userID

        }), 201

    except Exception as e:

        print("Add User Error :", e)

        return jsonify({

            "success": False,
            "message": str(e)

        }), 500