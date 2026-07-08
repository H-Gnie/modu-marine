import React, { useState } from 'react'
import { supabase } from '../lib/supabase.js'

const REGIONS = ['서울', '경기', '부산', '인천', '강원', '충남', '전남', '경남', '제주']

// 등록한 매물의 핵심 항목(가격·지역·계류지·설명)을 빠르게 수정한다.
export default function EditListingModal({ listing, onClose, showToast, onSaved }) {
  const [price, setPrice] = useState(String(listing.price ?? ''))
  const [region, setRegion] = useState(listing.region || REGIONS[0])
  const [marina, setMarina] = useState(listing.marina || '')
  const [desc, setDesc] = useState(listing.description || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const p = Number(price)
    if (!p || p <= 0) { setError('판매 가격을 올바르게 입력해 주세요.'); return }
    setLoading(true)
    const { error } = await supabase.from('listings')
      .update({ price: p, region, marina: marina || null, description: desc || null })
      .eq('id', listing.id)
    setLoading(false)
    if (error) { setError('수정 중 오류가 발생했습니다.'); return }
    showToast('매물이 수정되었습니다')
    onSaved && onSaved()
    onClose()
  }

  return (
    <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}>✕</button>
        <h3 className="inquiry-title">매물 수정</h3>
        <p className="inquiry-listing">{[listing.brand, listing.model].filter(Boolean).join(' ') || listing.type}</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="dealer-field-label">희망 판매 가격 (만원)</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="예: 2500" required />
          <label className="dealer-field-label">지역</label>
          <select value={region} onChange={e => setRegion(e.target.value)}>
            {REGIONS.map(r => <option key={r}>{r}</option>)}
          </select>
          <label className="dealer-field-label">계류지 / 마리나</label>
          <input value={marina} onChange={e => setMarina(e.target.value)} placeholder="예: 전곡항" />
          <label className="dealer-field-label">상태 설명</label>
          <textarea rows={4} value={desc} onChange={e => setDesc(e.target.value)}
            placeholder="정비 이력, 보관 방식 등 (연락처·외부 메신저는 입력 불가)" />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? '저장 중...' : '수정 저장'}
          </button>
        </form>
      </div>
    </div>
  )
}
