"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "../styles/maps.css"
import { rastreadorService } from "../services/rastreadorService"
import type { RastreadorComPosicao } from "../types"

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
  const tileLayerRef = useRef<L.TileLayer | null>(null)

  const [rastreadores, setRastreadores] = useState<RastreadorComPosicao[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mapType, setMapType] = useState<'mapa' | 'satelite'>('mapa')
  const [selectedRastreador, setSelectedRastreador] = useState<string | null>(null)

  // Função para carregar rastreadores com posições
  const loadRastreadores = async () => {
    try {
      setLoading(true)
      setError(null)
      const rastreadoresComPosicoes = await rastreadorService.listarRastreadoresComPosicoes()
      setRastreadores(rastreadoresComPosicoes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar rastreadores')
      console.error('Erro ao carregar rastreadores:', err)
    } finally {
      setLoading(false)
    }
  }

  // Função para formatar data/hora
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
    } catch {
      return 'N/A'
    }
  }

  // Função para obter ícone SVG do tipo de veículo
  const getVehicleIcon = (tipo?: string, isSelected: boolean = false) => {
    const size = isSelected ? 32 : 24
    const color = '#22c55e' // Verde

    if (tipo === 'onibus') {
      return L.divIcon({
        className: 'vehicle-marker',
        html: `
          <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20C21.1 6 22 6.9 22 8V19H20C20 20.1 19.1 21 18 21C16.9 21 16 20.1 16 19H8C8 20.1 7.1 21 6 21C4.9 21 4 20.1 4 19H2V8C2 6.9 2.9 6 4 6ZM4 8V17H20V8H4ZM6 19.5C6.83 19.5 7.5 18.83 7.5 18C7.5 17.17 6.83 16.5 6 16.5C5.17 16.5 4.5 17.17 4.5 18C4.5 18.83 5.17 19.5 6 19.5ZM18 19.5C18.83 19.5 19.5 18.83 19.5 18C19.5 17.17 18.83 16.5 18 16.5C17.17 16.5 16.5 17.17 16.5 18C16.5 18.83 17.17 19.5 18 19.5Z" fill="${color}"/>
            <rect x="6" y="10" width="12" height="4" fill="white"/>
          </svg>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      })
    } else {
      // Carro/caminhão
      return L.divIcon({
        className: 'vehicle-marker',
        html: `
          <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.28 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 6.5H17.5L19.11 11H4.89L6.5 6.5ZM7 13.5C7.83 13.5 8.5 14.17 8.5 15C8.5 15.83 7.83 16.5 7 16.5C6.17 16.5 5.5 15.83 5.5 15C5.5 14.17 6.17 13.5 7 13.5ZM17 13.5C17.83 13.5 18.5 14.17 18.5 15C18.5 15.83 17.83 16.5 17 16.5C16.17 16.5 15.5 15.83 15.5 15C15.5 14.17 16.17 13.5 17 13.5Z" fill="${color}"/>
          </svg>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      })
    }
  }

  // Função para atualizar marcadores no mapa
  const updateMapMarkers = (rastreadores: RastreadorComPosicao[]) => {
    if (!mapInstanceRef.current) return

    // Limpar marcadores existentes
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker)
    })
    markersRef.current = []

    // Adicionar novos marcadores
    rastreadores.forEach(rastreador => {
      const posicao = rastreador.posicaoAtual
      if (posicao?.latitude && posicao?.longitude) {
        const isSelected = selectedRastreador === rastreador.id
        const velocidade = posicao.velocidade || 0
        const placa = rastreador.placa || `PLACA-${rastreador.numeroSerial.slice(-6).toUpperCase()}` || 'N/A'
        const tipoVeiculo = rastreador.tipoVeiculo ||
          (rastreador.modelo?.toLowerCase().includes('onibus') ? 'onibus' : 'carro')

        const icon = getVehicleIcon(tipoVeiculo, isSelected)

        const marker = L.marker([posicao.latitude, posicao.longitude], { icon })
          .addTo(mapInstanceRef.current!)
          .bindPopup(`
            <div style="min-width: 150px; text-align: center;">
              <p style="margin: 4px 0; font-weight: bold; font-size: 14px;">PLACA</p>
              <p style="margin: 4px 0; font-size: 12px; color: #666;">${placa}</p>
              <p style="margin: 8px 0 4px 0; font-weight: bold; font-size: 14px;">${Math.round(velocidade)} km/h</p>
            </div>
          `)

        // Adicionar evento de clique
        marker.on('click', () => {
          setSelectedRastreador(rastreador.id)
          // Scroll para o cartão do veículo
          const cardElement = document.getElementById(`rastreador-${rastreador.id}`)
          if (cardElement) {
            cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
          }
        })

        markersRef.current.push(marker)
      }
    })
  }

  // Função para alternar tipo de mapa
  const toggleMapType = (newType: 'mapa' | 'satelite') => {
    if (!mapInstanceRef.current || mapType === newType) return

    // Remover camada atual
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current)
    }

    // Adicionar nova camada
    if (newType === 'satelite') {
      // Mudar para satélite
      tileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 19,
      })
    } else {
      // Mudar para mapa
      tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      })
    }

    tileLayerRef.current.addTo(mapInstanceRef.current)
    setMapType(newType)
  }

  // Função para centralizar no rastreador
  const centerOnRastreador = (rastreador: RastreadorComPosicao) => {
    if (!mapInstanceRef.current || !rastreador.posicaoAtual) return

    const posicao = rastreador.posicaoAtual
    mapInstanceRef.current.setView([posicao.latitude!, posicao.longitude!], 15)
    setSelectedRastreador(rastreador.id)
  }

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Inicializar o mapa centralizado no Brasil
      const map = L.map(mapRef.current).setView([-14.2350, -51.9253], 5)

      // Adicionar camada de tiles padrão (OpenStreetMap)
      tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Salvar referência do mapa
      mapInstanceRef.current = map

      // Carregar rastreadores iniciais
      loadRastreadores()

      // Atualizar rastreadores a cada 30 segundos
      const interval = setInterval(loadRastreadores, 30000)

      return () => {
        clearInterval(interval)
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        }
      }
    }
  }, [])

  // Atualizar marcadores quando os rastreadores mudarem
  useEffect(() => {
    updateMapMarkers(rastreadores)
  }, [rastreadores, selectedRastreador])

  return (
    <div className="maps-container">
      {/* Cartões de veículos no topo */}
      <div className="vehicles-cards-container">
        <div className="vehicles-cards-scroll">
          {loading && rastreadores.length === 0 ? (
            <div className="loading-cards">Carregando veículos...</div>
          ) : rastreadores.length === 0 ? (
            <div className="no-vehicles">Nenhum veículo encontrado</div>
          ) : (
            rastreadores.map((rastreador) => {
              const posicao = rastreador.posicaoAtual
              const velocidade = posicao?.velocidade || 0
              // Usar número serial como placa se não houver placa específica
              const placa = rastreador.placa || `PLACA-${rastreador.numeroSerial.slice(-6).toUpperCase()}` || 'N/A'
              // Usar modelo ou número serial como nome
              const nome = rastreador.nome || rastreador.modelo || rastreador.numeroSerial
              const condutor = rastreador.condutor || 'N/A'
              const isSelected = selectedRastreador === rastreador.id
              // Determinar tipo de veículo baseado no modelo ou usar padrão
              const tipoVeiculo = rastreador.tipoVeiculo ||
                (rastreador.modelo?.toLowerCase().includes('onibus') ? 'onibus' : 'carro')
              const tensaoBateria = posicao?.tensaoBateria
              const ignicao = posicao?.ignicao

              return (
                <div
                  key={rastreador.id}
                  id={`rastreador-${rastreador.id}`}
                  className={`vehicle-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => centerOnRastreador(rastreador)}
                >
                  <div className="vehicle-card-icon">
                    {tipoVeiculo === 'onibus' ? '🚌' : '🚛'}
                  </div>
                  <div className="vehicle-card-content">
                    <div className="vehicle-card-header">
                      <span className="vehicle-name">{nome}</span>
                      <span className="vehicle-placa">{placa}</span>
                    </div>
                    <div className="vehicle-card-info">
                      <div className="vehicle-info-item">
                        <span className="vehicle-label">Condutor:</span>
                        <span className="vehicle-value">{condutor}</span>
                      </div>
                      <div className="vehicle-info-item">
                        <span className="vehicle-label">Atualização:</span>
                        <span className="vehicle-value">{formatDateTime(posicao?.timestamp)}</span>
                      </div>
                    </div>
                    <div className="vehicle-card-footer">
                      <div className="vehicle-stat">
                        <span className="vehicle-stat-value">{Math.round(velocidade)}Km/h</span>
                      </div>
                      <div className="vehicle-stat">
                        <span className="vehicle-stat-icon">🔑</span>
                        <span className="vehicle-stat-value">{ignicao ? 'Ligada' : 'Desligada'}</span>
                      </div>
                      <div className="vehicle-stat">
                        <span className="vehicle-stat-icon">⚡</span>
                        <span className="vehicle-stat-value">
                          {tensaoBateria ? `${tensaoBateria.toFixed(1)}V` : 'N/A'}
                          {tensaoBateria && tensaoBateria < 12 && (
                            <span className="battery-warning">⚠️</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Mapa */}
      <div ref={mapRef} className="map">
        {/* Controles do mapa */}
        <div className="map-controls">
          <button
            className={`map-control-btn ${mapType === 'mapa' ? 'active' : ''}`}
            onClick={() => toggleMapType('mapa')}
          >
            Mapa
          </button>
          <button
            className={`map-control-btn ${mapType === 'satelite' ? 'active' : ''}`}
            onClick={() => toggleMapType('satelite')}
          >
            Satélite
          </button>
          <button className="map-control-btn search-btn" title="Pesquisar">
            🔍
          </button>
        </div>
      </div>

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
