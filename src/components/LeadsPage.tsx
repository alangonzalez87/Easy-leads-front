import React, { useState, useMemo, useEffect } from "react";
import { Lead, FilterState } from "../types";
import { FilterBar } from "./FilterBar";
import { ViewToggle } from "./ViewToggle";
import { LeadCard } from "./LeadCard";
import { LeadsList } from "./LeadsList";
import { Users, Search, Plus } from "lucide-react";
import { AddLeadModal } from "./AddLeadModal";
import { EditLeadModal } from "./EditLeadModal";
import { ModalRenovacion } from "./ModalRenovacion"; // 👈 import nuevo

export const LeadsPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    tablero: "",
    vendedor: "",
    estado: "",
  });
  const [view, setView] = useState<"cards" | "list">("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddLead, setShowAddLead] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tableros, setTableros] = useState<string[]>([]);
  const [vendedores, setVendedores] = useState<string[]>([]);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Renovación
  const [showRenovacionModal, setShowRenovacionModal] = useState(false);
  const [leadToRenew, setLeadToRenew] = useState<Lead | null>(null);

  // 🔹 Obtener leads desde el backend
  useEffect(() => {
    const fetchLeads = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setLeads(data);

          // extraer tableros y vendedores únicos
          const uniqueTableros = Array.from(new Set(data.map((l: Lead) => l.tablero).filter(Boolean)));
          const uniqueVendedores = Array.from(new Set(data.map((l: Lead) => l.vendedor).filter(Boolean)));

          setTableros(uniqueTableros);
          setVendedores(uniqueVendedores);
        } else {
          console.error("Error al obtener leads:", data.error);
        }
      } catch (err) {
        console.error("❌ Error de red al obtener leads:", err);
      }
    };

    fetchLeads();
  }, []);

  // 🔹 Filtrado de leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (filters.tablero && lead.tablero !== filters.tablero) return false;
      if (filters.vendedor && lead.vendedor !== filters.vendedor) return false;
      if (filters.estado && lead.estado !== filters.estado) return false;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          lead.nombre?.toLowerCase().includes(search) ||
          lead.email?.toLowerCase().includes(search) ||
          (lead.tel && lead.tel.toLowerCase().includes(search))
        );
      }
      return true;
    });
  }, [leads, filters, searchTerm]);

  // 🔹 Agregar lead individual
// 🔹 Agregar lead individual (front)
const handleAddLead = async (leadData: any) => {
  try {
    const token = localStorage.getItem("authToken"); // o de donde lo estés guardando
    if (!token) {
      alert("⚠️ No hay token, inicia sesión de nuevo");
      return;
    }

    

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,  // 🔑 ahora sí pasa el authMiddleware
      },
      body: JSON.stringify(leadData),
    });

    const data = await response.json();
    

    if (response.ok) {
      alert("Lead agregado con éxito");
      setShowAddLead(false);
      setLeads((prev) => [...prev, data]);
    } else {
      console.error("❌ Error desde API:", data.error);
      alert(`Error: ${data.error}`);
    }
  } catch (err) {
    console.error("🚨 Error de red o fetch:", err);
    alert("Error al agregar el lead");
  }
};



  // 🔹 Subir CSV
  const handleUploadCSV = async (file: File) => {
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("csv", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload-csv`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert("Archivo CSV cargado con éxito");
        setLeads((prev) => [...prev, ...(data.newLeads || [])]);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert("Error al cargar el archivo CSV");
    }
  };

  // 🔹 Editar Lead
  const handleEdit = (lead: Lead) => {
    setLeadToEdit(lead);
    setShowEditModal(true);
  };

  // 🔹 Eliminar Lead
  const handleDelete = async (id: number) => {
    const confirm = window.confirm("¿Seguro que querés eliminar este lead?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        alert("✅ Lead eliminado con éxito");
      } else {
        const data = await res.json();
        alert(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.error("❌ Error eliminando lead:", err);
      alert("Error al eliminar el lead");
    }
  };

  // 🔹 Abrir modal de renovación
  const handleRenewClick = (lead: Lead) => {
    setLeadToRenew(lead);
    setShowRenovacionModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users size={24} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Leads</h1>
            <p className="text-sm text-gray-500">
              {filteredLeads.length} leads encontrados
            </p>
          </div>
        </div>
        <ViewToggle view={view} onViewChange={setView} />
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        tableros={tableros}
        vendedores={vendedores}
      />

      {/* Content */}
      {view === "cards" ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>No se encontraron leads con los filtros aplicados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLeads.map((lead, index) => (
                <LeadCard 
                  key={lead.email || index} 
                  lead={lead} 
                  context="leadsPage" 
                  onEdit={handleEdit} 
                  onDelete={handleDelete}
                  onRenew={handleRenewClick} // 👈 pasa el handle nuevo
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <LeadsList leads={filteredLeads} />
      )}

      {/* Botón flotante */}
      <button
        onClick={() => setShowAddLead(true)}
        className="fixed bottom-20 right-8 bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
        title="Agregar Lead"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Modal para agregar lead */}
      <AddLeadModal
        isOpen={showAddLead}
        onClose={() => setShowAddLead(false)}
        onAddLead={handleAddLead}
        onUploadCSV={handleUploadCSV}
      />

      {/* Modal para editar lead */}
      <EditLeadModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        leadToEdit={leadToEdit}
        onSave={async (formData) => {
          const token = localStorage.getItem("authToken");

          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${leadToEdit.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          });

          if (res.ok) {
            const updated = await res.json();
            setLeads((prev) =>
              prev.map((l) => (l.id === updated.id ? updated : l))
            );
            alert("Lead actualizado ✅");
          } else {
            alert("Error actualizando lead ❌");
          }
        }}
      />

      {/* Modal para renovación */}
      {leadToRenew && (
        <ModalRenovacion
          isOpen={showRenovacionModal}
          onClose={() => setShowRenovacionModal(false)}
          lead={leadToRenew}
          onRenew={(updatedLead) => {
            setLeads((prev) =>
              prev.map((l) => (l.id === updatedLead.id ? updatedLead : l))
            );
          }}
        />
      )}
    </div>
  );
};
