"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "../styles/maps.css"
import FilterModal from "../components/FilterModal"
import { maquinaService } from "../services/maquinaService"
import type { Maquina, MaquinaFilters } from "../types"

// Fix para ícones padrão do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

const Maps: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [maquinas, setMaquinas] = useState<Maquina[]>([])
  const [filters, setFilters] = useState<MaquinaFilters>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Função para carregar máquinas
  const loadMaquinas = async (filters: MaquinaFilters = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await maquinaService.getMaquinas(filters)
      setMaquinas(response.data.maquinas)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar máquinas')
      console.error('Erro ao carregar máquinas:', err)
    } finally {
      setLoading(false)
    }
  }

  // Função para atualizar marcadores no mapa
  const updateMapMarkers = (maquinas: Maquina[]) => {
    if (!mapInstanceRef.current) return

    // Limpar marcadores existentes
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker)
    })
    markersRef.current = []

    // Adicionar novos marcadores
    maquinas.forEach(maquina => {
      if (maquina.localizacao) {
        // Para demonstração, vamos usar coordenadas aleatórias em São Paulo
        // Em um sistema real, você teria coordenadas reais das máquinas
        const lat = -23.5505 + (Math.random() - 0.5) * 0.1
        const lng = -46.6333 + (Math.random() - 0.5) * 0.1

        const marker = L.marker([lat, lng])
          .addTo(mapInstanceRef.current!)
          .bindPopup(`
            <div>
              <h4>${maquina.nome}</h4>
              <p><strong>Código:</strong> ${maquina.codigo}</p>
              <p><strong>Tipo:</strong> ${maquina.tipo}</p>
              <p><strong>Status:</strong> ${maquina.status}</p>
              <p><strong>Localização:</strong> ${maquina.localizacao}</p>
              ${maquina.fabricante ? `<p><strong>Fabricante:</strong> ${maquina.fabricante}</p>` : ''}
              ${maquina.responsavel ? `<p><strong>Responsável:</strong> ${maquina.responsavel}</p>` : ''}
            </div>
          `)

        markersRef.current.push(marker)
      }
    })
  }

  // Função para aplicar filtros
  const handleApplyFilters = (newFilters: MaquinaFilters) => {
    setFilters(newFilters)
    loadMaquinas(newFilters)
  }

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Inicializar o mapa
      const map = L.map(mapRef.current).setView([-23.5505, -46.6333], 13) // São Paulo como centro

      // Adicionar camada de tiles do OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Salvar referência do mapa
      mapInstanceRef.current = map

      // Carregar máquinas iniciais
      loadMaquinas()
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Atualizar marcadores quando as máquinas mudarem
  useEffect(() => {
    updateMapMarkers(maquinas)
  }, [maquinas])

  return (
    <div className="maps-container">
      <div ref={mapRef} className="map">
        <div className="map-overlay-panel">
          <div className="panel-header">
            <h3>Informações do Mapa</h3>
          </div>
          <div className="panel-content">
            <div className="info-item">
              <span className="label">Localização:</span>
              <span className="value">São Paulo, SP</span>
            </div>
            <div className="info-item">
              <span className="label">Marcadores:</span>
              <span className="value">{maquinas.length} pontos</span>
            </div>
            <div className="info-item">
              <span className="label">Zoom:</span>
              <span className="value">13x</span>
            </div>
          </div>
          <div className="panel-actions">
            <button
              className="btn btn-primary"
              onClick={() => setIsFilterModalOpen(true)}
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Filtrar'}
            </button>
            <button className="btn btn-secondary">Exportar</button>
          </div>
        </div>
      </div>

      {/* Modal de Filtro */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />

      {/* Mensagem de erro */}
      {error && (
        <div className="error-message" style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#ff4444',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          zIndex: 1000
        }}>
          {error}
        </div>
      )}
    </div>
  )
}

export default Maps
