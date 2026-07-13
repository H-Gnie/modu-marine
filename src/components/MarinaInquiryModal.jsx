import React, { useState } from 'react'
import { displayName } from '../utils.js'

// 계류장 문의 — 매물 문의와 동일한 접수/알림 경로(send-inquiry, 운영자 이메일)를 재사용.
export default function MarinaInquiryModal({ marina, user, onClose, showToast }) {
  const [name, setName] = useState(user ? displayName(user) : '')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !message.trim()) { setError('이름과 문의 내용을 입력해 주세요.'); return }
    setLoading(true)
    try {
      fetch('/api/send-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingTitle: `[계류장] ${marina.name}`,
          listingId: marina.id,
          buyerName: name.trim(),
          buyerPhone: phone.trim(),
          inquiryType: 'general',
          message: message.trim(),
          sellerId: null,
        }),
      }).catch(() => {})
      showToast('문의가 접수되었습니다. 계류장에서 곧 답변드립니다.')
      onClose()
    } catch {
      setError('접수 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}>✕</button>
        <h3 className="inquiry-title">계류장 문의</h3>
        <p className="inquiry-listing">{marina.name} · {marina.region}</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="text" placeholder="이름" value={name} onChange={e => setName(e.target.value)} maxLength={30} required />
          <input type="tel" placeholder="연락처 (예: 010-1234-5678)" value={phone} onChange={e => setPhone(e.target.value)} maxLength={20} />
          <textarea rows={4} placeholder="계류 가능 여부, 요금, 선체 길이·흘수 조건 등을 문의해 주세요"
            value={message} onChange={e => setMessage(e.target.value)} maxLength={500} required />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? '접수 중...' : '문의 보내기'}
          </button>
        </form>
        <p className="inquiry-notice">계약 전 선체 길이·흘수·전기·보험 조건은 계류장에 직접 확인하세요.</p>
      </div>
    </div>
  )
}
