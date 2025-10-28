import React, { useState, useEffect } from 'react'

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

interface ClienteEditarModalProps {
    isOpen: boolean
    onClose: () => void
    cliente: Cliente | null
    onSave: (clienteAtualizado: Cliente) => void
}

const ClienteEditarModal: React.FC<ClienteEditarModalProps> = ({ isOpen, onClose, cliente, onSave }) => {
    const [formData, setFormData] = useState<Partial<Cliente>>({})
    const [errors, setErrors] = useState<Partial<Cliente>>({})

    useEffect(() => {
        if (cliente) {
            setFormData({
                nome: cliente.nome,
                email: cliente.email,
                telefone: cliente.telefone,
                empresa: cliente.empresa,
                status: cliente.status
            })
        }
    }, [cliente])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Limpar erro quando o usuário começar a digitar
        if (errors[name as keyof Cliente]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<Cliente> = {}

        if (!formData.nome?.trim()) {
            newErrors.nome = 'Nome é obrigatório'
        }

        if (!formData.email?.trim()) {
            newErrors.email = 'Email é obrigatório'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido'
        }

        if (!formData.telefone?.trim()) {
            newErrors.telefone = 'Telefone é obrigatório'
        }

        if (!formData.empresa?.trim()) {
            newErrors.empresa = 'Empresa é obrigatória'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (validateForm() && cliente) {
            const clienteAtualizado: Cliente = {
                ...cliente,
                ...formData,
                ultimaAtualizacao: new Date().toLocaleDateString('pt-BR')
            }

            onSave(clienteAtualizado)
            onClose()
        }
    }

    const handleClose = () => {
        setFormData({})
        setErrors({})
        onClose()
    }

    if (!isOpen || !cliente) return null

    return (
        <div className="modal-overlay">
            <div className="modal-container modal-large">
                <div className="modal-header">
                    <h2>Editar Cliente - {cliente.nome}</h2>
                    <button className="modal-close" onClick={handleClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="nome">Nome Completo *</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome || ''}
                            onChange={handleInputChange}
                            className={errors.nome ? 'error' : ''}
                            placeholder="Digite o nome completo"
                        />
                        {errors.nome && <span className="error-message">{errors.nome}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                            className={errors.email ? 'error' : ''}
                            placeholder="Digite o email"
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefone">Telefone *</label>
                        <input
                            type="tel"
                            id="telefone"
                            name="telefone"
                            value={formData.telefone || ''}
                            onChange={handleInputChange}
                            className={errors.telefone ? 'error' : ''}
                            placeholder="(11) 99999-9999"
                        />
                        {errors.telefone && <span className="error-message">{errors.telefone}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="empresa">Empresa *</label>
                        <input
                            type="text"
                            id="empresa"
                            name="empresa"
                            value={formData.empresa || ''}
                            onChange={handleInputChange}
                            className={errors.empresa ? 'error' : ''}
                            placeholder="Digite o nome da empresa"
                        />
                        {errors.empresa && <span className="error-message">{errors.empresa}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status || 'pendente'}
                            onChange={handleInputChange}
                        >
                            <option value="pendente">Pendente</option>
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Informações do Sistema</label>
                        <div className="system-info">
                            <div className="info-item">
                                <span className="info-label">ID:</span>
                                <span className="info-value">#{cliente.id.toString().padStart(4, '0')}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Cadastrado em:</span>
                                <span className="info-value">{cliente.dataCadastro}</span>
                            </div>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ClienteEditarModal
