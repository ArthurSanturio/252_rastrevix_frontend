"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Plus, Download, Trash2 } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import "../styles/dashboard-pages.css"
import "../styles/estoque.css"

interface Equipamento {
  id: string;
  numeroSerie: string;
  modelo: string;
  fabricante: string;
  status: 'disponivel' | 'instalado' | 'manutencao' | 'inativo';
  cliente?: string;
  veiculoInstalado?: string;
  dataInstalacao?: string;
  fornecedor: string;
}

const EstoqueEquipamento: React.FC = () => {
  const { user } = useAuth()
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setEquipamentos([
        {
          id: "1",
          numeroSerie: "357073298627072",
          modelo: "Modelo A",
          fabricante: "Fabricante X",
          status: "instalado",
          cliente: "BRENO RESSARI NICOLINI",
          veiculoInstalado: "FIAT DUCATO - ODG6109",
          dataInstalacao: "2024-01-15",
          fornecedor: "Fornecedor A"
        }
      ])
      setIsLoading(false)
    }, 500)
  }, [])

  const filteredEquipamentos = equipamentos.filter(equip =>
    equip.numeroSerie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equip.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equip.fabricante.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (equip.cliente && equip.cliente.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleNovo = () => {
    console.log("Novo equipamento")
  }

  const handleExportar = () => {
    console.log("Exportar dados")
  }

  const handleExcluir = (equip: Equipamento) => {
    if (window.confirm(`Tem certeza que deseja excluir o equipamento ${equip.numeroSerie}?`)) {
      setEquipamentos(equipamentos.filter(e => e.id !== equip.id))
    }
  }

  return (
    <div className="dashboard-page estoque-page">
      <div className="page-header">
        <h1 className="page-title">ESTOQUE · Equipamento</h1>
      </div>

      <div className="page-content">
        <div className="search-section">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Procurar Equipamento"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="action-buttons-header">
            <button className="btn btn-secondary" onClick={handleNovo}>
              <Plus size={18} style={{ marginRight: '8px' }} />
              NOVO
            </button>
            <button className="btn btn-secondary" onClick={handleExportar}>
              <Download size={18} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <p>Carregando...</p>
          </div>
        ) : filteredEquipamentos.length === 0 ? (
          <div className="no-results">
            <p>Nenhum equipamento encontrado.</p>
          </div>
        ) : (
          <div className="estoque-list">
            {filteredEquipamentos.map((equip, index) => (
              <div key={equip.id} className="estoque-item">
                <div className="estoque-item-number">{index + 1}</div>
                <div className="estoque-item-content">
                  <div className="estoque-item-header">
                    <div className="estoque-item-id">{equip.numeroSerie}</div>
                  </div>
                  <div className="estoque-item-details">
                    <div className="detail-row">
                      <span className="detail-label">STATUS:</span>
                      <span className={`status-badge status-${equip.status}`}>
                        {equip.status.charAt(0).toUpperCase() + equip.status.slice(1)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">MODELO:</span>
                      <span className="detail-value">{equip.modelo}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">FABRICANTE:</span>
                      <span className="detail-value">{equip.fabricante}</span>
                    </div>
                    {equip.cliente && (
                      <div className="detail-row">
                        <span className="detail-label">CLIENTE:</span>
                        <span className="detail-value">{equip.cliente}</span>
                      </div>
                    )}
                    {equip.veiculoInstalado && (
                      <div className="detail-row">
                        <span className="detail-label">VEIC. INSTAL.:</span>
                        <span className="detail-value">{equip.veiculoInstalado}</span>
                      </div>
                    )}
                    {equip.dataInstalacao && (
                      <div className="detail-row">
                        <span className="detail-label">DATA INSTALAÇÃO:</span>
                        <span className="detail-value">{equip.dataInstalacao}</span>
                      </div>
                    )}
                    <div className="detail-row">
                      <span className="detail-label">FORNECEDOR:</span>
                      <span className="detail-value">{equip.fornecedor}</span>
                    </div>
                  </div>
                </div>
                <div className="estoque-item-actions">
                  <button
                    className="btn-icon btn-icon-danger"
                    onClick={() => handleExcluir(equip)}
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EstoqueEquipamento
