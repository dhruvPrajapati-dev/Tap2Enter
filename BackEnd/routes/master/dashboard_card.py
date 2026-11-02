from flask import Blueprint, jsonify, request
from datetime import datetime

# Change this import according to your existing database file
from database import get_connection



# DASHBOARD BLUEPRINT


dashboard_bp = Blueprint(
    "dashboard",
    __name__,
    url_prefix="/public/dashboard"
)
# DASHBOARD CARDS API

@dashboard_bp.route("/cards", methods=["GET"])
def dashboard_cards():

    connection = None
    cursor = None

    try:

       
        # GET SYSTEM ID
       

        sysID = request.args.get("sysID")

        if not sysID:
            return jsonify({
                "success": False,
                "message": "sysID is required"
            }), 400

        try:
            sysID = int(sysID)

        except ValueError:
            return jsonify({
                "success": False,
                "message": "Invalid sysID"
            }), 400


       
        # DATABASE CONNECTION
       

        connection = get_connection()

        cursor = connection.cursor()


       
        # TODAY'S VISITORS
       

        cursor.execute("""
            SELECT COUNT(*)
            FROM visitor
            WHERE sysID = %s
              AND createdDate >= CURDATE()
              AND createdDate < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
        """, (sysID,))

        total_visitors = cursor.fetchone()[0] or 0


       
        # TODAY'S ENTRIES
       

        cursor.execute("""
            SELECT COUNT(*)
            FROM userentryexit ue
            INNER JOIN user u
                ON ue.userID = u.userID
            WHERE u.sysID = %s
              AND ue.entryTime >= CURDATE()
              AND ue.entryTime < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
        """, (sysID,))

        total_entries = cursor.fetchone()[0] or 0


       
        # TODAY'S EXITS
       

        cursor.execute("""
            SELECT COUNT(*)
            FROM userentryexit ue
            INNER JOIN user u
                ON ue.userID = u.userID
            WHERE u.sysID = %s
              AND ue.exitTime >= CURDATE()
              AND ue.exitTime < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
              AND ue.exitTime IS NOT NULL
        """, (sysID,))

        total_exits = cursor.fetchone()[0] or 0


       
        # CURRENTLY INSIDE
       

        cursor.execute("""
            SELECT COUNT(*)
            FROM userentryexit ue
            INNER JOIN user u
                ON ue.userID = u.userID
            WHERE u.sysID = %s
              AND ue.entryTime IS NOT NULL
              AND ue.exitTime IS NULL
              AND ue.status = 'Inside'
        """, (sysID,))

        currently_inside = cursor.fetchone()[0] or 0


       
        # RESPONSE
       

        return jsonify({
            "success": True,

            "totalVisitors":
                total_visitors,

            "totalEntries":
                total_entries,

            "totalExits":
                total_exits,

            "currentlyInside":
                currently_inside

        }), 200    
    # ERROR HANDLING
    

    except Exception as error:

        print(
            "Dashboard API Error:",
            repr(error)
        )

        return jsonify({
            "success": False,

            "message":
                str(error)
        }), 500

    # CLOSE DATABASE

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()