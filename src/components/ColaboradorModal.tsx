import React, { useState } from 'react'

// Função auxiliar para formatar salário para exibição
const formatSalarioForDisplay = (value: string | number | undefined): string => {
    if (value === undefined || value === null || value === '') {
        return '';
    }
    // Converter para número se for string
    const num = typeof value === 'string' ? parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.')) : value;
    if (isNaN(num)) {
        return '';
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
};

// Função auxiliar para converter entrada formatada de volta para número
const parseSalarioFromInput = (inputString: string): string => {
    // Remover "R$", espaços, pontos (separador de milhares) e substituir vírgula (separador decimal) por ponto
    return inputString.replace(/[R$\s.]/g, '').replace(',', '.');
};

interface ColaboradorFormData {
    nome: string
    email: string
    telefone: string
    cargo: string
    departamento: 'tecnologia' | 'gestao' | 'analise' | 'design' | 'comercial' | 'administrativo' | 'rh' | 'financeiro' | 'operacoes' | 'marketing'
    salario: string
    status: 'ativo' | 'inativo' | 'treinamento'
    dataContratacao: string
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
        departamento: 'tecnologia',
        salario: '',
        status: 'treinamento',
        dataContratacao: ''
    })

    const [errors, setErrors] = useState<Partial<ColaboradorFormData>>({})

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        if (name === 'salario') {
            // Converter entrada formatada de volta para número limpo
            const parsedValue = parseSalarioFromInput(value);
            setFormData(prev => ({
                ...prev,
                [name]: parsedValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

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
        } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.telefone)) {
            newErrors.telefone = 'Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX'
        }

        if (!formData.cargo.trim()) {
            newErrors.cargo = 'Cargo é obrigatório'
        }

        if (!formData.departamento.trim()) {
            newErrors.departamento = 'Departamento é obrigatório'
        }

        if (!formData.salario.trim()) {
            newErrors.salario = 'Salário é obrigatório'
        } else if (isNaN(Number(formData.salario))) {
            newErrors.salario = 'Salário deve ser um número válido'
        }

        if (!formData.dataContratacao.trim()) {
            newErrors.dataContratacao = 'Data de contratação é obrigatória'
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
                departamento: 'tecnologia',
                salario: '',
                status: 'treinamento',
                dataContratacao: ''
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
            departamento: 'tecnologia',
            salario: '',
            status: 'treinamento',
            dataContratacao: ''
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
                        <select
                            id="departamento"
                            name="departamento"
                            value={formData.departamento}
                            onChange={handleInputChange}
                            className={errors.departamento ? 'error' : ''}
                        >
                            <option value="tecnologia">Tecnologia</option>
                            <option value="gestao">Gestão</option>
                            <option value="analise">Análise</option>
                            <option value="design">Design</option>
                            <option value="comercial">Comercial</option>
                            <option value="administrativo">Administrativo</option>
                            <option value="rh">RH</option>
                            <option value="financeiro">Financeiro</option>
                            <option value="operacoes">Operações</option>
                            <option value="marketing">Marketing</option>
                        </select>
                        {errors.departamento && <span className="error-message">{errors.departamento}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="salario">Salário *</label>
                        <input
                            type="text"
                            id="salario"
                            name="salario"
                            value={formatSalarioForDisplay(formData.salario)}
                            onChange={handleInputChange}
                            className={errors.salario ? 'error' : ''}
                            placeholder="R$ 0.000,00"
                        />
                        {errors.salario && <span className="error-message">{errors.salario}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="dataContratacao">Data de Contratação *</label>
                        <input
                            type="date"
                            id="dataContratacao"
                            name="dataContratacao"
                            value={formData.dataContratacao}
                            onChange={handleInputChange}
                            className={errors.dataContratacao ? 'error' : ''}
                        />
                        {errors.dataContratacao && <span className="error-message">{errors.dataContratacao}</span>}
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
