from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from database import get_connection
from datetime import datetime

user_wise_report_bp = Blueprint(
    "user_wise_report",
    __name__,
    url_prefix="/public"
)


@user_wise_report_bp.route("/user-wise-report", methods=["GET"])
@jwt_required()
def get_user_wise_report():

    connection = None
    cursor = None

    try:
        # -------------------------------------------------
        # GET PARAMETERS
        # -------------------------------------------------

        sys_id = request.args.get("sysID")
        search = request.args.get("search", "").strip()
        from_date = request.args.get("fromDate")
        to_date = request.args.get("toDate")

        if not sys_id:
            return jsonify({
                "success": False,
                "message": "sysID is required"
            }), 400

        if not search:
            return jsonify({
                "success": False,
                "message": "User search is required"
            }), 400

        if not from_date or not to_date:
            return jsonify({
                "success": False,
                "message": "fromDate and toDate are required"
            }), 400

        # Validate dates
        try:
            datetime.strptime(from_date, "%Y-%m-%d")
            datetime.strptime(to_date, "%Y-%m-%d")
        except ValueError:
            return jsonify({
                "success": False,
                "message": "Invalid date format. Use YYYY-MM-DD"
            }), 400

        # -------------------------------------------------
        # DATABASE
        # -------------------------------------------------

        connection = get_connection()

        # buffered=True prevents unread result problems
        cursor = connection.cursor(dictionary=True, buffered=True)

        # -------------------------------------------------
        # FIND USER
        # -------------------------------------------------

        user_query = """
            SELECT
                userID,
                sysID,
                fullName,
                contactNo,
                email,
                NFCID,
                photoPath,
                status,
                registrationDate
            FROM `user`
            WHERE sysID = %s
              AND (
                    userID LIKE %s
                    OR fullName LIKE %s
                    OR contactNo LIKE %s
                    OR NFCID LIKE %s
                    OR email LIKE %s
                  )
            LIMIT 1
        """

        search_value = f"%{search}%"

        cursor.execute(
            user_query,
            (
                sys_id,
                search_value,
                search_value,
                search_value,
                search_value,
                search_value
            )
        )

        user = cursor.fetchone()

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        user_id = user["userID"]

        # -------------------------------------------------
        # USER INFORMATION
        # -------------------------------------------------

        user_data = {
            "id": user["userID"],
            "name": user["fullName"],
            "mobile": user["contactNo"],
            "email": user["email"],
            "nfc": user["NFCID"],
            "photoPath": user["photoPath"],
            "status": user["status"],
            "registrationDate": (
                user["registrationDate"].strftime("%d %b %Y")
                if user["registrationDate"]
                else None
            ),
            "photo": None
        }

        # -------------------------------------------------
        # ATTENDANCE RECORDS
        # -------------------------------------------------

        attendance_query = """
            SELECT
                recordID,
                entryTime,
                exitTime,
                entryMethod,
                status
            FROM userentryexit
            WHERE userID = %s
              AND DATE(entryTime) BETWEEN %s AND %s
            ORDER BY entryTime ASC
        """

        cursor.execute(
            attendance_query,
            (
                user_id,
                from_date,
                to_date
            )
        )

        attendance_rows = cursor.fetchall()

        # -------------------------------------------------
        # ATTENDANCE DATA
        # -------------------------------------------------

        attendance = []

        total_entries = 0
        total_exits = 0
        present_days = 0
        total_working_seconds = 0
        nfc_entries = 0
        photoPath_entries = 0

        for row in attendance_rows:

            entry_time = row["entryTime"]
            exit_time = row["exitTime"]

            # -----------------------------
            # Entry
            # -----------------------------

            if entry_time:
                total_entries += 1

            # -----------------------------
            # Exit
            # -----------------------------

            if exit_time:
                total_exits += 1

            # -----------------------------
            # Method
            # -----------------------------

            method = row["entryMethod"] or "--"

            if method.upper() == "NFC":
                nfc_entries += 1

            elif method.upper() == "photoPath":
                photoPath_entries += 1

            # -----------------------------
            # Working Hours
            # -----------------------------

            hours_text = "--"

            if entry_time and exit_time:

                seconds = int(
                    (exit_time - entry_time).total_seconds()
                )

                if seconds > 0:
                    total_working_seconds += seconds

                hours = seconds // 3600
                minutes = (seconds % 3600) // 60

                hours_text = f"{hours:02d}h {minutes:02d}m"

            # -----------------------------
            # Present Days
            # -----------------------------

            if entry_time:
                present_days += 1

            # -----------------------------
            # Status
            # -----------------------------

            status = row["status"] or "Present"

            remarks = "On Time"

            if status.lower() == "late":
                remarks = "Late Arrival"

            # -----------------------------
            # Response row
            # -----------------------------

            attendance.append({
                "id": row["recordID"],

                "date": (
                    entry_time.strftime("%d %b %Y")
                    if entry_time
                    else "--"
                ),

                "entry": (
                    entry_time.strftime("%I:%M %p")
                    if entry_time
                    else "--"
                ),

                "exit": (
                    exit_time.strftime("%I:%M %p")
                    if exit_time
                    else "--"
                ),

                "hours": hours_text,

                "method": method,

                "status": status,

                "remarks": remarks
            })

        # -------------------------------------------------
        # TOTAL WORKING HOURS
        # -------------------------------------------------

        total_hours = total_working_seconds // 3600
        total_minutes = (
            total_working_seconds % 3600
        ) // 60

        working_hours = (
            f"{total_hours} Hrs"
            if total_minutes == 0
            else f"{total_hours} Hrs {total_minutes} Min"
        )

        # -------------------------------------------------
        # SUMMARY
        # -------------------------------------------------

        summary = {
            "totalEntries": total_entries,
            "totalExit": total_exits,
            "presentDays": present_days,
            "workingHours": working_hours,
            "nfcEntries": nfc_entries,
            "photoPathEntries": photoPath_entries
        }

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return jsonify({
            "success": True,
            "user": user_data,
            "summary": summary,
            "attendance": attendance
        }), 200

    except Exception as e:

        print("USER WISE REPORT ERROR:", str(e))

        return jsonify({
            "success": False,
            "message": "Unable to generate user report",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()