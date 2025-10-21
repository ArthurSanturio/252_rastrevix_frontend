"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import ClienteModal from "../components/ClienteModal"
import ClienteDetalhesModal from "../components/ClienteDetalhesModal"
import ClienteEditarModal from "../components/ClienteEditarModal"
import "../styles/dashboard-pages.css"

interface Cliente {
  id: number
  nome: string
  email: string
  telefone: string
  empresa: string
  status: 'ativo' | 'inativo' | 'pendente'
  dataCadastro: string
  ultimaAtualizacao: string
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

  // Dados mockados dos clientes
  const clientes: Cliente[] = [
    {
      id: 1,
      nome: "João Silva",
      email: "joao.silva@techcorp.com",
      telefone: "(11) 99999-9999",
      empresa: "TechCorp Solutions",
      status: "ativo",
      dataCadastro: "15/01/2024",
      ultimaAtualizacao: "20/01/2024"
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria.santos@globalind.com",
      telefone: "(11) 88888-8888",
      empresa: "Global Industries",
      status: "ativo",
      dataCadastro: "10/01/2024",
      ultimaAtualizacao: "18/01/2024"
    },
    {
      id: 3,
      nome: "Pedro Oliveira",
      email: "pedro@startupxyz.com",
      telefone: "(11) 77777-7777",
      empresa: "StartupXYZ",
      status: "pendente",
      dataCadastro: "22/01/2024",
      ultimaAtualizacao: "22/01/2024"
    },
    {
      id: 4,
      nome: "Ana Costa",
      email: "ana.costa@megacorp.com",
      telefone: "(11) 66666-6666",
      empresa: "MegaCorp Ltd",
      status: "ativo",
      dataCadastro: "05/01/2024",
      ultimaAtualizacao: "19/01/2024"
    },
    {
      id: 5,
      nome: "Carlos Ferreira",
      email: "carlos@innovationlabs.com",
      telefone: "(11) 55555-5555",
      empresa: "Innovation Labs",
      status: "pendente",
      dataCadastro: "25/01/2024",
      ultimaAtualizacao: "25/01/2024"
    },
    {
      id: 6,
      nome: "Lucia Mendes",
      email: "lucia@futuresystems.com",
      telefone: "(11) 44444-4444",
      empresa: "Future Systems",
      status: "ativo",
      dataCadastro: "12/01/2024",
      ultimaAtualizacao: "21/01/2024"
    },
    {
      id: 7,
      nome: "Roberto Lima",
      email: "roberto@inactivecorp.com",
      telefone: "(11) 33333-3333",
      empresa: "Inactive Corp",
      status: "inativo",
      dataCadastro: "01/01/2024",
      ultimaAtualizacao: "10/01/2024"
    }
  ]

  // Filtrar clientes baseado na busca e status
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

  const handleSaveCliente = (novoCliente: any) => {
    // Aqui você pode integrar com a API para salvar o cliente
    console.log('Novo cliente:', novoCliente)

    // Por enquanto, apenas mostra um alerta
    alert(`Cliente ${novoCliente.nome} cadastrado com sucesso!`)

    // Em uma implementação real, você faria uma chamada para a API
    // e atualizaria a lista de clientes
  }

  const handleVerDetalhes = (cliente: Cliente) => {
    setClienteSelecionado(cliente)
    setIsDetalhesModalOpen(true)
  }

  const handleEditarCliente = (cliente: Cliente) => {
    setClienteSelecionado(cliente)
    setIsEditarModalOpen(true)
  }

  const handleSalvarEdicao = (clienteAtualizado: Cliente) => {
    // Aqui você pode integrar com a API para atualizar o cliente
    console.log('Cliente atualizado:', clienteAtualizado)

    // Por enquanto, apenas mostra um alerta
    alert(`Cliente ${clienteAtualizado.nome} atualizado com sucesso!`)

    // Em uma implementação real, você faria uma chamada para a API
    // e atualizaria a lista de clientes
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
            <p className="stats-number">{clientes.length}</p>
            <span className="stats-change positive">+{clientes.filter(c => c.status === 'ativo').length} ativos</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>CLIENTES ATIVOS</h3>
            <p className="stats-number">{clientes.filter(c => c.status === 'ativo').length}</p>
            <span className="stats-change positive">Ativos no sistema</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>PENDENTES</h3>
            <p className="stats-number">{clientes.filter(c => c.status === 'pendente').length}</p>
            <span className="stats-change warning">Aguardando aprovação</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>INATIVOS</h3>
            <p className="stats-number">{clientes.filter(c => c.status === 'inativo').length}</p>
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
          {clientesFiltrados.length === 0 ? (
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
                      <span className="detail-value">{cliente.dataCadastro}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Última atualização:</span>
                      <span className="detail-value">{cliente.ultimaAtualizacao}</span>
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
