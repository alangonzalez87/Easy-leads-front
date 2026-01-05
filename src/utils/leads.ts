import { PipelineStage } from "../constants/pipeline";

export const isLeadEnVentana = (
  fecha_finalizacion?: string | null,
  stage?: string
): boolean => {
  if (stage === "renovo") return true;
  if (!fecha_finalizacion) return false;

  const fecha = new Date(fecha_finalizacion);
  const hoy = new Date();
  const dias = Math.floor((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  return dias >= -3 && dias <= 5;
};

export const safeStage = (stage?: string | null): PipelineStage => {
  const valid: PipelineStage[] = ["leads", "por_contactar", "contactado", "renovo", "inactivo"];
  return valid.includes(stage as PipelineStage) ? (stage as PipelineStage) : "leads";
};
