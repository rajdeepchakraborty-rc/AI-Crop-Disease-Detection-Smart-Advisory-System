import { useState } from 'react'
import { t } from '../i18n'

export default function AdvisoryPanel({ advice = {}, treatmentType, lang='english' }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const l = t[lang] || t.english
  const { treatment_steps = [], precautions = [], prevention = [] } = advice

  const displaySteps = isExpanded ? treatment_steps : treatment_steps.slice(0, 2)
  const displayPrecautions = isExpanded ? precautions : precautions.slice(0, 1)

  return (
    <div className="card" style={{ transition: 'all 0.3s ease' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span>{l.treatmentPlan} — {treatmentType === 'chemical' ? '🧪 Chemical' : '🌿 Organic'}</span>
      </div>
      <div className="card-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 20 }}>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--green-400)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {l.treatmentPlan}
            </div>
            <ul className="step-list">
              {displaySteps.map((s, i) => (
                <li key={i}><span className="step-num">{i + 1}</span>{s}</li>
              ))}
            </ul>
            {!isExpanded && treatment_steps.length > 2 && (
               <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', marginTop: 8 }}>...and {treatment_steps.length - 2} more steps</div>
            )}
          </div>
          
          {(isExpanded || precautions.length > 0) && (
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {l.precautions}
              </div>
              <ul className="bullet-list">
                {displayPrecautions.map((p, i) => <li key={i}><span className="bullet-dot">›</span>{p}</li>)}
              </ul>
              {!isExpanded && precautions.length > 1 && (
                 <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', marginTop: 8 }}>...and {precautions.length - 1} more precautions</div>
              )}
              
              {isExpanded && prevention.length > 0 && (
                <>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--blue)', marginBottom: 10, marginTop: 18, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {l.prevention}
                  </div>
                  <ul className="bullet-list">
                    {prevention.map((p, i) => <li key={i}><span className="bullet-dot" style={{color:'var(--blue)'}}>›</span>{p}</li>)}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
        
        <div style={{ marginTop: 20, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ 
              background: 'rgba(42,224,110,0.1)', border: '1px solid rgba(42,224,110,0.3)', 
              color: 'var(--accent)', padding: '6px 16px', borderRadius: 20, 
              fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={e => e.target.style.background = 'rgba(42,224,110,0.2)'}
            onMouseOut={e => e.target.style.background = 'rgba(42,224,110,0.1)'}
          >
            {isExpanded ? 'Show Less ⬆' : 'Read More ⬇'}
          </button>
        </div>
      </div>
    </div>
  )
}
