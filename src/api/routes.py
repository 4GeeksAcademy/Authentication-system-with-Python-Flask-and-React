"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import datetime



api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

####### Rutas de la API #########
## Signup

@api.route("/signup", methods=["POST"])
def signup():
    # Capturar los datos para registrar al usuario

    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    # Validar datos recibidos

    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "El usuario ya existe"}), 409

    # Crear usuario y setear contraseña 

    user = User(email=email, is_active=True)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado. Redirige a /login"}), 201

## Login
@api.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"msg": "Credenciales inválidas"}), 401
    
    # Crear token de acceso y expiración
    expires = datetime.timedelta(days=1)
    access_token = create_access_token(identity=str(user.id), expires_delta=expires)

    datos = {
        "access_token": access_token,
        "user": user.serialize()
    }

    return jsonify({"datos": datos}), 200


## Private
@api.route("/private", methods=["GET"])
@jwt_required() # Para proteger la ruta
def private():
    # El ID del usuario actual se obtiene automáticamente del token JWT
    user_id = get_jwt_identity()
    # Busca el usuario para obtener su email
    user = User.query.get(user_id)
    return jsonify({"msg": "Acceso autorizado", "user": user.serialize()}), 200
