import React, { useState, useEffect } from "react";
import { UserManagement } from "./UserManagement";
import { StatsCard } from "./StatsCard";
import Header from "./Header";
import { ChartCard } from "./ChartCard";
import RenovacionesProximas from "../components/RenovacionesProximas";
import { LeadsPage } from "./LeadsPage";
import { AddLeadModal } from "./AddLeadModal"; 
import ChangePassword from "./ChangePassword";
import { Sales } from "./sales";
import { WhatsAppChat } from "./WhatsAppChat";
import { useLeads } from "../hooks/useLeads";
import { Loader2, Users, BarChart3, Target, Zap } from "lucide-react";

interface User {
  id: number; 
  username: string;
  displayName: string;
  role: "super_admin" | "admin" | "user";
  isFirstLogin: boolean;
  dashboardConfig?: any;
}

interface DashboardProps {
  userData: User | null;
  onLogout: () => void;
}

type TabId = "dashboard" | "leads" | "sales" | "renovaciones" | "users" | "configuracion";

export const Dashboard: React.FC<DashboardProps> = ({ userData, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [showAddLead, setShowAddLead] = useState(false);

  const {
    leads,
    proximasRenovaciones,
    stats,
    loading,
    lastUpdated,
    refreshData,
  } = useLeads(userData?.id);

  useEffect(() => {
    if (userData?.isFirstLogin) {
      setShowAddLead(true);
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={refreshData}
        onLogout={onLogout}
        userName={userData?.displayName}
        role={userData?.role}
        lastUpdated={lastUpdated}
      /> 

      {/* Contenido */}
      {activeTab === "dashboard" ? (
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Leads Activos" value={stats.leadsActivos} icon={Users} color="blue" />
            <StatsCard title="Total Leads" value={stats.totalLeads} icon={BarChart3} color="green" />
            <StatsCard title="Pendientes" value={stats.pendientes} icon={Target} color="yellow" />
            <StatsCard title="Próximas a vencer" value={stats.proximasRenovaciones} icon={Zap} color="red" />
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartCard leads={leads} title="Distribución por Tablero" dataKey="tablero" />
            <ChartCard leads={leads} title="Distribución por Estado" dataKey="estado" />
          </div>
        </div>
      ) : activeTab === "leads" ? (
        <LeadsPage leads={leads} />
      ) : activeTab === "sales" ? (
        <Sales />
      ) : activeTab === "renovaciones" ? (
        <div className="max-w-7xl mx-auto px-6 py-8">        
          <RenovacionesProximas leads={proximasRenovaciones} />
        </div>
      ) : activeTab === "users" ? (
        <UserManagement currentUser={userData!} />      
      ) : activeTab === "configuracion" ? (
        <div className="max-w-2xl mx-auto px-6 py-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Configuración de cuenta</h2>
          <ChangePassword onPasswordChanged={() => {}} />
        </div>
      ) : null}

      {/* Chat de WhatsApp */}
      <WhatsAppChat />

      {/* Modal para agregar un nuevo lead */}
      <AddLeadModal
        isOpen={showAddLead}
        onClose={() => setShowAddLead(false)}
        onAddLead={() => {}}
        onUploadCSV={() => {}}
      />
    </div>
  );
};
