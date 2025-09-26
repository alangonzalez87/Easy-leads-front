import React from 'react';
import { Lead } from '../types';
import {
  User, Mail, Phone, Calendar, Clock, Star,
  Edit3, Trash2, UserRoundPen, UserX
} from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  isNearExpiry?: boolean;
  context?: "renovaciones" | "leadsPage";
  onEdit?: (lead: Lead) => void;
  onDelete?: (id: number) => void;
  onRenovo?: (lead: Lead) => void;
  onInactivo?: (id: number) => void;
}

// ---- Helpers ----
const formatDate = (date: string) => {
  if (!date) return "Sin fecha";
  const parsed = new Date(date + "T00:00:00"); // evita desfase UTC
  if (isNaN(parsed.getTime())) return "Fecha no válida";
  return parsed.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusColor = (estado: string) => {
  const m: Record<string, string> = {
    "Activo": "bg-green-100 text-green-800 border-green-200",
    "Pendiente": "bg-orange-100 text-orange-800 border-orange-200",
    "Finalizado": "bg-gray-100 text-gray-800 border-gray-200",
    "Cancelado": "bg-red-100 text-red-800 border-red-200",
    "Inactivo": "bg-rose-100 text-rose-800 border-rose-200",
  };
  return m[estado] || "bg-blue-100 text-blue-800 border-blue-200";
};

const getTableroColor = (tablero: number) => {
  const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500"];
  return colors[(tablero - 1) % colors.length] || "bg-gray-500";
};

// ---- Component ----
export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  isNearExpiry,
  context,
  onEdit,
  onDelete,
  onRenovo,
  onInactivo,
}) => {
  return (
    <div
      className={`relative group bg-white rounded-xl shadow-md p-4 border-l-4 transition-all hover:shadow-lg`}
    >
      {/* Barra lateral de color por tablero */}
      <div
        className={`absolute left-0 top-0 h-full w-2 rounded-l-xl ${getTableroColor(
          lead.tablero
        )}`}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-800 text-base">
            {lead.nombre || "Sin nombre"}
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold shadow ${getStatusColor(
              lead.estado
            )}`}
          >
            {lead.estado}
          </span>
          <span
            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-white text-xs font-bold shadow ${getTableroColor(
              lead.tablero
            )}`}
          >
            {lead.tablero}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-center space-x-2">
          <div className="bg-green-100 p-2 rounded-lg">
            <Mail className="h-4 w-4 text-green-600" />
          </div>
          <span className="truncate">{lead.email}</span>
        </div>

        {lead.tel && (
          <div className="flex items-center space-x-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Phone className="h-4 w-4 text-purple-600" />
            </div>
            <span>{lead.tel}</span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Clock className="h-4 w-4 text-orange-600" />
          </div>
          <span>Tiempo: {lead.tiempo}</span>
        </div>

        {lead.fecha_finalizacion && (
          <div className="flex items-center space-x-2">
            <div
              className={`p-2 rounded-lg ${
                isNearExpiry ? "bg-red-100" : "bg-indigo-100"
              }`}
            >
              <Calendar
                className={`h-4 w-4 ${
                  isNearExpiry ? "text-red-600" : "text-indigo-600"
                }`}
              />
            </div>
            <span
              className={`font-medium ${
                isNearExpiry ? "text-red-600 font-bold" : ""
              }`}
            >
              Finaliza: {formatDate(lead.fecha_finalizacion)}
            </span>
          </div>
        )}

        {lead.vendedor && (
          <div className="flex items-center space-x-2">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Star className="h-4 w-4 text-yellow-600" />
            </div>
            <span>Vendedor: {lead.vendedor}</span>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="absolute bottom-3 right-3 flex gap-2">
        {/* Botones visibles solo con hover */}
        {context === "leadsPage" && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={() => onEdit?.(lead)}
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
              title="Editar"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete?.(lead.id)}
              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {context === "renovaciones" && (
          <>
            <div className="opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => onRenovo?.(lead)}
                className="p-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                title="Renovó"
              >
                <UserRoundPen className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => onInactivo?.(lead.id)}
              className="p-2 rounded-full bg-rose-600 text-white hover:bg-rose-700"
              title="Inactivo"
            >
              <UserX className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
