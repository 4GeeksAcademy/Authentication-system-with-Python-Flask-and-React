import pytest
from werkzeug.security import generate_password_hash, check_password_hash
from .models import User, db
from flask import Flask

@pytest.fixture
def app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)
    with app.app_context():
        db.create_all()
        yield app

def test_password_hashing(app):
    with app.app_context():
        # Crear usuario y setear contraseña
        user = User(email="test@example.com", is_active=True)
        user.set_password("secret123")

        # Guardar en DB
        db.session.add(user)
        db.session.commit()

        # Recuperar usuario
        u = User.query.filter_by(email="test@example.com").first()
        assert u is not None

        # Verificar que el hash no es igual al texto plano
        assert u.password_hash != "secret123"

        # Verificar que check_password funciona
        assert u.check_password("secret123") is True
        assert u.check_password("wrongpass") is False
