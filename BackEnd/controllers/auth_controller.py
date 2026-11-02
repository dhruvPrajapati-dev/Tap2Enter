''' from flask import request
from database import get_connection


def login():

    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM system LIMIT 1")

    system = cursor.fetchone()

    cursor.close()
    conn.close()

    # -----------------------------
    # MASTER LOGIN
    # -----------------------------

    if (
        username == system["masterUsername"]
        and
        password == system["masterPasswordHash"]
    ):

        return {
            "success": True,
            "role": "master",
            "dashboard": "/master-dashboard",
            "message": "Master Login Successful"
        }

    # -----------------------------
    # PUBLIC LOGIN
    # -----------------------------

    if (
        username == system["publicUsername"]
        and
        password == system["publicPasswordHash"]
    ):

        return {
            "success": True,
            "role": "public",
            "dashboard": "/public-dashboard",
            "message": "Public Login Successful"
        }

    # -----------------------------
    # INVALID LOGIN
    # -----------------------------

    return {
        "success": False,
        "message": "Invalid Username or Password"
    },401 '''