import React, { useState } from "react";
import useExpenses from "../hooks/useExpenses";
import ExpenseModal from "./ExpenseModal";
import { MinusCircle, Trash2, Edit } from "lucide-react";

const SalesExpenses: React.FC = () => {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Hook de gastos
  const {
    gastosDia,
    gastosSemana,
    gastosMes,
    expenses,             // Agregá esto a tu hook: array de egresos
    addExpense,
    deleteExpense,        // Función que eliminá egreso por id
    // updateExpense      // Lo dejamos listo para después
  } = useExpenses();

  // Agregar egreso
  const handleAddExpense = async (amount, category, note) => {
    setExpenseLoading(true);
    await addExpense(amount, category, note);
    setExpenseLoading(false);
    setShowExpenseModal(false);
  };

  // Eliminar egreso
  const handleDeleteExpense = async (id) => {
    if (window.confirm("¿Seguro querés eliminar este egreso?")) {
      await deleteExpense(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 pt-8 pb-4 px-8 rounded-2xl shadow-md text-white flex justify-between items-center">
        <h1 className="text-3xl font-bold">Egresos</h1>
        <button
          onClick={() => setShowExpenseModal(true)}
          className="flex items-center gap-2 bg-gradient-to-br from-rose-500 to-pink-600 text-white font-semibold px-4 py-2 rounded-xl shadow-xl hover:scale-105 transition"
        >
          <MinusCircle className="w-5 h-5" />
          Agregar egreso
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-xl text-white p-6 flex flex-col justify-between min-h-[120px]">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold">Día</span>
          </div>
          <span className="text-3xl font-extrabold mt-2">
            ${gastosDia.toLocaleString()}
          </span>
        </div>
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-xl text-white p-6 flex flex-col justify-between min-h-[120px]">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold">Semana</span>
          </div>
          <span className="text-3xl font-extrabold mt-2">
            ${gastosSemana.toLocaleString()}
          </span>
        </div>
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-xl text-white p-6 flex flex-col justify-between min-h-[120px]">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold">Mes</span>
          </div>
          <span className="text-3xl font-extrabold mt-2">
            ${gastosMes.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Listado de egresos recientes */}
      <div className="bg-white mt-6 rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-bold text-rose-700 mb-4">Últimos egresos</h3>
        <ul className="divide-y">
          {expenses.slice(0, 6).map((gasto) => (
            <li key={gasto.id} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-rose-700">${gasto.amount}</span>
                <span className="ml-2 text-gray-600 text-sm">{gasto.category}</span>
                {gasto.note && (
                  <span className="ml-2 italic text-xs text-gray-400">({gasto.note})</span>
                )}
                <span className="ml-4 text-xs text-gray-500">
                  {new Date(gasto.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  title="Editar"
                  className="text-indigo-500 hover:text-indigo-700 p-1"
                  onClick={() => setEditingExpense(gasto)} 
                  disabled
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  title="Eliminar"
                  className="text-rose-500 hover:text-rose-700 p-1"
                  onClick={() => handleDeleteExpense(gasto.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
          {expenses.length === 0 && (
            <li className="py-3 text-gray-500 text-sm">No hay egresos registrados.</li>
          )}
        </ul>
      </div>

      {/* Modal para agregar gasto */}
      <ExpenseModal
        open={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onSave={handleAddExpense}
        loading={expenseLoading}
        categories={["canva", "pdf", "otros"]}
      />
    </div>
  );
};

export default SalesExpenses;
