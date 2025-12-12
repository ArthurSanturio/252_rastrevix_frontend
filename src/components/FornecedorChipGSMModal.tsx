import React, { useState } from 'react'

interface FornecedorChipGSMFormData {
  nome: string
  email: string
  telefone: string
  remetente: string
  observacoes: string
}

interface FornecedorChipGSMModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (fornecedor: FornecedorChipGSMFormData) => void
}

const FornecedorChipGSMModal: React.FC<FornecedorChipGSMModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<FornecedorChipGSMFormData>({
    nome: '',
    email: '',
    telefone: '',
    remetente: '',
    observacoes: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FornecedorChipGSMFormData, string>>>({})

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === 'telefone') {
      const formatted = formatPhone(value)
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Limpar erro quando o usuário começar a digitar
    if (errors[name as keyof FornecedorChipGSMFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FornecedorChipGSMFormData, string>> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome do fornecedor é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.remetente.trim()) {
      newErrors.remetente = 'Remetente é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.remetente)) {
      newErrors.remetente = 'Remetente deve ser um email válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSave(formData)

      // Limpar formulário
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        remetente: '',
        observacoes: ''
      })
      setErrors({})
      onClose()
    }
  }

  const handleClose = () => {
    setErrors({})
    // Limpar formulário ao fechar
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      remetente: '',
      observacoes: ''
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Cadastrar Fornecedor</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem' }}>
            Todos os campos com (*) são obrigatórios para fazer o cadastro
          </p>

          <div className="form-section">
            <h3 className="form-section-title">Dados</h3>

            <div className="form-group">
              <label htmlFor="nome">Nome do Fornecedor *</label>
              <div className="input-with-icon">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className={errors.nome ? 'error' : ''}
                  placeholder="Ex: ARQIA"
                  required
                />
              </div>
              {errors.nome && <span className="error-message">{errors.nome}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email do Fornecedor *</label>
              <div className="input-with-icon">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Ex: atendimento@arqia.com.br"
                  required
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="telefone">Telefone do Fornecedor</label>
              <div className="input-with-icon">
                <span className="input-icon">📞</span>
                <input
                  type="text"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  placeholder="Ex: (11) 99999-9999"
                  maxLength={15}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="remetente">Email do Remetente *</label>
              <div className="input-with-icon">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  id="remetente"
                  name="remetente"
                  value={formData.remetente}
                  onChange={handleInputChange}
                  className={errors.remetente ? 'error' : ''}
                  placeholder="Ex: rastrevix@paradadasmultas.com.br"
                  required
                />
              </div>
              {errors.remetente && <span className="error-message">{errors.remetente}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Observações</h3>
            <div className="form-group">
              <label htmlFor="observacoes">Observações</label>
              <div className="input-with-icon">
                <span className="input-icon">📝</span>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  placeholder="Digite observações sobre o fornecedor..."
                  rows={4}
                  className="form-textarea"
                />
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-danger" onClick={handleClose}>
              <span style={{ marginRight: '8px' }}>✕</span>
              CANCELAR
            </button>
            <button type="submit" className="btn btn-primary">
              <span style={{ marginRight: '8px' }}>+</span>
              CADASTRAR
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FornecedorChipGSMModal
