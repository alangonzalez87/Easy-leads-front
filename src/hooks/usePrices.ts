// hooks/usePrices.ts
import { useState, useEffect } from "react";

const usePrices = () => {
  const [newPrices, setNewPrices] = useState({ mensual: 0, trimestral: 0, anual: 0 });
  const [renewPrices, setRenewPrices] = useState({ mensual: 0, trimestral: 0, anual: 0 });

  // Traer precios del backend
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // 🔹 Obtener token dentro del efecto
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token no encontrado");

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/prices`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener precios");
        const data = await response.json();

        // Mapear precios por categoría y plan
        const newP: any = {}, renewP: any = {};
        data.forEach((item: any) => {
          if (item.category === "new") {
            if (item.plan === "monthly") newP.mensual = item.price;
            else if (item.plan === "quarterly") newP.trimestral = item.price;
            else if (item.plan === "annual") newP.anual = item.price;
          } else if (item.category === "renewal") {
            if (item.plan === "monthly") renewP.mensual = item.price;
            else if (item.plan === "quarterly") renewP.trimestral = item.price;
            else if (item.plan === "annual") renewP.anual = item.price;
          }
        });

        setNewPrices(newP);
        setRenewPrices(renewP);
      } catch (err) {
        console.error("Error al obtener precios", err);
      }
    };

    fetchPrices(); // Solo lo hacemos una vez al montar el componente
  }, []);

  // Función para actualizar precios en el backend
  const updatePrices = async (updatedPrices: any) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token no encontrado");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/prices/update-prices`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedPrices),
      });
      if (!response.ok) {
        console.error('Error en la respuesta:', response.status, response.statusText);
        return false;
      }
      // Si la actualización es exitosa, se actualizan los precios en el frontend
      setNewPrices(updatedPrices.newPrices);
      setRenewPrices(updatedPrices.renewPrices);
      return true;
    } catch (err) {
      console.error('Error al actualizar precios', err);
      return false;
    }
  };

  return { newPrices, renewPrices, setNewPrices, setRenewPrices, updatePrices };
};

export default usePrices;
