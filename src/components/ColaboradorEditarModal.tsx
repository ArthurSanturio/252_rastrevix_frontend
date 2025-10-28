import React, { useState, useEffect } from 'react'

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

interface ColaboradorEditarModalProps {
    isOpen: boolean
    onClose: () => void
    colaborador: Colaborador | null
    onSave: (colaboradorAtualizado: Colaborador) => void
}

interface ColaboradorErrors {
    nome?: string
    email?: string
    telefone?: string
    cargo?: string
    departamento?: string
    salario?: string
}

const ColaboradorEditarModal: React.FC<ColaboradorEditarModalProps> = ({ isOpen, onClose, colaborador, onSave }) => {
    const [formData, setFormData] = useState<Partial<Colaborador>>({})
    const [errors, setErrors] = useState<ColaboradorErrors>({})

    useEffect(() => {
        if (colaborador) {
            setFormData({
                nome: colaborador.nome,
                email: colaborador.email,
                telefone: colaborador.telefone,
                cargo: colaborador.cargo,
                departamento: colaborador.departamento,
                salario: colaborador.salario,
                status: colaborador.status
            })
        }
    }, [colaborador])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        // Convert salario string to number if it's a salario input
        let processedValue: any = value
        if (name === 'salario') {
            const parsed = parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'))
            processedValue = isNaN(parsed) ? value : parsed
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }))

        // Limpar erro quando o usuário começar a digitar
        if (name in errors) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: ColaboradorErrors = {}

        if (!formData.nome?.trim()) {
            newErrors.nome = 'Nome é obrigatório'
        }

        if (!formData.email?.trim()) {
            newErrors.email = 'Email é obrigatório'
        } else if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido'
        }

        if (!formData.telefone?.trim()) {
            newErrors.telefone = 'Telefone é obrigatório'
        }

        if (!formData.cargo?.trim()) {
            newErrors.cargo = 'Cargo é obrigatório'
        }

        if (!formData.departamento) {
            newErrors.departamento = 'Departamento é obrigatório'
        }

        if (formData.salario === undefined || formData.salario === null) {
            newErrors.salario = 'Salário é obrigatório'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (validateForm() && colaborador) {
            const colaboradorAtualizado: Colaborador = {
                ...colaborador,
                ...formData,
                ultimaAtualizacao: new Date().toLocaleDateString('pt-BR')
            }

            onSave(colaboradorAtualizado)
            onClose()
        }
    }

    const handleClose = () => {
        setFormData({})
        setErrors({})
        onClose()
    }

    if (!isOpen || !colaborador) return null

    return (
        <div className="modal-overlay">
            <div className="modal-container modal-large">
                <div className="modal-header">
                    <h2>Editar Colaborador - {colaborador.nome}</h2>
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
                        <label htmlFor="cargo">Cargo *</label>
                        <input
                            type="text"
                            id="cargo"
                            name="cargo"
                            value={formData.cargo || ''}
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
                            value={formData.departamento || ''}
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
                            value={formData.salario || ''}
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
                            value={formData.status || 'treinamento'}
                            onChange={handleInputChange}
                        >
                            <option value="treinamento">Em Treinamento</option>
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Informações do Sistema</label>
                        <div className="system-info">
                            <div className="info-item">
                                <span className="info-label">ID:</span>
                                <span className="info-value">#{colaborador.id.toString().padStart(4, '0')}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Contratado em:</span>
                                <span className="info-value">{colaborador.dataContratacao}</span>
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

export default ColaboradorEditarModal
