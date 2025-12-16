import React, { useState, useEffect } from 'react';
import { clienteService, type Cliente } from '../services/clienteService';
import { rastreadorService } from '../services/rastreadorService';
import { Search, Plus, AlertTriangle } from 'lucide-react';
import '../styles/dashboard-pages.css';

const TelemetriaEvento: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [eventos, setEventos] = useState<any[]>([]);
  const [rastreadorSelecionado, setRastreadorSelecionado] = useState<string | null>(null);

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const response = await clienteService.listarClientes({ limit: 1000 });
      setClientes(response.data.clientes);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClienteClick = async (clienteId: string) => {
    setClienteSelecionado(clienteId);
    // Aqui você pode carregar os eventos do cliente
    // Por enquanto, apenas definimos o cliente selecionado
  };

  const clientesFiltrados = clientes.filter(cliente => {
    const termo = searchTerm.toLowerCase();
    return (
      cliente.nome.toLowerCase().includes(termo) ||
      cliente.empresa.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>TELEMETRIA</h1>
        <div className="breadcrumb">
          <span>TELEMETRIA</span>
          <span>/</span>
          <span>EVENTO</span>
        </div>
      </div>

      <div className="telemetria-container">
        <div className="telemetria-left-panel">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Procurar Cliente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="clientes-list">
            {loading ? (
              <div className="loading-message">Carregando clientes...</div>
            ) : clientesFiltrados.length === 0 ? (
              <div className="empty-message">Nenhum cliente encontrado</div>
            ) : (
              clientesFiltrados.map((cliente) => (
                <div
                  key={cliente.id}
                  className={`cliente-item ${clienteSelecionado === cliente.id ? 'selected' : ''} ${cliente.status === 'inativo' ? 'bloqueado' : ''}`}
                  onClick={() => handleClienteClick(cliente.id)}
                >
                  <div className="cliente-nome">{cliente.nome}</div>
                  <div className="cliente-abrev">{cliente.empresa}</div>
                  {cliente.status === 'inativo' && (
                    <span className="bloqueado-badge">[Bloqueado]</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="telemetria-right-panel">
          <div className="panel-header">
            <h2>Eventos</h2>
            <button className="btn-add">
              <Plus size={18} />
              Adicionar Novo
            </button>
          </div>

          {clienteSelecionado ? (
            <div className="eventos-content">
              <p className="info-message">
                Esta é a sua lista de Eventos e Telemetria. Clique no nome desejado à esquerda para ver e alterar informações, ou clique no botão acima para adicionar um novo.
              </p>
              {/* Aqui você pode adicionar a lista de eventos quando implementar */}
            </div>
          ) : (
            <div className="empty-state">
              <AlertTriangle size={64} className="empty-icon" />
              <p className="empty-message">
                Esta é a sua lista de Eventos e Telemetria. Clique no nome desejado à esquerda para ver e alterar informações, ou clique no botão acima para adicionar um novo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelemetriaEvento;
