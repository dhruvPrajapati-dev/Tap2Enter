from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from database import get_connection
from datetime import datetime


attendance_bp = Blueprint(
    "attendance",
    __name__,
    url_prefix="/public"
)


@attendance_bp.route("/attendance", methods=["POST"])
@jwt_required()
def attendance():

    try:

        # ==========================================
        # JWT CLAIMS
        # ==========================================

        claims = get_jwt()

        if claims["role"] != "public":

            return jsonify({
                "success": False,
                "message": "Access Denied"
            }), 403


        systemID = claims["systemID"]


        # ==========================================
        # GET REQUEST DATA
        # ==========================================

        data = request.get_json()

        NFCID = data.get("NFCID")


        if not NFCID:

            return jsonify({
                "success": False,
                "message": "NFC Required"
            }), 400


        # ==========================================
        # DATABASE CONNECTION
        # ==========================================

        conn = get_connection()

        cursor = conn.cursor(dictionary=True)


        # ==========================================
        # FIND USER
        # ==========================================

        cursor.execute("""
            SELECT *
            FROM user
            WHERE NFCID = %s
              AND sysID = %s
            LIMIT 1
        """, (NFCID, systemID))

        user = cursor.fetchone()


        if user is None:

            cursor.close()
            conn.close()

            return jsonify({
                "success": False,
                "message": "User Not Found"
            }), 404


        # ==========================================
        # CHECK TODAY'S RECORD
        # ==========================================

        cursor.execute("""
            SELECT *
            FROM userentryexit
            WHERE userID = %s
              AND DATE(entryTime) = CURDATE()
            ORDER BY recordID DESC
            LIMIT 1
        """, (user["userID"],))

        todayRecord = cursor.fetchone()


        # ==========================================
        # CURRENT TIME
        # ==========================================

        now = datetime.now()

        currentTime = now.strftime("%H:%M:%S")


        # ==========================================
        # FIRST SCAN → ENTRY
        # ==========================================

        if todayRecord is None:

            cursor.execute("""
                INSERT INTO userentryexit
                (
                    userID,
                    entryMethod,
                    entryTime,
                    status
                )
                VALUES
                (
                    %s,
                    'NFC',
                    %s,
                    'Inside'
                )
            """, (
                user["userID"],
                now
            ))

            conn.commit()

            type = "entry"


        # ==========================================
        # SECOND SCAN → EXIT
        # ==========================================

        elif todayRecord["exitTime"] is None:

            cursor.execute("""
                UPDATE userentryexit
                SET
                    exitTime = %s,
                    status = 'Outside'
                WHERE recordID = %s
            """, (
                now,
                todayRecord["recordID"]
            ))

            conn.commit()

            type = "exit"


        # ==========================================
        # THIRD SCAN → REJECT
        # ==========================================

        else:

            cursor.close()
            conn.close()

            return jsonify({
                "success": False,
                "message": "User has already entered and exited today."
            }), 409


        # ==========================================
        # CLOSE DATABASE
        # ==========================================

        cursor.close()
        conn.close()


        # ==========================================
        # RESPONSE
        # ==========================================

        return jsonify({
            "success": True,
            "fullName": user["fullName"],
            "type": type,
            "time": currentTime
        }), 200


    except Exception as e:

        print(e)

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500