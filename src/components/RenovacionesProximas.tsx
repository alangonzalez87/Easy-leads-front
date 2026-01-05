// components/RenovacionesProximas.tsx
import React, { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";  // Asegúrate de importar DropResult
import { LeadCard } from "./LeadCard";
import { LeadColumn } from "./LeadColumn";  // Asegúrate de que esta importación sea correcta
import { usePipelineLeads } from "../hooks/usePipelineLeads";
import { ModalRenovacion } from "./ModalRenovacion";
import { Lead, PipelineStage } from "../types";
import { Calendar } from "lucide-react"; 
import { pipelineStages } from "../constants/Pipeline"; 

interface Props {
  leads: Lead[];
}

const RenovacionesProximas: React.FC<Props> = ({ leads }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showRenovoModal, setShowRenovoModal] = useState(false);
  const [leadToRenovar, setLeadToRenovar] = useState<Lead | null>(null);
  const [sourceCol, setSourceCol] = useState<PipelineStage | null>(null);

  const { columns, updateLeadStage, moveLeadBetweenColumns, setColumns } = usePipelineLeads(leads);

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
  console.log("RenovacionesProximas - columns:", columns);
  console.log("RenovacionesProximas - leads prop:", leads);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">📅 Renovaciones</h2>

<DragDropContext onDragEnd={handleDragEnd}>
  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
    {pipelineStages.map((stage) => (
      <LeadColumn
        key={stage.id}
        title={stage.title}
        icon={stage.icon}
        color={stage.color}
        droppableId={stage.id}
        leads={Array.isArray(columns[stage.id]) ? columns[stage.id] : []}
        onSelectLead={(lead) => setSelectedLead(lead)}
      />
    ))}
  </div>
</DragDropContext>

      {selectedLead && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="relative bg-white rounded-lg p-4 w-[600px] max-h-[90vh] overflow-y-auto shadow-lg">
            <button onClick={() => setSelectedLead(null)} className="absolute top-2 right-2 text-gray-600 hover:text-black">
              ✕
            </button>

            <LeadCard
              lead={selectedLead}
              context="renovaciones"
              onRenovo={(lead) => {
                setLeadToRenovar(lead);
                setShowRenovoModal(true);
              }}
              onInactivo={async (id) => {
                const updatedLead = await updateLeadStage(selectedLead!, "inactivo");
                moveLeadBetweenColumns(selectedLead!, selectedLead!.pipeline_stage as PipelineStage, "inactivo", updatedLead as Lead);
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
              moveLeadBetweenColumns(leadToRenovar, "renovo", sourceCol, leadToRenovar);
            }
            setShowRenovoModal(false);
            setLeadToRenovar(null);
          }}
          onConfirm={async (dias) => {
            const updatedLead = await updateLeadStage(leadToRenovar, "renovo", {
              tiempo: dias.toString(),
              fecha_finalizacion: new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
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
