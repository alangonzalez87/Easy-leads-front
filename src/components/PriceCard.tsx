// components/PriceCard.tsx
import React from "react";
import { Pencil } from "lucide-react";

interface PriceCardProps {
  title: string;
  prices: { mensual: number; trimestral: number; anual: number };
  onEdit: () => void;
  colorClass: string; // Para los colores de fondo de cada card
}

const PriceCard: React.FC<PriceCardProps> = ({ title, prices, onEdit, colorClass }) => {
  return (
    <div className={`relative ${colorClass} p-6 rounded-2xl shadow-md group hover:scale-105 transition`}>
      <h3 className="text-xl font-bold mb-6 flex justify-between items-center">
        {title}
        <button onClick={onEdit} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
          <Pencil className="h-5 w-5" />
        </button>
      </h3>
      <ul className="space-y-4">
        {["mensual", "trimestral", "anual"].map((plan) => (
          <li key={plan} className="px-4 py-3 bg-white rounded-lg flex justify-between">
            <span className="bg-gray-700 text-white px-3 py-1 rounded-lg">{plan.charAt(0).toUpperCase() + plan.slice(1)}</span>
            <span className="text-gray-800 text-xl">{prices[plan as keyof typeof prices]} ARS</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PriceCard;
