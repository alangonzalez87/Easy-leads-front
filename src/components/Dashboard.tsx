import React, { useEffect, useMemo, useState } from "react";
import { UserManagement } from "./UserManagement";
import { StatsCard } from "./StatsCard";
import Header from "./Header";
import { ChartCard } from "./ChartCard";
import RenovacionesProximas from "./RenovacionesProximas";
import { LeadsPage } from "./LeadsPage";
import { AddLeadModal } from "./AddLeadModal";
import ChangePassword from "./ChangePassword";
import Sales from "./Sales.tsx";
import { WhatsAppChat } from "./WhatsAppChat";
import { useLeads } from "../hooks/useLeads";
import { isLeadEnVentana } from "../utils/leads";
import { Loader2, Users, BarChart3, Target, Zap, Clock } from "lucide-react";

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

  const { leads, stats, loading, lastUpdated, refreshData, handleAddLead } = useLeads(
    userData?.id
  );

  useEffect(() => {
    if (userData?.isFirstLogin) {
      setShowAddLead(true);
    }
  }, [userData]);

  const proximasRenovaciones = useMemo(
    () =>
      leads.filter((lead) => isLeadEnVentana(lead.fecha_finalizacion, lead.pipeline_stage)),
    [leads]
  );

  const normalizeDate = (value?: string | null) => {
    if (!value) return null;
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const pendingRenewals = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return leads
      .filter((lead) => (lead.estado || "").toLowerCase() === "activo")
      .filter((lead) => {
        const date = normalizeDate(lead.fecha_finalizacion || (lead as any).finalizaDia);
        if (!date) return false;
        date.setHours(0, 0, 0, 0);
        return date <= today;
      })
      .sort((a, b) => {
        const aDate = normalizeDate(a.fecha_finalizacion || (a as any).finalizaDia)?.getTime() || 0;
        const bDate = normalizeDate(b.fecha_finalizacion || (b as any).finalizaDia)?.getTime() || 0;
        return aDate - bDate;
      });
  }, [leads]);

  const formatDate = (value?: string | null) => {
    const d = normalizeDate(value);
    if (!d) return "Sin fecha";
    return d.toLocaleDateString("es-AR");
  };

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
            <StatsCard title="Leads Activos" value={stats?.leadsActivos || 0} icon={Users} color="blue" />
            <StatsCard title="Total Leads" value={stats?.totalLeads || 0} icon={BarChart3} color="green" />
            <StatsCard title="Pendientes" value={stats?.pendientes || 0} icon={Target} color="yellow" />
            <StatsCard title="Próximas a vencer" value={stats?.proximasRenovaciones || 0} icon={Zap} color="red" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartCard leads={leads} title="Distribución por Tablero" dataKey="tablero" />
            <ChartCard leads={leads} title="Distribución por Estado" dataKey="estado" />
          </div>

          {/* Renovaciones pendientes */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Clock className="h-6 w-6 text-indigo-500 mr-2" />
              Renovaciones pendientes (activos vencidos)
            </h2>
            {pendingRenewals.length === 0 ? (
              <p className="text-gray-600">No hay renovaciones pendientes.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Lead</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Vendedor</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha fin</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRenewals.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                      >
                        <td className="py-3 px-4 font-semibold text-gray-800">{lead.nombre || "Sin nombre"}</td>
                        <td className="py-3 px-4 text-gray-700">{lead.email || "Sin email"}</td>
                        <td className="py-3 px-4 text-gray-700">{lead.vendedor || "Sin vendedor"}</td>
                        <td className="py-3 px-4 text-gray-700">
                          {formatDate(lead.fecha_finalizacion || (lead as any).finalizaDia)}
                        </td>
                        <td className="py-3 px-4 text-gray-700 capitalize">{lead.estado || "activo"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === "leads" ? (
        <LeadsPage />
      ) : activeTab === "sales" ? (
        <Sales />
      ) : activeTab === "renovaciones" ? (
        <div className="max-w-7xl mx-auto px-6 py-8">
          <RenovacionesProximas leads={proximasRenovaciones || []} />
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
        onAddLead={handleAddLead}
        onUploadCSV={() => {}}
      />
    </div>
  );
};
