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
      const response = await maquinaService.listarMaquinas(filters)
      setMaquinas(response.data.maquinas)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar máquinas')
      console.error('Erro ao carregar máquinas:', err)
    } finally {
      setLoading(false)
    }
  }

  // Função para gerar coordenadas consistentes baseadas no ID da máquina
  const generateConsistentCoordinates = (maquinaId: string) => {
    // Usar o ID da máquina para gerar coordenadas consistentes
    let hash = 0
    for (let i = 0; i < maquinaId.length; i++) {
      const char = maquinaId.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }

    // Normalizar o hash para valores entre 0 e 1
    const normalizedHash = Math.abs(hash) / 2147483647

    // Gerar coordenadas baseadas no hash (área de São Paulo)
    const baseLat = -23.5505
    const baseLng = -46.6333
    const range = 0.05 // Raio de ~5km

    const lat = baseLat + (normalizedHash - 0.5) * range
    const lng = baseLng + ((normalizedHash * 7) % 1 - 0.5) * range // Usar múltiplo para longitude

    return { lat, lng }
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
        // Usar coordenadas reais se disponíveis, senão gerar consistentes
        let lat, lng
        if (maquina.latitude && maquina.longitude) {
          lat = maquina.latitude
          lng = maquina.longitude
        } else {
          const coords = generateConsistentCoordinates(maquina.id)
          lat = coords.lat
          lng = coords.lng
        }

        // Definir cor do marcador baseado no status
        const getMarkerColor = (status: string) => {
          switch (status) {
            case 'ativa': return '#28a745' // Verde
            case 'inativa': return '#6c757d' // Cinza
            case 'manutencao': return '#ffc107' // Amarelo
            case 'calibracao': return '#17a2b8' // Azul
            default: return '#007bff' // Azul padrão
          }
        }

        // Criar ícone customizado com cor baseada no status
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            background-color: ${getMarkerColor(maquina.status)};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: bold;
          ">${maquina.codigo.charAt(maquina.codigo.length - 1)}</div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })

        const marker = L.marker([lat, lng], { icon: customIcon })
          .addTo(mapInstanceRef.current!)
          .bindPopup(`
            <div style="min-width: 200px;">
              <h4 style="margin: 0 0 8px 0; color: #333;">${maquina.nome}</h4>
              <p style="margin: 4px 0;"><strong>Código:</strong> ${maquina.codigo}</p>
              <p style="margin: 4px 0;"><strong>Tipo:</strong> ${maquina.tipo}</p>
              <p style="margin: 4px 0;"><strong>Status:</strong> 
                <span style="color: ${getMarkerColor(maquina.status)}; font-weight: bold;">${maquina.status}</span>
              </p>
              <p style="margin: 4px 0;"><strong>Localização:</strong> ${maquina.localizacao}</p>
              ${maquina.fabricante ? `<p style="margin: 4px 0;"><strong>Fabricante:</strong> ${maquina.fabricante}</p>` : ''}
              ${maquina.responsavel ? `<p style="margin: 4px 0;"><strong>Responsável:</strong> ${maquina.responsavel}</p>` : ''}
              ${maquina.eficiencia ? `<p style="margin: 4px 0;"><strong>Eficiência:</strong> ${maquina.eficiencia}%</p>` : ''}
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
