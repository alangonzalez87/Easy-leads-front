// components/PriceModal.tsx
import React from "react";
import { X, Save } from "lucide-react";

interface PriceModalProps {
  title: string;
  prices: { mensual: number; trimestral: number; anual: number };
  setPrices: React.Dispatch<React.SetStateAction<{ mensual: number; trimestral: number; anual: number }>>;
  onSave: () => void;
  onClose: () => void;
}

const PriceModal: React.FC<PriceModalProps> = ({ title, prices, setPrices, onSave, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form className="space-y-3">
          {["mensual", "trimestral", "anual"].map((plan) => (
            <input
              key={plan}
              type="number"
              value={prices[plan as keyof typeof prices]}
              onChange={(e) =>
                setPrices({ ...prices, [plan]: Number(e.target.value) })
              }
              className="w-full border rounded-lg px-4 py-2"
            />
          ))}
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white p-2 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onSave}
              className="bg-green-500 text-white p-2 rounded-full"
            >
              <Save className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PriceModal;
