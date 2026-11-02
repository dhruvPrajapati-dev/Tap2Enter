from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_connection
import bcrypt

settings_bp = Blueprint(
    "settings",
    __name__,
    url_prefix="/settings"
)


# =========================================================
# PASSWORD VERIFICATION
# =========================================================

def verify_password(stored_password, entered_password):

    if not stored_password or not entered_password:
        return False

    stored_password = str(stored_password)

    # Hashed password
    if (
        stored_password.startswith("scrypt:")
        or stored_password.startswith("pbkdf2:")
        or stored_password.startswith("argon2:")
    ):
        try:
            return check_password_hash(
                stored_password,
                entered_password
            )
        except Exception:
            return False

    # Legacy plaintext password
    return stored_password == entered_password


# =========================================================
# GET PROFILE
# =========================================================

@settings_bp.route("/profile", methods=["POST"])
@jwt_required()
def get_profile():

    connection = None
    cursor = None

    try:

        # -------------------------------------------------
        # JSON DATA
        # -------------------------------------------------

        data = request.get_json(silent=True) or {}

        system_id = data.get("systemID")

        if not system_id:
            return jsonify({
                "success": False,
                "message": "systemID is required."
            }), 400

        # -------------------------------------------------
        # DATABASE
        # -------------------------------------------------

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                sysID,
                systemName,
                address,
                contactNo,
                email,
                masterUsername,
                publicUsername,
                status,
                createdDate
            FROM systems
            WHERE sysID = %s
            LIMIT 1
            """,
            (system_id,)
        )

        profile = cursor.fetchone()

        if not profile:

            return jsonify({
                "success": False,
                "message": "System not found."
            }), 404

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        if profile.get("createdDate"):

            profile["createdDate"] = (
                profile["createdDate"]
                .strftime("%d-%m-%Y %H:%M:%S")
            )

        return jsonify({
            "success": True,
            "profile": profile
        }), 200

    except Exception as e:

        print("GET PROFILE ERROR:", e)

        return jsonify({
            "success": False,
            "message": "Unable to load profile."
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# UPDATE PROFILE
# =========================================================

@settings_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():

    connection = None
    cursor = None

    try:

        data = request.get_json(silent=True) or {}

        system_id = data.get("systemID")

        if not system_id:
            return jsonify({
                "success": False,
                "message": "systemID is required."
            }), 400

        system_name = data.get("systemName")
        address = data.get("address")
        contact_no = data.get("contactNo")
        email = data.get("email")
        master_username = data.get("masterUsername")
        public_username = data.get("publicUsername")

        if not system_name:
            return jsonify({
                "success": False,
                "message": "System name is required."
            }), 400

        if not address:
            return jsonify({
                "success": False,
                "message": "Address is required."
            }), 400

        if not contact_no:
            return jsonify({
                "success": False,
                "message": "Contact number is required."
            }), 400

        if not email:
            return jsonify({
                "success": False,
                "message": "Email is required."
            }), 400

        if not master_username:
            return jsonify({
                "success": False,
                "message": "Master username is required."
            }), 400

        if not public_username:
            return jsonify({
                "success": False,
                "message": "Public username is required."
            }), 400

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            UPDATE systems
            SET
                systemName = %s,
                address = %s,
                contactNo = %s,
                email = %s,
                masterUsername = %s,
                publicUsername = %s
            WHERE sysID = %s
            """,
            (
                system_name,
                address,
                contact_no,
                email,
                master_username,
                public_username,
                system_id
            )
        )

        connection.commit()

        if cursor.rowcount == 0:

            return jsonify({
                "success": False,
                "message": "System not found or no changes made."
            }), 404

        return jsonify({
            "success": True,
            "message": "Profile updated successfully."
        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        print("UPDATE PROFILE ERROR:", e)

        return jsonify({
            "success": False,
            "message": "Unable to update profile."
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()



# =========================================================
# CHANGE MASTER PASSWORD
# PUT /settings/password
# =========================================================

@settings_bp.route("/password", methods=["PUT"])
@jwt_required()
def change_master_password():

    connection = None
    cursor = None

    try:

        # -------------------------------------------------
        # GET JWT
        # -------------------------------------------------

        claims = get_jwt()

        token_system_id = claims.get("systemID")
        token_role = claims.get("role")

        # Only master can change master password
        if token_role != "master":
            return jsonify({
                "success": False,
                "message": "Access denied. Master account required."
            }), 403

        # -------------------------------------------------
        # REQUEST DATA
        # -------------------------------------------------

        data = request.get_json(silent=True) or {}

        system_id = data.get("systemID")
        current_password = data.get("currentPassword", "")
        new_password = data.get("newPassword", "")
        confirm_password = data.get("confirmPassword", "")

        # -------------------------------------------------
        # VALIDATION
        # -------------------------------------------------

        if not system_id:
            return jsonify({
                "success": False,
                "message": "systemID is required."
            }), 400

        # Make sure user cannot change another system's password
        if str(system_id) != str(token_system_id):
            return jsonify({
                "success": False,
                "message": "Invalid system ID."
            }), 403

        if not current_password:
            return jsonify({
                "success": False,
                "message": "Current password is required."
            }), 400

        if not new_password:
            return jsonify({
                "success": False,
                "message": "New password is required."
            }), 400

        if not confirm_password:
            return jsonify({
                "success": False,
                "message": "Confirm password is required."
            }), 400

        if new_password != confirm_password:
            return jsonify({
                "success": False,
                "message": "New password and confirm password do not match."
            }), 400

        if current_password == new_password:
            return jsonify({
                "success": False,
                "message": "New password must be different from current password."
            }), 400

        if len(new_password) < 8:
            return jsonify({
                "success": False,
                "message": "New password must contain at least 8 characters."
            }), 400

        # -------------------------------------------------
        # DATABASE
        # -------------------------------------------------

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT masterPasswordHash
            FROM systems
            WHERE sysID = %s
            LIMIT 1
            """,
            (system_id,)
        )

        system = cursor.fetchone()

        if not system:
            return jsonify({
                "success": False,
                "message": "System not found."
            }), 404

        stored_hash = system["masterPasswordHash"]

        if not stored_hash:
            return jsonify({
                "success": False,
                "message": "Master password is not configured."
            }), 400

        # -------------------------------------------------
        # CHECK CURRENT PASSWORD
        # -------------------------------------------------

        try:

            password_correct = bcrypt.checkpw(
                current_password.encode("utf-8"),
                stored_hash.encode("utf-8")
            )

        except Exception as e:

            print("MASTER PASSWORD HASH ERROR:", e)

            return jsonify({
                "success": False,
                "message": "Stored master password hash is invalid."
            }), 500

        if not password_correct:
            return jsonify({
                "success": False,
                "message": "Current master password is incorrect."
            }), 401

        # -------------------------------------------------
        # HASH NEW PASSWORD
        # -------------------------------------------------

        new_password_hash = bcrypt.hashpw(
            new_password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        # -------------------------------------------------
        # UPDATE DATABASE
        # -------------------------------------------------

        cursor.execute(
            """
            UPDATE systems
            SET masterPasswordHash = %s
            WHERE sysID = %s
            """,
            (
                new_password_hash,
                system_id
            )
        )

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Master password changed successfully."
        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        print("CHANGE MASTER PASSWORD ERROR:", e)

        return jsonify({
            "success": False,
            "message": "Unable to change master password."
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# CHANGE PUBLIC PASSWORD
# PUT /settings/public-password
# =========================================================

@settings_bp.route("/public-password", methods=["PUT"])
@jwt_required()
def change_public_password():

    connection = None
    cursor = None

    try:

        # -------------------------------------------------
        # GET JWT
        # -------------------------------------------------

        claims = get_jwt()

        token_system_id = claims.get("systemID")
        token_role = claims.get("role")

        # Only master can change public password
        if token_role != "master":
            return jsonify({
                "success": False,
                "message": "Access denied. Master account required."
            }), 403

        # -------------------------------------------------
        # REQUEST DATA
        # -------------------------------------------------

        data = request.get_json(silent=True) or {}

        system_id = data.get("systemID")
        current_password = data.get("currentPassword", "")
        new_password = data.get("newPassword", "")
        confirm_password = data.get("confirmPassword", "")

        # -------------------------------------------------
        # VALIDATION
        # -------------------------------------------------

        if not system_id:
            return jsonify({
                "success": False,
                "message": "systemID is required."
            }), 400

        # Prevent changing another system's password
        if str(system_id) != str(token_system_id):
            return jsonify({
                "success": False,
                "message": "Invalid system ID."
            }), 403

        if not current_password:
            return jsonify({
                "success": False,
                "message": "Current public password is required."
            }), 400

        if not new_password:
            return jsonify({
                "success": False,
                "message": "New password is required."
            }), 400

        if not confirm_password:
            return jsonify({
                "success": False,
                "message": "Confirm password is required."
            }), 400

        if new_password != confirm_password:
            return jsonify({
                "success": False,
                "message": "New password and confirm password do not match."
            }), 400

        if current_password == new_password:
            return jsonify({
                "success": False,
                "message": "New password must be different from current password."
            }), 400

        if len(new_password) < 8:
            return jsonify({
                "success": False,
                "message": "New password must contain at least 8 characters."
            }), 400

        # -------------------------------------------------
        # DATABASE
        # -------------------------------------------------

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT publicPasswordHash
            FROM systems
            WHERE sysID = %s
            LIMIT 1
            """,
            (system_id,)
        )

        system = cursor.fetchone()

        if not system:
            return jsonify({
                "success": False,
                "message": "System not found."
            }), 404

        stored_hash = system["publicPasswordHash"]

        if not stored_hash:
            return jsonify({
                "success": False,
                "message": "Public password is not configured."
            }), 400

        # -------------------------------------------------
        # CHECK CURRENT PASSWORD
        # -------------------------------------------------

        try:

            password_correct = bcrypt.checkpw(
                current_password.encode("utf-8"),
                stored_hash.encode("utf-8")
            )

        except Exception as e:

            print("PUBLIC PASSWORD HASH ERROR:", e)

            return jsonify({
                "success": False,
                "message": "Stored public password hash is invalid."
            }), 500

        if not password_correct:
            return jsonify({
                "success": False,
                "message": "Current public password is incorrect."
            }), 401

        # -------------------------------------------------
        # HASH NEW PASSWORD
        # -------------------------------------------------

        new_password_hash = bcrypt.hashpw(
            new_password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        # -------------------------------------------------
        # UPDATE DATABASE
        # -------------------------------------------------

        cursor.execute(
            """
            UPDATE systems
            SET publicPasswordHash = %s
            WHERE sysID = %s
            """,
            (
                new_password_hash,
                system_id
            )
        )

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Public password changed successfully."
        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        print("CHANGE PUBLIC PASSWORD ERROR:", e)

        return jsonify({
            "success": False,
            "message": "Unable to change public password."
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()