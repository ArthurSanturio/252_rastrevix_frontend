"use client"

import type React from "react"
import { useAuth } from "../contexts/AuthContext"
import "../styles/dashboard-pages.css"

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const userName = user?.name || "Usuário"

  return (
    <div className="dashboard-content">
      <div className="dashboard-welcome">
        <h2>Bem-vindo de volta, {userName}!</h2>
        <p>Aqui está um resumo das suas atividades</p>
      </div>

      <div className="dashboard-grid">
        <div className="card card-elevated">
          <div className="stats-content">
            <h3>TOTAL DE PROJETOS</h3>
            <p className="stats-number">12</p>
            <span className="stats-change positive">+2 este mês</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>TAREFAS CONCLUÍDAS</h3>
            <p className="stats-number">48</p>
            <span className="stats-change positive">+8 esta semana</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>HORAS TRABALHADAS</h3>
            <p className="stats-number">156</p>
            <span className="stats-change positive">+12 esta semana</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>META MENSAL</h3>
            <p className="stats-number">85%</p>
            <span className="stats-change positive">+5% esta semana</span>
          </div>
        </div>
      </div>

      <div className="dashboard-bottom-sections">
        <div className="card card-elevated">
          <h2>Atividades Recentes</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-content">
                <p>Nova tarefa criada: "Implementar sidebar"</p>
                <span className="activity-time">Há 2 horas</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-content">
                <p>Tarefa concluída: "Configurar roteamento"</p>
                <span className="activity-time">Há 4 horas</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card card-elevated">
          <h2>Projetos em Andamento</h2>
          <div className="project-list">
            <div className="project-item">
              <div className="project-header">
                <h3>Rastrevix Dashboard</h3>
                <span className="project-status in-progress">EM PROGRESSO</span>
              </div>
              <div className="project-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "75%" }}></div>
                </div>
                <span className="progress-text">75% concluído</span>
              </div>
              <div className="project-meta">
                <span>3 tarefas restantes</span>
                <span>Prazo: 15/01/2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
