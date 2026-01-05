export type PipelineStage = "leads" | "por_contactar" | "contactado" | "renovo" | "inactivo";


export interface Lead {
  id: string;
  nombre: string;
  email: string;
  tel?: string;
  tablero: string;
  estado: 'activo' | 'inactivo' | 'pendiente' ;
  tiempo: string; // días
  fecha_finalizacion?: string; // fecha en formato YYYY-MM-DD
  finalizaDia?: string; // compatibilidad con fuentes externas
  vendedor: string;
  pipeline_state?: PipelineStage;
  pipeline_stage?: PipelineStage;
  renovo_at?: string; // fecha en formato YYYY-MM-DD

}


export interface FilterState {
  tablero: string;
  vendedor: string;
  estado: string;
}

export interface DashboardStats {
  totalLeads: number;
  leadsActivos: number;
  proximasRenovaciones: number;
  tableros: number;
}

export interface UserData {
  username: string;
  password: string;
  role: 'super_admin' |'admin' |'user';
  displayName: string;
  isFirstLogin: boolean;
  dashboardConfig?: any;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'super_admin' |'admin'|'user';
  displayName: string;
  isFirstLogin: boolean;
  dashboardConfig?: any;
  createdAt: string;
}
