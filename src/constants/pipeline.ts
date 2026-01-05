import {
  Users,
  UserRoundSearch,
  UserRoundPlus,
  UserRoundPen,
  UserX,
} from "lucide-react";

export type PipelineStage =
  | "leads"
  | "por_contactar"
  | "contactado"
  | "renovo"
  | "inactivo";

export const pipelineStages = [
  {
    id: "leads",
    title: "Leads",
    icon: Users,
    color: "bg-gray-900",
  },
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
