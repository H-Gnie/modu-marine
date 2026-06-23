import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// iOS Safari는 viewport user-scalable=no 를 무시하므로 gesture 이벤트로 핀치줌을 막는다.
// (매물 사진 확대 뷰어는 자체 touch 핸들러를 쓰므로 영향 없음)
;['gesturestart', 'gesturechange', 'gestureend'].forEach(ev =>
  document.addEventListener(ev, e => e.preventDefault(), { passive: false })
)

createRoot(document.getElementById('root')).render(<App />)
