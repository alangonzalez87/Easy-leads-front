import React, { useState } from "react";
import { X, Users, FileText, UserPlus } from "lucide-react";
import { AddLeadForm } from "./AddLeadForm";

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (leadData: any) => void;
  onUpdateLead?: (id: number, leadData: any) => void;
  onUploadCSV: (file: File) => void;
  leadToEdit?: any; // 👉 el lead que vamos a editar
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onAddLead,
  onUpdateLead,
  onUploadCSV,
  leadToEdit,
}) => {
  const [activeTab, setActiveTab] = useState<"manual" | "csv">("manual");
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadCSV = () => {
    if (!file) return;
    onUploadCSV(file);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 transform transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {leadToEdit
                ? "Editar Lead"
                : activeTab === "manual"
                ? "Agregar Lead"
                : "Cargar CSV"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-rose-600 p-2 hover:bg-rose-100 rounded-xl transition-all duration-200"
            >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs (solo cuando no es edición) */}
        {!leadToEdit && (
          <div className="flex mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("manual")}
              className={`flex-1 py-2 flex items-center justify-center gap-2 font-medium ${
                activeTab === "manual"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <UserPlus className="w-4 h-4" /> Manual
            </button>
            <button
              onClick={() => setActiveTab("csv")}
              className={`flex-1 py-2 flex items-center justify-center gap-2 font-medium ${
                activeTab === "csv"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileText className="w-4 h-4" /> CSV
            </button>
          </div>
        )}

        {/* Content */}
        {leadToEdit || activeTab === "manual" ? (
          <AddLeadForm
            initialData={leadToEdit} // 👈 pasamos los datos si es edición
            onCancel={onClose}
            onSave={(formData) => {
              if (leadToEdit && onUpdateLead) {
                onUpdateLead(leadToEdit.id, formData);
              } else {
                onAddLead(formData);
              }
              onClose();
            }}
          />
        ) : (
          <div className="space-y-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleUploadCSV}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-2xl"
            >
              Subir CSV
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
