export const initialStore=()=>{

  // 1. intentar acceder al token y el usuario de la sesion al cargar la app
  const token = sessionStorage.getItem("jwt-token");
  const user = sessionStorage.getItem("user");

  return {
    token: token || null, // Guardo token
    user: user ? JSON.parse(user) : null // Guardamos la info del usuario 

  }
}

export default function storeReducer(store, action = {}) {

  switch(action.type){
    case 'login':
      // 2. Guardo token y el usuario en la sesión del navegador
      sessionStorage.setItem("jwt-token", action.payload.token);
      sessionStorage.setItem("user", JSON.stringify(action.payload.user));

      return {
        ...store,
        token: action.payload.token,
        user: action.payload.user,
        message: "Inicio de sesión exitoso"
      };

    case 'logout':
      // 3. Eliminar token de la sesión del navegador
      sessionStorage.removeItem("jwt-token");
      sessionStorage.removeItem("user");
      return {
        ...store,
        token: null,
        user: null,
        message: "Has cerrado sesión correctamente"
      }
    
    case 'error': // para manejar errores y limpiar el payload
      return {...store, message: action.payload.message || null};
    default:
      return store;
  }    
}