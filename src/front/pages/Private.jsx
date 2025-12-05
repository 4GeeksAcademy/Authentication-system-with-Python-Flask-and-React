import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"; 

export const Private = () => {
    // Obtenemos el token y el estado del usuario
    const { store } = useGlobalReducer();
    const navigate = useNavigate();
    const [message, setMessage] = useState("Cargando contenido privado...");
    const [loading, setLoading] = useState(true);

    // Endpoint del backend 
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    // Hook que se ejecuta al cargar la página
    useEffect(() => {
        // 1. VALIDACIÓN: Chequear si el token existe
        if (!store.token) {
            // Si no hay token en el store, redirigimos al login
            navigate("/login");
            return; 
        }

        // Si hay token, intentamos acceder a la ruta protegida
        const fetchPrivateData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/private`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        // 2. USO DEL TOKEN: Lo enviamos en el encabezado 'Authorization'
                        "Authorization": `Bearer ${store.token}`
                    }
                });

                const data = await response.json();
                setLoading(false);

                if (response.ok) {
                    // Acceso autorizado, se devuelve 200
                    setMessage(data.msg + " | Usuario: " + data.user.email);
                } else {
                    // Token inválido/expirado, se devuelve 401
                    setMessage(data.msg || "Token inválido o expirado. Redirigiendo a Login.");
                    // Forzamos el logout y la redirección en caso de token expirado
                    // Esto evita que el usuario se quede "pegado" en la página.
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error al obtener datos privados:", error);
                setMessage("Error de red al conectar con el servidor.");
                setLoading(false);
            }
        };

        fetchPrivateData();

    }, [store.token, navigate]); // Dependencias: se ejecuta cuando cambia el token o la navegación

    return (
        <div className="container mt-5 text-center">
            <div className="alert alert-warning">
                **PÁGINA PROTEGIDA**
                <p>Solo los usuarios autenticados pueden ver este contenido.</p>
            </div>
            
            <div className="card shadow p-4">
                <h2>{loading ? "Verificando Credenciales..." : "Mensaje del Servidor"}</h2>
                <hr />
                <p className={`lead ${!loading && message.includes("Autorizado") ? 'text-success' : 'text-danger'}`}>
                    {message}
                </p>
                
                {/* Botón de ejemplo para volver */}
                <button className="btn btn-outline-primary mt-3" onClick={() => navigate("/")}>
                    Volver al Inicio
                </button>
            </div>
        </div>
    );
};