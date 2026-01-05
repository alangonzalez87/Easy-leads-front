import React, { useState } from "react";

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (amount: number, category: string, note: string) => void;
  categories?: string[];
  loading?: boolean;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  open,
  onClose,
  onSave,
  categories = ["canva", "pdf", "otros"],
  loading = false,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<string>(categories[0]);
  const [note, setNote] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    onSave(amount, category, note);
    setAmount(0); setNote("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-2xl shadow-2xl min-w-[340px] max-w-xs w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold text-xl">&times;</button>
        <h2 className="text-xl font-bold mb-4 text-rose-700">Agregar Egreso</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Monto *</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              required
              className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-rose-400"
              placeholder="Ej: 2500"
              min={1}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nota (opcional)</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="Ej: Publicidad, Insumos, etc."
              maxLength={80}
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-bold bg-rose-600 text-white hover:bg-rose-700 transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Agregar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
