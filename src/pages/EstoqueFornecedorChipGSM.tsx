"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Plus, Download, Trash2 } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import "../styles/dashboard-pages.css"
import "../styles/estoque.css"

interface FornecedorChipGSM {
  id: string;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  operadora: string;
  status: 'ativo' | 'inativo';
  endereco?: string;
  cidade?: string;
  estado?: string;
}

const EstoqueFornecedorChipGSM: React.FC = () => {
  const { user } = useAuth()
  const [fornecedores, setFornecedores] = useState<FornecedorChipGSM[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setFornecedores([
        {
          id: "1",
          nome: "ARQIA",
          cnpj: "12.345.678/0001-90",
          telefone: "(11) 3456-7890",
          email: "contato@arqia.com.br",
          operadora: "ARQIA",
          status: "ativo",
          endereco: "Rua Exemplo, 123",
          cidade: "São Paulo",
          estado: "SP"
        }
      ])
      setIsLoading(false)
    }, 500)
  }, [])

  const filteredFornecedores = fornecedores.filter(fornecedor =>
    fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.cnpj.includes(searchTerm) ||
    fornecedor.telefone.includes(searchTerm) ||
    fornecedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.operadora.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleNovo = () => {
    console.log("Novo fornecedor")
  }

  const handleExportar = () => {
    console.log("Exportar dados")
  }

  const handleExcluir = (fornecedor: FornecedorChipGSM) => {
    if (window.confirm(`Tem certeza que deseja excluir o fornecedor ${fornecedor.nome}?`)) {
      setFornecedores(fornecedores.filter(f => f.id !== fornecedor.id))
    }
  }

  return (
    <div className="dashboard-page estoque-page">
      <div className="page-header">
        <h1 className="page-title">ESTOQUE · Forn. Chip GSM</h1>
      </div>

      <div className="page-content">
        <div className="search-section">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Procurar Fornecedor"
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
        ) : filteredFornecedores.length === 0 ? (
          <div className="no-results">
            <p>Nenhum fornecedor encontrado.</p>
          </div>
        ) : (
          <div className="estoque-list">
            {filteredFornecedores.map((fornecedor, index) => (
              <div key={fornecedor.id} className="estoque-item">
                <div className="estoque-item-number">{index + 1}</div>
                <div className="estoque-item-content">
                  <div className="estoque-item-header">
                    <div className="estoque-item-id">{fornecedor.nome}</div>
                  </div>
                  <div className="estoque-item-details">
                    <div className="detail-row">
                      <span className="detail-label">STATUS:</span>
                      <span className={`status-badge status-${fornecedor.status}`}>
                        {fornecedor.status.charAt(0).toUpperCase() + fornecedor.status.slice(1)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">CNPJ:</span>
                      <span className="detail-value">{fornecedor.cnpj}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">TELEFONE:</span>
                      <span className="detail-value">{fornecedor.telefone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">EMAIL:</span>
                      <span className="detail-value">{fornecedor.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">OPERADORA:</span>
                      <span className="detail-value">{fornecedor.operadora}</span>
                    </div>
                    {fornecedor.endereco && (
                      <div className="detail-row">
                        <span className="detail-label">ENDEREÇO:</span>
                        <span className="detail-value">{fornecedor.endereco}</span>
                      </div>
                    )}
                    {fornecedor.cidade && fornecedor.estado && (
                      <div className="detail-row">
                        <span className="detail-label">CIDADE/ESTADO:</span>
                        <span className="detail-value">{fornecedor.cidade} - {fornecedor.estado}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="estoque-item-actions">
                  <button
                    className="btn-icon btn-icon-danger"
                    onClick={() => handleExcluir(fornecedor)}
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

export default EstoqueFornecedorChipGSM
