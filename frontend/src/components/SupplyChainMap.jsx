import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useState, useEffect } from 'react'
import { t } from '../i18n'
import L from 'leaflet'

const createIcon = (color) => L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<svg width="28" height="40" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 8.5 12 22 12 22s12-13.5 12-22C24 5.373 18.627 0 12 0zm0 17c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z" fill="${color}"/>
  </svg>`,
  iconSize: [28, 40],
  iconAnchor: [14, 40],
  popupAnchor: [0, -36]
})

const userIcon = createIcon('#3b82f6') // Blue for Farm
const shopIcon = createIcon('#10b981') // Green for Shops

// Component to handle recentering the map
function RecenterButton({ center, label, bounds }) {
  const map = useMap()
  return (
    <button 
      className="btn btn-outline" 
      style={{ padding: '4px 10px', fontSize: '0.8rem', background: 'var(--green-500)', color: '#fff', border: 'none', position: 'absolute', top: 10, right: 10, zIndex: 1000 }}
      onClick={(e) => {
        e.stopPropagation()
        map.setView([center.lat, center.lng], 10)
      }}
    >
      {label}
    </button>
  )
}

export default function SupplyChainMap({ supplyChain, lang = 'english' }) {
  const l = t[lang] || t.english
  const [showMap, setShowMap] = useState(false)

  if (!supplyChain || !supplyChain.shops || supplyChain.shops.length === 0) return null

  const center = {
    lat: supplyChain.center.lat,
    lng: supplyChain.center.lon
  }

  // Calculate bounds to fit both the center and all shops
  const bounds = [
    [center.lat, center.lng],
    ...supplyChain.shops.map(s => [s.lat, s.lon])
  ]

  if (!showMap) {
    return (
      <div className="card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px' }}>
        <button 
          className="btn" 
          style={{ background: 'var(--green-500)', color: '#fff', fontSize: '1.1rem', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => setShowMap(true)}
        >
          <span>{l.findNearestSupplier || '📍 Find Nearest Supplier'}</span>
        </button>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{l.findNearestSupplier || '📍 Find Nearest Supplier'}</span>
      </div>
      <div className="card-body">
        <p style={{ fontSize: '0.85rem', marginBottom: 10, color: 'var(--gray-300)' }}>
          {l.supplierSubtext || 'Showing nearby shops stocking your treatment type.'}
        </p>
        
        <div style={{ height: '300px', width: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
          <MapContainer 
            center={[center.lat, center.lng]} 
            zoom={10} 
            style={{ height: '100%', width: '100%', zIndex: 0 }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <RecenterButton center={center} label={l.recenter || 'Recenter'} bounds={bounds} />
            
            <Marker position={[center.lat, center.lng]} icon={userIcon}>
              <Popup>
                <strong>Your Farm</strong><br/>
                Location
              </Popup>
            </Marker>
            
            {supplyChain.shops.map((shop, i) => (
              <Marker key={i} position={[shop.lat, shop.lon]} icon={shopIcon}>
                <Popup>
                  <div style={{ color: '#000' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>{shop.name}</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#666' }}>
                      Stock: {shop.stocks.join(', ')}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div style={{ marginTop: 10, fontSize: '0.75rem', color: 'var(--gray-400)' }}>
          <details>
            <summary style={{ cursor: 'pointer', outline: 'none' }}>{l.apiGuidance || 'API Guidance'}</summary>
            <p style={{ marginTop: 5 }}>{supplyChain.api_guidance}</p>
          </details>
        </div>
      </div>
    </div>
  )
}
