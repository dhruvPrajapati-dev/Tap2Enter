from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from database import get_connection


users_bp = Blueprint(
    "users",
    __name__,
    url_prefix="/system"
)


# =========================================================
# GET ALL USERS
# =========================================================

@users_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users():

    connection = None
    cursor = None

    try:
        sys_id = request.args.get("sysID")

        if not sys_id:
            return jsonify({
                "success": False,
                "message": "sysID is required"
            }), 400

        connection = get_connection()

        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                userID,
                sysID,
                fullName,
                contactNo,
                email,
                NFCID,
                face,
                status,
                createdDate
            FROM `user`
            WHERE sysID = %s
            ORDER BY createdDate DESC
        """, (sys_id,))

        users = cursor.fetchall()

        return jsonify({
            "success": True,
            "users": users
        }), 200

    except Exception as e:

        print("GET USERS ERROR:", e)

        return jsonify({
            "success": False,
            "message": "Unable to load users",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# GET SINGLE USER
# =========================================================

@users_bp.route("/users/<user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):

    connection = None
    cursor = None

    try:
        sys_id = request.args.get("sysID")

        if not sys_id:
            return jsonify({
                "success": False,
                "message": "sysID is required"
            }), 400

        connection = get_connection()

        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                userID,
                sysID,
                fullName,
                contactNo,
                email,
                NFCID,
                face,
                status,
                createdDate
            FROM `user`
            WHERE userID = %s
              AND sysID = %s
            LIMIT 1
        """, (user_id, sys_id))

        user = cursor.fetchone()

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        return jsonify({
            "success": True,
            "user": user
        }), 200

    except Exception as e:

        print("GET USER ERROR:", e)

        return jsonify({
            "success": False,
            "message": "Unable to load user",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# UPDATE USER
# =========================================================

@users_bp.route(
    "/users/<user_id>",
    methods=["PUT", "OPTIONS"]
)
@jwt_required(optional=True)
def update_user(user_id):

    if request.method == "OPTIONS":
        return "", 200

    connection = None
    cursor = None

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Request body is required"
            }), 400

        sys_id = data.get("sysID")

        full_name = data.get("fullName")
        contact_no = data.get("contactNo")
        email = data.get("email")
        nfc_id = data.get("NFCID")
        status = data.get("status")

        if not sys_id:
            return jsonify({
                "success": False,
                "message": "sysID is required"
            }), 400

        if not full_name:
            return jsonify({
                "success": False,
                "message": "Full name is required"
            }), 400

        connection = get_connection()

        cursor = connection.cursor()

        # -----------------------------------------------
        # CHECK USER
        # -----------------------------------------------

        cursor.execute("""
            SELECT userID
            FROM `user`
            WHERE userID = %s
              AND sysID = %s
            LIMIT 1
        """, (user_id, sys_id))

        user = cursor.fetchone()

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        # -----------------------------------------------
        # CHECK DUPLICATE NFC
        # -----------------------------------------------

        if nfc_id:

            cursor.execute("""
                SELECT userID
                FROM `user`
                WHERE NFCID = %s
                  AND sysID = %s
                  AND userID != %s
                LIMIT 1
            """, (nfc_id, sys_id, user_id))

            existing_nfc = cursor.fetchone()

            if existing_nfc:

                return jsonify({
                    "success": False,
                    "message": "NFC ID is already assigned to another user"
                }), 409

        # -----------------------------------------------
        # UPDATE USER
        # -----------------------------------------------

        cursor.execute("""
            UPDATE `user`
            SET
                fullName = %s,
                contactNo = %s,
                email = %s,
                NFCID = %s,
                status = %s
            WHERE userID = %s
              AND sysID = %s
        """, (
            full_name,
            contact_no,
            email,
            nfc_id,
            status,
            user_id,
            sys_id
        ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "User updated successfully"
        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        print("UPDATE USER ERROR:", e)

        return jsonify({
            "success": False,
            "message": "Unable to update user",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# DEACTIVATE USER
# =========================================================

@users_bp.route(
    "/users/<user_id>/deactivate",
    methods=["PUT", "OPTIONS"]
)
@jwt_required(optional=True)
def deactivate_user(user_id):

    if request.method == "OPTIONS":
        return "", 200

    connection = None
    cursor = None

    try:

        sys_id = request.args.get("sysID")

        if not sys_id:
            return jsonify({
                "success": False,
                "message": "sysID is required"
            }), 400

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute("""
            UPDATE `user`
            SET status = 'Inactive'
            WHERE userID = %s
              AND sysID = %s
        """, (user_id, sys_id))

        if cursor.rowcount == 0:

            connection.rollback()

            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        connection.commit()

        return jsonify({
            "success": True,
            "message": "User deactivated successfully",
            "userID": user_id
        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        print("DEACTIVATE USER ERROR:", e)

        return jsonify({
            "success": False,
            "message": "Unable to deactivate user",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# ACTIVATE USER
# =========================================================

@users_bp.route(
    "/users/<user_id>/activate",
    methods=["PUT", "OPTIONS"]
)
@jwt_required(optional=True)
def activate_user(user_id):

    if request.method == "OPTIONS":
        return "", 200

    connection = None
    cursor = None

    try:

        sys_id = request.args.get("sysID")

        if not sys_id:
            return jsonify({
                "success": False,
                "message": "sysID is required"
            }), 400

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute("""
            UPDATE `user`
            SET status = 'Active'
            WHERE userID = %s
              AND sysID = %s
        """, (user_id, sys_id))

        if cursor.rowcount == 0:

            connection.rollback()

            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        connection.commit()

        return jsonify({
            "success": True,
            "message": "User activated successfully",
            "userID": user_id
        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        print("ACTIVATE USER ERROR:", e)

        return jsonify({
            "success": False,
            "message": "Unable to activate user",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# =========================================================
# DELETE USER
# =========================================================

@users_bp.route(
    "/users/<user_id>",
    methods=["DELETE", "OPTIONS"]
)
@jwt_required(optional=True)
def delete_user(user_id):

    if request.method == "OPTIONS":
        return "", 200

    connection = None
    cursor = None

    try:

        sys_id = request.args.get("sysID")

        if not sys_id:
            return jsonify({
                "success": False,
                "message": "sysID is required"
            }), 400

        connection = get_connection()

        cursor = connection.cursor()

        # -----------------------------------------------
        # CHECK USER AND STATUS
        # -----------------------------------------------

        cursor.execute("""
            SELECT status
            FROM `user`
            WHERE userID = %s
              AND sysID = %s
            LIMIT 1
        """, (user_id, sys_id))

        user = cursor.fetchone()

        if not user:

            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        # -----------------------------------------------
        # USER MUST BE INACTIVE
        # -----------------------------------------------

        if user[0] != "Inactive":

            return jsonify({
                "success": False,
                "message": "Please deactivate the user before deleting"
            }), 400

        # -----------------------------------------------
        # DELETE ATTENDANCE RECORDS
        # -----------------------------------------------

        cursor.execute("""
            DELETE FROM userentryexit
            WHERE userID = %s
        """, (user_id,))

        attendance_deleted = cursor.rowcount

        # -----------------------------------------------
        # DELETE USER
        # -----------------------------------------------

        cursor.execute("""
            DELETE FROM `user`
            WHERE userID = %s
              AND sysID = %s
        """, (user_id, sys_id))

        if cursor.rowcount == 0:

            connection.rollback()

            return jsonify({
                "success": False,
                "message": "Unable to delete user"
            }), 500

        # -----------------------------------------------
        # COMMIT
        # -----------------------------------------------

        connection.commit()

        return jsonify({
            "success": True,
            "message": "User permanently deleted",
            "userID": user_id,
            "attendanceRecordsDeleted": attendance_deleted
        }), 200

    except Exception as e:

        if connection:
            connection.rollback()

        print("DELETE USER ERROR:", e)

        return jsonify({
            "success": False,
            "message": "Unable to delete user",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()