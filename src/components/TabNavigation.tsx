import React from "react";
import { BarChart3, Users, UserPlus, DollarSign, Settings } from "lucide-react";

type TabId = "dashboard" | "leads" | "add-lead" | "sales" | "users";

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  userRole: "super_admin" | "admin" | "user"; // 👈 ahora acepta admin también
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  userRole,
}) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "leads", label: "Leads", icon: Users },
    { id: "add-lead", label: "Agregar Lead", icon: UserPlus },
    { id: "sales", label: "Ventas", icon: DollarSign },
    ...(userRole === "super_admin" || userRole === "admin"
      ? [{ id: "users", label: "Usuarios", icon: Settings }]
      : []),
  ] as const;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
