export type MaquinaFilters = {
    search?: string;
    status?: string;
    tipo?: string;
    localizacao?: string;
};

export type Maquina = {
    id: string;
    codigo: string;
    nome: string;
    tipo: 'torno' | 'fresa' | 'soldadora' | 'prensa' | 'cnc' | 'outras';
    status: 'ativa' | 'inativa' | 'manutencao' | 'calibracao';
    fabricante?: string;
    modelo?: string;
    localizacao?: string;
    responsavel?: string;
    eficiencia?: number;
    dataCadastro: string;
    ultimaAtualizacao: string;
};

export type MaquinaResponse = {
    message: string;
    data: {
        maquinas: Maquina[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
};
