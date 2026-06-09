import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import ChangePassword from "./components/ChangePassword";
import { Dashboard } from "./components/Dashboard";

const BYPASS_AUTH_FOR_LOCAL_DEV = true;
const DEV_USER = {
  username: "dev",
  displayName: "Easy Leads Dev",
  role: "super_admin" as const,
  isFirstLogin: false,
};

export default function App() {
  const [authUser, setAuthUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (BYPASS_AUTH_FOR_LOCAL_DEV) {
      setAuthUser(DEV_USER);
      setUserProfile(DEV_USER);
      setIsLoggedIn(true);
      setNeedsPasswordChange(false);
      setLoading(false);
      return;
    }

    checkCurrentSession();
  }, []);

  const checkCurrentSession = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const storedAuthUser = localStorage.getItem("authUser");
      const storedUserProfile = localStorage.getItem("userProfile");

      if (token && storedAuthUser && storedUserProfile) {
        // Restaurar desde localStorage
        const parsedProfile = JSON.parse(storedUserProfile);
       

        setAuthUser(JSON.parse(storedAuthUser));
        setUserProfile(parsedProfile);
        setIsLoggedIn(true);
        setNeedsPasswordChange(parsedProfile.is_first_login || false);
      }

      if (token) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/session`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("🟣 checkCurrentSession → data:", data);

          setAuthUser(data.authUser);
          setUserProfile(data.userProfile);
          setIsLoggedIn(true);
          setNeedsPasswordChange(data.userProfile?.is_first_login || false);

          localStorage.setItem("authUser", JSON.stringify(data.authUser));
          localStorage.setItem("userProfile", JSON.stringify(data.userProfile));
        } else {
          setError("No se pudo verificar la sesión.");
        }
      }
    } catch (error) {
      console.error("Error checking session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (loginData: { authUser: any; userProfile: any; session: any }) => {
    
    try {
      if (loginData.userProfile) {
        // Guardamos token y perfiles
        localStorage.setItem("authToken", loginData.session.token);
        localStorage.setItem("authUser", JSON.stringify(loginData.authUser));
        localStorage.setItem("userProfile", JSON.stringify(loginData.userProfile));

        // Actualizamos estados
        setAuthUser(loginData.authUser);
        setUserProfile(loginData.userProfile);
        setIsLoggedIn(true);
        setNeedsPasswordChange(loginData.userProfile.is_first_login);

        
      } else {
        setError("Error: No se encontraron datos del usuario.");
      }
    } catch (err) {
      setError("Error al intentar iniciar sesión");
    }
  };

  const handlePasswordChanged = () => {
    setNeedsPasswordChange(false);
    if (userProfile) {
      const updatedProfile = { ...userProfile, is_first_login: false };
      setUserProfile(updatedProfile);
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    }
  };

  const handleLogout = async () => {
    if (BYPASS_AUTH_FOR_LOCAL_DEV) {
      setAuthUser(DEV_USER);
      setUserProfile(DEV_USER);
      setIsLoggedIn(true);
      setNeedsPasswordChange(false);
      return;
    }

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      localStorage.removeItem("authToken");
      setAuthUser(null);
      setUserProfile(null);
      setIsLoggedIn(false);
      setNeedsPasswordChange(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

if (needsPasswordChange && userProfile) {
  
  return (
    <ChangePassword onPasswordChanged={handlePasswordChanged} />
  );
}
 return (
    <Dashboard
      userData={{
        ...authUser,
        ...userProfile,
      }}
      onLogout={handleLogout}
    />
  );
}
