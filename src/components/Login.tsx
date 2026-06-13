import { useState } from "react";
import {jwtDecode} from "jwt-decode";
import imagen1 from '../assets/imagen1.svg';

interface LoginProps {
  onLogin: (loginData: { authUser: any; userProfile: any; session: any }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false); 

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {

      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log("🔹 [Login] Respuesta backend:", data);

    if (!response.ok) {
      setError(data.error || "Usuario o contraseña incorrectos");
      return;
    }

    // Guardamos token
    localStorage.setItem("authToken", data.token);

    // Decodificamos para tener otra fuente del id
    const decoded: any = jwtDecode(data.token);
    console.log("🔹 [Login] Token decodificado:", decoded);

    // Mapeamos bien lo que espera App.tsx
    const authUser = {
      id: decoded?.id, // <- viene del token
      username: data.userProfile?.username,
      displayName: data.userProfile?.display_name,
      role: data.userProfile?.role,
    };

    const userProfile = {
      id: data.userProfile?.id, // <- VIENE DEL BACK
      username: data.userProfile?.username,
      display_name: data.userProfile?.display_name,
      role: data.userProfile?.role,
      is_first_login: data.userProfile?.is_first_login,
    };

    console.log("🔹 [Login] authUser:", authUser);
    console.log("🔹 [Login] userProfile:", userProfile);

    onLogin({
    authUser,
    userProfile,
    session: data, // 👈 guardamos TODO lo que devolvió el backend
  });

  } catch (err) {
    console.error("❌ [Login] Error:", err);
    setError("Error al intentar iniciar sesión");
  }
};




  return (
    <div className="flex h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-teal-500">
      {/* Lado izquierdo (Formulario de Login) */}
      <div className="w-1/2 flex justify-center items-center p- border-gray-700">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-semibold text-white mb-4 text-center">Easy-Leads</h1>
          <h2 className="text-xl font-medium text-gray-100 mb-6 text-center">¡Bienvenido!</h2>

          {/* Formulario de Login */}
          <form className="w-full space-y-4" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                id="rememberMe"
                className="rounded-md"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-300">Recordarme</label>
            </div>
            <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-md">Entrar</button>
          </form>

          {/* Mensaje de error si no puede loguear */}
          {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

          {/* Cartel debajo del botón con texto negro */}
          <p className="mt-4 text-sm text-black text-center">
            ⚠️ Al iniciar sesión por primera vez, le pedirá cargar un archivo CSV con las siguientes columnas obligatorias:
            <br />
            <strong>Email</strong>, <strong>Tiempo</strong> y <strong>Fecha de Finalización</strong>.
          </p>
        </div>
      </div>

      {/* Lado derecho (Imagen sin borde blanco) */}
      <div className="w-1/2 flex justify-center items-center">
        <img src={imagen1} alt="Imagen Candado" className="w-3/4 h-auto object-contain" />
      </div>
    </div>
  );
}
