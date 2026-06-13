import { useEffect, useMemo, useState } from "react";
import { supabase } from "../services/supabase";
import { getLeadPipelineStage, isLeadEnVentana } from "../utils/leads";

interface LeadStats {
  totalLeads: number;
  leadsActivos: number;
  pendientes: number;
  proximasRenovaciones: number;
  tableros: number;
}

const normalizeLead = (lead: any) => ({
  ...lead,
  fecha_finalizacion:
    lead.fecha_finalizacion ||
    lead.finalizaDia ||
    lead.finaliza_dia ||
    lead.finaliza ||
    "",
  pipeline_stage: getLeadPipelineStage(lead),
  tiempo: lead.tiempo ? lead.tiempo.toString() : lead.tiempo || "",
});

export const useLeads = (providedUserId?: number | null) => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const token = localStorage.getItem("authToken");
  let tokenUserId: number | null = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      tokenUserId = payload.userId || payload.id;
    } catch (e) {
      console.error("useLeads - token invalido o no decodificable", e);
    }
  }

  const userId = providedUserId ?? tokenUserId;

  const refreshData = async () => {
    setLoading(true);
    setError("");

    try {
      let query = supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const normalized = (data || []).map(normalizeLead);
      setLeads(normalized);
      setLastUpdated(new Date().toLocaleString("es-ES"));
    } catch (err) {
      console.error("useLeads - refreshData error:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [userId]);

  const handleAddLead = async (leadData: any) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("No hay token, inicia sesion de nuevo");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(leadData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Lead agregado con exito");
        setLeads((prev) => [...prev, normalizeLead(data)]);
        setLastUpdated(new Date().toLocaleString("es-ES"));
      } else {
        console.error("Error desde API:", data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error("Error de red o fetch:", err);
      alert("Error al agregar el lead");
    }
  };

  const stats: LeadStats = useMemo(() => {
    const totalLeads = leads.length;
    const leadsActivos = leads.filter((l) => (l.estado || "").toLowerCase() === "activo").length;
    const pendientes = leads.filter((l) => (l.estado || "").toLowerCase() === "pendiente").length;
    const tableros = new Set(
      leads.map((l) => (l.tablero ?? "").toString().trim()).filter(Boolean)
    ).size;
    const proximasRenovaciones = leads.filter((lead) =>
      isLeadEnVentana(lead)
    ).length;

    return { totalLeads, leadsActivos, pendientes, proximasRenovaciones, tableros };
  }, [leads]);

  return { leads, handleAddLead, loading, error, lastUpdated, refreshData, stats };
};
