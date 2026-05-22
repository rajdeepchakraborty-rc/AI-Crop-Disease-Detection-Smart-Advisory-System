import html2pdf from 'html2pdf.js'
import { t } from '../i18n'

export default function ReportModal({ result, lang = 'english', onClose }) {
  const l = t[lang] || t.english
  
  const download = () => {
    const element = document.getElementById('report-content')
    const opt = {
      margin:       [10, 10, 10, 10],
      filename:     `Clinical_Report_${result.leaf_id}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
    
    html2pdf().set(opt).from(element).save()
  }

  const { advice = {}, weather = {} } = result
  const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '800px', width: '95%' }}>
        <div className="modal-header">
          📄 Official Diagnostic Report
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={download}>
              ⬇ Download PDF
            </button>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>
        
        <div className="modal-body" style={{ padding: 0, maxHeight: '75vh', overflowY: 'auto', background: '#f8fafc' }}>
          {/* THE ACTUAL HTML REPORT TO BE CAPTURED AS PDF */}
          <div id="report-content" style={{ padding: '40px', background: 'white', color: '#1e293b', fontFamily: 'Arial, sans-serif' }}>
            
            {/* Header / Letterhead */}
            <div style={{ borderBottom: '3px solid #0f172a', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '28px', color: '#0f172a', letterSpacing: '1px', textTransform: 'uppercase' }}>CLINICAL DIAGNOSTIC REPORT</h1>
                <p style={{ margin: '5px 0 0', color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>DEPARTMENT OF AGRICULTURAL PATHOLOGY</p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#475569' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#0f172a', marginBottom: '4px' }}>CropAI System</div>
                <div>ID: {result.leaf_id}</div>
                <div>Date: {dateStr}</div>
              </div>
            </div>

            {/* Patient / Subject Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px', background: '#f1f5f9', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Subject Identification</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{result.leaf_id}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Requested Treatment Protocol</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: result.treatment_type === 'chemical' ? '#b91c1c' : '#15803d' }}>
                  {result.treatment_type ? result.treatment_type.toUpperCase() : 'ORGANIC'}
                </div>
              </div>
            </div>

            {/* Diagnosis Section */}
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '18px', borderBottom: '2px solid #cbd5e1', paddingBottom: '8px', color: '#0f172a', marginBottom: '15px' }}>
                <span style={{ color: '#0284c7', marginRight: '8px' }}>❖</span> PATHOLOGY DIAGNOSIS
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ flex: 1, padding: '20px', background: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '0 8px 8px 0' }}>
                  <div style={{ fontSize: '12px', color: '#991b1b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>Detected Condition</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7f1d1d' }}>{result.disease}</div>
                </div>
                <div style={{ width: '150px', textAlign: 'center', padding: '20px', border: '2px solid #e2e8f0', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>Confidence</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0284c7' }}>{result.confidence}%</div>
                </div>
              </div>
              
              <div style={{ marginTop: '15px', fontSize: '14px', lineHeight: '1.6', color: '#334155' }}>
                <strong>Clinical Notes:</strong> {result.explanation}
              </div>
            </div>

            {/* Environmental Vitals */}
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '18px', borderBottom: '2px solid #cbd5e1', paddingBottom: '8px', color: '#0f172a', marginBottom: '15px' }}>
                <span style={{ color: '#0284c7', marginRight: '8px' }}>❖</span> ENVIRONMENTAL VITALS
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                <div style={{ border: '1px solid #e2e8f0', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Temperature</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '5px' }}>{weather.temperature || '--'} °C</div>
                </div>
                <div style={{ border: '1px solid #e2e8f0', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Humidity</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '5px' }}>{weather.humidity || '--'} %</div>
                </div>
                <div style={{ border: '1px solid #e2e8f0', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Rainfall</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '5px' }}>{weather.rainfall || '0.0'} mm</div>
                </div>
              </div>
            </div>

            {/* Prescription & Treatment */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '18px', borderBottom: '2px solid #cbd5e1', paddingBottom: '8px', color: '#0f172a', marginBottom: '15px' }}>
                <span style={{ color: '#0284c7', marginRight: '8px' }}>Rx</span> PRESCRIPTION & PROTOCOL
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '14px', color: '#0f172a', marginBottom: '10px' }}>Recommended Treatment Steps:</h3>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#334155', lineHeight: '1.6' }}>
                  {advice.treatment_steps?.map((step, idx) => (
                    <li key={idx} style={{ marginBottom: '6px' }}>{step}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: '#fffbeb', padding: '15px', borderRadius: '6px', border: '1px solid #fde68a' }}>
                  <h3 style={{ fontSize: '13px', color: '#92400e', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Contraindications & Precautions</h3>
                  <ul style={{ margin: 0, paddingLeft: '15px', color: '#92400e', fontSize: '13px', lineHeight: '1.5' }}>
                    {advice.precautions?.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                  <h3 style={{ fontSize: '13px', color: '#166534', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Preventative Measures</h3>
                  <ul style={{ margin: 0, paddingLeft: '15px', color: '#166534', fontSize: '13px', lineHeight: '1.5' }}>
                    {advice.prevention?.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer Signature */}
            <div style={{ marginTop: '50px', borderTop: '2px dashed #cbd5e1', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ width: '200px', textAlign: 'center' }}>
                <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '8px', height: '40px' }}>
                  {/* Fake Signature graphic */}
                  <span style={{ fontFamily: '"Brush Script MT", cursive', fontSize: '24px', color: '#1e3a8a' }}>CropAI System</span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>AUTHORIZED SIGNATURE</div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-block', border: '3px double #10b981', color: '#10b981', padding: '10px 15px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  VERIFIED BY CROP-AI<br/>
                  <span style={{ fontSize: '10px', color: '#047857' }}>DISEASE DETECTION PROJECT</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
