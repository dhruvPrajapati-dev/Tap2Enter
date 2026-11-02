import mysql.connector

# Database Connection
def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="@dmin$",
        database="tap2enter"
    )