from flask import Blueprint, jsonify, request
import mysql.connector
from database import get_connection


user_management_bp = Blueprint(
    "user_management",
    __name__,
    url_prefix="/system"
)


# =========================================================
# GET USERS FOR SPECIFIC SYSTEM
# =========================================================

@user_management_bp.route("/users", methods=["GET"])
def get_users():

    connection = None
    cursor = None

    try:

        # ---------------------------------------------
        # 1. Get sysID sent by React
        # ---------------------------------------------

        sysID = request.args.get("sysID")

        if not sysID:
            return jsonify({
                "success": False,
                "message": "sysID is required"
            }), 400

        # Convert to integer
        try:
            sysID = int(sysID)
        except ValueError:
            return jsonify({
                "success": False,
                "message": "Invalid sysID"
            }), 400


        # ---------------------------------------------
        # 2. Connect to MySQL
        # ---------------------------------------------

        connection = get_connection()

        cursor = connection.cursor(dictionary=True)


        # ---------------------------------------------
        # 3. Get ONLY this system's users
        # ---------------------------------------------

        query = """
            SELECT
                userID,
                sysID,
                fullName,
                contactNo,
                email,
                NFCID,
                photoPath,
                faceEncoding,
                status,
                registrationDate
            FROM `user`
            WHERE sysID = %s
            ORDER BY registrationDate DESC
        """

        cursor.execute(query, (sysID,))


        # ---------------------------------------------
        # 4. Get database result
        # ---------------------------------------------

        users = cursor.fetchall()


        # ---------------------------------------------
        # 5. Prepare response for React
        # ---------------------------------------------

        for user in users:

            if user["faceEncoding"]:
                user["face"] = "face Registered"
            else:
                user["face"] = "face Not Registered"

            # Don't send face encoding to frontend
            user.pop("faceEncoding", None)


        # ---------------------------------------------
        # 6. Send response
        # ---------------------------------------------

        return jsonify({
            "success": True,
            "sysID": sysID,
            "count": len(users),
            "users": users
        }), 200


    except mysql.connector.Error as error:

        print("MySQL Error:", error)

        return jsonify({
            "success": False,
            "message": "Database error"
        }), 500


    except Exception as error:

        print("Server Error:", error)

        return jsonify({
            "success": False,
            "message": "Unable to fetch users"
        }), 500


    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()