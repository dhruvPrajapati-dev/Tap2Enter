from flask import Blueprint, request, jsonify
from datetime import datetime
from database import get_connection
import mysql.connector
from flask_jwt_extended import jwt_required, get_jwt
visitor_attendance = Blueprint(
    "visitor_attendance",
    __name__,
    url_prefix="/public"
)

# =========================================================
# VISITOR ENTRY API
# =========================================================

@visitor_attendance.route("/visitor", methods=["POST"])
def create_visitor():

    connection = None
    cursor = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "success": False,
                "message": "No visitor data received"
            }), 400


        # -------------------------------------------------
        # GET DATA
        # -------------------------------------------------
        sysID = data.get("sysID").strip()
        visitorName = str(
            data.get("visitorName", "")
        ).strip()

        mobile = str(
            data.get("mobile", "")
        ).strip()

        email = str(
            data.get("email", "")
        ).strip()

        purpose = str(
            data.get("purpose", "")
        ).strip()

        face_captured = bool(
            data.get("faceCaptured", False)
        )


        # -------------------------------------------------
        # VALIDATION
        # -------------------------------------------------

        if not visitorName:

            return jsonify({
                "success": False,
                "message": "Visitor name is required"
            }), 400


        if not mobile:

            return jsonify({
                "success": False,
                "message": "Mobile number is required"
            }), 400


        if not mobile.isdigit() or len(mobile) != 10:

            return jsonify({
                "success": False,
                "message":
                    "Mobile number must contain 10 digits"
            }), 400


        if not purpose:

            return jsonify({
                "success": False,
                "message":
                    "Purpose of visit is required"
            }), 400


        if not face_captured:

            return jsonify({
                "success": False,
                "message":
                    "Face capture is required"
            }), 400


        # -------------------------------------------------
        # DATABASE
        # -------------------------------------------------

        connection = get_connection()

        cursor = connection.cursor()

        query = """
            INSERT INTO visitor
            (   
                sysID,
                visitorName,
                contactNo,
                email,
                purpose,
                faceCaptured,
                createdDate
            )
            VALUES
            (%s, %s, %s, %s, %s, %s, %s)
        """


        entry_time = datetime.now()


        values = (
            sysID,
            visitorName,
            mobile,
            email if email else None,
            purpose,
            face_captured,
            entry_time
        )


        cursor.execute(
            query,
            values
        )

        connection.commit()


        visitor_id = cursor.lastrowid


        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return jsonify({

            "success": True,

            "message":
                "Visitor entry recorded successfully",

            "visitorID":
                visitor_id,

            "visitorName":
                visitorName,

            "entryTime":
                entry_time.strftime(
                    "%Y-%m-%d %H:%M:%S"
                )

        }), 201


    except mysql.connector.Error as error:

        print(
            "Visitor Database Error:",
            error
        )


        return jsonify({

            "success": False,

            "message":
                "Database error"

        }), 500


    except Exception as error:

        print(
            "Visitor API Error:",
            error
        )


        return jsonify({

            "success": False,

            "message":
                "Unable to record visitor entry"

        }), 500


    finally:

        if cursor:

            cursor.close()

        if connection:

            connection.close()