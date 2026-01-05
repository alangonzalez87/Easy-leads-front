import { Droppable, Draggable } from "@hello-pangea/dnd";
import { MiniCard } from "./MiniCard";
import { Lead } from "../types";

type Props = {
  title: string;
  icon: React.ElementType;
  color: string;
  droppableId: string;
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
};

export const LeadColumn: React.FC<Props> = ({
  title,
  icon: Icon,
  color,
  droppableId,
  leads,
  onSelectLead,
}) => (
   
  <div className="flex-1 min-w-[260px] bg-white rounded-2xl shadow border border-gray-200 flex flex-col">
    <div className={`flex items-center justify-between px-4 py-3 text-white rounded-t-2xl ${color}`}>
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
                  <MiniCard lead={lead} onDoubleClick={() => onSelectLead(lead)} />
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
