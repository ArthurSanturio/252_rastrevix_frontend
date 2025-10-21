import React, { useState } from 'react'

interface ClienteFormData {
    nome: string
    email: string
    telefone: string
    empresa: string
    status: 'ativo' | 'inativo' | 'pendente'
}

interface ClienteModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (cliente: ClienteFormData) => void
}

const ClienteModal: React.FC<ClienteModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<ClienteFormData>({
        nome: '',
        email: '',
        telefone: '',
        empresa: '',
        status: 'pendente'
    })

    const [errors, setErrors] = useState<Partial<ClienteFormData>>({})

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Limpar erro quando o usuário começar a digitar
        if (errors[name as keyof ClienteFormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<ClienteFormData> = {}

        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido'
        }

        if (!formData.telefone.trim()) {
            newErrors.telefone = 'Telefone é obrigatório'
        }

        if (!formData.empresa.trim()) {
            newErrors.empresa = 'Empresa é obrigatória'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (validateForm()) {
            onSave(formData)
            setFormData({
                nome: '',
                email: '',
                telefone: '',
                empresa: '',
                status: 'pendente'
            })
            setErrors({})
            onClose()
        }
    }

    const handleClose = () => {
        setFormData({
            nome: '',
            email: '',
            telefone: '',
            empresa: '',
            status: 'pendente'
        })
        setErrors({})
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Cadastrar Novo Cliente</h2>
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
                            value={formData.nome}
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
                            value={formData.email}
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
                            value={formData.telefone}
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
                            value={formData.empresa}
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
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <option value="pendente">Pendente</option>
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Cadastrar Cliente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ClienteModal
