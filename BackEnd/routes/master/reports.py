from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from database import get_connection
from datetime import datetime, date, timedelta


# =========================================================
# REPORT BLUEPRINT
# =========================================================

reports_bp = Blueprint(
    "reports",
    __name__,
    url_prefix="/public/reports"
)


# =========================================================
# REPORT API
# GET /public/reports
#
# Example:
# /public/reports?fromDate=2026-09-01&toDate=2026-09-13
# =========================================================

@reports_bp.route("", methods=["GET"])
@jwt_required()
def get_report():

    connection = None
    cursor = None

    try:

        # =================================================
        # 1. JWT
        # =================================================

        claims = get_jwt()

        # If you want to check public role, uncomment this
        #
        # if claims.get("role") != "public":
        #     return jsonify({
        #         "success": False,
        #         "message": "Access Denied"
        #     }), 403

        system_id = claims.get("systemID")

        if not system_id:
            return jsonify({
                "success": False,
                "message": "System ID not found in token"
            }), 400


        # =================================================
        # 2. DATE FILTER
        # =================================================

        from_date = request.args.get("fromDate")
        to_date = request.args.get("toDate")

        # If fromDate is not supplied, use today
        if not from_date:
            from_date = date.today().strftime("%Y-%m-%d")

        # If toDate is not supplied, use fromDate
        if not to_date:
            to_date = from_date


        # =================================================
        # 3. VALIDATE DATE
        # =================================================

        try:

            start_date = datetime.strptime(
                from_date,
                "%Y-%m-%d"
            ).date()

            end_date = datetime.strptime(
                to_date,
                "%Y-%m-%d"
            ).date()

        except ValueError:

            return jsonify({
                "success": False,
                "message": "Invalid date format. Use YYYY-MM-DD"
            }), 400


        # =================================================
        # 4. DATE VALIDATION
        # =================================================

        if start_date > end_date:

            return jsonify({
                "success": False,
                "message": "From date cannot be greater than To date"
            }), 400


        # =================================================
        # 5. END DATE + 1 DAY
        #
        # Example:
        #
        # fromDate = 2026-09-13
        # toDate   = 2026-09-13
        #
        # Query:
        #
        # >= 2026-09-13
        # <  2026-09-14
        #
        # This includes the complete day.
        # =================================================

        end_date_exclusive = end_date + timedelta(days=1)


        # =================================================
        # 6. DATABASE CONNECTION
        # =================================================

        connection = get_connection()

        if connection is None:

            return jsonify({
                "success": False,
                "message": "Database connection failed"
            }), 500


        # =================================================
        # 7. CREATE CURSOR
        # =================================================

        cursor = connection.cursor(
            dictionary=True
        )


        # =================================================
        # 8. TOTAL ENTRIES
        # =================================================

        entry_query = """
            SELECT COUNT(*) AS total_entries
            FROM userentryexit uee
            INNER JOIN user u
                ON uee.userID = u.userID
            WHERE u.sysID = %s
              AND uee.entryTime >= %s
              AND uee.entryTime < %s
        """

        cursor.execute(
            entry_query,
            (
                system_id,
                start_date,
                end_date_exclusive
            )
        )

        entry_result = cursor.fetchone()

        total_entries = (
            entry_result["total_entries"]
            if entry_result
            else 0
        )


        # =================================================
        # 9. TOTAL EXITS
        # =================================================

        exit_query = """
            SELECT COUNT(*) AS total_exits
            FROM userentryexit uee
            INNER JOIN user u
                ON uee.userID = u.userID
            WHERE u.sysID = %s
              AND uee.exitTime IS NOT NULL
              AND uee.exitTime >= %s
              AND uee.exitTime < %s
        """

        cursor.execute(
            exit_query,
            (
                system_id,
                start_date,
                end_date_exclusive
            )
        )

        exit_result = cursor.fetchone()

        total_exits = (
            exit_result["total_exits"]
            if exit_result
            else 0
        )


        # =================================================
        # 10. CURRENTLY INSIDE
        #
        # User has entry but no exit.
        #
        # NOTE:
        # This checks the current database state, not only
        # records inside the selected date range.
        # =================================================

        inside_query = """
            SELECT COUNT(*) AS currently_inside
            FROM userentryexit uee
            INNER JOIN user u
                ON uee.userID = u.userID
            WHERE u.sysID = %s
              AND uee.entryTime IS NOT NULL
              AND uee.exitTime IS NULL
        """

        cursor.execute(
            inside_query,
            (system_id,)
        )

        inside_result = cursor.fetchone()

        currently_inside = (
            inside_result["currently_inside"]
            if inside_result
            else 0
        )


        # =================================================
        # 11. TOTAL VISITORS
        # =================================================

        total_visitor_query = """
            SELECT COUNT(*) AS total_visitors
            FROM visitor v
            WHERE v.sysID = %s
              AND v.createdDate >= %s
              AND v.createdDate < %s
        """

        cursor.execute(
            total_visitor_query,
            (
                system_id,
                start_date,
                end_date_exclusive
            )
        )

        visitor_count_result = cursor.fetchone()

        total_visitors = (
            visitor_count_result["total_visitors"]
            if visitor_count_result
            else 0
        )


        # =================================================
        # 12. DETAILED USER ATTENDANCE REPORT
        # =================================================

        report_query = """
            SELECT
                uee.recordID,
                u.fullName,
                u.userID,
                uee.entryTime,
                uee.exitTime,
                uee.entryMethod,
                uee.status
            FROM userentryexit uee
            INNER JOIN user u
                ON uee.userID = u.userID
            WHERE u.sysID = %s
              AND uee.entryTime >= %s
              AND uee.entryTime < %s
            ORDER BY uee.entryTime DESC
        """

        cursor.execute(
            report_query,
            (
                system_id,
                start_date,
                end_date_exclusive
            )
        )

        rows = cursor.fetchall()


        # =================================================
        # 13. CREATE USER REPORT ARRAY
        # =================================================

        reports = []

        for row in rows:

            # ---------------------------------------------
            # STATUS
            # ---------------------------------------------

            if row["exitTime"] is None:
                status = "Inside"
            else:
                status = "Outside"


            # ---------------------------------------------
            # ENTRY TIME
            # ---------------------------------------------

            entry_time = None

            if row["entryTime"]:

                entry_time = row["entryTime"].strftime(
                    "%d-%m-%Y %H:%M:%S"
                )


            # ---------------------------------------------
            # EXIT TIME
            # ---------------------------------------------

            exit_time = None

            if row["exitTime"]:

                exit_time = row["exitTime"].strftime(
                    "%d-%m-%Y %H:%M:%S"
                )


            # ---------------------------------------------
            # ADD USER RECORD
            # ---------------------------------------------

            reports.append({
                "id": row["recordID"],
                "name": row["fullName"],
                "userId": row["userID"],
                "entry": entry_time,
                "exit": exit_time,
                "method": row["entryMethod"],
                "status": status
            })


        # =================================================
        # 14. VISITOR REPORT
        #
        # IMPORTANT:
        # This query is OUTSIDE the user attendance loop.
        # =================================================

        visitor_query = """
            SELECT
                v.visitorID,
                v.visitorname,
                v.contactNo,
                v.purpose,
                v.faceCaptured,
                v.createdDate
            FROM visitor v
            WHERE v.sysID = %s
              AND v.createdDate >= %s
              AND v.createdDate < %s
            ORDER BY v.createdDate DESC
        """

        cursor.execute(
            visitor_query,
            (
                system_id,
                start_date,
                end_date_exclusive
            )
        )

        visitor_rows = cursor.fetchall()


        # =================================================
        # 15. CREATE VISITOR ARRAY
        # =================================================

        visitors = []

        for row in visitor_rows:

            created_date = None

            if row["createdDate"]:

                created_date = row["createdDate"].strftime(
                    "%d-%m-%Y %I:%M:%S %p"
                )


            visitors.append({
                "visitorID": row["visitorID"],
                "visitorname": row["visitorname"],
                "contactNo": row["contactNo"],
                "purpose": row["purpose"],
                "faceCaptured": row["faceCaptured"],
                "createdDate": created_date
            })


        # =================================================
        # 16. RESPONSE
        # =================================================

        return jsonify({

            "success": True,

            "filters": {
                "systemID": system_id,
                "fromDate": from_date,
                "toDate": to_date
            },

            "summary": {

                "totalEntries": total_entries,

                "totalExits": total_exits,

                "currentlyInside": currently_inside,

                "totalVisitors": total_visitors
            },

            "reports": reports,

            "visitors": visitors,

            "totalRecords": {

                "users": len(reports),

                "visitors": len(visitors)
            }

        }), 200


    # =====================================================
    # ERROR HANDLING
    # =====================================================

    except Exception as e:

        print(
            "=========================================="
        )

        print(
            "REPORT API ERROR:",
            str(e)
        )

        print(
            "=========================================="
        )

        return jsonify({

            "success": False,

            "message": "Unable to generate report.",

            "error": str(e)

        }), 500


    # =====================================================
    # CLEANUP
    # =====================================================

    finally:

        if cursor:

            try:
                cursor.close()
            except Exception as e:
                print(
                    "Cursor close error:",
                    str(e)
                )


        if connection:

            try:
                connection.close()
            except Exception as e:
                print(
                    "Connection close error:",
                    str(e)
                )