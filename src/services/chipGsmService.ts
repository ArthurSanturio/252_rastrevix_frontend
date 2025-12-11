import { apiService } from './api';

export interface ChipGSM {
  id: string;
  numero: string;
  status: 'ativo' | 'inativo' | 'bloqueado';
  cliente?: string;
  clienteId?: string;
  telefone?: string;
  operadora?: string;
  veiculoInstalado?: string;
  equipamento?: string;
  equipamentoId?: string;
  fornecedor?: string;
  fornecedorId?: string;
  matrizFranquia?: string;
  iccid?: string;
  planoGsm?: string;
  quantidadeMB?: number;
  valorMensal?: number;
  dataAtivacao?: string;
  observacoes?: string;
  dataCadastro: string;
  ultimaAtualizacao: string;
}

export interface ChipGSMCreateData {
  numero: string;
  status?: 'ativo' | 'inativo' | 'bloqueado';
  clienteId?: string;
  telefone?: string;
  operadora?: string;
  veiculoInstalado?: string;
  equipamentoId?: string;
  fornecedorId?: string;
  matrizFranquia?: string;
  iccid?: string;
  planoGsm?: string;
  quantidadeMB?: number;
  valorMensal?: number;
  dataAtivacao?: string;
  observacoes?: string;
}

export interface ChipGSMUpdateData extends Partial<ChipGSMCreateData> {
  id: string;
}

export interface ChipGSMListResponse {
  message: string;
  data: {
    chips: ChipGSM[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface ChipGSMResponse {
  message: string;
  data: {
    chip: ChipGSM;
  };
}

class ChipGsmService {
  private baseEndpoint = '/chips-gsm';

  // Listar chips GSM com filtros e paginação
  async listarChipsGsm(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    operadora?: string;
  }): Promise<ChipGSMListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.operadora) queryParams.append('operadora', params.operadora);

    const endpoint = queryParams.toString()
      ? `${this.baseEndpoint}?${queryParams.toString()}`
      : this.baseEndpoint;

    return apiService.request<ChipGSMListResponse>(endpoint);
  }

  // Obter chip GSM por ID
  async obterChipGsm(id: string): Promise<ChipGSMResponse> {
    return apiService.request<ChipGSMResponse>(`${this.baseEndpoint}/${id}`);
  }

  // Criar novo chip GSM
  async criarChipGsm(data: ChipGSMCreateData): Promise<ChipGSMResponse> {
    return apiService.request<ChipGSMResponse>(this.baseEndpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Atualizar chip GSM
  async atualizarChipGsm(id: string, data: Partial<ChipGSMCreateData>): Promise<ChipGSMResponse> {
    return apiService.request<ChipGSMResponse>(`${this.baseEndpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Excluir chip GSM
  async excluirChipGsm(id: string): Promise<{ message: string }> {
    return apiService.request<{ message: string }>(`${this.baseEndpoint}/${id}`, {
      method: 'DELETE',
    });
  }
}

export const chipGsmService = new ChipGsmService();
