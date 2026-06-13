import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import ChangePassword from "./components/ChangePassword";
import { Dashboard } from "./components/Dashboard";
import {
  clearStoredSession,
  getStoredAccessToken,
  getTokenRefreshDelay,
  getValidAccessToken,
  refreshAccessToken,
} from "./services/auth";

const BYPASS_AUTH_FOR_LOCAL_DEV = false;
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

  const checkCurrentSession = async () => {
    try {
      const token = await getValidAccessToken();
      const storedAuthUser = localStorage.getItem("authUser");
      const storedUserProfile = localStorage.getItem("userProfile");

      if (token && storedAuthUser && storedUserProfile) {
        const parsedProfile = JSON.parse(storedUserProfile);
        setAuthUser(JSON.parse(storedAuthUser));
        setUserProfile(parsedProfile);
        setIsLoggedIn(true);
        setNeedsPasswordChange(parsedProfile.is_first_login || false);
      } else {
        clearStoredSession();
      }
    } catch (error) {
      console.error("Error checking session:", error);
      clearStoredSession();
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (!isLoggedIn || BYPASS_AUTH_FOR_LOCAL_DEV) return;

    let refreshTimer: number | undefined;

    const refreshWhenActive = async () => {
      if (document.visibilityState !== "visible") return;
      const token = await getValidAccessToken();
      if (token) scheduleRefresh(token);
    };

    const scheduleRefresh = (token: string) => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(async () => {
        const refreshedToken = await refreshAccessToken();
        if (refreshedToken) {
          scheduleRefresh(refreshedToken);
        } else {
          refreshTimer = window.setTimeout(refreshWhenActive, 60 * 1000);
        }
      }, getTokenRefreshDelay(token));
    };

    const token = getStoredAccessToken();
    if (token) scheduleRefresh(token);
    window.addEventListener("focus", refreshWhenActive);
    document.addEventListener("visibilitychange", refreshWhenActive);

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("focus", refreshWhenActive);
      document.removeEventListener("visibilitychange", refreshWhenActive);
    };
  }, [isLoggedIn]);

  const handleLogin = (loginData: { authUser: any; userProfile: any; session: any }) => {
    if (!loginData.userProfile) return;

    localStorage.setItem("authToken", loginData.session.token);
    localStorage.setItem("authUser", JSON.stringify(loginData.authUser));
    localStorage.setItem("userProfile", JSON.stringify(loginData.userProfile));
    setAuthUser(loginData.authUser);
    setUserProfile(loginData.userProfile);
    setIsLoggedIn(true);
    setNeedsPasswordChange(loginData.userProfile.is_first_login);
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
    if (BYPASS_AUTH_FOR_LOCAL_DEV) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      clearStoredSession();
      setAuthUser(null);
      setUserProfile(null);
      setIsLoggedIn(false);
      setNeedsPasswordChange(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  if (needsPasswordChange && userProfile) {
    return <ChangePassword onPasswordChanged={handlePasswordChanged} />;
  }

  return (
    <Dashboard
      userData={{ ...authUser, ...userProfile }}
      onLogout={handleLogout}
    />
  );
}
