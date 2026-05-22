import { useState, useEffect } from 'react'
import { t } from '../i18n'

const getSeverityClass = (s = '') => {
  if (!s) return ''
  const lower = s.toLowerCase()
  if (lower.includes('healthy') || lower.includes('स्वस्थ') || lower.includes('সুস্থ')) return 'severity-healthy'
  if (lower.includes('severe') || lower.includes('गंभीर') || lower.includes('তীব্র'))  return 'severity-severe'
  if (lower.includes('moderate') || lower.includes('मध्यम') || lower.includes('মাঝারি'))return 'severity-moderate'
  return 'severity-mild'
}

export default function DiseaseCard({ result, lang='english' }) {
  const l = t[lang] || t.english
  const [barWidth, setBarWidth] = useState(0)
  useEffect(() => { setTimeout(() => setBarWidth(result.confidence), 200) }, [result.confidence])

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">{l.diseaseDetection}</div>
      <div className="card-body">
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 8 }}>
            {result.disease}
          </div>
          <span className={`severity-badge ${getSeverityClass(result.severity)}`}>
            {result.severity}
          </span>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div className="flex justify-between mb-2" style={{ fontSize: '0.8rem' }}>
            <span className="text-muted">{l.confidence}</span>
            <span className="text-green font-bold">{result.confidence}%</span>
          </div>
          <div className="confidence-bar-track">
            <div className="confidence-bar-fill" style={{ width: `${barWidth}%` }} />
          </div>
        </div>

        <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid var(--border)', fontSize: '0.83rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
          ⚠️ {result.risk_note}
        </div>

        <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            🍃 {result.leaf_id}
          </span>
          <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            💡 {result.image_processing?.lighting_condition || 'normal'} {l.light}
          </span>
        </div>
      </div>
    </div>
  )
}
