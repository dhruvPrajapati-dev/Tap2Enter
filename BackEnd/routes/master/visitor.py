from flask import Blueprint, jsonify, request

from database import get_connection


# VISITOR BLUEPRINT

visitor_bp = Blueprint(
    "visitor",
    __name__,
    url_prefix="/public/visitor"
)


# GET TODAY'S VISITORS

@visitor_bp.route("/", methods=["GET"])
def get_visitors():

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


   
        # VALIDATE SYSTEM ID
   

        try:

            sysID = int(sysID)

        except ValueError:

            return jsonify({
                "success": False,
                "message": "Invalid sysID"
            }), 400


   
        # DATABASE CONNECTION
   

        connection = get_connection()

        cursor = connection.cursor(dictionary=True)


   
        # GET TODAY'S VISITORS
   

        query = """
            SELECT
                visitorID,
                sysID,
                visitorName,
                contactNo,
                email,
                purpose,
                faceCaptured,
                createdDate

            FROM visitor

            WHERE sysID = %s

              AND createdDate >= CURDATE()

              AND createdDate < DATE_ADD(
                    CURDATE(),
                    INTERVAL 1 DAY
              )

            ORDER BY createdDate DESC
        """


        cursor.execute(
            query,
            (sysID,)
        )


        visitors = cursor.fetchall()


   
        # RESPONSE
   

        return jsonify({

            "success": True,

            "sysID": sysID,

            "count": len(visitors),

            "data": visitors

        }), 200


  
    # ERROR HANDLING
  

    except Exception as error:

        print(
            "Visitor API Error:",
            repr(error)
        )


        return jsonify({

            "success": False,

            "message":
                "Unable to load visitor data."

        }), 500


  
    # CLOSE DATABASE
  

    finally:

        if cursor:

            cursor.close()


        if connection:

            connection.close()