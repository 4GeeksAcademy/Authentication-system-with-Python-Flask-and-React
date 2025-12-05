import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"; // para acceder a dispatch

export const Login = () => {
    // Estados del form y msgs
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    // navegación y estado global
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();

    // Funciones para manejo de form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const BASE_URL = import.meta.env.VITE_BACKEND_URL;

        try {
            const response = await fetch(`${BASE_URL}/api/login`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json()

            if (!response.ok) {
                setError(data.msg || "Error al iniciar sesión. Verifica tus credenciales.");
                return;
            }
            // Lógica de autenticación
            // Guardar token en estado global
            dispatch({
                type: 'login',
                payload: data.token
            });
            // Redige al usuario a la pagina privada
            navigate("/private");

        } catch (err) {
            console.error("Error de red:", err);
            setError("Error de conexión con el servidor.");
        }
    };
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h1 className="text-center mb-4">Iniciar Sesión</h1>
                    
                    {/* Mensaje de error */}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {/* Formulario */}
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
                        <button type="submit" className="btn btn-success w-100">
                            Acceder
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};