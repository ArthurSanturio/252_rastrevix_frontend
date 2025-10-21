"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import ColaboradorModal from "../components/ColaboradorModal"
import ColaboradorDetalhesModal from "../components/ColaboradorDetalhesModal"
import ColaboradorEditarModal from "../components/ColaboradorEditarModal"
import "../styles/colaboradores.css"
import "../styles/dashboard-pages.css"

interface Colaborador {
  id: number
  nome: string
  email: string
  telefone: string
  cargo: string
  departamento: string
  status: 'ativo' | 'inativo' | 'treinamento'
  dataContratacao: string
  ultimaAtualizacao: string
  salario: string
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

  // Dados mockados dos colaboradores
  const colaboradores: Colaborador[] = [
    {
      id: 1,
      nome: "João Silva",
      email: "joao.silva@empresa.com",
      telefone: "(11) 99999-9999",
      cargo: "Desenvolvedor Senior",
      departamento: "Tecnologia",
      status: "ativo",
      dataContratacao: "15/01/2023",
      ultimaAtualizacao: "20/01/2024",
      salario: "R$ 8.500,00"
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria.santos@empresa.com",
      telefone: "(11) 88888-8888",
      cargo: "Gerente de Projetos",
      departamento: "Gestão",
      status: "ativo",
      dataContratacao: "10/03/2023",
      ultimaAtualizacao: "18/01/2024",
      salario: "R$ 12.000,00"
    },
    {
      id: 3,
      nome: "Pedro Oliveira",
      email: "pedro.oliveira@empresa.com",
      telefone: "(11) 77777-7777",
      cargo: "Analista Junior",
      departamento: "Análise",
      status: "treinamento",
      dataContratacao: "22/01/2024",
      ultimaAtualizacao: "22/01/2024",
      salario: "R$ 4.200,00"
    },
    {
      id: 4,
      nome: "Ana Costa",
      email: "ana.costa@empresa.com",
      telefone: "(11) 66666-6666",
      cargo: "Designer UX/UI",
      departamento: "Design",
      status: "ativo",
      dataContratacao: "05/06/2023",
      ultimaAtualizacao: "19/01/2024",
      salario: "R$ 6.800,00"
    },
    {
      id: 5,
      nome: "Carlos Ferreira",
      email: "carlos.ferreira@empresa.com",
      telefone: "(11) 55555-5555",
      cargo: "Estagiário",
      departamento: "Tecnologia",
      status: "treinamento",
      dataContratacao: "25/01/2024",
      ultimaAtualizacao: "25/01/2024",
      salario: "R$ 1.200,00"
    },
    {
      id: 6,
      nome: "Lucia Mendes",
      email: "lucia.mendes@empresa.com",
      telefone: "(11) 44444-4444",
      cargo: "Coordenadora de Vendas",
      departamento: "Comercial",
      status: "ativo",
      dataContratacao: "12/08/2023",
      ultimaAtualizacao: "21/01/2024",
      salario: "R$ 9.500,00"
    },
    {
      id: 7,
      nome: "Roberto Lima",
      email: "roberto.lima@empresa.com",
      telefone: "(11) 33333-3333",
      cargo: "Assistente Administrativo",
      departamento: "Administrativo",
      status: "inativo",
      dataContratacao: "01/01/2022",
      ultimaAtualizacao: "10/01/2024",
      salario: "R$ 3.500,00"
    },
    {
      id: 8,
      nome: "Fernanda Rocha",
      email: "fernanda.rocha@empresa.com",
      telefone: "(11) 22222-2222",
      cargo: "Analista de RH",
      departamento: "Recursos Humanos",
      status: "ativo",
      dataContratacao: "15/09/2023",
      ultimaAtualizacao: "23/01/2024",
      salario: "R$ 5.200,00"
    }
  ]

  // Filtrar colaboradores baseado na busca e status
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

  const handleSaveColaborador = (novoColaborador: any) => {
    // Aqui você pode integrar com a API para salvar o colaborador
    console.log('Novo colaborador:', novoColaborador)

    // Por enquanto, apenas mostra um alerta
    alert(`Colaborador ${novoColaborador.nome} cadastrado com sucesso!`)

    // Em uma implementação real, você faria uma chamada para a API
    // e atualizaria a lista de colaboradores
  }

  const handleVerDetalhes = (colaborador: Colaborador) => {
    setColaboradorSelecionado(colaborador)
    setIsDetalhesModalOpen(true)
  }

  const handleEditarColaborador = (colaborador: Colaborador) => {
    setColaboradorSelecionado(colaborador)
    setIsEditarModalOpen(true)
  }

  const handleSalvarEdicao = (colaboradorAtualizado: Colaborador) => {
    // Aqui você pode integrar com a API para atualizar o colaborador
    console.log('Colaborador atualizado:', colaboradorAtualizado)

    // Por enquanto, apenas mostra um alerta
    alert(`Colaborador ${colaboradorAtualizado.nome} atualizado com sucesso!`)

    // Em uma implementação real, você faria uma chamada para a API
    // e atualizaria a lista de colaboradores
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
            <p className="stats-number">{colaboradores.length}</p>
            <span className="stats-change positive">+{colaboradores.filter(c => c.status === 'ativo').length} ativos</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>COLABORADORES ATIVOS</h3>
            <p className="stats-number">{colaboradores.filter(c => c.status === 'ativo').length}</p>
            <span className="stats-change positive">Ativos no sistema</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>EM TREINAMENTO</h3>
            <p className="stats-number">{colaboradores.filter(c => c.status === 'treinamento').length}</p>
            <span className="stats-change warning">Aguardando conclusão</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>INATIVOS</h3>
            <p className="stats-number">{colaboradores.filter(c => c.status === 'inativo').length}</p>
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
          {colaboradoresFiltrados.length === 0 ? (
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
                      <span className="detail-value">{colaborador.salario}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Contratado em:</span>
                      <span className="detail-value">{colaborador.dataContratacao}</span>
                    </div>
                    <div className="detail-group">
                      <span className="detail-label">Última atualização:</span>
                      <span className="detail-value">{colaborador.ultimaAtualizacao}</span>
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
