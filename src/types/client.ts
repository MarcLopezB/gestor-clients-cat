export interface Client {
  external_id: string | null;
  serial: string | null;
  domicilio_to: string | null;
  velocidad_label: string | null;
  service_profile: string | null;
  es_nat: 0 | 1 | null;
  phone: string | null;
  service_id: string | null;
  estado: 'OK' | 'ERROR' | 'EXCEPTION' | null;
  mensaje: string | null;
  fecha: string | null;
}

export interface ClientsResponse {
  total: number;
  items: Client[];
}

export interface ProcessClientResponse {
  external_id: string;
  service_id: string;
  status: 'triggered' | 'OK' | 'ERROR';
  detail: any | null;
}

export interface HealthResponse {
  status: 'ok';
}

export interface ClientsQuery {
  estado?: string;
  search?: string;
  limit?: number;
  offset?: number;
  order?: 'fecha_desc' | 'fecha_asc' | 'external_id_asc' | 'external_id_desc';
}

export type ClientStatus = 'OK' | 'ERROR' | 'EXCEPTION';