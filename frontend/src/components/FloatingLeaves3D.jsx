import { useMemo } from 'react'
import '../leaves3d.css'

export default function FloatingLeaves3D({ count = 15 }) {
  const leaves = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 40 + 20 // 20px to 60px
      const left = Math.random() * 100 // 0% to 100%
      const delay = Math.random() * 15 // 0s to 15s delay
      const duration = Math.random() * 15 + 10 // 10s to 25s duration
      const animType = Math.random() > 0.5 ? 'float3D-1' : 'float3D-2'
      const tint = Math.random() > 0.5 ? '#4ade80' : '#86efac' // light green or lighter green

      return {
        id: i,
        style: {
          left: `${left}vw`,
          width: `${size}px`,
          height: `${size}px`,
          animation: `${animType} ${duration}s linear ${delay}s infinite`,
        },
        tint
      }
    })
  }, [count])

  return (
    <div className="leaves-3d-container">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(74, 222, 128, 0.8)" />
            <stop offset="100%" stopColor="rgba(21, 128, 61, 0.4)" />
          </linearGradient>
        </defs>
      </svg>
      {leaves.map((leaf) => (
        <div key={leaf.id} className="leaf-3d" style={leaf.style}>
          <svg viewBox="0 0 24 24" fill="url(#leafGrad)">
            {/* Beautiful generic leaf SVG path */}
            <path d="M12,2C8,2,4,6,4,10c0,4,4,8,8,12c4-4,8-8,8-12C20,6,16,2,12,2z M12,19.5c-2.5-2.5-5-5.5-5-8.5c0-2.8,2.2-5,5-5 s5,2.2,5,5C17,14,14.5,17,12,19.5z"/>
            <path d="M12,5c-2.8,0-5,2.2-5,5c0,3,2.5,6,5,8.5c2.5-2.5,5-5.5,5-8.5C17,7.2,14.8,5,12,5z" opacity="0.5"/>
            {/* Stem/vein */}
            <path d="M12,5v14" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" fill="none"/>
            <path d="M12,10l3-2" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none"/>
            <path d="M12,13l3-2" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none"/>
            <path d="M12,16l3-2" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none"/>
            <path d="M12,11l-3-2" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none"/>
            <path d="M12,14l-3-2" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none"/>
          </svg>
        </div>
      ))}
    </div>
  )
}
