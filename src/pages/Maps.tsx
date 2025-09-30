"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "../styles/maps.css"

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

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Inicializar o mapa
      const map = L.map(mapRef.current).setView([-23.5505, -46.6333], 13) // São Paulo como centro

      // Adicionar camada de tiles do OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Adicionar alguns marcadores de exemplo
      L.marker([-23.5505, -46.6333])
        .addTo(map)
        .bindPopup("São Paulo - Centro")
        .openPopup()

      L.marker([-23.5614, -46.6565])
        .addTo(map)
        .bindPopup("Parque Ibirapuera")

      L.marker([-23.5489, -46.6388])
        .addTo(map)
        .bindPopup("Avenida Paulista")

      // Salvar referência do mapa
      mapInstanceRef.current = map
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

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
              <span className="value">3 pontos</span>
            </div>
            <div className="info-item">
              <span className="label">Zoom:</span>
              <span className="value">13x</span>
            </div>
          </div>
          <div className="panel-actions">
            <button className="btn btn-primary">Filtrar</button>
            <button className="btn btn-secondary">Exportar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Maps
