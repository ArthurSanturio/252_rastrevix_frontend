import { apiService } from './api';
import type {
    Rastreador,
    RastreadorComPosicao,
    RastreadorListResponse,
    RastreadorPosicaoResponse,
    RastreadorDadosResponse,
    RastreadorEventosResponse
} from '../types';

class RastreadorService {
    private baseEndpoint = '/rastreadores';

    // Listar rastreadores com filtros e paginação
    async listarRastreadores(params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
    }): Promise<RastreadorListResponse> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.status) queryParams.append('status', params.status);

        const endpoint = queryParams.toString()
            ? `${this.baseEndpoint}?${queryParams.toString()}`
            : this.baseEndpoint;

        return apiService.request<RastreadorListResponse>(endpoint);
    }

    // Obter rastreador por ID
    async obterRastreador(id: string): Promise<{ message: string; data: { rastreador: Rastreador } }> {
        return apiService.request<{ message: string; data: { rastreador: Rastreador } }>(`${this.baseEndpoint}/${id}`);
    }

    // Obter posição atual de um rastreador
    async obterPosicaoAtual(id: string): Promise<RastreadorPosicaoResponse> {
        return apiService.request<RastreadorPosicaoResponse>(`${this.baseEndpoint}/${id}/posicao-atual`);
    }

    // Obter dados históricos de um rastreador
    async obterDados(id: string, params?: {
        page?: number;
        limit?: number;
        dataInicio?: string;
        dataFim?: string;
    }): Promise<RastreadorDadosResponse> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.dataInicio) queryParams.append('dataInicio', params.dataInicio);
        if (params?.dataFim) queryParams.append('dataFim', params.dataFim);

        const endpoint = queryParams.toString()
            ? `${this.baseEndpoint}/${id}/dados?${queryParams.toString()}`
            : `${this.baseEndpoint}/${id}/dados`;

        return apiService.request<RastreadorDadosResponse>(endpoint);
    }

    // Listar todos os rastreadores com suas posições atuais (para o mapa)
    async listarRastreadoresComPosicoes(): Promise<RastreadorComPosicao[]> {
        try {
            // Buscar todos os rastreadores ativos
            const response = await this.listarRastreadores({
                limit: 1000, // Limite alto para pegar todos
                status: 'ativo'
            });

            const rastreadores = response.data.rastreadores;

            // Buscar posição atual de cada rastreador
            const rastreadoresComPosicoes = await Promise.allSettled(
                rastreadores.map(async (rastreador) => {
                    try {
                        const posicaoResponse = await this.obterPosicaoAtual(rastreador.id);
                        return {
                            ...rastreador,
                            posicaoAtual: posicaoResponse.data.posicao
                        } as RastreadorComPosicao;
                    } catch (error) {
                        // Se não houver posição, retorna o rastreador sem posição
                        return {
                            ...rastreador,
                            posicaoAtual: undefined
                        } as RastreadorComPosicao;
                    }
                })
            );

            return rastreadoresComPosicoes
                .filter((result): result is PromiseFulfilledResult<RastreadorComPosicao> =>
                    result.status === 'fulfilled'
                )
                .map(result => result.value)
                .filter(rastreador =>
                    rastreador.posicaoAtual?.latitude &&
                    rastreador.posicaoAtual?.longitude
                );
        } catch (error) {
            console.error('Erro ao listar rastreadores com posições:', error);
            return [];
        }
    }

    // Criar novo rastreador
    async criarRastreador(dados: Partial<Rastreador>): Promise<{ message: string; data: { rastreador: Rastreador } }> {
        return apiService.request<{ message: string; data: { rastreador: Rastreador } }>(this.baseEndpoint, {
            method: 'POST',
            body: JSON.stringify(dados),
        });
    }

    // Atualizar rastreador
    async atualizarRastreador(id: string, dados: Partial<Rastreador>): Promise<{ message: string; data: { rastreador: Rastreador } }> {
        return apiService.request<{ message: string; data: { rastreador: Rastreador } }>(`${this.baseEndpoint}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dados),
        });
    }

    // Deletar rastreador
    async deletarRastreador(id: string): Promise<{ message: string }> {
        return apiService.request<{ message: string }>(`${this.baseEndpoint}/${id}`, {
            method: 'DELETE',
        });
    }

    // Obter eventos de um rastreador
    async obterEventos(id: string, params?: {
        page?: number;
        limit?: number;
        dataInicio?: string;
        dataFim?: string;
        eventoId?: number;
    }): Promise<RastreadorEventosResponse> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.dataInicio) queryParams.append('dataInicio', params.dataInicio);
        if (params?.dataFim) queryParams.append('dataFim', params.dataFim);
        if (params?.eventoId) queryParams.append('eventoId', params.eventoId.toString());

        const endpoint = queryParams.toString()
            ? `${this.baseEndpoint}/${id}/eventos?${queryParams.toString()}`
            : `${this.baseEndpoint}/${id}/eventos`;

        return apiService.request<RastreadorEventosResponse>(endpoint);
    }
}

export const rastreadorService = new RastreadorService();
export default rastreadorService;
