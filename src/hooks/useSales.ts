// hooks/useSales.ts
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const useSales = () => {
  const [newSales, setNewSales] = useState(0); // del día
  const [renewals, setRenewals] = useState(0); // del día
  const [totalSales, setTotalSales] = useState(0); // del mes
  const [totalRenewals, setTotalRenewals] = useState(0); // del mes
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const monthStartStr = startOfMonth.toISOString().slice(0, 10);

        // Traemos todas las ventas desde el inicio del mes
        const { data, error } = await supabase
          .from("sales")
          .select("*")
          .gte("created_at", monthStartStr);

        if (error) throw error;

        let dayNew = 0;
        let dayRenew = 0;
        let monthNew = 0;
        let monthRenew = 0;

        data.forEach((sale) => {
          const saleDate = sale.created_at.slice(0, 10);

          // Totales del mes
          if (sale.kind === "new") {
            monthNew += sale.amount;
          } else if (sale.kind === "renewal") {
            monthRenew += sale.amount;
          }

          // Totales del día
          if (saleDate === today) {
            if (sale.kind === "new") {
              dayNew += sale.amount;
            } else if (sale.kind === "renewal") {
              dayRenew += sale.amount;
            }
          }
        });

        setNewSales(dayNew);
        setRenewals(dayRenew);
        setTotalSales(monthNew);
        setTotalRenewals(monthRenew);
      } catch (err) {
        console.error("❌ Error al cargar ventas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  return { newSales, renewals, totalSales, totalRenewals, loading };
};

export default useSales;
