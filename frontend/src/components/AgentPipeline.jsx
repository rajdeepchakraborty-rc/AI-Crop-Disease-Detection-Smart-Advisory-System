export default function AgentPipeline({ agents, activeAgent, completedAgents, logs }) {
  const getStatus = (i) => {
    if (completedAgents.includes(i)) {
      const log = logs[i]
      return log?.status === 'error' ? 'error' : 'done'
    }
    if (activeAgent === i) return 'active'
    return 'pending'
  }

  const icons = ['📸','🦠','⚖️','🔬','🍃','📋','🌦','🌡️','🚚','🤖','🔮','🔊','📄','🏗️']

  return (
    <div className="pipeline-grid">
      {agents.map((name, i) => {
        const s = getStatus(i)
        return (
          <div key={i} className={`pipeline-step ${s}`}>
            <div className="step-dot" />
            <span style={{ fontSize: '0.85rem' }}>{icons[i]}</span>
            <span className="step-label">{name.replace(/^\d+\.\s/, '')}</span>
            {s === 'done' && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--accent)' }}>✓</span>}
            {s === 'error' && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#f87171' }}>✗</span>}
          </div>
        )
      })}
    </div>
  )
}
