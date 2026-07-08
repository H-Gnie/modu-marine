import React, { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { displayName } from '../utils.js'

const INQUIRY_TYPES = [
  { value: 'general', label: '일반 문의' },
  { value: 'visit', label: '방문/시승 문의' },
  { value: 'delivery', label: '운송/인도 문의' },
]

export default function InquiryModal({ item, user, onClose, showToast, initialType = 'general', title = '매물 문의' }) {
  const [name, setName] = useState(user ? displayName(user) : '')
  const [phone, setPhone] = useState('')
  const [type, setType] = useState(initialType)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 더미 매물(sellerId 없음)은 inquiries FK 위반이라 DB 저장을 건너뛴다
      if (item.sellerId) {
        const { error: dbError } = await supabase.from('inquiries').insert({
          listing_id: item.id,
          buyer_id: user?.id ?? null,
          buyer_name: name.trim(),
          buyer_phone: phone.trim() || null,
          buyer_email: user?.email ?? null,
          message: message.trim(),
          inquiry_type: type,
        })
        if (dbError) throw dbError
      }

      // 운영자 이메일 알림 — 실패해도 문의 접수 자체는 성공 처리
      fetch('/api/send-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: item.id,
          listingTitle: item.title,
          buyerName: name.trim(),
          buyerPhone: phone.trim(),
          inquiryType: type,
          message: message.trim(),
          sellerId: item.sellerId || null,
        }),
      }).catch(() => {})

      showToast('문의가 접수되었습니다. 판매자가 곧 연락드립니다.')
      onClose()
    } catch (err) {
      console.error('문의 저장 오류:', err)
      setError('문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}>✕</button>

        <h3 className="inquiry-title">{title}</h3>
        <p className="inquiry-listing">{item.title} · {Number(item.price).toLocaleString()}만원</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={30}
            required
          />
          <input
            type="tel"
            placeholder="연락처 (예: 010-1234-5678)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            maxLength={20}
          />
          <select value={type} onChange={e => setType(e.target.value)}>
            {INQUIRY_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <textarea
            placeholder={type === 'visit'
              ? '희망 방문 날짜·시간대와 시운전 희망 여부를 적어 주세요 (예: 이번 주말 오후, 시운전 희망)'
              : '문의 내용을 입력해 주세요 (계류지 확인, 시운전 가능 여부 등)'}
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
            maxLength={500}
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-submit" disabled={loading || !name.trim() || !message.trim()}>
            {loading ? '접수 중...' : type === 'visit' ? '방문 예약 요청' : '문의 보내기'}
          </button>
        </form>

        <p className="inquiry-notice">앱 밖 계약금 송금이나 제3자 명의 거래는 권장하지 않습니다.</p>
      </div>
    </div>
  )
}
