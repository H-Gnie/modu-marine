import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// iOS Safari는 viewport user-scalable=no 를 무시하므로 직접 핀치줌을 막는다.
// 캡처 단계에서 멀티터치/스케일 변화를 잡아야 스크롤 중에도 새지 않는다.
// (매물 사진 확대 뷰어는 자체 touch 핸들러로 줌을 구현하므로 영향 없음)
const blockPinch = e => {
  if (e.touches?.length > 1 || (typeof e.scale === 'number' && e.scale !== 1)) {
    e.preventDefault()
  }
}
;['touchstart', 'touchmove'].forEach(ev =>
  document.addEventListener(ev, blockPinch, { passive: false, capture: true })
)
;['gesturestart', 'gesturechange', 'gestureend'].forEach(ev =>
  document.addEventListener(ev, e => e.preventDefault(), { passive: false, capture: true })
)

createRoot(document.getElementById('root')).render(<App />)
