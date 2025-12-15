import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/toast-custom.css'
import Login from "../pages/Login"
import Register from "../pages/Register"
import Dashboard from "../pages/Dashboard"
import Maps from "../pages/Maps"
import CadastroCliente from "../pages/CadastroCliente"
import CadastroMaquina from "../pages/CadastroMaquina"
import CadastroColaborador from "../pages/CadastroColaborador"
import CadastroRastreador from "../pages/CadastroRastreador"
import EstoqueChipGSM from "../pages/EstoqueChipGSM"
import EstoqueEquipamento from "../pages/EstoqueEquipamento"
import EstoqueFornecedorChipGSM from "../pages/EstoqueFornecedorChipGSM"
import RelatorioParadaDeslocamento from "../pages/RelatorioParadaDeslocamento"
import RelatorioHistorico from "../pages/RelatorioHistorico"
import RelatorioMotoristaJornada from "../pages/RelatorioMotoristaJornada"
import RelatorioLogistica from "../pages/RelatorioLogistica"
import RelatorioEvento from "../pages/RelatorioEvento"
import RelatorioManutencao from "../pages/RelatorioManutencao"
import RelatorioAbastecimento from "../pages/RelatorioAbastecimento"
import RelatorioMulta from "../pages/RelatorioMulta"
import RelatorioViagem from "../pages/RelatorioViagem"
import RelatorioCustoViagem from "../pages/RelatorioCustoViagem"
import RelatorioEntrega from "../pages/RelatorioEntrega"
import RelatorioChecklist from "../pages/RelatorioChecklist"
import RelatorioVinculo from "../pages/RelatorioVinculo"
import RelatorioPontos from "../pages/RelatorioPontos"
import RelatorioCercas from "../pages/RelatorioCercas"
import RelatorioAtraso from "../pages/RelatorioAtraso"
import RelatorioMatrizCliente from "../pages/RelatorioMatrizCliente"
import RelatorioFinanceiro from "../pages/RelatorioFinanceiro"
import RelatorioFrota from "../pages/RelatorioFrota"
import PerimetrosPonto from "../pages/PerimetrosPonto"
import PerimetrosCerca from "../pages/PerimetrosCerca"
import PerimetrosRota from "../pages/PerimetrosRota"
import Perfil from "../pages/Perfil"
import Configuracoes from "../pages/Configuracoes"
import Layout from "../components/Layout"
import ProtectedRoute from "./ProtectedRoute"
import { AuthProvider } from "../contexts/AuthContext"

const AppRouter: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes with Layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="/mapa" element={<Maps />} />
            <Route path="/cadastro/cliente" element={<CadastroCliente />} />
            <Route path="/cadastro/maquina" element={<CadastroMaquina />} />
            <Route path="/cadastro/colaborador" element={<CadastroColaborador />} />
            <Route path="/cadastro/rastreador" element={<CadastroRastreador />} />
            <Route path="/estoque/chip-gsm" element={<EstoqueChipGSM />} />
            <Route path="/estoque/equipamento" element={<EstoqueEquipamento />} />
            <Route path="/estoque/fornecedor-chip-gsm" element={<EstoqueFornecedorChipGSM />} />
            <Route path="/relatorios/historico" element={<RelatorioHistorico />} />
            <Route path="/relatorios/parada-deslocamento" element={<RelatorioParadaDeslocamento />} />
            <Route path="/relatorios/motorista-jornada" element={<RelatorioMotoristaJornada />} />
            <Route path="/relatorios/logistica" element={<RelatorioLogistica />} />
            <Route path="/relatorios/evento" element={<RelatorioEvento />} />
            <Route path="/relatorios/manutencao" element={<RelatorioManutencao />} />
            <Route path="/relatorios/abastecimento" element={<RelatorioAbastecimento />} />
            <Route path="/relatorios/multa" element={<RelatorioMulta />} />
            <Route path="/relatorios/viagem" element={<RelatorioViagem />} />
            <Route path="/relatorios/custo-viagem" element={<RelatorioCustoViagem />} />
            <Route path="/relatorios/entrega" element={<RelatorioEntrega />} />
            <Route path="/relatorios/checklist" element={<RelatorioChecklist />} />
            <Route path="/relatorios/vinculo" element={<RelatorioVinculo />} />
            <Route path="/relatorios/pontos" element={<RelatorioPontos />} />
            <Route path="/relatorios/cercas" element={<RelatorioCercas />} />
            <Route path="/relatorios/atraso" element={<RelatorioAtraso />} />
            <Route path="/relatorios/matriz-cliente" element={<RelatorioMatrizCliente />} />
            <Route path="/relatorios/financeiro" element={<RelatorioFinanceiro />} />
            <Route path="/relatorios/frota" element={<RelatorioFrota />} />
            <Route path="/perimetros/ponto" element={<PerimetrosPonto />} />
            <Route path="/perimetros/cerca" element={<PerimetrosCerca />} />
            <Route path="/perimetros/rota" element={<PerimetrosRota />} />
            <Route path="/profile" element={<Perfil />} />
            <Route path="/settings" element={<Configuracoes />} />
            {/* Add other protected routes here as needed */}
            {/* <Route path="/help" element={<Help />} /> */}
          </Route>

          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />

          {/* Catch all route - redirect to login for unauthenticated users */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        {/* Toast Container - notificações globais */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={true}
          draggable={false}
          pauseOnHover={true}
          limit={5}
          theme="colored"
          enableMultiContainer={false}
          transition="slide"
          closeButton={({ closeToast }) => (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                closeToast();
              }}
              style={{
                color: 'white',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
                fontSize: '20px',
                fontWeight: 'bold',
                opacity: 0.8,
                transition: 'all 0.2s',
                zIndex: 10000,
                position: 'relative',
                lineHeight: '1',
                minWidth: '24px',
                minHeight: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.borderRadius = '4px';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.8';
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              aria-label="Fechar"
            >
              ×
            </button>
          )}
          style={{ zIndex: 9999 }}
        />
      </Router>
    </AuthProvider>
  )
}

export default AppRouter
