import DiseaseCard from './DiseaseCard'
import WeatherCard from './WeatherCard'
import AdvisoryPanel from './AdvisoryPanel'
import VoicePlayer from './VoicePlayer'
import ReportModal from './ReportModal'
import WhatIfPanel from './WhatIfPanel'
import HeatmapViewer from './HeatmapViewer'
import FarmHistory from './FarmHistory'
import MicroClimateCard from './MicroClimateCard'
import SupplyChainMap from './SupplyChainMap'
import ScrollReveal from './ScrollReveal'
import { useState } from 'react'
import { t } from '../i18n'

export default function ResultsDashboard({ result, lang='english' }) {
  const [showReport, setShowReport] = useState(false)
  const l = t[lang] || t.english

  return (
    <>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, flexWrap:'wrap', gap:12 }}>
        <div>
          <div className="section-title" style={{marginBottom:2}}>🧾 {l.analysisComplete}</div>
          <div className="text-muted" style={{fontSize:'0.83rem'}}>{l.leafId}: <span className="text-green" style={{fontWeight:600}}>{result.leaf_id}</span></div>
        </div>
        <button className="btn btn-outline animate-blink-btn" onClick={() => setShowReport(true)}>
          📄 {l.viewReport}
        </button>
      </div>

      <div className="results-grid">
        <ScrollReveal direction="left" delay={0}>
          <DiseaseCard result={result} lang={lang} />
        </ScrollReveal>
        
        <ScrollReveal direction="right" delay={100}>
          <WeatherCard weather={result.weather} lang={lang} />
        </ScrollReveal>
        
        {result.microclimate_forecast && (
          <ScrollReveal direction="left" delay={200}>
            <div className="card-wide"><MicroClimateCard forecastData={result.microclimate_forecast} lang={lang} /></div>
          </ScrollReveal>
        )}
        
        <ScrollReveal direction="right" delay={100}>
          <div className="card-wide"><AdvisoryPanel advice={result.advice} treatmentType={result.treatment_type} lang={lang} /></div>
        </ScrollReveal>

        <ScrollReveal direction="left" delay={0}>
          <HeatmapViewer heatmap={result.heatmap_description} explanation={result.explanation} heatmapUrl={result.heatmap_url} lang={lang} />
        </ScrollReveal>
        
        <ScrollReveal direction="right" delay={100}>
          <FarmHistory history={result.farm_history} leafId={result.leaf_id} lang={lang} />
        </ScrollReveal>
        
        {result.audio_url && (
          <ScrollReveal direction="left" delay={200}>
            <div className="card-wide"><VoicePlayer audioUrl={result.audio_url} script={result.voice_script} lang={lang} /></div>
          </ScrollReveal>
        )}
        
        {result.what_if_analysis && (
          <ScrollReveal direction="right" delay={100}>
            <div className="card-wide"><WhatIfPanel analysis={result.what_if_analysis} lang={lang} /></div>
          </ScrollReveal>
        )}

        {result.supply_chain && (
          <ScrollReveal direction="left" delay={200}>
            <div className="card-wide"><SupplyChainMap supplyChain={result.supply_chain} lang={lang} /></div>
          </ScrollReveal>
        )}
      </div>

      {showReport && (
        <ReportModal result={result} lang={lang} onClose={() => setShowReport(false)} />
      )}
    </>
  )
}
