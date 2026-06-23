import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// iOS Safari는 viewport user-scalable=no 를 무시하므로 직접 핀치줌을 막는다.
// 1) gesture 이벤트 차단  2) 멀티터치(두 손가락) touchmove 차단 — 빠른 핀치까지 확실히 잠금.
// (매물 사진 확대 뷰어는 자체 touch 핸들러로 줌을 구현하므로 영향 없음)
;['gesturestart', 'gesturechange', 'gestureend'].forEach(ev =>
  document.addEventListener(ev, e => e.preventDefault(), { passive: false })
)
document.addEventListener('touchstart', e => {
  if (e.touches.length > 1) e.preventDefault()
}, { passive: false })
document.addEventListener('touchmove', e => {
  if (e.touches.length > 1) e.preventDefault()
}, { passive: false })

createRoot(document.getElementById('root')).render(<App />)
