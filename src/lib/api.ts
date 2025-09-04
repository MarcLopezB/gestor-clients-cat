import type { Client, ClientsResponse, ProcessClientResponse, HealthResponse, ClientsQuery } from '@/types/client';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || this.getDefaultBaseUrl();
  }

  private getDefaultBaseUrl(): string {
    // Prioritat: localStorage > VITE_API_BASE_URL > fallback
    const stored = localStorage.getItem('api_base_url');
    if (stored) return stored;
    
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url;
    localStorage.setItem('api_base_url', url);
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
          // Fallback a text si no és JSON
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
        throw new ApiError(response.status, errorMessage);
      }

      return response.json();
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      
      // Error de xarxa o altres
      throw new ApiError(0, error.message || 'Error de connexió');
    }
  }

  async healthCheck(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  async getClients(query: ClientsQuery = {}): Promise<ClientsResponse> {
    const params = new URLSearchParams();
    
    if (query.estado) params.append('estado', query.estado);
    if (query.search) params.append('search', query.search);
    if (query.limit !== undefined) params.append('limit', query.limit.toString());
    if (query.offset !== undefined) params.append('offset', query.offset.toString());
    if (query.order) params.append('order', query.order);

    const queryString = params.toString();
    const endpoint = `/clients${queryString ? `?${queryString}` : ''}`;
    
    return this.request<ClientsResponse>(endpoint);
  }

  async getClient(externalId: string): Promise<Client> {
    return this.request<Client>(`/clients/${encodeURIComponent(externalId)}`);
  }

  async processClient(externalId: string): Promise<ProcessClientResponse> {
    return this.request<ProcessClientResponse>(`/clients/${encodeURIComponent(externalId)}`, {
      method: 'POST',
    });
  }
}

// Instància singleton
export const apiClient = new ApiClient();