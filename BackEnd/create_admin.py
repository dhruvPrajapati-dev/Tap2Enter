import bcrypt
import mysql.connector

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="@dmin$",
    database="tap2enter"
)

cursor = conn.cursor()

# Admin details
fullName = "Dhruv Ghoghari"
username = "admin"
password = "123"   # Plain password
email = "admiqn@examplde.com"
contactNo = "9865943210"
status = "Active"

# Convert password to bcrypt hash
passwordHash = bcrypt.hashpw(
    password.encode(),
    bcrypt.gensalt()
).decode()

# Insert into database
sql = """
INSERT INTO admin
(fullName, username, passwordHash, email, contactNo, status)
VALUES (%s, %s, %s, %s, %s, %s)
"""

values = (
    fullName,
    username,
    passwordHash,
    email,
    contactNo,
    status
)

cursor.execute(sql, values)

conn.commit()

print("Admin created successfully.")

cursor.close()
conn.close()