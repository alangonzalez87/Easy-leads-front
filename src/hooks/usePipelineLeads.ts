import { useState, useEffect } from "react";
import { Lead } from "../types";
import {
  getLeadPipelineStage,
  isFinalPipelineStageVisible,
  isLeadEnVentana,
  markLeadPipelineStageChanged,
  safeStage,
} from "../utils/leads";
import { supabase } from "../services/supabase"; 

export const usePipelineLeads = (leads: Lead[]) => {
  console.log("usePipelineLeads - leads input:", leads);
  const [columns, setColumns] = useState<Record<string, Lead[]>>({
    leads: [],
    por_contactar: [],
    contactado: [],
    renovo: [],
    inactivo: [],
  });


  useEffect(() => {
    const grouped: Record<string, Lead[]> = {
      leads: [],
      por_contactar: [],
      contactado: [],
      renovo: [],
      inactivo: [],
    };

    (leads || []).forEach((lead) => {
      const stage = getLeadPipelineStage(lead);
      if (!isFinalPipelineStageVisible(lead)) {
        if (stage === "renovo") {
          grouped.leads.push({ ...lead, pipeline_stage: "leads" });
        }
        return;
      }
      grouped[stage].push(lead);
    });

    setColumns(grouped);
    
  }, [leads]);

  useEffect(() => {
    const intervalId = window.setInterval(
      () => setColumns((current) => {
        const renewalsReturningToLeads = current.renovo
          .filter((lead) => !isFinalPipelineStageVisible(lead) && isLeadEnVentana(lead))
          .map((lead) => ({ ...lead, pipeline_stage: "leads" as const }));

        return {
          ...current,
          leads: [...current.leads, ...renewalsReturningToLeads],
          renovo: current.renovo.filter(isFinalPipelineStageVisible),
          inactivo: current.inactivo.filter(isFinalPipelineStageVisible),
        };
      }),
      60 * 1000
    );
    return () => window.clearInterval(intervalId);
  }, []);

  // Actualizar etapa de lead (y en base de datos)
  const updateLeadStage = async (
    lead: Lead,
    newStage: string,
    extra: any = {}
  ): Promise<Lead> => {
    // Preparar payload para actualizar en DB
    const payload: any = { pipeline_stage: newStage, ...extra };

    // Actualización de estado específica
    if (newStage === "inactivo") {
      payload.estado = "Inactivo";
      payload.fecha_inactivacion = new Date().toISOString().split("T")[0];
    }
    if (newStage === "renovo") {
      payload.estado = "Activo";
    }

    try {
      const { data, error } = await supabase
        .from("leads")
        .update(payload)
        .eq("id", lead.id)
        .select();

      if (error) {
        console.error("Error actualizando lead:", error);
        // Devuelve el lead original si hay error
        return lead;
      }
      if (data && Array.isArray(data) && data.length > 0) {
        markLeadPipelineStageChanged(lead.id, safeStage(newStage));
        return data[0];
      } else {
      // Si no viene, devolvé el lead local actualizado
        markLeadPipelineStageChanged(lead.id, safeStage(newStage));
        return { ...lead, ...payload };
      }
    } catch (err) {
      console.error("Error inesperado al actualizar lead:", err);
      return lead;
    }
  };

  // Mover lead visualmente entre columnas
  const moveLeadBetweenColumns = (
    lead: Lead,
    from: string,
    to: string,
    updatedLead: Lead
  ) => {
    setColumns((prev) => {
      const updated = { ...prev };
      updated[from] = prev[from].filter((l) => l.id !== lead.id);
      updated[to] = [...prev[to], updatedLead];
      return updated;
    });
  };

  return {
    columns,
    updateLeadStage,
    moveLeadBetweenColumns,
    setColumns, // por si necesitás actualizar manualmente desde fuera
  };
};
