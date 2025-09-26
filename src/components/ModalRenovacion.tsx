import React, { useState } from "react";
import { X, Calendar, Clock } from "lucide-react";
import { Lead } from "../types";

interface ModalRenovacionProps {
  lead: Lead;
  onClose: () => void;
  onConfirm: (dias: number) => void;
}

export const ModalRenovacion: React.FC<ModalRenovacionProps> = ({
  lead,
  onClose,
  onConfirm,
}) => {
  const [dias, setDias] = useState<number>(30);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            Renovar Lead
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Lead info */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">Cliente:</p>
          <p className="text-base font-semibold text-gray-900">
            {lead.nombre || "Sin nombre"}
          </p>
          <p className="text-sm text-gray-500">{lead.email}</p>
        </div>

        {/* Select tiempo */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Selecciona la nueva duración
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setDias(30)}
              className={`px-3 py-2 rounded-lg border flex items-center justify-center gap-2 text-sm font-medium ${
                dias === 30
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              1 mes
            </button>
            <button
              onClick={() => setDias(90)}
              className={`px-3 py-2 rounded-lg border flex items-center justify-center gap-2 text-sm font-medium ${
                dias === 90
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              3 meses
            </button>
            <button
              onClick={() => setDias(365)}
              className={`px-3 py-2 rounded-lg border flex items-center justify-center gap-2 text-sm font-medium ${
                dias === 365
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              1 año
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(dias)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-90 transition-colors flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
