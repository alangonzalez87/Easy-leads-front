import React from "react";

const opciones = ["Día", "Semana", "Mes"];

export const ToggleViewButton = ({ value, onChange }) => {
  // Busca el siguiente valor
  const nextValue = () => {
    const idx = opciones.indexOf(value);
    return opciones[(idx + 1) % opciones.length];
  };

  return (
    <button
      className="px-3 py-1 rounded-full bg-white text-rose-600 font-bold shadow border hover:bg-rose-50 transition"
      onClick={() => onChange(nextValue())}
    >
      {value}
    </button>
  );
};
