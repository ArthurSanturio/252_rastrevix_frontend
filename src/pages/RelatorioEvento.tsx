import React, { useState, useEffect } from 'react';
import { clienteService, type Cliente } from '../services/clienteService';
import { maquinaService, type Maquina } from '../services/maquinaService';
import { Search, Calendar, Clock } from 'lucide-react';
import '../styles/dashboard-pages.css';
import '../styles/relatorios.css';
import { calcularPeriodoRapido } from '../utils/relatorioHelpers';
import { EVENTOS_TELEMETRIA } from '../types';

interface RelatorioEventoFormData {
  clienteId: string;
  veiculosIds: string[];
  eventoId: string;
  periodoRapido: 'hoje' | 'ontem' | 'dois-dias' | 'tres-dias';
  dataInicio: string;
  horaInicio: string;
  dataFim: string;
  horaFim: string;
}

const RelatorioEvento: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Maquina[]>([]);
  const [veiculosSelecionados, setVeiculosSelecionados] = useState<string[]>([]);
  const [veiculosDropdownOpen, setVeiculosDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RelatorioEventoFormData, string>>>({});

  const [formData, setFormData] = useState<RelatorioEventoFormData>({
    clienteId: '',
    veiculosIds: [],
    eventoId: '',
    periodoRapido: 'hoje',
    dataInicio: '',
    horaInicio: '00:00',
    dataFim: '',
    horaFim: '23:59'
  });

  useEffect(() => {
    carregarClientes();
    const periodo = calcularPeriodoRapido('hoje');
    setFormData(prev => ({ ...prev, ...periodo }));
  }, []);

  useEffect(() => {
    if (formData.clienteId) {
      carregarVeiculos(formData.clienteId);
    } else {
      setVeiculos([]);
      setVeiculosSelecionados([]);
      setVeiculosDropdownOpen(false);
    }
  }, [formData.clienteId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.veiculos-selector')) {
        setVeiculosDropdownOpen(false);
      }
    };

    if (veiculosDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [veiculosDropdownOpen]);

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

  const carregarVeiculos = async (clienteId: string) => {
    try {
      setLoading(true);
      const response = await maquinaService.listarMaquinas({ clienteId, limit: 1000 });
      setVeiculos(response.data.maquinas);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodoRapido = (periodo: 'hoje' | 'ontem' | 'dois-dias' | 'tres-dias') => {
    const periodoData = calcularPeriodoRapido(periodo);
    setFormData(prev => ({
      ...prev,
      periodoRapido: periodo,
      ...periodoData
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof RelatorioEventoFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleVeiculoToggle = (veiculoId: string) => {
    setVeiculosSelecionados(prev => {
      const novoArray = prev.includes(veiculoId)
        ? prev.filter(id => id !== veiculoId)
        : [...prev, veiculoId];

      setFormData(prev => ({
        ...prev,
        veiculosIds: novoArray
      }));

      return novoArray;
    });
  };

  const validarFormulario = (): boolean => {
    const novosErros: Partial<Record<keyof RelatorioEventoFormData, string>> = {};

    if (!formData.clienteId) {
      novosErros.clienteId = 'Cliente é obrigatório';
    }

    if (veiculosSelecionados.length === 0) {
      novosErros.veiculosIds = 'Selecione pelo menos um veículo';
    }

    if (!formData.dataInicio) {
      novosErros.dataInicio = 'Data início é obrigatória';
    }

    if (!formData.horaInicio) {
      novosErros.horaInicio = 'Hora início é obrigatória';
    }

    if (!formData.dataFim) {
      novosErros.dataFim = 'Data fim é obrigatória';
    }

    if (!formData.horaFim) {
      novosErros.horaFim = 'Hora fim é obrigatória';
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    console.log('Dados do relatório evento:', {
      ...formData,
      veiculosIds: veiculosSelecionados
    });
    alert('Relatório Evento gerado com sucesso! (Funcionalidade em desenvolvimento)');
  };

  return (
    <div className="relatorio-container">
      <div className="relatorio-header">
        <h1>RELATÓRIO • EVENTO</h1>
      </div>

      <div className="relatorio-content">
        <div className="filtros-section">
          <h2 className="filtros-title">Filtros</h2>

          <form onSubmit={handleSubmit} className="relatorio-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="clienteId">
                  Cliente<span className="required">*</span>
                </label>
                <select
                  id="clienteId"
                  name="clienteId"
                  value={formData.clienteId}
                  onChange={handleChange}
                  className={`form-select ${errors.clienteId ? 'error' : ''}`}
                >
                  <option value="">[Selecione os Clientes]</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome} - {cliente.empresa}
                    </option>
                  ))}
                </select>
                {errors.clienteId && (
                  <span className="error-message">{errors.clienteId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="veiculos">
                  Veículo<span className="required">*</span>
                </label>
                <div className="veiculos-selector">
                  <div
                    className="veiculos-selected"
                    onClick={() => formData.clienteId && veiculos.length > 0 && setVeiculosDropdownOpen(!veiculosDropdownOpen)}
                  >
                    {veiculosSelecionados.length > 0
                      ? `${veiculosSelecionados.length} Selecionados`
                      : formData.clienteId
                        ? 'Selecione os veículos'
                        : 'Selecione um cliente primeiro'}
                  </div>
                  {formData.clienteId && veiculos.length > 0 && veiculosDropdownOpen && (
                    <div className="veiculos-dropdown">
                      {veiculos.map(veiculo => (
                        <label key={veiculo.id} className="veiculo-checkbox">
                          <input
                            type="checkbox"
                            checked={veiculosSelecionados.includes(veiculo.id)}
                            onChange={() => handleVeiculoToggle(veiculo.id)}
                          />
                          <span>{veiculo.nome || veiculo.placa || veiculo.codigo}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {errors.veiculosIds && (
                  <span className="error-message">{errors.veiculosIds}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="eventoId">Evento</label>
                <select
                  id="eventoId"
                  name="eventoId"
                  value={formData.eventoId}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">[Selecione um Evento]</option>
                  {Object.entries(EVENTOS_TELEMETRIA).map(([id, nome]) => (
                    <option key={id} value={id}>
                      {nome} ({id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="periodo-section">
              <label>Período</label>
              <div className="periodo-rapido-buttons">
                <button
                  type="button"
                  className={`periodo-btn ${formData.periodoRapido === 'hoje' ? 'active' : ''}`}
                  onClick={() => handlePeriodoRapido('hoje')}
                >
                  Hoje
                </button>
                <button
                  type="button"
                  className={`periodo-btn ${formData.periodoRapido === 'ontem' ? 'active' : ''}`}
                  onClick={() => handlePeriodoRapido('ontem')}
                >
                  Ontem
                </button>
                <button
                  type="button"
                  className={`periodo-btn ${formData.periodoRapido === 'dois-dias' ? 'active' : ''}`}
                  onClick={() => handlePeriodoRapido('dois-dias')}
                >
                  Dois dias
                </button>
                <button
                  type="button"
                  className={`periodo-btn ${formData.periodoRapido === 'tres-dias' ? 'active' : ''}`}
                  onClick={() => handlePeriodoRapido('tres-dias')}
                >
                  Três dias
                </button>
              </div>

              <div className="periodo-datas">
                <div className="form-group">
                  <label htmlFor="dataInicio">
                    Data Início<span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <Calendar className="input-icon" size={18} />
                    <input
                      type="text"
                      id="dataInicio"
                      name="dataInicio"
                      value={formData.dataInicio}
                      onChange={handleChange}
                      placeholder="DD/MM/AAAA"
                      className={`form-input ${errors.dataInicio ? 'error' : ''}`}
                    />
                  </div>
                  {errors.dataInicio && (
                    <span className="error-message">{errors.dataInicio}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="horaInicio">
                    Hora Início<span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <Clock className="input-icon" size={18} />
                    <input
                      type="text"
                      id="horaInicio"
                      name="horaInicio"
                      value={formData.horaInicio}
                      onChange={handleChange}
                      placeholder="HH:MM"
                      className={`form-input ${errors.horaInicio ? 'error' : ''}`}
                    />
                  </div>
                  {errors.horaInicio && (
                    <span className="error-message">{errors.horaInicio}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="dataFim">
                    Data Fim<span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <Calendar className="input-icon" size={18} />
                    <input
                      type="text"
                      id="dataFim"
                      name="dataFim"
                      value={formData.dataFim}
                      onChange={handleChange}
                      placeholder="DD/MM/AAAA"
                      className={`form-input ${errors.dataFim ? 'error' : ''}`}
                    />
                  </div>
                  {errors.dataFim && (
                    <span className="error-message">{errors.dataFim}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="horaFim">
                    Hora Fim<span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <Clock className="input-icon" size={18} />
                    <input
                      type="text"
                      id="horaFim"
                      name="horaFim"
                      value={formData.horaFim}
                      onChange={handleChange}
                      placeholder="HH:MM"
                      className={`form-input ${errors.horaFim ? 'error' : ''}`}
                    />
                  </div>
                  {errors.horaFim && (
                    <span className="error-message">{errors.horaFim}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="observacao">
              <p>
                <strong>OBS:</strong> todos os campos com (*) são obrigatórios para realizar uma pesquisa!
              </p>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-pesquisar">
                <Search size={20} />
                PESQUISAR
              </button>
            </div>
          </form>
        </div>

        <div className="descricao-relatorio">
          <div className="descricao-icon">
            <Search size={64} />
          </div>
          <h2>Relatório de Eventos</h2>
          <p>
            Esse é o Relatório de evento. Acima selecione o Cliente, o Período e se quiser um relatório mais detalhado faça os Filtros desejados, após clique no botão Pesquisar para gerar as informações.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RelatorioEvento;
