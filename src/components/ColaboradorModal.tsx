import React, { useState } from 'react'

interface ColaboradorFormData {
    nome: string
    email: string
    telefone: string
    cargo: string
    departamento: string
    salario: string
    status: 'ativo' | 'inativo' | 'treinamento'
}

interface ColaboradorModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (colaborador: ColaboradorFormData) => void
}

const ColaboradorModal: React.FC<ColaboradorModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<ColaboradorFormData>({
        nome: '',
        email: '',
        telefone: '',
        cargo: '',
        departamento: '',
        salario: '',
        status: 'treinamento'
    })

    const [errors, setErrors] = useState<Partial<ColaboradorFormData>>({})

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Limpar erro quando o usuário começar a digitar
        if (errors[name as keyof ColaboradorFormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<ColaboradorFormData> = {}

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

        if (!formData.cargo.trim()) {
            newErrors.cargo = 'Cargo é obrigatório'
        }

        if (!formData.departamento.trim()) {
            newErrors.departamento = 'Departamento é obrigatório'
        }

        if (!formData.salario.trim()) {
            newErrors.salario = 'Salário é obrigatório'
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
                cargo: '',
                departamento: '',
                salario: '',
                status: 'treinamento'
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
            cargo: '',
            departamento: '',
            salario: '',
            status: 'treinamento'
        })
        setErrors({})
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Cadastrar Novo Colaborador</h2>
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
                        <label htmlFor="cargo">Cargo *</label>
                        <input
                            type="text"
                            id="cargo"
                            name="cargo"
                            value={formData.cargo}
                            onChange={handleInputChange}
                            className={errors.cargo ? 'error' : ''}
                            placeholder="Digite o cargo"
                        />
                        {errors.cargo && <span className="error-message">{errors.cargo}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="departamento">Departamento *</label>
                        <input
                            type="text"
                            id="departamento"
                            name="departamento"
                            value={formData.departamento}
                            onChange={handleInputChange}
                            className={errors.departamento ? 'error' : ''}
                            placeholder="Digite o departamento"
                        />
                        {errors.departamento && <span className="error-message">{errors.departamento}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="salario">Salário *</label>
                        <input
                            type="text"
                            id="salario"
                            name="salario"
                            value={formData.salario}
                            onChange={handleInputChange}
                            className={errors.salario ? 'error' : ''}
                            placeholder="R$ 0.000,00"
                        />
                        {errors.salario && <span className="error-message">{errors.salario}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <option value="treinamento">Em Treinamento</option>
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Cadastrar Colaborador
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ColaboradorModal
