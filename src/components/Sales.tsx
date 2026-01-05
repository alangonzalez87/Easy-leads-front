import React, { useState } from "react";
import SalesIncome from "./SalesIncomes";
import SalesExpenses from "./SalesExpense";

const Sales: React.FC = () => {
  const [tab, setTab] = useState<"ingresos" | "egresos">("ingresos");

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative pb-20">
      {/* Submenú */}
      <div className="flex gap-4 mb-8 justify-center">
        <button
          onClick={() => setTab("ingresos")}
          className={`px-6 py-2 rounded-full font-semibold transition ${tab === "ingresos" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}
        >
          Ingresos
        </button>
        <button
          onClick={() => setTab("egresos")}
          className={`px-6 py-2 rounded-full font-semibold transition ${tab === "egresos" ? "bg-rose-600 text-white" : "bg-gray-200 text-gray-600"}`}
        >
          Egresos
        </button>
      </div>
      {/* Contenido dinámico */}
      {tab === "ingresos" ? <SalesIncome /> : <SalesExpenses />}
    </div>
  );
};

export default Sales;
