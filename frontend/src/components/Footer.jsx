export default function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '40px 20px 60px 20px',
      marginTop: '40px',
      borderTop: '1px solid rgba(74, 222, 128, 0.1)',
      background: 'linear-gradient(to top, rgba(4, 12, 6, 1), transparent)',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '12px 28px',
        borderRadius: '30px',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
        animation: 'float-footer 6s ease-in-out infinite'
      }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© {new Date().getFullYear()}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>•</span>
        <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          Made with <span style={{ color: '#ef4444', animation: 'pulse-heart 1.5s infinite', display: 'inline-block' }}>❤️</span> by 
          <span style={{ 
            background: 'linear-gradient(90deg, #4ade80, #60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            letterSpacing: '0.5px',
            textShadow: '0 0 20px rgba(74,222,128,0.2)'
          }}>Team CodeReem</span>
        </span>
      </div>

      <style>{`
        @keyframes pulse-heart {
          0% { transform: scale(1); }
          15% { transform: scale(1.3); }
          30% { transform: scale(1); }
          45% { transform: scale(1.3); }
          60% { transform: scale(1); }
          100% { transform: scale(1); }
        }
        @keyframes float-footer {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </footer>
  )
}
