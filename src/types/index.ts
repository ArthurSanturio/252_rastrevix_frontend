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
    latitude?: number;
    longitude?: number;
    clienteId?: string;
    placa?: string;
    grupo?: string;
    equipamento?: string;
    equipamentoNumero?: string;
    dataInstalacaoEquipamento?: string;
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

// Cliente types
export interface Cliente {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    empresa: string;
    status: 'ativo' | 'inativo' | 'pendente';
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    cnpj?: string;
    observacoes?: string;
    contatoResponsavel?: string;
    telefoneResponsavel?: string;
    dataCadastro: string;
    ultimaAtualizacao: string;
}

export interface ClienteCreateData {
    nome: string;
    email: string;
    telefone: string;
    empresa: string;
    status?: 'ativo' | 'inativo' | 'pendente';
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    cnpj?: string;
    observacoes?: string;
    contatoResponsavel?: string;
    telefoneResponsavel?: string;
}

// Colaborador types
export interface Colaborador {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    cargo: string;
    departamento: 'tecnologia' | 'gestao' | 'analise' | 'design' | 'comercial' | 'administrativo' | 'rh' | 'financeiro' | 'operacoes' | 'marketing';
    status: 'ativo' | 'inativo' | 'treinamento';
    salario?: number;
    dataContratacao: string;
    dataDemissao?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    cpf?: string;
    rg?: string;
    dataNascimento?: string;
    observacoes?: string;
    supervisorId?: string;
    dataCadastro: string;
    ultimaAtualizacao: string;
}

export interface ColaboradorCreateData {
    nome: string;
    email: string;
    telefone: string;
    cargo: string;
    departamento: 'tecnologia' | 'gestao' | 'analise' | 'design' | 'comercial' | 'administrativo' | 'rh' | 'financeiro' | 'operacoes' | 'marketing';
    status?: 'ativo' | 'inativo' | 'treinamento';
    salario?: number;
    dataContratacao: string;
    dataDemissao?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    cpf?: string;
    rg?: string;
    dataNascimento?: string;
    observacoes?: string;
    supervisorId?: string;
}

// Rastreador types
export interface Rastreador {
    id: string;
    numeroSerial: string;
    imei: string;
    status: 'ativo' | 'inativo' | 'manutencao' | 'bloqueado';
    modelo?: string;
    fabricante?: string;
    versaoFirmware?: string;
    observacoes?: string;
    placa?: string;
    nome?: string;
    condutor?: string;
    tipoVeiculo?: 'onibus' | 'caminhao' | 'carro';
    bloqueado?: boolean;
    tipoTransmissao?: string;
    dataCadastro: string;
    ultimaAtualizacao: string;
    ultimaComunicacao?: string;
}

export interface DadosRastreador {
    id: string;
    rastreadorId: string;
    timestamp: string;
    latitude?: number;
    longitude?: number;
    altitude?: number;
    velocidade?: number;
    direcao?: number;
    satelites?: number;
    ignicao?: boolean;
    odometro?: number;
    horimetro?: number;
    tensaoEntrada?: number;
    tensaoBateria?: number;
    velocidadeCAN?: number;
    rpm?: number;
    combustivel?: number;
    temperatura?: number;
    canAtivo?: boolean;
    eventoId?: number;
    eventoStatus?: string;
    eventoNome?: string;
}

export interface RastreadorComPosicao extends Rastreador {
    posicaoAtual?: DadosRastreador;
}

export interface RastreadorListResponse {
    message: string;
    data: {
        rastreadores: Rastreador[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
}

export interface RastreadorPosicaoResponse {
    message: string;
    data: {
        posicao: DadosRastreador;
    };
}

export interface RastreadorDadosResponse {
    message: string;
    data: {
        rastreador: Rastreador;
        dados: DadosRastreador[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
}
