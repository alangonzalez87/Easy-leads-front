import React from "react";
import { Calendar } from "lucide-react";
import { Lead } from "../types";

interface MiniLeadCardProps {
  lead: Lead;
  onDoubleClick?: (lead: Lead) => void;
}

// Colores dinámicos por pipeline_stage
const stageColors: Record<string, string> = {
  leads: "bg-gray-500",
  por_contactar: "bg-blue-500",
  contactado: "bg-amber-500",
  renovo: "bg-emerald-500",
  inactivo: "bg-rose-500",
};

// Helper para formatear fecha sin desfase
const formatDate = (date: string) => {
  if (!date) return "Sin fecha";
  const parsed = new Date(date + "T00:00:00");
  if (isNaN(parsed.getTime())) return "Fecha no válida";
  return parsed.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const MiniCard: React.FC<MiniLeadCardProps> = ({
  lead,
  onDoubleClick,
}) => {
  return (
    <div
      onDoubleClick={() => onDoubleClick?.(lead)}
      className="relative rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition cursor-pointer"
    >
      {/* Barra lateral de color */}
      <div
        className={`absolute left-0 top-0 h-full w-2 rounded-l-xl ${
          stageColors[lead.pipeline_stage || "leads"]
        }`}
      />

      <div className="relative z-10 flex flex-col justify-center h-full">
        {/* Tablero arriba a la derecha */}
        {lead.tablero && (
          <span className="absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full bg-blue-600 text-white shadow">
            {lead.tablero}
          </span>
        )}

        {/* Nombre */}
        <div className="text-base font-semibold text-gray-900 truncate mb-2">
          {lead.nombre || "Sin nombre"}
        </div>

        {/* Fecha de finalización */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-medium text-gray-700">
            {lead.fecha_finalizacion
              ? formatDate(lead.fecha_finalizacion)
              : "Sin fecha"}
          </span>
        </div>
      </div>
    </div>
  );
};
