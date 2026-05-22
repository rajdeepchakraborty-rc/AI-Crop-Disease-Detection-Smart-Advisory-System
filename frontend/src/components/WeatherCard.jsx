import { t } from '../i18n'

export default function WeatherCard({ weather = {}, lang='english' }) {
  const l = t[lang] || t.english
  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">{l.weatherIntel}</div>
      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{weather.temperature}°C</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{l.temp}</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{weather.humidity}%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{l.humidity}</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '0 4px' }}>
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>{l.rain}</span>
          <span style={{ fontWeight: 600 }}>{weather.rainfall} mm</span>
        </div>
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '12px', borderRadius: 10, fontSize: '0.85rem', color: 'var(--blue)', marginTop: 'auto' }}>
          <strong>{l.impact}:</strong> {weather.impact}
        </div>
      </div>
    </div>
  )
}
