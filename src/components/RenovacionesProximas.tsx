import React, { useMemo, useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Users,
  UserRoundSearch,
  UserRoundPlus,
  UserRoundPen,
  UserX,
} from "lucide-react";
import { MiniCard } from "./MiniCard";
import { LeadCard } from "./LeadCard";
import { Lead } from "../types/index";
import { ModalRenovacion } from "./ModalRenovacion";

export type PipelineStage =
  | "leads"
  | "por_contactar"
  | "contactado"
  | "renovo"
  | "inactivo";

interface Props {
  leads: Lead[];
}

const DIAS_PASADOS = 5;
const DIAS_ADELANTE = 5;

// -------- Helpers --------
function isLeadEnVentana(fecha_finalizacion?: string | null, stage?: string) {
  if (stage === "renovo") return true;
  if (!fecha_finalizacion) return false;

  const fecha = new Date(fecha_finalizacion);
  const hoy = new Date();
  const dias = Math.floor(
    (fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
  );
  return dias >= -DIAS_PASADOS && dias <= DIAS_ADELANTE;
}

function safeStage(stage?: string | null): PipelineStage {
  const valid: PipelineStage[] = [
    "leads",
    "por_contactar",
    "contactado",
    "renovo",
    "inactivo",
  ];
  return valid.includes(stage as PipelineStage)
    ? (stage as PipelineStage)
    : "leads";
}

// -------- Column --------
const Column: React.FC<{
  title: string;
  icon: React.ElementType;
  color: string;
  droppableId: PipelineStage;
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}> = ({ title, icon: Icon, color, droppableId, leads, onSelectLead }) => (
  <div className="flex-1 min-w-[260px] bg-white rounded-2xl shadow border border-gray-200 flex flex-col">
    <div
      className={`flex items-center justify-between px-4 py-3 text-white rounded-t-2xl ${color}`}
    >
      <h3 className="text-base font-semibold">{title}</h3>
      <div className="bg-white/20 p-1.5 rounded-lg">
        <Icon className="w-4 h-4" />
      </div>
    </div>

    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="p-4 min-h-[500px] bg-gray-50 text-sm text-gray-600 space-y-3 flex flex-col"
        >
          {leads.length === 0 && (
            <div className="text-xs text-gray-400">Nada por aquí ✨</div>
          )}
          {leads.map((lead, index) => (
            <Draggable
              key={`lead-${lead.id}`}
              draggableId={`lead-${lead.id}`}
              index={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{ ...provided.draggableProps.style }}
                >
                  <MiniCard
                    lead={lead}
                    onDoubleClick={() => onSelectLead(lead)}
                  />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);

// -------- Main --------
const RenovacionesProximas: React.FC<Props> = ({ leads }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showRenovoModal, setShowRenovoModal] = useState(false);
  const [leadToRenovar, setLeadToRenovar] = useState<Lead | null>(null);
  const [sourceCol, setSourceCol] = useState<PipelineStage | null>(null);

  const leadsEnVentana = useMemo(
    () =>
      leads.filter((lead) =>
        isLeadEnVentana(lead.fecha_finalizacion, lead.pipeline_stage)
      ),
    [leads]
  );

  const [columns, setColumns] = useState<Record<PipelineStage, Lead[]>>({
    leads: [],
    por_contactar: [],
    contactado: [],
    renovo: [],
    inactivo: [],
  });

  useEffect(() => {
    const grouped: Record<PipelineStage, Lead[]> = {
      leads: [],
      por_contactar: [],
      contactado: [],
      renovo: [],
      inactivo: [],
    };

    leadsEnVentana.forEach((lead) => {
      const stage = safeStage(lead.pipeline_stage);
      grouped[stage].push(lead);
    });

    setColumns(grouped);
  }, [leadsEnVentana]);

  // -------- Central update --------
  const updateLeadStage = async (
    lead: Lead,
    newStage: PipelineStage,
    extra: Record<string, any> = {}
  ) => {
    const payload: any = { pipeline_stage: newStage, ...extra };

    if (newStage === "inactivo") {
      payload.estado = "Inactivo";
      payload.fecha_inactivacion = new Date().toISOString().split("T")[0];
    }
    if (newStage === "renovo") {
      payload.estado = "Activo";
    }

    const { data, error } = await supabase
      .from("leads")
      .update(payload)
      .eq("id", lead.id)
      .select();

    if (error) {
      console.error("Error actualizando lead:", error);
      return lead;
    }

    return { ...lead, ...payload };
  };

  const moveLeadBetweenColumns = (
    lead: Lead,
    from: PipelineStage,
    to: PipelineStage,
    updatedLead: Lead
  ) => {
    setColumns((prev) => {
      const updated = { ...prev };
      updated[from] = prev[from].filter((l) => l.id !== lead.id);
      updated[to] = [...prev[to], updatedLead];
      return updated;
    });
  };

  // -------- Drag & Drop --------
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColId = source.droppableId as PipelineStage;
    const destColId = destination.droppableId as PipelineStage;
    if (sourceColId === destColId && source.index === destination.index) return;

    const moved = columns[sourceColId][source.index];
    if (!moved) return;

    if (destColId === "renovo") {
      setLeadToRenovar(moved);
      setSourceCol(sourceColId);
      setShowRenovoModal(true);
    } else {
      const updatedLead = await updateLeadStage(moved, destColId);
      moveLeadBetweenColumns(moved, sourceColId, destColId, updatedLead as Lead);
    }
  };

  const cols = [
    { id: "leads", title: "Leads", icon: Users, color: "bg-gray-900" },
    {
      id: "por_contactar",
      title: "Por contactar",
      icon: UserRoundSearch,
      color: "bg-blue-600",
    },
    {
      id: "contactado",
      title: "Contactado",
      icon: UserRoundPlus,
      color: "bg-amber-600",
    },
    {
      id: "renovo",
      title: "Renovó",
      icon: UserRoundPen,
      color: "bg-emerald-700",
    },
    {
      id: "inactivo",
      title: "Inactivo",
      icon: UserX,
      color: "bg-rose-700",
    },
  ] as const;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">📅 Renovaciones</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {cols.map((col) => (
            <Column
              key={col.id}
              title={col.title}
              icon={col.icon}
              color={col.color}
              droppableId={col.id}
              leads={columns[col.id]}
              onSelectLead={(lead) => setSelectedLead(lead)}
            />
          ))}
        </div>
      </DragDropContext>

      {selectedLead && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="relative bg-white rounded-lg p-4 w-[600px] max-h-[90vh] overflow-y-auto shadow-lg">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            <LeadCard
              lead={selectedLead}
              context="renovaciones"
              onRenovo={async (lead) => {
                setLeadToRenovar(lead);
                setShowRenovoModal(true);
              }}
              onInactivo={async (id) => {
                const updatedLead = await updateLeadStage(
                  selectedLead!,
                  "inactivo"
                );
                moveLeadBetweenColumns(
                  selectedLead!,
                  selectedLead!.pipeline_stage as PipelineStage,
                  "inactivo",
                  updatedLead as Lead
                );
                setSelectedLead(null);
              }}
            />
          </div>
        </div>
      )}

      {showRenovoModal && leadToRenovar && (
        <ModalRenovacion
          lead={leadToRenovar}
          onClose={() => {
            if (sourceCol && leadToRenovar) {
              moveLeadBetweenColumns(
                leadToRenovar,
                "renovo",
                sourceCol,
                leadToRenovar
              );
            }
            setShowRenovoModal(false);
            setLeadToRenovar(null);
          }}
          onConfirm={async (dias) => {
            const updatedLead = await updateLeadStage(leadToRenovar, "renovo", {
              tiempo: dias.toString(),
              fecha_finalizacion: new Date(
                Date.now() + dias * 24 * 60 * 60 * 1000
              )
                .toISOString()
                .split("T")[0],
            });

            Object.keys(columns).forEach((col) => {
              setColumns((prev) => ({
                ...prev,
                [col as PipelineStage]: prev[
                  col as PipelineStage
                ].filter((l) => l.id !== leadToRenovar.id),
              }));
            });

            setColumns((prev) => ({
              ...prev,
              renovo: [...prev.renovo, updatedLead as Lead],
            }));

            setShowRenovoModal(false);
            setLeadToRenovar(null);
          }}
        />
      )}
    </div>
  );
};

export default RenovacionesProximas;
