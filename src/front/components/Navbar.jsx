import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
	// Obtener el estado y dispatch
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	// cerrar sesión
	const handleLogout = () => {
		dispatch({ type: 'logout' }); // Llama a logout que limpia token y sesión
		navigate('/login') // redirigir a la página login
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">JWT Authentication</span>
				</Link>
				<div className="ml-auto">

					{/* Mostrar login o Logout */}
					{store.token ? (
						// Si hay token, el usuario está logueado
						<>
							<Link to="/private" className="me-3">
								<button className="btn btn-warning" onClick={handleLogout}>
									Área privada
								</button>
							</Link>
							<button className="btn btn-danger" onClick={handleLogout}>
								Cerrar Sesión
							</button>
						</>
					) : (

						// Si no hay token el usuario no está logueado
						<>
							<Link to="/signup" className="me-3">
								<button className="btn btn-secondary">Registro</button>
							</Link>
							<Link to="/login">
								<button className="btn btn-success">Iniciar sesión</button>
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
}

