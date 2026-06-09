import { PipelineStage } from "../constants/pipeline";

const normalizeStageValue = (stage?: string | null): string => {
  return (stage || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s-]+/g, "_");
};

export const isLeadEnVentana = (
  fecha_finalizacion?: string | null,
  stage?: string
): boolean => {
  if (safeStage(stage) === "renovo") return true;
  if (!fecha_finalizacion) return false;

  const fecha = new Date(fecha_finalizacion);
  const hoy = new Date();
  const dias = Math.floor((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  return dias >= -3 && dias <= 5;
};

export const safeStage = (stage?: string | null): PipelineStage => {
  const valid: PipelineStage[] = ["leads", "por_contactar", "contactado", "renovo", "inactivo"];
  const normalized = normalizeStageValue(stage);
  return valid.includes(normalized as PipelineStage) ? (normalized as PipelineStage) : "leads";
};

export const getLeadPipelineStage = (lead: Record<string, any>): PipelineStage => {
  const stageFields = [
    lead.pipeline_stage,
    lead.stage,
    lead.status,
  ];

  for (const value of stageFields) {
    const normalized = normalizeStageValue(value);
    if (normalized && safeStage(normalized) === normalized) {
      return normalized as PipelineStage;
    }
  }

  return "leads";
};
