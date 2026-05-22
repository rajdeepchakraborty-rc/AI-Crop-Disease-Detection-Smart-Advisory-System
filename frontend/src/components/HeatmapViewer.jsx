import { t } from '../i18n'
import { audioUrl } from '../api/cropApi'

export default function HeatmapViewer({ heatmap, explanation, heatmapUrl, lang='english' }) {
  const l = t[lang] || t.english
  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">{l.xai}</div>
      <div className="card-body">
        {heatmapUrl ? (
          <div style={{ marginBottom: 12, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img src={audioUrl(heatmapUrl)} alt="Grad-CAM Heatmap" style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 200 }} />
          </div>
        ) : (
          <div className="xai-heatmap-sim">
            <div className="xai-overlay-label">🔥 High Activation — Infected Region</div>
          </div>
        )}
        {heatmap && (
          <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--green-400)', fontWeight: 600 }}>Heatmap: </span>{heatmap}
          </div>
        )}
        {explanation && (
          <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.6, padding: '10px 12px', background: 'rgba(167,139,250,0.07)', borderRadius: 8, border: '1px solid rgba(167,139,250,0.2)' }}>
            <span style={{ color: 'var(--purple)', fontWeight: 600 }}>Explanation: </span>{explanation}
          </div>
        )}
      </div>
    </div>
  )
}
