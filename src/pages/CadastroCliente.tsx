"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import ClienteModal from "../components/ClienteModal"
import ClienteDetalhesModal from "../components/ClienteDetalhesModal"
import ClienteEditarModal from "../components/ClienteEditarModal"
import { clienteService } from "../services/clienteService"
import "../styles/dashboard-pages.css"

// Interfaces locais para evitar problemas de importação
interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  status: 'ativo' | 'inativo' | 'pendente';
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  cnpj?: string;
  observacoes?: string;
  contatoResponsavel?: string;
  telefoneResponsavel?: string;
  dataCadastro: string;
  ultimaAtualizacao: string;
}

interface ClienteCreateData {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  status?: 'ativo' | 'inativo' | 'pendente';
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  cnpj?: string;
  observacoes?: string;
  contatoResponsavel?: string;
  telefoneResponsavel?: string;
}

const CadastroCliente: React.FC = () => {
  const { user } = useAuth()
  const userName = user?.name || "Usuário"
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetalhesModalOpen, setIsDetalhesModalOpen] = useState(false)
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null)

  // Estados para dados reais
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    ativos: 0,
    inativos: 0,
    pendentes: 0
  })

  // Carregar dados dos clientes
  const carregarClientes = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await clienteService.listarClientes({
        search: searchTerm || undefined,
        status: statusFilter !== "todos" ? statusFilter : undefined,
        limit: 100 // Carregar mais clientes para demonstração
      })

      setClientes(response.data.clientes)
    } catch (err) {
      console.error('Erro ao carregar clientes:', err)
      setError('Erro ao carregar clientes. Verifique sua conexão.')
    } finally {
      setLoading(false)
    }
  }

  // Carregar estatísticas
  const carregarEstatisticas = async () => {
    try {
      const response = await clienteService.obterEstatisticas()
      setStats(response.data)
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err)
    }
  }

  // Carregar dados quando o componente monta
  useEffect(() => {
    carregarClientes()
    carregarEstatisticas()
  }, [])

  // Recarregar quando filtros mudam
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carregarClientes()
    }, 500) // Debounce de 500ms

    return () => clearTimeout(timeoutId)
  }, [searchTerm, statusFilter])

  // Filtrar clientes localmente (já vem filtrado da API, mas mantemos para consistência)
  const clientesFiltrados = clientes.filter(cliente => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || cliente.status === statusFilter

    return matchesSearch && matchesStatus
  })

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

  const handleSaveCliente = async (novoCliente: ClienteCreateData) => {
    try {
      await clienteService.criarCliente(novoCliente)

      // Recarregar lista de clientes e estatísticas
      await carregarClientes()
      await carregarEstatisticas()

      alert(`Cliente ${novoCliente.nome} cadastrado com sucesso!`)
      setIsModalOpen(false)
    } catch (err) {
      console.error('Erro ao salvar cliente:', err)
      alert('Erro ao cadastrar cliente. Tente novamente.')
    }
  }

  const handleVerDetalhes = (cliente: Cliente) => {
    setClienteSelecionado(cliente)
    setIsDetalhesModalOpen(true)
  }

  const handleEditarCliente = (cliente: Cliente) => {
    setClienteSelecionado(cliente)
    setIsEditarModalOpen(true)
  }

  const handleSalvarEdicao = async (clienteAtualizado: Cliente) => {
    try {
      // Preparar dados para envio, removendo campos vazios
      const dadosParaEnvio = {
        id: clienteAtualizado.id,
        nome: clienteAtualizado.nome,
        email: clienteAtualizado.email,
        telefone: clienteAtualizado.telefone,
        empresa: clienteAtualizado.empresa,
        status: clienteAtualizado.status,
        endereco: clienteAtualizado.endereco || undefined,
        cidade: clienteAtualizado.cidade || undefined,
        estado: clienteAtualizado.estado || undefined,
        cep: clienteAtualizado.cep || undefined,
        cnpj: clienteAtualizado.cnpj || undefined,
        observacoes: clienteAtualizado.observacoes || undefined,
        contatoResponsavel: clienteAtualizado.contatoResponsavel || undefined,
        telefoneResponsavel: clienteAtualizado.telefoneResponsavel || undefined
      }

      console.log('Dados sendo enviados para atualização:', dadosParaEnvio)

      await clienteService.atualizarCliente(dadosParaEnvio)

      // Recarregar lista de clientes e estatísticas
      await carregarClientes()
      await carregarEstatisticas()

      alert(`Cliente ${clienteAtualizado.nome} atualizado com sucesso!`)
      setIsEditarModalOpen(false)
    } catch (err) {
      console.error('Erro ao atualizar cliente:', err)
      alert('Erro ao atualizar cliente. Tente novamente.')
    }
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-welcome">
        <h2>Lista de Clientes, {userName}!</h2>
        <p>Visualize e gerencie todos os clientes cadastrados</p>
      </div>

      {/* Estatísticas */}
      <div className="dashboard-grid">
        <div className="card card-elevated">
          <div className="stats-content">
            <h3>TOTAL DE CLIENTES</h3>
            <p className="stats-number">{stats.total}</p>
            <span className="stats-change positive">+{stats.ativos} ativos</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>CLIENTES ATIVOS</h3>
            <p className="stats-number">{stats.ativos}</p>
            <span className="stats-change positive">Ativos no sistema</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>PENDENTES</h3>
            <p className="stats-number">{stats.pendentes}</p>
            <span className="stats-change warning">Aguardando aprovação</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>INATIVOS</h3>
            <p className="stats-number">{stats.inativos}</p>
            <span className="stats-change negative">Clientes inativos</span>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="card card-elevated">
        <div className="filters-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por nome, empresa ou email..."
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
              <option value="pendente">Pendentes</option>
              <option value="inativo">Inativos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="clientes-list-container">
        <div className="add-cliente-section">
          <h2>Clientes Cadastrados ({clientesFiltrados.length})</h2>
          <button
            className="btn-add-cliente"
            onClick={() => setIsModalOpen(true)}
          >
            Adicionar Cliente
          </button>
        </div>
        <div className="clientes-list">
          {loading ? (
            <div className="loading-state">
              <p>Carregando clientes...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={carregarClientes} className="btn btn-primary">
                Tentar Novamente
              </button>
            </div>
          ) : clientesFiltrados.length === 0 ? (
            <div className="no-results">
              <p>Nenhum cliente encontrado com os filtros aplicados.</p>
            </div>
          ) : (
            clientesFiltrados.map((cliente) => (
              <div key={cliente.id} className="cliente-item">
                <div className="cliente-info">
                  <div className="cliente-header">
                    <h3>{cliente.nome}</h3>
                    <span className={`status-badge ${getStatusClass(cliente.status)}`}>
                      {getStatusText(cliente.status)}
                    </span>
                  </div>
                  <div className="cliente-details">
                    <div className="detail-group">
                      <span className="detail-label">Empresa:</span>
                      <span className="detail-value">{cliente.empresa}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{cliente.email}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Telefone:</span>
                      <span className="detail-value">{cliente.telefone}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Cadastrado em:</span>
                      <span className="detail-value">{new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Última atualização:</span>
                      <span className="detail-value">{new Date(cliente.ultimaAtualizacao).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
                <div className="cliente-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditarCliente(cliente)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleVerDetalhes(cliente)}
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
      <ClienteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCliente}
      />

      <ClienteDetalhesModal
        isOpen={isDetalhesModalOpen}
        onClose={() => setIsDetalhesModalOpen(false)}
        cliente={clienteSelecionado}
      />

      <ClienteEditarModal
        isOpen={isEditarModalOpen}
        onClose={() => setIsEditarModalOpen(false)}
        cliente={clienteSelecionado}
        onSave={handleSalvarEdicao}
      />
    </div>
  )
}

export default CadastroCliente
