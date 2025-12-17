import React, { useState, useEffect } from 'react';
import { clienteService, type Cliente } from '../services/clienteService';
import { maquinaService, type Maquina } from '../services/maquinaService';
import { Search, Calendar, Clock, Plus } from 'lucide-react';
import '../styles/dashboard-pages.css';
import '../styles/relatorios.css';
import { calcularPeriodoRapido } from '../utils/relatorioHelpers';

interface RelatorioLogisticaFormData {
  clienteId: string;
  periodoRapido: 'hoje' | 'ontem' | 'dois-dias' | 'tres-dias';
  dataInicio: string;
  dataFim: string;
  veiculoId: string;
  horaInicioRota: string;
  horaFim: string;
  rotaId: string;
  trechoId: string;
}

const RelatorioLogistica: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Maquina[]>([]);
  const [, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RelatorioLogisticaFormData, string>>>({});

  const [formData, setFormData] = useState<RelatorioLogisticaFormData>({
    clienteId: '',
    periodoRapido: 'hoje',
    dataInicio: '',
    dataFim: '',
    veiculoId: '',
    horaInicioRota: '00:00',
    horaFim: '23:59',
    rotaId: '',
    trechoId: ''
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
    }
  }, [formData.clienteId]);

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

    if (errors[name as keyof RelatorioLogisticaFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validarFormulario = (): boolean => {
    const novosErros: Partial<Record<keyof RelatorioLogisticaFormData, string>> = {};

    if (!formData.clienteId) {
      novosErros.clienteId = 'Cliente é obrigatório';
    }

    if (!formData.dataInicio) {
      novosErros.dataInicio = 'Data início é obrigatória';
    }

    if (!formData.dataFim) {
      novosErros.dataFim = 'Data fim é obrigatória';
    }

    if (!formData.veiculoId) {
      novosErros.veiculoId = 'Veículo é obrigatório';
    }

    if (!formData.horaInicioRota) {
      novosErros.horaInicioRota = 'Hora início da rota é obrigatória';
    }

    if (!formData.horaFim) {
      novosErros.horaFim = 'Hora fim é obrigatória';
    }

    if (!formData.rotaId) {
      novosErros.rotaId = 'Rota é obrigatória';
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    console.log('Dados do relatório logística:', formData);
    alert('Relatório Logística gerado com sucesso! (Funcionalidade em desenvolvimento)');
  };

  return (
    <div className="relatorio-container">
      <div className="relatorio-header">
        <h1>RELATÓRIO • LOGÍSTICA</h1>
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
                  <option value="">[Selecione o Cliente]</option>
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
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="veiculoId">
                  Veículo<span className="required">*</span>
                </label>
                <select
                  id="veiculoId"
                  name="veiculoId"
                  value={formData.veiculoId}
                  onChange={handleChange}
                  className={`form-select ${errors.veiculoId ? 'error' : ''}`}
                  disabled={!formData.clienteId}
                >
                  <option value="">[Selecione o Veículo]</option>
                  {veiculos.map(veiculo => (
                    <option key={veiculo.id} value={veiculo.id}>
                      {veiculo.nome || veiculo.placa || veiculo.codigo}
                    </option>
                  ))}
                </select>
                {errors.veiculoId && (
                  <span className="error-message">{errors.veiculoId}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="horaInicioRota">
                  Hora Início da rota<span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <Clock className="input-icon" size={18} />
                  <input
                    type="text"
                    id="horaInicioRota"
                    name="horaInicioRota"
                    value={formData.horaInicioRota}
                    onChange={handleChange}
                    placeholder="HH:MM"
                    className={`form-input ${errors.horaInicioRota ? 'error' : ''}`}
                  />
                </div>
                {errors.horaInicioRota && (
                  <span className="error-message">{errors.horaInicioRota}</span>
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="rotaId">
                  Rota<span className="required">*</span>
                </label>
                <select
                  id="rotaId"
                  name="rotaId"
                  value={formData.rotaId}
                  onChange={handleChange}
                  className={`form-select ${errors.rotaId ? 'error' : ''}`}
                >
                  <option value="">[Selecione a Rota]</option>
                </select>
                {errors.rotaId && (
                  <span className="error-message">{errors.rotaId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="trechoId">
                  Trecho
                </label>
                <div className="input-with-icon">
                  <Plus className="input-icon" size={18} />
                  <select
                    id="trechoId"
                    name="trechoId"
                    value={formData.trechoId}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">[Selecione o Trecho]</option>
                  </select>
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
          <h2>Relatório de Logística</h2>
          <p>
            Esse é o Relatório de Logística. Acima selecione o Cliente, o Plano, o Período e faça os ajustes necessários em Ajuste de tempo, após clique no botão Pesquisar para gerar as informações.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RelatorioLogistica;
