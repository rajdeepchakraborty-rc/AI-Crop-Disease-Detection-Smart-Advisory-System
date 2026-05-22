import { t } from '../i18n'

export default function WhatIfPanel({ analysis, lang='english' }) {
  const l = t[lang] || t.english
  return (
    <div className="card">
      <div className="card-header">{l.whatif}</div>
      <div className="card-body">
        <div className="whatif-result">
          <div className="whatif-label">🤖 AI Predictive Analysis</div>
          {analysis}
        </div>
      </div>
    </div>
  )
}
