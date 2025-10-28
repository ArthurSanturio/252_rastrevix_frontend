import React from 'react'

interface Colaborador {
    id: string
    nome: string
    email: string
    telefone: string
    cargo: string
    departamento: 'tecnologia' | 'gestao' | 'analise' | 'design' | 'comercial' | 'administrativo' | 'rh' | 'financeiro' | 'operacoes' | 'marketing'
    status: 'ativo' | 'inativo' | 'treinamento'
    salario?: number
    dataContratacao: string
    dataDemissao?: string
    endereco?: string
    cidade?: string
    estado?: string
    cep?: string
    cpf?: string
    rg?: string
    dataNascimento?: string
    observacoes?: string
    supervisorId?: string
    dataCadastro: string
    ultimaAtualizacao: string
}

interface ColaboradorDetalhesModalProps {
    isOpen: boolean
    onClose: () => void
    colaborador: Colaborador | null
}

const ColaboradorDetalhesModal: React.FC<ColaboradorDetalhesModalProps> = ({ isOpen, onClose, colaborador }) => {
    if (!isOpen || !colaborador) return null

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'ativo':
                return 'status-ativo'
            case 'inativo':
                return 'status-inativo'
            case 'treinamento':
                return 'status-treinamento'
            default:
                return ''
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'ativo':
                return 'ATIVO'
            case 'inativo':
                return 'INATIVO'
            case 'treinamento':
                return 'TREINAMENTO'
            default:
                return status.toUpperCase()
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container modal-large">
                <div className="modal-header">
                    <h2>Detalhes do Colaborador</h2>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-content">
                    <div className="colaborador-detalhes-header">
                        <div className="colaborador-avatar">
                            <span>{colaborador.nome.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="colaborador-info-header">
                            <h3>{colaborador.nome}</h3>
                            <span className={`status-badge ${getStatusClass(colaborador.status)}`}>
                                {getStatusText(colaborador.status)}
                            </span>
                        </div>
                    </div>

                    <div className="detalhes-grid">
                        <div className="detalhe-item">
                            <label>Nome Completo</label>
                            <p>{colaborador.nome}</p>
                        </div>

                        <div className="detalhe-item">
                            <label>Email</label>
                            <p>{colaborador.email}</p>
                        </div>

                        <div className="detalhe-item">
                            <label>Telefone</label>
                            <p>{colaborador.telefone}</p>
                        </div>

                        <div className="detalhe-item">
                            <label>Cargo</label>
                            <p>{colaborador.cargo}</p>
                        </div>

                        <div className="detalhe-item">
                            <label>Departamento</label>
                            <p>{colaborador.departamento}</p>
                        </div>

                        <div className="detalhe-item">
                            <label>Salário</label>
                            <p className="salario-value">{colaborador.salario}</p>
                        </div>

                        <div className="detalhe-item">
                            <label>Status</label>
                            <span className={`status-badge ${getStatusClass(colaborador.status)}`}>
                                {getStatusText(colaborador.status)}
                            </span>
                        </div>

                        <div className="detalhe-item">
                            <label>Data de Contratação</label>
                            <p>{colaborador.dataContratacao}</p>
                        </div>

                        <div className="detalhe-item">
                            <label>Última Atualização</label>
                            <p>{colaborador.ultimaAtualizacao}</p>
                        </div>

                        <div className="detalhe-item">
                            <label>ID do Colaborador</label>
                            <p className="colaborador-id">#{colaborador.id.toString().padStart(4, '0')}</p>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Fechar
                        </button>
                        <button className="btn btn-primary">
                            Editar Colaborador
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ColaboradorDetalhesModal
