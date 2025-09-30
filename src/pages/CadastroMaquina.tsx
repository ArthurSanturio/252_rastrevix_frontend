"use client"

import type React from "react"
import { useAuth } from "../contexts/AuthContext"
import "../styles/dashboard-pages.css"

const CadastroMaquina: React.FC = () => {
  const { user } = useAuth()
  const userName = user?.name || "Usuário"

  return (
    <div className="dashboard-content">
      <div className="dashboard-welcome">
        <h2>Cadastro de Máquinas, {userName}!</h2>
        <p>Gerencie o inventário e informações das máquinas</p>
      </div>

      <div className="dashboard-grid">
        <div className="card card-elevated">
          <div className="stats-content">
            <h3>TOTAL DE MÁQUINAS</h3>
            <p className="stats-number">1,247</p>
            <span className="stats-change positive">+32 este mês</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>MÁQUINAS ATIVAS</h3>
            <p className="stats-number">1,156</p>
            <span className="stats-change positive">+18 esta semana</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>EM MANUTENÇÃO</h3>
            <p className="stats-number">67</p>
            <span className="stats-change positive">-5 esta semana</span>
          </div>
        </div>

        <div className="card card-elevated">
          <div className="stats-content">
            <h3>EFICIÊNCIA MÉDIA</h3>
            <p className="stats-number">94.8%</p>
            <span className="stats-change positive">+1.2% esta semana</span>
          </div>
        </div>
      </div>

      <div className="dashboard-bottom-sections">
        <div className="card card-elevated">
          <h2>Registros Recentes</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-content">
                <p>Máquina "CNC-205" cadastrada</p>
                <span className="activity-time">Há 45 minutos</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-content">
                <p>Manutenção "Torno-103" concluída</p>
                <span className="activity-time">Há 1 hora</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-content">
                <p>Máquina "Fresa-89" calibrada</p>
                <span className="activity-time">Há 3 horas</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-content">
                <p>Inspeção "Solda-45" realizada</p>
                <span className="activity-time">Ontem</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card card-elevated">
          <h2>Máquinas em Manutenção</h2>
          <div className="project-list">
            <div className="project-item">
              <div className="project-header">
                <h3>Torno CNC-301</h3>
                <span className="project-status in-progress">EM MANUTENÇÃO</span>
              </div>
              <div className="project-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "40%" }}></div>
                </div>
                <span className="progress-text">40% concluído</span>
              </div>
              <div className="project-meta">
                <span>Troca de peças</span>
                <span>Prazo: 22/01/2024</span>
              </div>
            </div>

            <div className="project-item">
              <div className="project-header">
                <h3>Fresa Universal-156</h3>
                <span className="project-status completed">MANUTENÇÃO CONCLUÍDA</span>
              </div>
              <div className="project-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "100%" }}></div>
                </div>
                <span className="progress-text">100% concluído</span>
              </div>
              <div className="project-meta">
                <span>Máquina operacional</span>
                <span>Concluído em 15/01/2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CadastroMaquina
