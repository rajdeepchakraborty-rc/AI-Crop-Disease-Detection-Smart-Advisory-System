import { useState, useRef, useEffect } from 'react'
import { audioUrl } from '../api/cropApi'
import { t } from '../i18n'

export default function VoicePlayer({ audioUrl: rawUrl, script, lang='english' }) {
  const l = t[lang] || t.english
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const url = audioUrl(rawUrl)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onEnd = () => { setPlaying(false); setProgress(0) }
    const onTime = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100)
    }
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('timeupdate', onTime)
    return () => { audio.removeEventListener('ended', onEnd); audio.removeEventListener('timeupdate', onTime) }
  }, [])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    playing ? a.pause() : a.play()
    setPlaying(!playing)
  }

  return (
    <div className="card">
      <div className="card-header">🔊 {l.playAudio}</div>
      <div className="card-body">
        {url && <audio ref={audioRef} src={url} />}
        <div className="voice-player">
          <button className="voice-btn" onClick={toggle} title={playing ? 'Pause' : 'Play'}>
            {playing ? '⏸' : '▶️'}
          </button>
          <div className="voice-progress">
            <div className="voice-label">{playing ? '🎙 Playing Advisory...' : '🔊 Click to hear voice advisory'}</div>
            <div className="voice-bar-track">
              <div className="voice-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        {script && (
          <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: 10, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.7, maxHeight: 100, overflow: 'auto' }}>
            {script}
          </div>
        )}
      </div>
    </div>
  )
}
