// utils/expenses.ts

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getStartOfWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay()); // Domingo
  return d;
}

export function getStartOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Suma gastos por período, con opción de filtrar por categorías (o suma todos si no pasás nada)
 * @param expenses array de egresos
 * @param categorias [] opcional
 */
export function getGastosPorPeriodo(expenses: any[], categorias: string[] = []) {
  const today = new Date();
  const startOfWeek = getStartOfWeek(today);
  const startOfMonth = getStartOfMonth(today);

  let gastosDia = 0, gastosSemana = 0, gastosMes = 0;

  expenses.forEach((gasto) => {
    // Si categorías está definido, solo suma esas. Si está vacío, suma todo.
    if (categorias.length > 0 && !categorias.includes(gasto.category)) return;
    const fecha = new Date(gasto.expense_date || gasto.created_at);
    if (isSameDay(fecha, today)) gastosDia += Number(gasto.amount);
    if (fecha >= startOfWeek && fecha <= today) gastosSemana += Number(gasto.amount);
    if (fecha >= startOfMonth && fecha <= today) gastosMes += Number(gasto.amount);
  });

  return { gastosDia, gastosSemana, gastosMes };
}
