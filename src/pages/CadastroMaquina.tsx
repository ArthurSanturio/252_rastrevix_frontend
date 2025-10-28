"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import MaquinaModal from "../components/MaquinaModal"
import MaquinaEditarModal from "../components/MaquinaEditarModal"
import ConfirmModal from "../components/ConfirmModal"
import { maquinaService } from "../services/maquinaService"
import { showSuccess, showError, showWarning } from "../utils/toast"
import "../styles/dashboard-pages.css"

// Função auxiliar para formatar valor para exibição
const formatValorDisplay = (value: number | undefined): string => {
  if (value === undefined || value === null || typeof value !== 'number') {
    return 'Não informado';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Função auxiliar para formatar eficiência
const formatEficienciaDisplay = (value: number | undefined): string => {
  if (value === undefined || value === null || typeof value !== 'number') {
    return 'N/A';
  }
  return `${value.toFixed(1)}%`;
};

// Interfaces locais
interface Maquina {
  id: string;
  codigo: string;
  nome: string;
  tipo: 'torno' | 'fresa' | 'soldadora' | 'prensa' | 'cnc' | 'outras';
  status: 'ativa' | 'inativa' | 'manutencao' | 'calibracao';
  fabricante?: string;
  modelo?: string;
  numeroSerie?: string;
  dataFabricacao?: string;
  dataInstalacao?: string;
  valorCompra?: number;
  eficiencia?: number;
  localizacao?: string;
  responsavel?: string;
  especificacoes?: string;
  observacoes?: string;
  proximaManutencao?: string;
  ultimaManutencao?: string;
  horasTrabalhadas?: number;
  horasManutencao?: number;
  latitude?: number;
  longitude?: number;
  dataCadastro: string;
  ultimaAtualizacao: string;
}

interface MaquinaFormData {
  codigo: string;
  nome: string;
  tipo: 'torno' | 'fresa' | 'soldadora' | 'prensa' | 'cnc' | 'outras';
  status: 'ativa' | 'inativa' | 'manutencao' | 'calibracao';
  fabricante: string;
  modelo: string;
  numeroSerie: string;
  dataFabricacao: string;
  dataInstalacao: string;
  valorCompra: string;
  eficiencia: string;
  localizacao: string;
  responsavel: string;
  especificacoes: string;
  observacoes: string;
  proximaManutencao: string;
  ultimaManutencao: string;
  horasTrabalhadas: string;
  horasManutencao: string;
  latitude: string;
  longitude: string;
}

interface MaquinaCreateData {
  codigo: string;
  nome: string;
  tipo: 'torno' | 'fresa' | 'soldadora' | 'prensa' | 'cnc' | 'outras';
  status?: 'ativa' | 'inativa' | 'manutencao' | 'calibracao';
  fabricante?: string;
  modelo?: string;
  numeroSerie?: string;
  dataFabricacao?: string;
  dataInstalacao?: string;
  valorCompra?: number;
  eficiencia?: number;
  localizacao?: string;
  responsavel?: string;
  especificacoes?: string;
  observacoes?: string;
  proximaManutencao?: string;
  ultimaManutencao?: string;
  horasTrabalhadas?: number;
  horasManutencao?: number;
  latitude?: number;
  longitude?: number;
}

const CadastroMaquina: React.FC = () => {
  const { user } = useAuth()
  const userName = user?.name || "Usuário"

  // Estados para dados reais
  const [maquinas, setMaquinas] = useState<Maquina[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [maquinaSelecionada, setMaquinaSelecionada] = useState<Maquina | null>(null)
  const [maquinaParaExcluir, setMaquinaParaExcluir] = useState<Maquina | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    ativas: 0,
    inativas: 0,
    manutencao: 0,
    calibracao: 0,
    eficienciaMedia: 0
  })

  // Carregar dados das máquinas
  const carregarMaquinas = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await maquinaService.listarMaquinas({
        limit: 100
      })

      setMaquinas(response.data.maquinas)
    } catch (err) {
      console.error('Erro ao carregar máquinas:', err)
      setError('Erro ao carregar máquinas. Verifique sua conexão.')
    } finally {
      setLoading(false)
    }
  }

  // Carregar estatísticas
  const carregarEstatisticas = async () => {
    try {
      const response = await maquinaService.obterEstatisticas()
      setStats(response.data)
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err)
    }
  }

  // Carregar dados quando o componente monta
  useEffect(() => {
    carregarMaquinas()
    carregarEstatisticas()
  }, [])

  const handleSaveMaquina = async (novaMaquina: MaquinaFormData) => {
    try {
      // Converter dados do formulário para o formato esperado pela API
      const dadosParaEnvio: MaquinaCreateData = {
        codigo: novaMaquina.codigo,
        nome: novaMaquina.nome,
        tipo: novaMaquina.tipo,
        status: novaMaquina.status,
        fabricante: novaMaquina.fabricante || undefined,
        modelo: novaMaquina.modelo || undefined,
        numeroSerie: novaMaquina.numeroSerie || undefined,
        dataFabricacao: novaMaquina.dataFabricacao || undefined,
        dataInstalacao: novaMaquina.dataInstalacao || undefined,
        valorCompra: novaMaquina.valorCompra ? Number(novaMaquina.valorCompra) : undefined,
        eficiencia: novaMaquina.eficiencia ? Number(novaMaquina.eficiencia) : undefined,
        localizacao: novaMaquina.localizacao || undefined,
        responsavel: novaMaquina.responsavel || undefined,
        especificacoes: novaMaquina.especificacoes || undefined,
        observacoes: novaMaquina.observacoes || undefined,
        proximaManutencao: novaMaquina.proximaManutencao || undefined,
        ultimaManutencao: novaMaquina.ultimaManutencao || undefined,
        horasTrabalhadas: novaMaquina.horasTrabalhadas ? Number(novaMaquina.horasTrabalhadas) : undefined,
        horasManutencao: novaMaquina.horasManutencao ? Number(novaMaquina.horasManutencao) : undefined,
        latitude: novaMaquina.latitude ? Number(novaMaquina.latitude) : undefined,
        longitude: novaMaquina.longitude ? Number(novaMaquina.longitude) : undefined
      }

      console.log('Dados sendo enviados para criação:', dadosParaEnvio)

      await maquinaService.criarMaquina(dadosParaEnvio)

      // Recarregar lista de máquinas e estatísticas
      await carregarMaquinas()
      await carregarEstatisticas()

      showSuccess(`Máquina ${novaMaquina.nome} cadastrada com sucesso!`)
      setIsModalOpen(false)
    } catch (err) {
      console.error('Erro ao salvar máquina:', err)
      showError('Erro ao cadastrar máquina. Tente novamente.')
    }
  }

  const handleEditarMaquina = (maquina: Maquina) => {
    setMaquinaSelecionada(maquina)
    setIsEditarModalOpen(true)
  }

  const handleSalvarEdicao = async (maquinaAtualizada: Maquina) => {
    try {
      // Preparar dados para envio, removendo campos vazios
      const dadosParaEnvio = {
        id: maquinaAtualizada.id,
        codigo: maquinaAtualizada.codigo,
        nome: maquinaAtualizada.nome,
        tipo: maquinaAtualizada.tipo,
        status: maquinaAtualizada.status,
        fabricante: maquinaAtualizada.fabricante || undefined,
        modelo: maquinaAtualizada.modelo || undefined,
        numeroSerie: maquinaAtualizada.numeroSerie || undefined,
        dataFabricacao: maquinaAtualizada.dataFabricacao || undefined,
        dataInstalacao: maquinaAtualizada.dataInstalacao || undefined,
        valorCompra: maquinaAtualizada.valorCompra || undefined,
        eficiencia: maquinaAtualizada.eficiencia || undefined,
        localizacao: maquinaAtualizada.localizacao || undefined,
        responsavel: maquinaAtualizada.responsavel || undefined,
        especificacoes: maquinaAtualizada.especificacoes || undefined,
        observacoes: maquinaAtualizada.observacoes || undefined,
        proximaManutencao: maquinaAtualizada.proximaManutencao || undefined,
        ultimaManutencao: maquinaAtualizada.ultimaManutencao || undefined,
        horasTrabalhadas: maquinaAtualizada.horasTrabalhadas || undefined,
        horasManutencao: maquinaAtualizada.horasManutencao || undefined
      }

      console.log('Dados sendo enviados para atualização:', dadosParaEnvio)

      await maquinaService.atualizarMaquina(dadosParaEnvio)

      // Recarregar lista de máquinas e estatísticas
      await carregarMaquinas()
      await carregarEstatisticas()

      showSuccess(`Máquina ${maquinaAtualizada.nome} atualizada com sucesso!`)
      setIsEditarModalOpen(false)
    } catch (err) {
      console.error('Erro ao atualizar máquina:', err)
      showError('Erro ao atualizar máquina. Tente novamente.')
    }
  }

  const handleExcluirMaquina = (maquina: Maquina) => {
    setMaquinaParaExcluir(maquina)
    setIsConfirmModalOpen(true)
  }

  const confirmarExclusao = async () => {
    if (!maquinaParaExcluir) return

    try {
      await maquinaService.deletarMaquina(maquinaParaExcluir.id)

      // Recarregar lista de máquinas e estatísticas
      await carregarMaquinas()
      await carregarEstatisticas()

      showSuccess(`Máquina ${maquinaParaExcluir.nome} excluída com sucesso!`)
      setMaquinaParaExcluir(null)
    } catch (err) {
      console.error('Erro ao excluir máquina:', err)
      if (err instanceof Error && err.message.includes('não encontrada')) {
        showWarning('Esta máquina já foi excluída ou não existe mais. A lista será atualizada.')
        await carregarMaquinas()
      } else {
        showError('Erro ao excluir máquina. Tente novamente.')
      }
      setMaquinaParaExcluir(null)
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'ativa':
        return 'status-ativo'
      case 'inativa':
        return 'status-inativo'
      case 'manutencao':
        return 'status-manutencao'
      case 'calibracao':
        return 'status-calibracao'
      default:
        return ''
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ativa':
        return 'ATIVA'
      case 'inativa':
        return 'INATIVA'
      case 'manutencao':
        return 'EM MANUTENÇÃO'
      case 'calibracao':
        return 'EM CALIBRAÇÃO'
      default:
        return status.toUpperCase()
    }
  }

  const getTipoText = (tipo: string) => {
    switch (tipo) {
      case 'torno':
        return 'Torno'
      case 'fresa':
        return 'Fresa'
      case 'soldadora':
        return 'Soldadora'
      case 'prensa':
        return 'Prensa'
      case 'cnc':
        return 'CNC'
      case 'outras':
        return 'Outras'
      default:
        return tipo
    }
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-welcome">
        <h2>Cadastro de Máquinas, {userName}!</h2>
        <p>Gerencie o inventário e informações das máquinas</p>
        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
          style={{ marginTop: '1rem' }}
        >
          Adicionar Máquina
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="card card-elevated">
          <div className="stats-content">
            <h3>TOTAL DE MÁQUINAS</h3>
            <p className="stats-number">{stats.total.toLocaleString()}</p>
            <span className="stats-change positive">Máquinas cadastradas</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>MÁQUINAS ATIVAS</h3>
            <p className="stats-number">{stats.ativas.toLocaleString()}</p>
            <span className="stats-change positive">Em operação</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>EM MANUTENÇÃO</h3>
            <p className="stats-number">{stats.manutencao.toLocaleString()}</p>
            <span className="stats-change warning">Aguardando manutenção</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>EFICIÊNCIA MÉDIA</h3>
            <p className="stats-number">{formatEficienciaDisplay(stats.eficienciaMedia)}</p>
            <span className="stats-change positive">Performance média</span>
          </div>
        </div>
      </div>

      <div className="dashboard-bottom-sections">
        <div className="card card-elevated">
          <h2>Máquinas Cadastradas ({maquinas.length})</h2>
          {loading ? (
            <div className="loading-state">
              <p>Carregando máquinas...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={carregarMaquinas} className="btn btn-primary">
                Tentar Novamente
              </button>
            </div>
          ) : maquinas.length === 0 ? (
            <div className="no-results">
              <p>Nenhuma máquina cadastrada ainda.</p>
            </div>
          ) : (
            <div className="maquinas-list">
              {maquinas.slice(0, 5).map((maquina) => (
                <div key={maquina.id} className="maquina-item">
                  <div className="maquina-info">
                    <div className="maquina-header">
                      <h3>{maquina.nome}</h3>
                      <span className={`status-badge ${getStatusClass(maquina.status)}`}>
                        {getStatusText(maquina.status)}
                      </span>
                    </div>
                    <div className="maquina-details">
                      <div className="detail-group">
                        <span className="detail-label">Código:</span>
                        <span className="detail-value">{maquina.codigo}</span>
                      </div>
                      <div className="detail-group">
                        <span className="detail-label">Tipo:</span>
                        <span className="detail-value">{getTipoText(maquina.tipo)}</span>
                      </div>
                      <div className="detail-group">
                        <span className="detail-label">Fabricante:</span>
                        <span className="detail-value">{maquina.fabricante || 'Não informado'}</span>
                      </div>
                      <div className="detail-group">
                        <span className="detail-label">Valor:</span>
                        <span className="detail-value">{formatValorDisplay(maquina.valorCompra)}</span>
                      </div>
                      <div className="detail-group">
                        <span className="detail-label">Eficiência:</span>
                        <span className="detail-value">{formatEficienciaDisplay(maquina.eficiencia)}</span>
                      </div>
                      <div className="detail-group">
                        <span className="detail-label">Cadastrada em:</span>
                        <span className="detail-value">{new Date(maquina.dataCadastro).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="maquina-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEditarMaquina(maquina)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleExcluirMaquina(maquina)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card card-elevated">
          <h2>Máquinas em Manutenção</h2>
          <div className="project-list">
            {maquinas.filter(m => m.status === 'manutencao').length === 0 ? (
              <div className="no-results">
                <p>Nenhuma máquina em manutenção no momento.</p>
              </div>
            ) : (
              maquinas.filter(m => m.status === 'manutencao').slice(0, 2).map((maquina) => (
                <div key={maquina.id} className="project-item">
                  <div className="project-header">
                    <h3>{maquina.nome}</h3>
                    <span className="project-status in-progress">EM MANUTENÇÃO</span>
                  </div>
                  <div className="project-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: "40%" }}></div>
                    </div>
                    <span className="progress-text">40% concluído</span>
                  </div>
                  <div className="project-meta">
                    <span>{maquina.codigo}</span>
                    <span>Próxima: {maquina.proximaManutencao ? new Date(maquina.proximaManutencao).toLocaleDateString('pt-BR') : 'Não agendada'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modais */}
      <MaquinaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMaquina}
      />

      <MaquinaEditarModal
        isOpen={isEditarModalOpen}
        onClose={() => setIsEditarModalOpen(false)}
        onSave={handleSalvarEdicao}
        maquina={maquinaSelecionada}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false)
          setMaquinaParaExcluir(null)
        }}
        onConfirm={confirmarExclusao}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir a máquina "${maquinaParaExcluir?.nome}"? Esta ação não pode ser desfeita.`}
        confirmText="Confirmar Exclusão"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

export default CadastroMaquina
