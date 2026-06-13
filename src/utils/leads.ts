import { PipelineStage } from "../constants/pipeline";

const FINAL_STAGE_RETENTION_MS = 24 * 60 * 60 * 1000;
const PIPELINE_TIMESTAMPS_KEY = "leadPipelineStageChangedAt";

type LeadWindowData = {
  id?: string | number;
  fecha_finalizacion?: string | null;
  finalizaDia?: string | null;
  pipeline_stage?: string | null;
  stage?: string | null;
  status?: string | null;
  renovo_at?: string | null;
  fecha_inactivacion?: string | null;
};

type LeadStageData = Pick<LeadWindowData, "pipeline_stage" | "stage" | "status">;

const normalizeStageValue = (stage?: unknown): string => {
  return (stage || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s-]+/g, "_");
};

const readPipelineTimestamps = (): Record<string, string> => {
  if (typeof window === "undefined") return {};

  try {
    return JSON.parse(localStorage.getItem(PIPELINE_TIMESTAMPS_KEY) || "{}");
  } catch {
    return {};
  }
};

const timestampKey = (leadId: string | number, stage: PipelineStage) =>
  `${leadId}:${stage}`;

export const markLeadPipelineStageChanged = (
  leadId: string | number,
  stage: PipelineStage
) => {
  if (typeof window === "undefined") return;

  const timestamps = readPipelineTimestamps();
  Object.keys(timestamps)
    .filter((key) => key.startsWith(`${leadId}:`))
    .forEach((key) => delete timestamps[key]);

  if (stage === "renovo" || stage === "inactivo") {
    timestamps[timestampKey(leadId, stage)] = new Date().toISOString();
  }

  localStorage.setItem(PIPELINE_TIMESTAMPS_KEY, JSON.stringify(timestamps));
};

const parseLocalDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const parsed = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const isFinalPipelineStageVisible = (lead: LeadWindowData): boolean => {
  const stage = getLeadPipelineStage(lead);
  if (stage !== "renovo" && stage !== "inactivo") return true;

  const storedTimestamp = lead.id == null
    ? null
    : readPipelineTimestamps()[timestampKey(lead.id, stage)];
  const fallbackTimestamp = stage === "renovo"
    ? lead.renovo_at
    : lead.fecha_inactivacion;
  const changedAt = parseLocalDate(storedTimestamp || fallbackTimestamp);

  if (!changedAt) return false;
  return Date.now() - changedAt.getTime() < FINAL_STAGE_RETENTION_MS;
};

export const isLeadEnVentana = (lead: LeadWindowData): boolean => {
  const stage = getLeadPipelineStage(lead);
  if (stage === "inactivo") return isFinalPipelineStageVisible(lead);
  if (stage === "renovo" && isFinalPipelineStageVisible(lead)) return true;

  const fecha = parseLocalDate(lead.fecha_finalizacion || lead.finalizaDia);
  if (!fecha) return false;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  fecha.setHours(0, 0, 0, 0);
  const dias = Math.round((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  return dias >= -3 && dias <= 3;
};

export const safeStage = (stage?: string | null): PipelineStage => {
  const valid: PipelineStage[] = ["leads", "por_contactar", "contactado", "renovo", "inactivo"];
  const normalized = normalizeStageValue(stage);
  return valid.includes(normalized as PipelineStage) ? (normalized as PipelineStage) : "leads";
};

export const getLeadPipelineStage = (lead: LeadStageData): PipelineStage => {
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
