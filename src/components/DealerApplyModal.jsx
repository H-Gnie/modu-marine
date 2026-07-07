import React, { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function DealerApplyModal({ user, onClose, showToast, onSuccess }) {
  const [bizName, setBizName] = useState('')
  const [bizNo, setBizNo] = useState('')
  const [ceoName, setCeoName] = useState('')
  const [openDate, setOpenDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // 본인 인증: 세션 토큰을 서버로 보내 서버가 요청자를 검증한다
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setError('로그인이 필요합니다. 다시 로그인해 주세요.'); setLoading(false); return }

      const res = await fetch('/api/verify-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          bizName: bizName.trim(),
          bizNo: bizNo.trim(),
          ceoName: ceoName.trim(),
          openDate: openDate.replace(/[^0-9]/g, ''),
        }),
      })
      const data = await res.json()
      if (data.ok) {
        showToast('딜러 인증이 완료되었습니다! 이제 전문 매물로 등록됩니다.')
        onSuccess && onSuccess()
        onClose()
      } else {
        setError(data.message || data.error || '인증에 실패했습니다.')
      }
    } catch (err) {
      setError('검증 연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}>✕</button>

        <h3 className="inquiry-title">딜러 전환 신청</h3>
        <p className="inquiry-listing">사업자 정보를 국세청에서 실시간 확인해 자동 승인됩니다.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input type="text" placeholder="상호 (사업자명)" value={bizName}
            onChange={e => setBizName(e.target.value)} maxLength={50} required />
          <input type="text" inputMode="numeric" placeholder="사업자등록번호 (숫자 10자리)" value={bizNo}
            onChange={e => setBizNo(e.target.value)} maxLength={12} required />
          <input type="text" placeholder="대표자명" value={ceoName}
            onChange={e => setCeoName(e.target.value)} maxLength={30} required />
          <label className="dealer-field-label">개업일</label>
          <input type="date" value={openDate}
            onChange={e => setOpenDate(e.target.value)} required />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? '국세청 확인 중...' : '사업자 인증하고 딜러 전환'}
          </button>
        </form>

        <p className="inquiry-notice">입력 정보는 사업자 진위확인 용도로만 사용됩니다.</p>
      </div>
    </div>
  )
}
