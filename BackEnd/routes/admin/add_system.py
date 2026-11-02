from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from database import get_connection
import bcrypt

# ==========================================
# Blueprint
# ==========================================

add_system_bp = Blueprint(
    "add_system",
    __name__,
    url_prefix="/admin"
)


# ==========================================
# Add New System
# POST : /admin/add-system
# ==========================================

@add_system_bp.route("/add-system", methods=["POST"])
@jwt_required()
def add_system():

    conn = None
    cursor = None

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "No data received."
            }), 400

        # ==========================================
        # Get Data
        # ==========================================

        systemName = data.get("systemName", "").strip()
        address = data.get("address", "").strip()
        contactNo = data.get("contactNo", "").strip()
        email = data.get("email", "").strip()

        masterUsername = data.get("masterUsername", "").strip()
        masterPassword = data.get("masterPassword", "")

        publicUsername = data.get("publicUsername", "").strip()
        publicPassword = data.get("publicPassword", "")

        status = data.get("status", "Active")

        # ==========================================
        # Validation
        # ==========================================

        if systemName == "":
            return jsonify({
                "success": False,
                "message": "System Name is required."
            }), 400

        if not masterUsername.startswith("mst_"):
            return jsonify({
                "success": False,
                "message": "Master Username must start with mst_."
            }), 400

        if not publicUsername.startswith("pub_"):
            return jsonify({
                "success": False,
                "message": "Public Username must start with pub_."
            }), 400

        if masterPassword == "":
            return jsonify({
                "success": False,
                "message": "Master Password is required."
            }), 400

        if publicPassword == "":
            return jsonify({
                "success": False,
                "message": "Public Password is required."
            }), 400

        # ==========================================
        # Database Connection
        # ==========================================

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # ==========================================
        # Check Duplicate Master Username
        # ==========================================

        cursor.execute(
            """
            SELECT sysID
            FROM `systems`
            WHERE masterUsername = %s
            LIMIT 1
            """,
            (masterUsername,)
        )

        existing_master = cursor.fetchone()

        if existing_master:
            return jsonify({
                "success": False,
                "message": "Master Username already exists."
            }), 409

        # ==========================================
        # Check Duplicate Public Username
        # ==========================================

        cursor.execute(
            """
            SELECT sysID
            FROM `systems`
            WHERE publicUsername = %s
            LIMIT 1
            """,
            (publicUsername,)
        )

        existing_public = cursor.fetchone()

        if existing_public:
            return jsonify({
                "success": False,
                "message": "Public Username already exists."
            }), 409

        # ==========================================
        # Password Hashing
        # ==========================================

        masterHash = bcrypt.hashpw(
            masterPassword.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        publicHash = bcrypt.hashpw(
            publicPassword.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        # ==========================================
        # Insert New System
        # ==========================================

        cursor.execute(
            """
            INSERT INTO `systems`
            (
                systemName,
                address,
                contactNo,
                email,
                masterUsername,
                masterPasswordHash,
                publicUsername,
                publicPasswordHash,
                status
            )
            VALUES
            (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                systemName,
                address,
                contactNo,
                email,
                masterUsername,
                masterHash,
                publicUsername,
                publicHash,
                status
            )
        )

        # ==========================================
        # Commit
        # ==========================================

        conn.commit()

        newID = cursor.lastrowid

        # ==========================================
        # Success Response
        # ==========================================

        return jsonify({
            "success": True,
            "message": "System Added Successfully.",
            "systemID": newID
        }), 201

    except Exception as e:

        if conn:
            conn.rollback()

        print("Add System Error:", e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()