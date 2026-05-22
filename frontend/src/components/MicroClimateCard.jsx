import { t } from '../i18n'

export default function MicroClimateCard({ forecastData, lang='english' }) {
  const l = t[lang] || t.english
  if (!forecastData || !forecastData.forecast) return null

  const { forecast, alert, rule } = forecastData
  const isDanger = alert.includes('🚨')

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">{l.microClimateTitle || '📈 Micro-Climate Risk Forecast'}</div>
      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        <div style={{
          padding: '12px 14px',
          background: isDanger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          border: `1px solid ${isDanger ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
          borderRadius: 10,
          fontSize: '0.85rem',
          color: isDanger ? 'var(--red)' : 'var(--green-400)',
          marginBottom: 16,
          fontWeight: 600,
          lineHeight: 1.5,
          animation: isDanger ? 'pulse-alert 2s infinite' : 'none'
        }}>
          {alert}
        </div>

        <style>{`
          @keyframes pulse-alert {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          }
          @keyframes grow-up {
            from { height: 0; opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 'auto' }}>
          {forecast.map((day, i) => {
            const dateStr = new Date(day.date).toLocaleDateString(lang === 'english' ? 'en-US' : lang === 'hindi' ? 'hi-IN' : 'bn-BD', { weekday: 'short', day: 'numeric' })
            const heightPercent = Math.min((day.humidity / 100) * 40, 40) // up to 40px height bar
            return (
              <div key={i} style={{ 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid var(--border)', 
                borderRadius: 12, 
                padding: '12px 4px', 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{dateStr}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{day.temp}°</div>
                
                {/* Unique animated humidity bar */}
                <div style={{ width: '4px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: 4, position: 'relative', marginTop: 4, marginBottom: 4 }}>
                  <div style={{ 
                    position: 'absolute', bottom: 0, left: 0, right: 0, 
                    height: `${heightPercent}px`, 
                    background: 'var(--blue)', 
                    borderRadius: 4,
                    animation: `grow-up 1.5s cubic-bezier(0.2, 0.8, 0.2, 1.1) ${i * 0.15 + 0.5}s both`
                  }} />
                </div>

                <div style={{ fontSize: '0.7rem', color: 'var(--blue)', fontWeight: 600 }}>{day.humidity}%</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{day.rain}mm</div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
