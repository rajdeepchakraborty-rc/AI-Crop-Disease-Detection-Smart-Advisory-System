import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { analyzeCrop } from '../api/cropApi'
import ImageUpload from './ImageUpload'
import ResultsDashboard from './ResultsDashboard'

const AGENT_NAMES = [
  'Image Processing', 'Disease Detection', 'Severity Analysis',
  'Explainability (XAI)', 'Leaf Signature', 'Farm Memory',
  'Weather Intelligence', 'Microclimate Forecast', 'Supply Chain',
  'Advisory LLM', 'What-If Simulation', 'Voice Generator',
  'Report Generator', 'Response Builder',
]

const ThreeJSAnalyzer = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    
    // Localized loader camera (zoomed out to prevent clipping)
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
    camera.position.z = 8.8

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(180, 180)
    renderer.setPixelRatio(window.devicePixelRatio)
    
    containerRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5)
    directionalLight.position.set(2, 2, 5)
    scene.add(directionalLight)
    const accentLight = new THREE.PointLight(0x2AE06E, 2)
    accentLight.position.set(-2, -2, 2)
    scene.add(accentLight)
    
    // Core AI Brain Sphere (Wireframe Icosahedron)
    const coreMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2AE06E, 
      emissive: 0x2AE06E, 
      emissiveIntensity: 0.8,
      wireframe: true,
      transparent: true,
      opacity: 0.9
    })
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 1), coreMaterial)
    scene.add(core)

    // Data Rings (Simulating scanning/processing)
    const ringMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x86efac, 
      emissive: 0x1F8A4C,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    })
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.04, 16, 100), ringMaterial)
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.02, 16, 100), ringMaterial)
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(2.9, 0.06, 16, 100), ringMaterial)
    
    ring1.rotation.x = Math.PI / 2
    ring2.rotation.y = Math.PI / 3
    ring3.rotation.z = Math.PI / 4
    
    scene.add(ring1, ring2, ring3)

    // Floating Data Nodes
    const nodesGroup = new THREE.Group()
    const nodeGeo = new THREE.SphereGeometry(0.12, 8, 8)
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    for(let i = 0; i < 15; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat)
      const angle = (i / 15) * Math.PI * 2
      const radius = 2.5 + Math.random() * 0.5
      node.position.set(Math.cos(angle) * radius, Math.sin(angle * 3) * 1.5, Math.sin(angle) * radius)
      nodesGroup.add(node)
    }
    scene.add(nodesGroup)

    let animationId
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      
      // Complex rotations for high-tech feel
      core.rotation.x += 0.015
      core.rotation.y += 0.02
      
      ring1.rotation.x += 0.02
      ring1.rotation.y += 0.01
      
      ring2.rotation.y -= 0.015
      ring2.rotation.z += 0.02
      
      ring3.rotation.x += 0.01
      ring3.rotation.z -= 0.01
      
      nodesGroup.rotation.y += 0.03
      nodesGroup.rotation.z += 0.01
      
      // Pulsing effect
      const time = Date.now() * 0.004
      const scale = 1 + Math.sin(time) * 0.12
      core.scale.set(scale, scale, scale)
      
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: 180, 
        height: 180, 
        margin: '0 auto 24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(circle, rgba(42,224,110,0.15) 0%, transparent 60%)',
        borderRadius: '50%',
        boxShadow: '0 0 40px rgba(42,224,110,0.1)'
      }} 
    />
  )
}

export default function DashboardPage() {
  const canvasRef = useRef(null)
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [lat, setLat] = useState('28.6139')
  const [lon, setLon] = useState('77.2090')
  const [treatmentType, setTreatmentType] = useState('organic')
  const [language, setLanguage] = useState('english')
  const [userQuery, setUserQuery] = useState('')
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [currentTime, setCurrentTime] = useState('00:00')
  const [showResults, setShowResults] = useState(false)
  const [analyzingProgress, setAnalyzingProgress] = useState(0)
  const [currentAnalyzingStep, setCurrentAnalyzingStep] = useState('')
  const resultsRef = useRef(null)
  
  // 3D animation refs
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const animationFrameRef = useRef(null)
  const particlesRef = useRef([])
  const cubesRef = useRef([])
  const spheresRef = useRef([])
  const ringsRef = useRef([])
  const helixRef = useRef(null)
  const coreRef = useRef(null)
  const glowRingRef = useRef(null)

  // Analyzing steps for animation
  const analyzingSteps = [
    'Initializing AI Models...',
    'Processing Leaf Image...',
    'Detecting Disease Patterns...',
    'Analyzing Severity Level...',
    'Generating XAI Heatmap...',
    'Fetching Weather Data...',
    'Calculating Microclimate...',
    'Checking Farm History...',
    'Analyzing Supply Chain...',
    'Generating Advisory Report...',
    'Preparing Voice Output...',
    'Finalizing Results...'
  ]

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { setLat(pos.coords.latitude.toFixed(4)); setLon(pos.coords.longitude.toFixed(4)) },
        () => {}
      )
    }
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000 * 60)
    return () => clearInterval(timer)
  }, [])

  // Background animation removed
  // Simulate analyzing progress
  useEffect(() => {
    let interval
    let stepInterval
    
    if (status === 'analyzing') {
      setAnalyzingProgress(0)
      setCurrentAnalyzingStep(analyzingSteps[0])
      
      // Progress bar animation
      interval = setInterval(() => {
        setAnalyzingProgress(prev => {
          if (prev >= 95) {
            return 95 // Stall at 95% until backend response
          }
          return prev + 1.5
        })
      }, 150)
      
      // Step text animation
      let stepIndex = 0
      stepInterval = setInterval(() => {
        stepIndex++
        if (stepIndex < analyzingSteps.length) {
          setCurrentAnalyzingStep(analyzingSteps[stepIndex])
        }
      }, 800)
    }
    
    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
    }
  }, [status])

  const handleImageSelect = (file) => {
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
    setResult(null)
    setStatus('idle')
    setShowResults(false)
    setAnalyzingProgress(0)
  }

  const handleAnalyze = async () => {
    if (!image) return
    setStatus('analyzing')
    setResult(null)
    setErrorMsg('')
    setShowResults(false)
    setAnalyzingProgress(0)
    
    try {
      const data = await analyzeCrop({ 
        image, 
        lat: parseFloat(lat), 
        lon: parseFloat(lon), 
        treatmentType, 
        userQuery, 
        language 
      })
      
      // Force 100% completion when backend responds
      setAnalyzingProgress(100)
      setCurrentAnalyzingStep('Analysis Complete!')
      
      setTimeout(() => {
        setResult(data)
        setStatus('done')
        setShowResults(true)
        // Scroll to results after a short delay
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          document.getElementById('what-if-section')?.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }, 300)
      }, 800)
    } catch (e) {
      setStatus('error')
      setErrorMsg(e?.response?.data?.detail || e.message || 'Analysis failed')
    }
  }

  const confidence = result?.confidence || 0
  const disease = result?.disease || null
  const weather = result?.weather || {}

  return (
    <div className="dashboard-container" style={{ 
      display: 'flex', 
      height: 'calc(100vh - 75px)', // Subtract header height
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* LEFT PANEL - Phone UI */}
      <div className="phone-panel" style={{
        flex: '0 0 420px',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(10,26,14,0.95), rgba(11,30,20,0.98))',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(42,224,110,0.3)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        zIndex: 10,
        boxShadow: '10px 0 30px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
          height: '95%',
          borderRadius: 60,
          background: 'radial-gradient(ellipse, rgba(42,224,110,0.08), transparent)',
          pointerEvents: 'none',
          zIndex: 0
        }} />
        
        <div className="diag-phone" style={{
          margin: '30px auto',
          width: '100%',
          maxWidth: '360px',
          position: 'relative',
          zIndex: 1
        }}>
          <div className="diag-phone-inner">
            
            {/* Status Bar */}
            <div className="diag-statusbar">
              <span>{currentTime}</span>
              <div className="diag-statusbar-notch"></div>
              <div className="diag-statusbar-icons">
                <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 0C3.58 0 0 2.69 0 6h2c0-2.21 2.69-4 6-4s6 1.79 6 4h2c0-3.31-3.58-6-8-6zM8 4C5.79 4 4 5.12 4 6.5h2c0-.28.9-.5 2-.5s2 .22 2 .5h2C12 5.12 10.21 4 8 4z" opacity=".6"/><circle cx="8" cy="9" r="2"/></svg>
                <svg width="18" height="12" viewBox="0 0 24 12" fill="currentColor" opacity=".7"><rect x="0" y="2" width="3" height="8" rx="1"/><rect x="5" y="1" width="3" height="9" rx="1"/><rect x="10" y="0" width="3" height="10" rx="1"/><rect x="15" y="0" width="3" height="10" rx="1"/></svg>
                <svg width="22" height="12" viewBox="0 0 28 12" fill="currentColor" opacity=".7"><rect x="0" y="1" width="22" height="10" rx="2.5" stroke="currentColor" strokeWidth="1" fill="none"/><rect x="2" y="3" width="15" height="6" rx="1.5" fill="#2AE06E"/><rect x="23" y="4" width="3" height="4" rx="1"/></svg>
              </div>
            </div>

            {/* Side Buttons */}
            <div style={{ position: 'absolute', left: -4, top: 100, width: 4, height: 30, background: '#1a1a1a', borderRadius: '2px 0 0 2px' }} />
            <div style={{ position: 'absolute', left: -4, top: 140, width: 4, height: 50, background: '#1a1a1a', borderRadius: '2px 0 0 2px' }} />
            <div style={{ position: 'absolute', right: -4, top: 120, width: 4, height: 40, background: '#1a1a1a', borderRadius: '0 2px 2px 0' }} />

            {/* Scan Viewport */}
            <div className="diag-scan-viewport" style={{ marginTop: '16px' }}>
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Scan" className="diag-scan-img" style={{ filter: status === 'analyzing' ? 'brightness(0.6) contrast(1.3)' : 'none', transition: 'filter 0.5s' }} />
                  <div className="diag-bracket diag-bracket-tl"></div>
                  <div className="diag-bracket diag-bracket-tr"></div>
                  <div className="diag-bracket diag-bracket-bl"></div>
                  <div className="diag-bracket diag-bracket-br"></div>
                  
                  {status === 'analyzing' && (
                    <div className="diag-scan-overlay">
                      <div className="diag-laser"></div>
                      <div className="diag-radar-ring ring-1"></div>
                      <div className="diag-radar-ring ring-2"></div>
                      <div className="diag-radar-ring ring-3"></div>
                      <div className="diag-data-node node-1"></div>
                      <div className="diag-data-node node-2"></div>
                      <div className="diag-data-node node-3"></div>
                      <div className="diag-data-node node-4"></div>
                      <div className="diag-scan-target">
                        <svg viewBox="0 0 100 100" className="scan-target-svg">
                          <circle cx="50" cy="50" r="40" stroke="#2AE06E" strokeWidth="1" fill="none" strokeDasharray="4 6" />
                          <circle cx="50" cy="50" r="20" stroke="#2AE06E" strokeWidth="0.5" fill="none" />
                          <path d="M 50 0 L 50 100 M 0 50 L 100 50" stroke="#2AE06E" strokeWidth="0.5" opacity="0.5" />
                        </svg>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="diag-scan-upload">
                  <ImageUpload onImageSelect={handleImageSelect} preview={imagePreview} />
                </div>
              )}
            </div>

            {/* Analyzing Animation */}
            {status === 'analyzing' && (
              <div style={{ 
                padding: '16px', 
                background: 'rgba(0,0,0,0.6)', 
                borderRadius: 16, 
                margin: '12px 16px',
                border: '1px solid rgba(42,224,110,0.3)',
                animation: 'pulseGlow 1.5s infinite'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div className="spinner" style={{ width: 20, height: 20 }} />
                  <span style={{ color: '#2AE06E', fontSize: 13, fontWeight: 600 }}>{currentAnalyzingStep}</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${analyzingProgress}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #2AE06E, #86efac)',
                    transition: 'width 0.3s ease',
                    borderRadius: 2
                  }} />
                </div>
                <div style={{ textAlign: 'center', marginTop: 8 }}>
                  <span style={{ color: '#86efac', fontSize: 11 }}>{Math.floor(analyzingProgress)}% Complete</span>
                </div>
              </div>
            )}

            {/* Quick Result Preview */}
            {result && !showResults && (
              <div className="diag-alert-overlay" style={{ margin: '0 16px 12px', cursor: 'pointer' }} onClick={() => setShowResults(true)}>
                <div className="diag-alert-indicator"></div>
                <div>
                  <div className="diag-alert-title">{disease || 'Analysis Complete'} ✓</div>
                  <div className="diag-alert-sub">Confidence: {confidence}% • Click to view full results</div>
                </div>
              </div>
            )}

            {/* Config Inputs */}
            <div className="diag-config-compact">
              <div className="diag-config-row">
                <div className="diag-input-group">
                  <label>Latitude</label>
                  <input type="number" step="0.0001" value={lat} onChange={e => setLat(e.target.value)} />
                </div>
                <div className="diag-input-group">
                  <label>Longitude</label>
                  <input type="number" step="0.0001" value={lon} onChange={e => setLon(e.target.value)} />
                </div>
              </div>
              <div className="diag-config-row">
                <div className="diag-input-group">
                  <label>Treatment</label>
                  <select value={treatmentType} onChange={e => setTreatmentType(e.target.value)}>
                    <option value="organic">🌿 Organic</option>
                    <option value="chemical">🧪 Chemical</option>
                  </select>
                </div>
                <div className="diag-input-group">
                  <label>Language</label>
                  <select value={language} onChange={e => setLanguage(e.target.value)}>
                    <option value="english">🇬🇧 English</option>
                    <option value="hindi">🇮🇳 Hindi</option>
                    <option value="bengali">🇧🇩 Bengali</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Analyze Button */}
            <div style={{ padding: '0 16px 8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                className="diag-analyze-btn"
                onClick={handleAnalyze}
                disabled={!image || status === 'analyzing'}
              >
                {status === 'analyzing' ? <><span className="spinner" /> Analyzing Crop...</> : <>🚀 Start Analysis</>}
              </button>
              {imagePreview && !result && (
                <button className="diag-change-btn" onClick={() => { setImage(null); setImagePreview(null); setShowResults(false) }}>
                  🔄 Change Image
                </button>
              )}
            </div>

            {/* What-If Simulation Input */}
            <div className="diag-config-compact" id="what-if-section" style={{ marginTop: '4px' }}>
              <div className="diag-config-row">
                <div className="diag-input-group" style={{ width: '100%' }}>
                  <label>What-If Simulation (Optional)</label>
                  <input type="text" placeholder="e.g. What if it rains heavily tomorrow?" value={userQuery} onChange={e => setUserQuery(e.target.value)} style={{ width: '100%', padding: '10px 14px' }} />
                </div>
              </div>
            </div>

            {/* Footer Environmental Grid */}
            <div className="diag-env-grid">
              <div className="diag-env-cell">
                <div className="diag-env-icon">💧</div>
                <div className="diag-env-val">{weather.humidity || '65'}%</div>
                <div className="diag-env-label">Humidity</div>
              </div>
              <div className="diag-env-cell">
                <div className="diag-env-icon">🌡️</div>
                <div className="diag-env-val">{weather.temperature || '28'}°C</div>
                <div className="diag-env-label">Temp</div>
              </div>
              <div className="diag-env-cell">
                <div className="diag-env-icon">💨</div>
                <div className="diag-env-val">{weather.wind_speed || '12'} km/h</div>
                <div className="diag-env-label">Wind</div>
              </div>
            </div>

            {/* Home Indicator */}
            <div className="diag-home-indicator"></div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Results Section */}
      <div className="results-panel" style={{
        flex: 1,
        position: 'relative',
        height: '100%',
        overflowY: 'auto',
        zIndex: 10,
        padding: '24px',
        background: 'rgba(11,30,20,0.85)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* HUD Status Indicators */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          marginBottom: 24,
          border: '1px solid rgba(42,224,110,0.2)'
        }}>
          <div>
            <div style={{ fontSize: 11, color: '#86efac', letterSpacing: 1 }}>CROP ANALYSIS SYSTEM</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#2AE06E' }}>AI-Powered Diagnostics</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ 
                width: 10, 
                height: 10, 
                borderRadius: '50%', 
                background: status === 'analyzing' ? '#fbbf24' : status === 'done' ? '#2AE06E' : '#4a4a4a',
                animation: status === 'analyzing' ? 'pulse 1s infinite' : 'none',
                boxShadow: `0 0 10px ${status === 'analyzing' ? '#fbbf24' : status === 'done' ? '#2AE06E' : 'none'}`
              }} />
              <span style={{ color: '#fff', fontSize: 13 }}>
                {status === 'analyzing' ? 'Analyzing...' : status === 'done' ? 'Analysis Complete' : 'Ready'}
              </span>
            </div>
            {result && (
              <div style={{ 
                padding: '4px 12px', 
                background: 'rgba(42,224,110,0.15)', 
                borderRadius: 20,
                border: '1px solid rgba(42,224,110,0.3)'
              }}>
                <span style={{ color: '#2AE06E', fontSize: 12, fontWeight: 600 }}>✓ Results Ready</span>
              </div>
            )}
          </div>
        </div>

        {/* Results Content */}
        {!showResults && status !== 'analyzing' && status !== 'done' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '70vh',
            textAlign: 'center'
          }}>
            <div style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              background: 'rgba(42,224,110,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
              border: '2px solid rgba(42,224,110,0.3)'
            }}>
              <span style={{ fontSize: 48 }}>🌾</span>
            </div>
            <h3 style={{ color: '#fff', marginBottom: 12 }}>Ready to Analyze</h3>
            <p style={{ color: '#86efac', maxWidth: 400 }}>
              Upload a crop leaf image and click "Analyze Crop" to see AI-powered disease detection results here
            </p>
          </div>
        )}

        {status === 'analyzing' && !showResults && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '70vh',
            textAlign: 'center'
          }}>
            <ThreeJSAnalyzer />
            <h3 style={{ color: '#fff', marginBottom: 12 }}>Analyzing Crop Health</h3>
            <p style={{ color: '#86efac' }}>{currentAnalyzingStep}</p>
            <div style={{ width: 300, marginTop: 20 }}>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ 
                  width: `${analyzingProgress}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #2AE06E, #86efac)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <p style={{ color: '#4ade80', fontSize: 12, marginTop: 8 }}>{Math.floor(analyzingProgress)}% Complete</p>
            </div>
          </div>
        )}

        {showResults && result && (
          <div ref={resultsRef} style={{ animation: 'fadeInUp 0.5s ease' }}>
            <ResultsDashboard result={result} lang={language} />
          </div>
        )}

        {status === 'error' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '70vh',
            textAlign: 'center'
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              background: 'rgba(239,68,68,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
              border: '2px solid rgba(239,68,68,0.3)'
            }}>
              <span style={{ fontSize: 40 }}>⚠️</span>
            </div>
            <h3 style={{ color: '#f87171', marginBottom: 12 }}>Analysis Failed</h3>
            <p style={{ color: '#86efac', maxWidth: 400 }}>{errorMsg}</p>
            <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={() => setStatus('idle')}>
              Try Again
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(42,224,110,0.2); }
          50% { box-shadow: 0 0 20px 5px rgba(42,224,110,0.3); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .phone-panel::-webkit-scrollbar {
          width: 4px;
        }
        
        .phone-panel::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.3);
        }
        
        .phone-panel::-webkit-scrollbar-thumb {
          background: #2AE06E;
          border-radius: 2px;
        }
        
        .results-panel::-webkit-scrollbar {
          width: 6px;
        }
        
        .results-panel::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.3);
          border-radius: 3px;
        }
        
        .results-panel::-webkit-scrollbar-thumb {
          background: #2AE06E;
          border-radius: 3px;
        }

        @media (max-width: 968px) {
          .phone-panel {
            width: 100% !important;
            height: auto !important;
            position: relative !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(42,224,110,0.3) !important;
          }
          .results-panel {
            width: 100% !important;
            position: relative !important;
            height: auto !important;
            min-height: 500px;
          }
          .dashboard-container {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  )
}