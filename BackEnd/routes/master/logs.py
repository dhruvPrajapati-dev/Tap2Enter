from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from database import get_connection

logs_bp = Blueprint("logs", __name__)


@logs_bp.route("/public/logs", methods=["GET"])
@jwt_required()
def get_logs():

    connection = None
    cursor = None

    try:

        
        # GET PARAMETERS
        

        system_id = request.args.get("systemID")

        start_date = request.args.get("startDate")
        end_date = request.args.get("endDate")

        log_type = request.args.get("type")
        method = request.args.get("method")

        search = request.args.get("search")


        
        # SYSTEM ID VALIDATION
        

        if not system_id:

            return jsonify({
                "success": False,
                "message": "systemID is required"
            }), 400


        
        # DATABASE CONNECTION
        

        connection = get_connection()

        cursor = connection.cursor()


        
        # BASE QUERY
        

        query = """
            SELECT
                uee.recordID,
                uee.userID,
                u.fullName,
                uee.entryMethod,
                uee.entryTime,
                uee.exitTime,
                uee.status

            FROM userentryexit uee

            JOIN user u
                ON uee.userID = u.userID

            WHERE u.sysID = %s
        """

        params = [system_id]


        
        # DATE FILTER
        

        if start_date and end_date:

            query += """
                AND DATE(uee.entryTime)
                BETWEEN %s AND %s
            """

            params.append(start_date)
            params.append(end_date)

        elif start_date:

            query += """
                AND DATE(uee.entryTime) >= %s
            """

            params.append(start_date)

        elif end_date:

            query += """
                AND DATE(uee.entryTime) <= %s
            """

            params.append(end_date)


        
        # TYPE FILTER
        

        if log_type == "entry":

            # User has an entry record
            query += """
                AND uee.entryTime IS NOT NULL
            """

        elif log_type == "exit":

            # User has exited
            query += """
                AND uee.exitTime IS NOT NULL
            """


        
        # METHOD FILTER
        

        if method:

            query += """
                AND UPPER(uee.entryMethod) = UPPER(%s)
            """

            params.append(method)


        
        # SEARCH FILTER
        

        if search:

            query += """
                AND (
                    u.fullName LIKE %s
                    OR CAST(uee.userID AS CHAR) LIKE %s
                )
            """

            search_value = f"%{search}%"

            params.append(search_value)
            params.append(search_value)


        
        # ORDER
        

        query += """
            ORDER BY uee.entryTime DESC
        """


        
        # EXECUTE QUERY
        

        cursor.execute(query, tuple(params))

        rows = cursor.fetchall()


        
        # CREATE RESPONSE
        

        logs = []


        for row in rows:

            logs.append({

                "id": row[0],

                "user_id": row[1],

                "fullName": row[2],

                "entryMethod": row[3],

                "entryTime": (
                    row[4].strftime("%d-%m-%Y %H:%M:%S")
                    if row[4] is not None
                    else None
                ),

                "exitTime": (
                    row[5].strftime("%d-%m-%Y %H:%M:%S")
                    if row[5] is not None
                    else None
                ),

                "status": row[6]
            })


        
        # CLOSE
        

        cursor.close()
        connection.close()


        
        # RESPONSE
        

        return jsonify({

            "success": True,

            "logs": logs,

            "count": len(logs)

        }), 200


    except Exception as e:

        print("Logs Error:", e)


        if cursor:
            cursor.close()

        if connection:
            connection.close()


        return jsonify({

            "success": False,

            "message": "Failed to fetch logs",

            "error": str(e)

        }), 500