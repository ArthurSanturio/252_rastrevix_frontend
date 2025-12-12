import { apiService } from './api';

export interface FornecedorChipGSM {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  remetente: string;
  observacoes?: string;
  dataCadastro: string;
  ultimaAtualizacao: string;
}

export interface FornecedorChipGSMCreateData {
  nome: string;
  email: string;
  telefone?: string;
  remetente: string;
  observacoes?: string;
}

export interface FornecedorChipGSMUpdateData extends Partial<FornecedorChipGSMCreateData> {
  id: string;
}

export interface FornecedorChipGSMListResponse {
  message: string;
  data: {
    fornecedores: FornecedorChipGSM[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface FornecedorChipGSMResponse {
  message: string;
  data: {
    fornecedor: FornecedorChipGSM;
  };
}

class FornecedorChipGsmService {
  private baseEndpoint = '/fornecedores-chip-gsm';

  // Listar fornecedores com filtros e paginação
  async listarFornecedores(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<FornecedorChipGSMListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const endpoint = queryParams.toString()
      ? `${this.baseEndpoint}?${queryParams.toString()}`
      : this.baseEndpoint;

    return apiService.request<FornecedorChipGSMListResponse>(endpoint);
  }

  // Obter fornecedor por ID
  async obterFornecedor(id: string): Promise<FornecedorChipGSMResponse> {
    return apiService.request<FornecedorChipGSMResponse>(`${this.baseEndpoint}/${id}`);
  }

  // Criar novo fornecedor
  async criarFornecedor(data: FornecedorChipGSMCreateData): Promise<FornecedorChipGSMResponse> {
    return apiService.request<FornecedorChipGSMResponse>(this.baseEndpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Atualizar fornecedor
  async atualizarFornecedor(id: string, data: Partial<FornecedorChipGSMCreateData>): Promise<FornecedorChipGSMResponse> {
    return apiService.request<FornecedorChipGSMResponse>(`${this.baseEndpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Excluir fornecedor
  async excluirFornecedor(id: string): Promise<{ message: string }> {
    return apiService.request<{ message: string }>(`${this.baseEndpoint}/${id}`, {
      method: 'DELETE',
    });
  }
}

export const fornecedorChipGsmService = new FornecedorChipGsmService();
