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
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{ zIndex: 9999 }}
        />
      </Router>
    </AuthProvider>
  )
}

export default AppRouter
