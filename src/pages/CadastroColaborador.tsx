"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import ColaboradorModal from "../components/ColaboradorModal"
import ColaboradorDetalhesModal from "../components/ColaboradorDetalhesModal"
import ColaboradorEditarModal from "../components/ColaboradorEditarModal"
import { colaboradorService } from "../services/colaboradorService"
import "../styles/colaboradores.css"
import "../styles/dashboard-pages.css"

// Interfaces locais para evitar problemas de importação
interface Colaborador {
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

interface ColaboradorCreateData {
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

const CadastroColaborador: React.FC = () => {
  const { user } = useAuth()
  const userName = user?.name || "Usuário"
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetalhesModalOpen, setIsDetalhesModalOpen] = useState(false)
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false)
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState<Colaborador | null>(null)

  // Estados para dados reais
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    inativos: 0,
    treinamento: 0
  })

  // Carregar dados dos colaboradores
  const carregarColaboradores = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await colaboradorService.listarColaboradores({
        search: searchTerm || undefined,
        status: statusFilter !== "todos" ? statusFilter : undefined,
        limit: 100 // Carregar mais colaboradores para demonstração
      })

      setColaboradores(response.data.colaboradores)
    } catch (err) {
      console.error('Erro ao carregar colaboradores:', err)
      setError('Erro ao carregar colaboradores. Verifique sua conexão.')
    } finally {
      setLoading(false)
    }
  }

  // Carregar estatísticas
  const carregarEstatisticas = async () => {
    try {
      const response = await colaboradorService.obterEstatisticas()
      setStats(response.data)
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err)
    }
  }

  // Carregar dados quando o componente monta
  useEffect(() => {
    carregarColaboradores()
    carregarEstatisticas()
  }, [])

  // Recarregar quando filtros mudam
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carregarColaboradores()
    }, 500) // Debounce de 500ms

    return () => clearTimeout(timeoutId)
  }, [searchTerm, statusFilter])

  // Filtrar colaboradores localmente (já vem filtrado da API, mas mantemos para consistência)
  const colaboradoresFiltrados = colaboradores.filter(colaborador => {
    const matchesSearch = colaborador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      colaborador.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      colaborador.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      colaborador.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || colaborador.status === statusFilter

    return matchesSearch && matchesStatus
  })

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

  const handleSaveColaborador = async (novoColaborador: ColaboradorCreateData) => {
    try {
      await colaboradorService.criarColaborador(novoColaborador)

      // Recarregar lista de colaboradores e estatísticas
      await carregarColaboradores()
      await carregarEstatisticas()

    alert(`Colaborador ${novoColaborador.nome} cadastrado com sucesso!`)
      setIsModalOpen(false)
    } catch (err) {
      console.error('Erro ao salvar colaborador:', err)
      alert('Erro ao cadastrar colaborador. Tente novamente.')
    }
  }

  const handleVerDetalhes = (colaborador: Colaborador) => {
    setColaboradorSelecionado(colaborador)
    setIsDetalhesModalOpen(true)
  }

  const handleEditarColaborador = (colaborador: Colaborador) => {
    setColaboradorSelecionado(colaborador)
    setIsEditarModalOpen(true)
  }

  const handleSalvarEdicao = async (colaboradorAtualizado: Colaborador) => {
    try {
      // Preparar dados para envio, removendo campos vazios
      const dadosParaEnvio = {
        id: colaboradorAtualizado.id,
        nome: colaboradorAtualizado.nome,
        email: colaboradorAtualizado.email,
        telefone: colaboradorAtualizado.telefone,
        cargo: colaboradorAtualizado.cargo,
        departamento: colaboradorAtualizado.departamento,
        status: colaboradorAtualizado.status,
        salario: colaboradorAtualizado.salario || undefined,
        dataContratacao: colaboradorAtualizado.dataContratacao,
        dataDemissao: colaboradorAtualizado.dataDemissao || undefined,
        endereco: colaboradorAtualizado.endereco || undefined,
        cidade: colaboradorAtualizado.cidade || undefined,
        estado: colaboradorAtualizado.estado || undefined,
        cep: colaboradorAtualizado.cep || undefined,
        cpf: colaboradorAtualizado.cpf || undefined,
        rg: colaboradorAtualizado.rg || undefined,
        dataNascimento: colaboradorAtualizado.dataNascimento || undefined,
        observacoes: colaboradorAtualizado.observacoes || undefined,
        supervisorId: colaboradorAtualizado.supervisorId || undefined
      }

      console.log('Dados sendo enviados para atualização:', dadosParaEnvio)

      await colaboradorService.atualizarColaborador(dadosParaEnvio)

      // Recarregar lista de colaboradores e estatísticas
      await carregarColaboradores()
      await carregarEstatisticas()

    alert(`Colaborador ${colaboradorAtualizado.nome} atualizado com sucesso!`)
      setIsEditarModalOpen(false)
    } catch (err) {
      console.error('Erro ao atualizar colaborador:', err)
      alert('Erro ao atualizar colaborador. Tente novamente.')
    }
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-welcome">
        <h2>Lista de Colaboradores, {userName}!</h2>
        <p>Visualize e gerencie todos os colaboradores cadastrados</p>
      </div>

      {/* Estatísticas */}
      <div className="dashboard-grid">
        <div className="card card-elevated">
          <div className="stats-content">
            <h3>TOTAL DE COLABORADORES</h3>
            <p className="stats-number">{stats.total}</p>
            <span className="stats-change positive">+{stats.ativos} ativos</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>COLABORADORES ATIVOS</h3>
            <p className="stats-number">{stats.ativos}</p>
            <span className="stats-change positive">Ativos no sistema</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>EM TREINAMENTO</h3>
            <p className="stats-number">{stats.treinamento}</p>
            <span className="stats-change warning">Aguardando conclusão</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>INATIVOS</h3>
            <p className="stats-number">{stats.inativos}</p>
            <span className="stats-change negative">Colaboradores inativos</span>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="card card-elevated">
        <div className="filters-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por nome, cargo, departamento ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="todos">Todos os Status</option>
              <option value="ativo">Ativos</option>
              <option value="treinamento">Em Treinamento</option>
              <option value="inativo">Inativos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Colaboradores */}
      <div className="colaboradores-list-container">
        <div className="add-colaborador-section">
          <h2>Colaboradores Cadastrados ({colaboradoresFiltrados.length})</h2>
          <button
            className="btn-add-colaborador"
            onClick={() => setIsModalOpen(true)}
          >
            Adicionar Colaborador
          </button>
        </div>
        <div className="colaboradores-list">
          {loading ? (
            <div className="loading-state">
              <p>Carregando colaboradores...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={carregarColaboradores} className="btn btn-primary">
                Tentar Novamente
              </button>
            </div>
          ) : colaboradoresFiltrados.length === 0 ? (
            <div className="no-results">
              <p>Nenhum colaborador encontrado com os filtros aplicados.</p>
            </div>
          ) : (
            colaboradoresFiltrados.map((colaborador) => (
              <div key={colaborador.id} className="colaborador-item">
                <div className="colaborador-info">
                  <div className="colaborador-header">
                    <h3>{colaborador.nome}</h3>
                    <span className={`status-badge ${getStatusClass(colaborador.status)}`}>
                      {getStatusText(colaborador.status)}
                    </span>
                  </div>
                  <div className="colaborador-details">
                    <div className="detail-group">
                      <span className="detail-label">Cargo:</span>
                      <span className="detail-value">{colaborador.cargo}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Departamento:</span>
                      <span className="detail-value">{colaborador.departamento}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{colaborador.email}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Telefone:</span>
                      <span className="detail-value">{colaborador.telefone}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Salário:</span>
                      <span className="detail-value">
                        {colaborador.salario ? `R$ ${colaborador.salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Não informado'}
                      </span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Contratado em:</span>
                      <span className="detail-value">{new Date(colaborador.dataContratacao).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Última atualização:</span>
                      <span className="detail-value">{new Date(colaborador.ultimaAtualizacao).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
                <div className="colaborador-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditarColaborador(colaborador)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleVerDetalhes(colaborador)}
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modais */}
      <ColaboradorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveColaborador}
      />

      <ColaboradorDetalhesModal
        isOpen={isDetalhesModalOpen}
        onClose={() => setIsDetalhesModalOpen(false)}
        colaborador={colaboradorSelecionado}
      />

      <ColaboradorEditarModal
        isOpen={isEditarModalOpen}
        onClose={() => setIsEditarModalOpen(false)}
        colaborador={colaboradorSelecionado}
        onSave={handleSalvarEdicao}
      />
    </div>
  )
}

export default CadastroColaborador
