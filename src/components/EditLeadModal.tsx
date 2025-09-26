import React from "react";
import { X, UserX } from "lucide-react";
import { AddLeadForm } from "./AddLeadForm";

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => void;
  leadToEdit: any; // lead actual a editar
  onInactivar?: (id: number) => void; // 🔹 opcional: pasar lead a inactivo directo
}

export const EditLeadModal: React.FC<EditLeadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  leadToEdit,
  onInactivar,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">✏️ Editar Lead</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-rose-700 p-5 hover:bg-rose-50 rounded-xl transition-all duration-300"
          >
            <X className="h-7 w-7" />
          </button>
        </div>

        {/* Form con datos iniciales */}
        <AddLeadForm
          initialData={leadToEdit}
          onCancel={onClose}
          onSave={(formData) => {
            onSave(formData);
            onClose();
          }}
        />
      </div>
    </div>
  );
};
