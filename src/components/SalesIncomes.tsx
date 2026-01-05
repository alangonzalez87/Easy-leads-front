import React, { useState, useEffect } from "react";
import useSales from "../hooks/useSales";
import usePrices from "../hooks/usePrices";
import PriceModal from "./PriceModal";
import { useLeads } from "../hooks/useLeads";
import { Pencil } from "lucide-react";
import { decodeToken } from "../utils/decodeToken";

const token = localStorage.getItem("authToken");
const decoded = token ? decodeToken(token) : null;
const userId = decoded?.id || null;

const SalesIncomes: React.FC = () => {
  // Estado para modales
  const [showNewPricesModal, setShowNewPricesModal] = useState(false);
  const [showRenewPricesModal, setShowRenewPricesModal] = useState(false);

  // Hooks de ventas, precios, leads
  const { newPrices, renewPrices, updatePrices, setNewPrices, setRenewPrices } = usePrices();
  const { leads, handleAddLead, loading, error, lastUpdated } = useLeads(userId);
  const { newSales, renewals, totalSales, totalRenewals } = useSales();

  const [localNewPrices, setLocalNewPrices] = useState({ mensual: 0, trimestral: 0, anual: 0 });
  const [localRenewPrices, setLocalRenewPrices] = useState({ mensual: 0, trimestral: 0, anual: 0 });

  // Sincronizar precios con backend
  useEffect(() => {
    setLocalNewPrices(newPrices);
    setLocalRenewPrices(renewPrices);
  }, [newPrices, renewPrices]);

  // Actualizar precios
  const handlePriceUpdate = async () => {
    const updatedPrices = {
      items: [
        localNewPrices.mensual ? { category: "new", plan: "monthly", price: localNewPrices.mensual } : null,
        localNewPrices.trimestral ? { category: "new", plan: "quarterly", price: localNewPrices.trimestral } : null,
        localNewPrices.anual ? { category: "new", plan: "annual", price: localNewPrices.anual } : null,
        localRenewPrices.mensual ? { category: "renewal", plan: "monthly", price: localRenewPrices.mensual } : null,
        localRenewPrices.trimestral ? { category: "renewal", plan: "quarterly", price: localRenewPrices.trimestral } : null,
        localRenewPrices.anual ? { category: "renewal", plan: "annual", price: localRenewPrices.anual } : null,
      ].filter(item => item !== null)
    };
    if (updatedPrices.items.length === 0) {
      alert("No hay precios válidos para actualizar.");
      return;
    }
    const success = await updatePrices(updatedPrices);
    if (success) {
      alert("Precios actualizados correctamente!");
      setNewPrices(localNewPrices);
      setRenewPrices(localRenewPrices);
    } else {
      alert("Hubo un problema al actualizar los precios.");
    }
  };

  // Ingreso neto
  const netIncome = totalSales + totalRenewals;

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 pt-12 pb-6 px-8 rounded-2xl shadow-md text-white flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center">Ventas del Mes</h1>
        <p className="text-indigo-100 text-lg">Resumen de ingresos y suscripciones</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-xl text-white">
          <p className="text-sm">Ganancias del Día</p>
          <p className="text-2xl font-bold">${newSales.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-6 rounded-2xl shadow-xl text-white">
          <p className="text-sm">Renovaciones del Día</p>
          <p className="text-2xl font-bold">${renewals.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-yellow-600 p-6 rounded-2xl shadow-xl text-white">
          <p className="text-sm">Ingresos Netos</p>
          <p className="text-2xl font-bold">${netIncome.toLocaleString()}</p>
        </div>
      </div>

      {/* Formulario de Precios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Precios Altas Nuevas */}
        <div className="relative bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl shadow-md border border-emerald-200 group hover:scale-105 transition">
          <h3 className="text-xl font-bold text-emerald-800 mb-6 flex justify-between items-center">
            Precios Altas Nuevas
            <button
              onClick={() => setShowNewPricesModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <Pencil className="h-5 w-5" />
            </button>
          </h3>
          <ul className="space-y-4">
            {["mensual", "trimestral", "anual"].map((plan) => (
              <li key={plan} className="px-4 py-3 bg-white rounded-lg flex justify-between">
                <span className="bg-emerald-600 text-white px-3 py-1 rounded-lg">
                  {plan.charAt(0).toUpperCase() + plan.slice(1)}
                </span>
                <input
                  type="number"
                  value={localNewPrices[plan as keyof typeof localNewPrices]}
                  onChange={(e) =>
                    setLocalNewPrices({ ...localNewPrices, [plan]: Number(e.target.value) })
                  }
                  className="w-full text-xl border px-2 py-1 rounded-lg"
                />
              </li>
            ))}
          </ul>
        </div>
        {/* Precios Renovaciones */}
        <div className="relative bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl shadow-md border border-pink-200 group hover:scale-105 transition">
          <h3 className="text-xl font-bold text-pink-800 mb-6 flex justify-between items-center">
            Precios Renovaciones
            <button
              onClick={() => setShowRenewPricesModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <Pencil className="h-5 w-5" />
            </button>
          </h3>
          <ul className="space-y-4">
            {["mensual", "trimestral", "anual"].map((plan) => (
              <li key={plan} className="px-4 py-3 bg-white rounded-lg flex justify-between">
                <span className="bg-pink-600 text-white px-3 py-1 rounded-lg">
                  {plan.charAt(0).toUpperCase() + plan.slice(1)}
                </span>
                <input
                  type="number"
                  value={localRenewPrices[plan as keyof typeof localRenewPrices]}
                  onChange={(e) =>
                    setLocalRenewPrices({ ...localRenewPrices, [plan]: Number(e.target.value) })
                  }
                  className="w-full text-xl border px-2 py-1 rounded-lg"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modales de precios */}
      {showNewPricesModal && (
        <PriceModal
          title="Editar precios - Altas Nuevas"
          prices={localNewPrices}
          setPrices={setLocalNewPrices}
          onSave={() => {
            handlePriceUpdate();
            setShowNewPricesModal(false);
          }}
          onClose={() => setShowNewPricesModal(false)}
        />
      )}
      {showRenewPricesModal && (
        <PriceModal
          title="Editar precios - Renovaciones"
          prices={localRenewPrices}
          setPrices={setLocalRenewPrices}
          onSave={() => {
            handlePriceUpdate();
            setShowRenewPricesModal(false);
          }}
          onClose={() => setShowRenewPricesModal(false)}
        />
      )}
    </div>
  );
};

export default SalesIncomes;
