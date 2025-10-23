import React, { useState } from 'react'

// Função auxiliar para formatar valor para exibição
const formatValorForDisplay = (value: string | number | undefined): string => {
    if (value === undefined || value === null || value === '') {
        return '';
    }
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
const parseValorFromInput = (inputString: string): string => {
    return inputString.replace(/[R$\s.]/g, '').replace(',', '.');
};

interface MaquinaFormData {
    codigo: string
    nome: string
    tipo: 'torno' | 'fresa' | 'soldadora' | 'prensa' | 'cnc' | 'outras'
    status: 'ativa' | 'inativa' | 'manutencao' | 'calibracao'
    fabricante: string
    modelo: string
    numeroSerie: string
    dataFabricacao: string
    dataInstalacao: string
    valorCompra: string
    eficiencia: string
    localizacao: string
    responsavel: string
    especificacoes: string
    observacoes: string
    proximaManutencao: string
    ultimaManutencao: string
    horasTrabalhadas: string
    horasManutencao: string
}

interface MaquinaModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (maquina: MaquinaFormData) => void
}

const MaquinaModal: React.FC<MaquinaModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<MaquinaFormData>({
        codigo: '',
        nome: '',
        tipo: 'outras',
        status: 'ativa',
        fabricante: '',
        modelo: '',
        numeroSerie: '',
        dataFabricacao: '',
        dataInstalacao: '',
        valorCompra: '',
        eficiencia: '',
        localizacao: '',
        responsavel: '',
        especificacoes: '',
        observacoes: '',
        proximaManutencao: '',
        ultimaManutencao: '',
        horasTrabalhadas: '',
        horasManutencao: ''
    })

    const [errors, setErrors] = useState<Partial<MaquinaFormData>>({})

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        if (name === 'valorCompra') {
            const parsedValue = parseValorFromInput(value);
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
        if (errors[name as keyof MaquinaFormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<MaquinaFormData> = {}

        if (!formData.codigo.trim()) {
            newErrors.codigo = 'Código é obrigatório'
        }

        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório'
        }

        if (formData.valorCompra && isNaN(Number(formData.valorCompra))) {
            newErrors.valorCompra = 'Valor deve ser um número válido'
        }

        if (formData.eficiencia && (isNaN(Number(formData.eficiencia)) || Number(formData.eficiencia) < 0 || Number(formData.eficiencia) > 100)) {
            newErrors.eficiencia = 'Eficiência deve ser um número entre 0 e 100'
        }

        if (formData.horasTrabalhadas && (isNaN(Number(formData.horasTrabalhadas)) || Number(formData.horasTrabalhadas) < 0)) {
            newErrors.horasTrabalhadas = 'Horas trabalhadas deve ser um número positivo'
        }

        if (formData.horasManutencao && (isNaN(Number(formData.horasManutencao)) || Number(formData.horasManutencao) < 0)) {
            newErrors.horasManutencao = 'Horas de manutenção deve ser um número positivo'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (validateForm()) {
            onSave(formData)
            setFormData({
                codigo: '',
                nome: '',
                tipo: 'outras',
                status: 'ativa',
                fabricante: '',
                modelo: '',
                numeroSerie: '',
                dataFabricacao: '',
                dataInstalacao: '',
                valorCompra: '',
                eficiencia: '',
                localizacao: '',
                responsavel: '',
                especificacoes: '',
                observacoes: '',
                proximaManutencao: '',
                ultimaManutencao: '',
                horasTrabalhadas: '',
                horasManutencao: ''
            })
            setErrors({})
            onClose()
        }
    }

    const handleClose = () => {
        setFormData({
            codigo: '',
            nome: '',
            tipo: 'outras',
            status: 'ativa',
            fabricante: '',
            modelo: '',
            numeroSerie: '',
            dataFabricacao: '',
            dataInstalacao: '',
            valorCompra: '',
            eficiencia: '',
            localizacao: '',
            responsavel: '',
            especificacoes: '',
            observacoes: '',
            proximaManutencao: '',
            ultimaManutencao: '',
            horasTrabalhadas: '',
            horasManutencao: ''
        })
        setErrors({})
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="modal-overlay">
            <div className="modal-container modal-large">
                <div className="modal-header">
                    <h2>Cadastrar Nova Máquina</h2>
                    <button className="modal-close" onClick={handleClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="codigo">Código da Máquina *</label>
                            <input
                                type="text"
                                id="codigo"
                                name="codigo"
                                value={formData.codigo}
                                onChange={handleInputChange}
                                className={errors.codigo ? 'error' : ''}
                                placeholder="Ex: CNC-001"
                            />
                            {errors.codigo && <span className="error-message">{errors.codigo}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="nome">Nome da Máquina *</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleInputChange}
                                className={errors.nome ? 'error' : ''}
                                placeholder="Ex: Torno CNC"
                            />
                            {errors.nome && <span className="error-message">{errors.nome}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="tipo">Tipo</label>
                            <select
                                id="tipo"
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleInputChange}
                            >
                                <option value="torno">Torno</option>
                                <option value="fresa">Fresa</option>
                                <option value="soldadora">Soldadora</option>
                                <option value="prensa">Prensa</option>
                                <option value="cnc">CNC</option>
                                <option value="outras">Outras</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                <option value="ativa">Ativa</option>
                                <option value="inativa">Inativa</option>
                                <option value="manutencao">Em Manutenção</option>
                                <option value="calibracao">Em Calibração</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="fabricante">Fabricante</label>
                            <input
                                type="text"
                                id="fabricante"
                                name="fabricante"
                                value={formData.fabricante}
                                onChange={handleInputChange}
                                placeholder="Ex: Haas"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="modelo">Modelo</label>
                            <input
                                type="text"
                                id="modelo"
                                name="modelo"
                                value={formData.modelo}
                                onChange={handleInputChange}
                                placeholder="Ex: VF-2"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="numeroSerie">Número de Série</label>
                            <input
                                type="text"
                                id="numeroSerie"
                                name="numeroSerie"
                                value={formData.numeroSerie}
                                onChange={handleInputChange}
                                placeholder="Ex: SN123456"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="localizacao">Localização</label>
                            <input
                                type="text"
                                id="localizacao"
                                name="localizacao"
                                value={formData.localizacao}
                                onChange={handleInputChange}
                                placeholder="Ex: Setor A - Linha 1"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="dataFabricacao">Data de Fabricação</label>
                            <input
                                type="date"
                                id="dataFabricacao"
                                name="dataFabricacao"
                                value={formData.dataFabricacao}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dataInstalacao">Data de Instalação</label>
                            <input
                                type="date"
                                id="dataInstalacao"
                                name="dataInstalacao"
                                value={formData.dataInstalacao}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="valorCompra">Valor de Compra</label>
                            <input
                                type="text"
                                id="valorCompra"
                                name="valorCompra"
                                value={formatValorForDisplay(formData.valorCompra)}
                                onChange={handleInputChange}
                                className={errors.valorCompra ? 'error' : ''}
                                placeholder="R$ 0.000,00"
                            />
                            {errors.valorCompra && <span className="error-message">{errors.valorCompra}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="eficiencia">Eficiência (%)</label>
                            <input
                                type="number"
                                id="eficiencia"
                                name="eficiencia"
                                value={formData.eficiencia}
                                onChange={handleInputChange}
                                className={errors.eficiencia ? 'error' : ''}
                                placeholder="0-100"
                                min="0"
                                max="100"
                            />
                            {errors.eficiencia && <span className="error-message">{errors.eficiencia}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="responsavel">Responsável</label>
                            <input
                                type="text"
                                id="responsavel"
                                name="responsavel"
                                value={formData.responsavel}
                                onChange={handleInputChange}
                                placeholder="Nome do responsável"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="horasTrabalhadas">Horas Trabalhadas</label>
                            <input
                                type="number"
                                id="horasTrabalhadas"
                                name="horasTrabalhadas"
                                value={formData.horasTrabalhadas}
                                onChange={handleInputChange}
                                className={errors.horasTrabalhadas ? 'error' : ''}
                                placeholder="0"
                                min="0"
                            />
                            {errors.horasTrabalhadas && <span className="error-message">{errors.horasTrabalhadas}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="ultimaManutencao">Última Manutenção</label>
                            <input
                                type="date"
                                id="ultimaManutencao"
                                name="ultimaManutencao"
                                value={formData.ultimaManutencao}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="proximaManutencao">Próxima Manutenção</label>
                            <input
                                type="date"
                                id="proximaManutencao"
                                name="proximaManutencao"
                                value={formData.proximaManutencao}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="especificacoes">Especificações Técnicas</label>
                        <textarea
                            id="especificacoes"
                            name="especificacoes"
                            value={formData.especificacoes}
                            onChange={handleInputChange}
                            placeholder="Especificações técnicas da máquina..."
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="observacoes">Observações</label>
                        <textarea
                            id="observacoes"
                            name="observacoes"
                            value={formData.observacoes}
                            onChange={handleInputChange}
                            placeholder="Observações adicionais..."
                            rows={3}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Cadastrar Máquina
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default MaquinaModal
