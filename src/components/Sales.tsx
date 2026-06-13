import React, { useMemo } from "react";
import { AlertTriangle, CalendarClock, CheckCircle2, Mail, User } from "lucide-react";
import { useLeads } from "../hooks/useLeads";
import { Lead } from "../types";

type ChatGptColumn = {
  id: "vencidos" | "proximos" | "vigentes";
  title: string;
  description: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  leads: Lead[];
};

const parseDate = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const daysUntil = (value?: string) => {
  const date = parseDate(value);
  if (!date) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((date.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
};

const formatDate = (value?: string) => {
  const date = parseDate(value);
  return date
    ? date.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })
    : "Sin fecha";
};

const renewalLabel = (days: number | null) => {
  if (days === null) return "Sin fecha";
  if (days < 0) return `Venció hace ${Math.abs(days)} día${Math.abs(days) === 1 ? "" : "s"}`;
  if (days === 0) return "Renueva hoy";
  if (days === 1) return "Renueva mañana";
  return `Renueva en ${days} días`;
};

const ChatGptCard: React.FC<{ lead: Lead }> = ({ lead }) => {
  const days = daysUntil(lead.fecha_finalizacion_chatgpt);

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-gray-900">{lead.nombre || "Sin nombre"}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
            <Mail className="h-4 w-4" />
            <span className="truncate">{lead.email || "Sin email"}</span>
          </p>
        </div>
        <span className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-semibold text-cyan-800">
          ChatGPT
        </span>
      </div>

      <div className="mt-4 rounded-lg bg-slate-50 p-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <CalendarClock className="h-4 w-4 text-cyan-600" />
          {formatDate(lead.fecha_finalizacion_chatgpt)}
        </p>
        <p className={`mt-1 text-sm font-medium ${days !== null && days <= 7 ? "text-rose-600" : "text-gray-600"}`}>
          {renewalLabel(days)}
        </p>
      </div>

      {lead.vendedor && (
        <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <User className="h-4 w-4" /> {lead.vendedor}
        </p>
      )}

      {lead.notas && (
        <p className="mt-3 border-t border-gray-100 pt-3 text-sm text-gray-600">
          {lead.notas}
        </p>
      )}
    </article>
  );
};

const Sales: React.FC = () => {
  const { leads, loading, error } = useLeads();

  const chatGptLeads = useMemo(
    () =>
      (leads as Lead[])
        .filter((lead) => Boolean(parseDate(lead.fecha_finalizacion_chatgpt)))
        .sort((a, b) =>
          (parseDate(a.fecha_finalizacion_chatgpt)?.getTime() || 0) -
          (parseDate(b.fecha_finalizacion_chatgpt)?.getTime() || 0)
        ),
    [leads]
  );

  const columns = useMemo<ChatGptColumn[]>(() => [
    {
      id: "vencidos",
      title: "Vencidos",
      description: "Necesitan renovación",
      color: "border-rose-300 bg-rose-50",
      icon: AlertTriangle,
      leads: chatGptLeads.filter((lead) => (daysUntil(lead.fecha_finalizacion_chatgpt) ?? 0) < 0),
    },
    {
      id: "proximos",
      title: "Renuevan pronto",
      description: "Hoy o dentro de 7 días",
      color: "border-amber-300 bg-amber-50",
      icon: CalendarClock,
      leads: chatGptLeads.filter((lead) => {
        const days = daysUntil(lead.fecha_finalizacion_chatgpt);
        return days !== null && days >= 0 && days <= 7;
      }),
    },
    {
      id: "vigentes",
      title: "Más adelante",
      description: "Renuevan después de 7 días",
      color: "border-emerald-300 bg-emerald-50",
      icon: CheckCircle2,
      leads: chatGptLeads.filter((lead) => (daysUntil(lead.fecha_finalizacion_chatgpt) ?? 0) > 7),
    },
  ], [chatGptLeads]);

  if (loading) {
    return <p className="p-8 text-center text-gray-600">Cargando clientes de ChatGPT...</p>;
  }

  if (error) {
    return <p className="p-8 text-center text-rose-600">No se pudieron cargar los clientes: {error}</p>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold">ChatGPT</h1>
        <p className="mt-1 text-cyan-100">
          {chatGptLeads.length} cliente{chatGptLeads.length === 1 ? "" : "s"} con renovación registrada
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {columns.map(({ id, title, description, color, icon: Icon, leads: columnLeads }) => (
          <section key={id} className={`min-h-72 rounded-2xl border p-4 ${color}`}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 font-bold text-gray-900">
                  <Icon className="h-5 w-5" /> {title}
                </h2>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-gray-700 shadow-sm">
                {columnLeads.length}
              </span>
            </div>

            <div className="space-y-3">
              {columnLeads.map((lead) => <ChatGptCard key={lead.id} lead={lead} />)}
              {columnLeads.length === 0 && (
                <p className="rounded-xl border border-dashed border-gray-300 bg-white/60 p-6 text-center text-sm text-gray-500">
                  No hay clientes en esta columna.
                </p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Sales;
