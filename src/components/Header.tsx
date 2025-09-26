// src/components/Header.tsx
import React from "react";
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  UserCog, 
  RefreshCw, 
  LogOut, 
  CalendarClock,
  Settings
} from "lucide-react";

type TabId = "dashboard" | "leads" | "sales" | "users" | "renovaciones" | "configuracion";

interface HeaderProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onRefresh: () => void;
  onLogout: () => void;
  userName?: string;
  role?: "super_admin" | "admin" | "user";
  lastUpdated?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onTabChange, 
  onRefresh, 
  onLogout, 
  userName, 
  lastUpdated,
  role = "user" 
}) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, color: "from-blue-500 to-purple-500" },
    { id: "leads", label: "Todos los Leads", icon: Users, color: "from-green-500 to-teal-500" },
    { id: "sales", label: "Ventas", icon: TrendingUp, color: "from-orange-500 to-red-500" },
    { id: "users", label: "Usuarios", icon: UserCog, color: "from-purple-500 to-indigo-500" },
    { id: "renovaciones", label: "Renovaciones", icon: CalendarClock, color: "from-pink-500 to-red-500" }
  ] as const;

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo y saludo */}
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Easy-Leads
          </h1>
          {userName && (
            <p className="text-sm text-gray-600">
              Hola <span className="font-semibold text-blue-600">{userName}</span>
            </p>
          )}
        </div>

        {/* Tabs de navegación */}
        <div className="flex items-center gap-2">
          {tabs
            .filter(tab => {
              if (tab.id === "users") {
                return role === "admin" || role === "super_admin"; // 👈 solo admins ven el tab
              }
              return true;
            })
            .map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => onTabChange(id as TabId)}
                className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 ${
                  activeTab === id
                    ? `bg-gradient-to-r ${color} text-white shadow-lg`
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange("configuracion")}
             className="p-7 rounded-xl hover:bg-gray-100 text-blue-900"
             title="Configuración"
          >
            <Settings size={18} />
            
          </button>

          <button
            onClick={onRefresh}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            title="Actualizar"
          >
            <RefreshCw className="h-5 w-5" />
          </button>

          <button
            onClick={onLogout}
            className="p-2 rounded-lg hover:bg-red-100 text-red-600"
            title="Cerrar sesión"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
