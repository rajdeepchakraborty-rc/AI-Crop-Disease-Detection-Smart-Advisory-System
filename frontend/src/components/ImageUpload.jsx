import { useRef, useState } from 'react'

export default function ImageUpload({ onImageSelect, preview }) {
  const inputRef = useRef(null)
  const [drag, setDrag] = useState(false)

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) onImageSelect(file)
  }

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div
      className={`upload-zone ${drag ? 'drag-over' : ''}`}
      onClick={() => inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
    >
      <input
        ref={inputRef} type="file" accept="image/*" hidden
        onChange={e => handleFile(e.target.files[0])}
      />
      {preview ? (
        <>
          <img src={preview} alt="Crop preview" className="upload-preview" />
          <p style={{ marginTop: 10, fontSize: '0.82rem', color: 'var(--green-400)' }}>
            ✅ Image loaded — click to change
          </p>
        </>
      ) : (
        <>
          <div className="upload-icon">🌾</div>
          <div className="upload-title">Drop your crop image here</div>
          <div className="upload-sub">or click to browse · JPG, PNG, WebP supported</div>
        </>
      )}
    </div>
  )
}
