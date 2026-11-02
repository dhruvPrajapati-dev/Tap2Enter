from flask import Flask, jsonify
from flask_cors import CORS # type: ignore
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from datetime import timedelta
import os


from routes.master.dashboard_card import dashboard_bp
from routes.master.user_management import user_management_bp
from routes.master.visitor import visitor_bp
from routes.master.logs import logs_bp
from routes.master.reports import reports_bp
from routes.master.users import users_bp
from routes.master.user_wise_report import user_wise_report_bp
from routes.master.setting import settings_bp

# Load Environment Variableste


load_dotenv()


# Create Flask App


app = Flask(__name__)


# CORS


CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True
)


# JWT Configuration


jwt_key = os.getenv("JWT_SECRET_KEY")

if not jwt_key:
    raise Exception("JWT_SECRET_KEY not found in .env")

app.config["JWT_SECRET_KEY"] = jwt_key

app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)

jwt = JWTManager(app)


# Import Blueprints


from routes.admin.login import admin_login_bp
from routes.user.login import user_bp

# Register Blueprints


app.register_blueprint(admin_login_bp)

app.register_blueprint(user_bp)
#add-system api


from routes.admin.add_system import add_system_bp
app.register_blueprint(add_system_bp)


## Add User API
from routes.system.add_user import master_bp

app.register_blueprint(master_bp)
# Home


@app.route("/", methods=["GET"])
def home():

    return jsonify({

        "success": True,

        "project": "Tap2Enter",

        "version": "1.0",

        "status": "Backend Running"

    })


# Health Check


@app.route("/health", methods=["GET"])
def health():

    return jsonify({

        "success": True,

        "status": "OK"

    })


# JWT Error Handlers


@jwt.unauthorized_loader
def unauthorized(error):

    return jsonify({

        "success": False,

        "message": "Authorization Token Missing"

    }), 401


@jwt.invalid_token_loader
def invalid(error):

    return jsonify({

        "success": False,

        "message": "Invalid Token"

    }), 401


@jwt.expired_token_loader
def expired(jwt_header, jwt_payload):

    return jsonify({

        "success": False,

        "message": "Token Expired"

    }), 401


@jwt.revoked_token_loader
def revoked(jwt_header, jwt_payload):

    return jsonify({

        "success": False,

        "message": "Token Revoked"

    }), 401



# Error Handlers


@app.errorhandler(404)
def page_not_found(error):

    return jsonify({

        "success": False,

        "message": "API Not Found"

    }), 404


@app.errorhandler(500)
def internal_server(error):

    return jsonify({

        "success": False,

        "message": "Internal Server Error"

    }), 500

from routes.public.attendance import attendance_bp

app.register_blueprint(attendance_bp)

#visitor attendance api
from routes.public.visitor_attendance import visitor_attendance

app.register_blueprint(visitor_attendance)


app.register_blueprint(dashboard_bp)
app.register_blueprint(user_management_bp)
app.register_blueprint(visitor_bp)
app.register_blueprint(logs_bp)
app.register_blueprint(reports_bp)
app.register_blueprint(users_bp)
app.register_blueprint(user_wise_report_bp)
app.register_blueprint(settings_bp)

#test api



# Start Server

if __name__ == "__main__":

    print("_" * 45)
    print(" Tap2Enter Backend Started")
    print(" http://127.0.0.1:5000")
    print("_" * 45)

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )