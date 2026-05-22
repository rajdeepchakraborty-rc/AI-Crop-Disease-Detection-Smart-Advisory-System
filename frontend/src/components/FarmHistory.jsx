import { useState } from 'react'
import { deleteFarmMemory } from '../api/cropApi'
import { t } from '../i18n'

export default function FarmHistory({ history = [], leafId, lang='english' }) {
  const l = t[lang] || t.english
  const [deleted, setDeleted] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!leafId || !confirm('Are you sure you want to clear the farm memory for this leaf?')) return
    setIsDeleting(true)
    try {
      await deleteFarmMemory(leafId)
      setDeleted(true)
    } catch (e) {
      console.error("Failed to delete", e)
      alert("Failed to delete farm memory")
    }
    setIsDeleting(false)
  }

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{l.farmMemory}</span>
        {history.length > 0 && !deleted && (
          <button 
            className="btn btn-outline" 
            style={{ padding: '4px 8px', fontSize: '0.7rem', color: 'var(--red)', borderColor: 'rgba(248,113,113,0.3)' }}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? '...' : l.clear}
          </button>
        )}
      </div>
      <div className="card-body">
        {history.length === 0 || deleted ? (
          <div className="empty-state">{l.noRecords}</div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>{l.date}</th>
                <th>{l.disease}</th>
                <th>{l.severity}</th>
              </tr>
            </thead>
            <tbody>
              {history.slice().reverse().map((h, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text-muted)' }}>{h.date}</td>
                  <td>{h.disease}</td>
                  <td style={{ color: h.severity?.toLowerCase().includes('severe') ? 'var(--red)' : h.severity?.toLowerCase().includes('moderate') ? 'var(--gold)' : 'var(--green-400)' }}>
                    {h.severity || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
