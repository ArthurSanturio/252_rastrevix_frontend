import React from 'react'

interface Cliente {
    id: string
    nome: string
    email: string
    telefone: string
    empresa: string
    status: 'ativo' | 'inativo' | 'pendente'
    dataCadastro: string
    ultimaAtualizacao: string
}

interface ClienteDetalhesModalProps {
    isOpen: boolean
    onClose: () => void
    cliente: Cliente | null
}

const ClienteDetalhesModal: React.FC<ClienteDetalhesModalProps> = ({ isOpen, onClose, cliente }) => {
    if (!isOpen || !cliente) return null

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'ativo':
                return 'status-ativo'
            case 'inativo':
                return 'status-inativo'
            case 'pendente':
                return 'status-pendente'
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
            case 'pendente':
                return 'PENDENTE'
            default:
                return status.toUpperCase()
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container modal-large">
                <div className="modal-header">
                    <h2>Detalhes do Cliente</h2>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-content">
                    <div className="cliente-detalhes-header">
                        <div className="cliente-avatar">
                            <span>{cliente.nome.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="cliente-info-header">
                            <h3>{cliente.nome}</h3>
                            <span className={`status-badge ${getStatusClass(cliente.status)}`}>
                                {getStatusText(cliente.status)}
                            </span>
                        </div>
                    </div>

                    <div className="detalhes-grid">
                        <div className="detalhe-item">
                            <label>Nome Completo</label>
                            <p>{cliente.nome}</p>
                        </div>

                        <div className="detalhe-item">
                            <label>Email</label>
                            <p>{cliente.email}</p>
                        </div>

                        <div className="detalhe-item">
                            <label>Telefone</label>
                            <p>{cliente.telefone}</p>
                        </div>

                        <div className="detalhe-item">
                            <label>Empresa</label>
                            <p>{cliente.empresa}</p>
                        </div>

                        <div className="detalhe-item">
                            <label>Status</label>
                            <span className={`status-badge ${getStatusClass(cliente.status)}`}>
                                {getStatusText(cliente.status)}
                            </span>
                        </div>

                        <div className="detalhe-item">
                            <label>Data de Cadastro</label>
                            <p>{cliente.dataCadastro}</p>
                        </div>

                        <div className="detalhe-item">
                            <label>Última Atualização</label>
                            <p>{cliente.ultimaAtualizacao}</p>
                        </div>

                        <div className="detalhe-item">
                            <label>ID do Cliente</label>
                            <p className="cliente-id">#{cliente.id.toString().padStart(4, '0')}</p>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Fechar
                        </button>
                        <button className="btn btn-primary">
                            Editar Cliente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClienteDetalhesModal
