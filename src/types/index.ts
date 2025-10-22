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
