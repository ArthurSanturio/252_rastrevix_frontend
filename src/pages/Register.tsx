"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Por favor, preencha todos os campos")
      return false
    }

    if (formData.name.length < 2) {
      setError("O nome deve ter pelo menos 2 caracteres")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, insira um endereço de email válido")
      return false
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Call register API
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })

      setSuccess("Conta criada com sucesso! Redirecionando...")

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/")
      }, 1000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Falha no cadastro. Tente novamente."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="auth-card">
        <h1>Criar Conta</h1>
        <p>Junte-se ao Rastrevix e comece sua jornada hoje</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Seu nome completo"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Criando Conta..." : "Criar Conta"}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Já tem uma conta? <Link to="/login">Faça login aqui</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
