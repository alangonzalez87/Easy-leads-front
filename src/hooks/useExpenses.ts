import { useState, useEffect } from "react";
import { getGastosPorPeriodo } from "../utils/expenses";
import { Delete } from "lucide-react";

const useExpenses = (category?: string | string[]) => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [gastosDia, setGastosDia] = useState(0);
  const [gastosSemana, setGastosSemana] = useState(0);
  const [gastosMes, setGastosMes] = useState(0);

  // Trae todos los egresos (de cualquier categoría)
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error fetchExpenses");
      const data = await response.json();
      setExpenses(data);

      // Calcula los gastos con el filtro (si existe)
      const categorias = Array.isArray(category)
        ? category
        : category
        ? [category]
        : [];
      const { gastosDia, gastosSemana, gastosMes } = getGastosPorPeriodo(data, categorias);
      setGastosDia(gastosDia);
      setGastosSemana(gastosSemana);
      setGastosMes(gastosMes);

    } catch (err) {
      console.error(err);
    }
  };

  // Agrega un egreso y refresca la lista
  const addExpense = async (amount: number, category: string, note: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, category, note }),
      });
      if (!response.ok) throw new Error("Error agregar gasto");
      await fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

 const deleteExpense = async (expenseId: number) => {
  const token = localStorage.getItem("authToken"); // <-- agregalo acá
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${expenseId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Error eliminando gasto");
    await fetchExpenses(); // refresca lista después de borrar
  } catch (err) {
    console.error(err);
  }
};



  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line
  }, []);

  // Recalcula si cambia la categoría o la lista local
  useEffect(() => {
    const categorias = Array.isArray(category)
      ? category
      : category
      ? [category]
      : [];
    const { gastosDia, gastosSemana, gastosMes } = getGastosPorPeriodo(expenses, categorias);
    setGastosDia(gastosDia);
    setGastosSemana(gastosSemana);
    setGastosMes(gastosMes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, expenses]);

  // Si después querés filtrar por solo “canva” o “otros” podés usar:
  // const gastosCanva = getGastosPorPeriodo(expenses, ["canva"]);
  // const gastosOtros = getGastosPorPeriodo(expenses, ["otros"]);

  return {
    expenses,
    gastosDia,
    gastosSemana,
    gastosMes,
    addExpense,
    fetchExpenses,
    deleteExpense
  };
};

export default useExpenses;

