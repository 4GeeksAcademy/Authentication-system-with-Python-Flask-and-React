import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    // Estados del formulario
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // hook para la navegación
    const navigate = useNavigate();

    // Manejo del form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Definir URL de backend
        const BASE_URL = import.meta.env.VITE_BACKEND_URL;

        try {
            const response = await fetch(`${BASE_URL}/api/signup`, {
                method: "POST",
                headers: {
                    "content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                // Si flask devuelve 409, usuario existe
                setError(data.msg || "Error desconocido al registrar");
                return;
            }
            setSuccess(true); // Flask devuelve 201

            // Redirigir al usuario al inicio de sesión
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            console.error("Error de red:", err);
            setError("Error de conexión con el servidor");
        };
    };
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h1 className="text-center mb-4">Registro de Usuario</h1>

                    {/* Mensajes de exito o error */}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {error && <div className="alert alert-success">Registro exitoso...</div>}

                    {/* Formulario*/}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="emailInput" className="form-label">Correo Electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                id="emailInput"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="passwordInput" className="form-label">Contraseña</label>
                            <input 
                                type="password"
                                className="form-control"
                                id="passwordInput"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Registar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};