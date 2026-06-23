import React, { useState, useRef } from 'react'

// 전체화면 사진 확대 뷰어. 앱 전체는 핀치줌이 꺼져 있으므로 여기서 자체 줌을 구현한다.
// 핀치(두 손가락) 확대, 한 손가락 드래그 이동, 더블탭/더블클릭으로 확대·원복.
export default function ImageZoomViewer({ src, onClose }) {
  const [t, setT] = useState({ scale: 1, x: 0, y: 0 })
  const r = useRef({ startDist: 0, startScale: 1, lastX: 0, lastY: 0, panning: false, lastTap: 0 })

  const dist = (touches) =>
    Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY)

  function onTouchStart(e) {
    if (e.touches.length === 2) {
      r.current.startDist = dist(e.touches)
      r.current.startScale = t.scale
    } else if (e.touches.length === 1) {
      r.current.panning = t.scale > 1
      r.current.lastX = e.touches[0].clientX
      r.current.lastY = e.touches[0].clientY
      const now = Date.now()
      if (now - r.current.lastTap < 300) {
        setT(prev => (prev.scale > 1 ? { scale: 1, x: 0, y: 0 } : { scale: 2.5, x: 0, y: 0 }))
      }
      r.current.lastTap = now
    }
  }

  function onTouchMove(e) {
    if (e.touches.length === 2) {
      e.preventDefault()
      const scale = Math.min(5, Math.max(1, r.current.startScale * (dist(e.touches) / r.current.startDist)))
      setT(prev => ({ ...prev, scale, ...(scale === 1 ? { x: 0, y: 0 } : {}) }))
    } else if (e.touches.length === 1 && r.current.panning) {
      e.preventDefault()
      const dx = e.touches[0].clientX - r.current.lastX
      const dy = e.touches[0].clientY - r.current.lastY
      r.current.lastX = e.touches[0].clientX
      r.current.lastY = e.touches[0].clientY
      setT(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
    }
  }

  function toggleZoom() {
    setT(prev => (prev.scale > 1 ? { scale: 1, x: 0, y: 0 } : { scale: 2.5, x: 0, y: 0 }))
  }

  return (
    <div className="imgzoom-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button className="imgzoom-close" onClick={onClose} aria-label="닫기">✕</button>
      <img
        className="imgzoom-img"
        src={src}
        alt=""
        draggable={false}
        style={{ transform: `translate(${t.x}px, ${t.y}px) scale(${t.scale})` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onDoubleClick={toggleZoom}
      />
      {t.scale === 1 && <div className="imgzoom-hint">두 손가락으로 확대 · 더블탭</div>}
    </div>
  )
}
