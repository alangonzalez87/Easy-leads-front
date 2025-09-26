import { useState, useEffect, useMemo } from 'react';
import { Lead, FilterState, DashboardStats } from '../types';
import { supabase } from "../services/supabase";
import { isWithinInterval, subDays, addDays } from 'date-fns';

const DIAS_PASADOS = 5;
const DIAS_ADELANTE = 5;

function isLeadEnVentana(fecha_finalizacion?: string | null) {
  if (!fecha_finalizacion) return false;
  const fecha = new Date(fecha_finalizacion);
  const hoy = new Date();
  const enVentana = isWithinInterval(fecha, {
    start: subDays(hoy, DIAS_PASADOS),
    end: addDays(hoy, DIAS_ADELANTE),
  });
  return enVentana;
}

export const useLeads = (userId?: number) => {
  

  const [leads, setLeads] = useState<Lead[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    tablero: '',
    vendedor: '',
    estado: ''
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string>('');
 

  const refreshData = async () => {
    console.log("🔄 refreshData ejecutado con userId:", userId);
    if (!userId) {
      console.log("⛔ No hay userId, se cancela fetch");
      return;
    }

    setLoading(true);
    setError('');

    try {
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId);
        console.log("🟢 Leads crudos de Supabase:", data);

      if (error) {
        console.error("❌ Error recibido desde Supabase:", error);
        throw error;
      }

      
      setLeads(data as Lead[]);
      setLastUpdated(new Date().toLocaleString('es-ES'));
    } catch (err) {
      
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setLeads([]);
    } finally {
      setLoading(false);
      
    }
  };

  useEffect(() => {
    
    if (userId) {
      refreshData();
    } else {
      console.log("⛔ No hay userId en useEffect, setLoading(false)");
      setLoading(false);
    }
  }, [userId]);

  const filteredLeads = useMemo(() => {
    const resultado = leads.filter(lead => {
      if (filters.tablero && lead.tablero !== filters.tablero) return false;
      if (filters.vendedor && lead.vendedor !== filters.vendedor) return false;
      if (filters.estado && lead.estado !== filters.estado) return false;
      return true;
    });
    
    return resultado;
  }, [leads, filters]);

  const leadsActivos = useMemo(() => {
    const activos = filteredLeads.filter(lead => lead.estado === 'activo');
    
    return activos;
  }, [filteredLeads]);


  const proximasRenovaciones = useMemo(() => {
    const renovaciones = leads.filter(lead => isLeadEnVentana(lead.fecha_finalizacion));
    
    return renovaciones;
  }, [leads]);

 const stats: DashboardStats = useMemo(() => {
  const norm = (v?: string | null) => (v ?? "").trim().toLowerCase();

  const activos    = leads.filter((l) => norm(l.estado) === "activo").length;
  const pendientes = leads.filter((l) => norm(l.estado) === "pendiente").length;
  const inactivos  = leads.filter((l) => norm(l.estado) === "inactivo").length;

  const uniqueTableros = new Set(leads.map((lead) => lead.tablero));

  return {
    totalLeads: leads.length,
    leadsActivos: activos,
    pendientes,                     // ahora existe explícito
    inactivos,                      // opcional, por si querés mostrarlo
    proximasRenovaciones: proximasRenovaciones.length,
    tableros: uniqueTableros.size,
  };
}, [leads, proximasRenovaciones]);
 

  return {
    leads,
    proximasRenovaciones,
    stats,
    loading,
    error,
    lastUpdated,
    refreshData,
  };
};
