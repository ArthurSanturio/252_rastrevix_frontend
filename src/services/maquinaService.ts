import type { Maquina, MaquinaFilters, MaquinaResponse } from '../types';

// Updated: 2025-01-20 - Force Vite reload
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class MaquinaService {
    private baseURL: string;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const token = localStorage.getItem('accessToken');

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                let errorData: any;
                try {
                    errorData = await response.json();
                } catch {
                    errorData = {
                        error: `HTTP ${response.status}: ${response.statusText}`,
                        code: response.status.toString()
                    };
                }
                throw new Error(errorData.error || `Erro na requisição: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro de conexão com o servidor');
        }
    }

    async getMaquinas(filters: MaquinaFilters = {}): Promise<MaquinaResponse> {
        const params = new URLSearchParams();

        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.tipo) params.append('tipo', filters.tipo);

        const queryString = params.toString();
        const endpoint = `/maquinas${queryString ? `?${queryString}` : ''}`;

        return this.request<MaquinaResponse>(endpoint);
    }

    async getMaquinaById(id: string): Promise<{ message: string; data: { maquina: Maquina } }> {
        return this.request<{ message: string; data: { maquina: Maquina } }>(`/maquinas/${id}`);
    }
}

export const maquinaService = new MaquinaService();
export default maquinaService;