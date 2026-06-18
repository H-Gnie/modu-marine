import React, { useState } from 'react'
import { PHOTO_SLOTS } from '../data.js'
import { won } from '../utils.js'

const VESSEL_TYPES = ['제트스키', '모터보트', '낚시보트', '요트', 'RIB']
const REGIONS = ['서울', '경기', '부산', '인천', '강원', '충남', '전남', '경남', '제주']
const ENGINE_TYPES = ['아웃보드', '인보드', '제트', '디젤', '전기']
const REG_STATUSES = ['정상', '말소 예정', '미등록']
const INSP_STATUSES = ['유효', '만료', '해당 없음']
const INS_STATUSES = ['가입', '만료', '미가입']

function Step0({ sellMode, setSellMode, onNext }) {
  return (
    <div className="sell-card">
      <h2>판매 방식을 선택하세요</h2>
      <div className="mode-grid">
        <button
          className={`mode${sellMode === 'self' ? ' active' : ''}`}
          onClick={() => setSellMode('self')}
        >
          <strong>내마린팔기 Self</strong>
          <span>사진 직접 등록<br/>72시간 검증 딜러 입찰</span>
          <em className="mode-fee">수수료 2.5%</em>
        </button>
        <button
          className={`mode${sellMode === 'pro' ? ' active' : ''}`}
          onClick={() => setSellMode('pro')}
        >
          <strong>내마린팔기 Pro</strong>
          <span>전문 평가사 방문 진단<br/>48시간 입찰</span>
          <em className="mode-fee">수수료 3.5%</em>
        </button>
      </div>
      <button className="wide-btn primary" style={{marginTop:'16px'}} onClick={onNext}>다음</button>
    </div>
  )
}

function Step1({ d, onChange, onNext, onPrev }) {
  return (
    <div className="sell-card">
      <h2>선박 기본 정보</h2>
      <div className="field">
        <label>선종</label>
        <select value={d.type} onChange={e => onChange('type', e.target.value)}>
          {VESSEL_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="filter-row" style={{marginTop:'10px'}}>
        <div className="field">
          <label>제조사</label>
          <input value={d.brand} placeholder="예: Yamaha" onChange={e => onChange('brand', e.target.value)} />
        </div>
        <div className="field">
          <label>모델명</label>
          <input value={d.model} placeholder="예: VX Cruiser" onChange={e => onChange('model', e.target.value)} />
        </div>
      </div>
      <div className="filter-row" style={{marginTop:'10px'}}>
        <div className="field">
          <label>연식</label>
          <input type="number" value={d.year} placeholder="2021" onChange={e => onChange('year', e.target.value)} />
        </div>
        <div className="field">
          <label>등록번호 / HIN</label>
          <input value={d.hin} placeholder="선택 입력" onChange={e => onChange('hin', e.target.value)} />
        </div>
      </div>
      <div className="cta-row" style={{marginTop:'16px'}}>
        <button className="wide-btn" style={{background:'var(--soft)',color:'var(--navy)',fontWeight:900}} onClick={onPrev}>이전</button>
        <button className="primary" style={{borderRadius:'var(--r-md)',fontWeight:900}} onClick={onNext}>다음</button>
      </div>
    </div>
  )
}

function Step2({ d, onChange, onNext, onPrev }) {
  return (
    <div className="sell-card">
      <h2>가격 및 위치</h2>
      <div className="field">
        <label>희망 판매 가격 (만원)</label>
        <input type="number" value={d.price} placeholder="예: 2500" onChange={e => onChange('price', e.target.value)} />
      </div>
      <div className="filter-row" style={{marginTop:'10px'}}>
        <div className="field">
          <label>지역</label>
          <select value={d.region} onChange={e => onChange('region', e.target.value)}>
            {REGIONS.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="field">
          <label>계류지 / 마리나</label>
          <input value={d.marina} placeholder="예: 전곡항" onChange={e => onChange('marina', e.target.value)} />
        </div>
      </div>
      <div className="cta-row" style={{marginTop:'16px'}}>
        <button className="wide-btn" style={{background:'var(--soft)',color:'var(--navy)',fontWeight:900}} onClick={onPrev}>이전</button>
        <button className="primary" style={{borderRadius:'var(--r-md)',fontWeight:900}} onClick={onNext}>다음</button>
      </div>
    </div>
  )
}

function Step3({ d, onChange, onNext, onPrev }) {
  return (
    <div className="sell-card">
      <h2>제원 정보</h2>
      <div className="filter-row">
        <div className="field">
          <label>운항시간 (h)</label>
          <input type="number" value={d.hours} placeholder="68" onChange={e => onChange('hours', e.target.value)} />
        </div>
        <div className="field">
          <label>선체 길이</label>
          <input value={d.length} placeholder="3.5m" onChange={e => onChange('length', e.target.value)} />
        </div>
      </div>
      <div className="filter-row" style={{marginTop:'10px'}}>
        <div className="field">
          <label>엔진 종류</label>
          <select value={d.engine} onChange={e => onChange('engine', e.target.value)}>
            {ENGINE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="field">
          <label>마력 (HP)</label>
          <input type="number" value={d.hp} placeholder="150" onChange={e => onChange('hp', e.target.value)} />
        </div>
      </div>
      <div className="cta-row" style={{marginTop:'16px'}}>
        <button className="wide-btn" style={{background:'var(--soft)',color:'var(--navy)',fontWeight:900}} onClick={onPrev}>이전</button>
        <button className="primary" style={{borderRadius:'var(--r-md)',fontWeight:900}} onClick={onNext}>다음</button>
      </div>
    </div>
  )
}

function Step4({ d, onChange, onNext, onPrev }) {
  return (
    <div className="sell-card">
      <h2>서류 및 안전 상태</h2>
      <div className="field">
        <label>선박 등록증</label>
        <select value={d.regStatus} onChange={e => onChange('regStatus', e.target.value)}>
          {REG_STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="field" style={{marginTop:'10px'}}>
        <label>선박 검사 (선박법)</label>
        <select value={d.inspStatus} onChange={e => onChange('inspStatus', e.target.value)}>
          {INSP_STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="field" style={{marginTop:'10px'}}>
        <label>보험 상태</label>
        <select value={d.insStatus} onChange={e => onChange('insStatus', e.target.value)}>
          {INS_STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="cta-row" style={{marginTop:'16px'}}>
        <button className="wide-btn" style={{background:'var(--soft)',color:'var(--navy)',fontWeight:900}} onClick={onPrev}>이전</button>
        <button className="primary" style={{borderRadius:'var(--r-md)',fontWeight:900}} onClick={onNext}>다음</button>
      </div>
    </div>
  )
}

function Step5({ d, onChange, onChangePhoto, onRemovePhoto, onNext, onPrev }) {
  const uploaded = Object.values(d.photos).filter(Boolean).length
  return (
    <div className="sell-card">
      <h2>사진 등록</h2>
      <p className="sell-hint">각 박스를 <b>탭하면 사진을 선택</b>할 수 있습니다. 필수(*) 4장 이상 등록해 주세요.</p>
      <div className="photo-count-bar">
        <span className="photo-count-num">{uploaded}</span> / {PHOTO_SLOTS.length}장 등록됨
      </div>
      <div className="photo-guide-grid">
        {PHOTO_SLOTS.map(s => {
          const url = d.photos[s.key]
          if (url) {
            return (
              <div key={s.key} className="pgslot filled">
                <div className="pgslot-preview" style={{backgroundImage:`url('${url}')`}}>
                  <button
                    className="pgslot-remove"
                    onClick={() => onRemovePhoto(s.key)}
                    aria-label="삭제"
                  >×</button>
                </div>
                <div className="pgslot-filled-label">
                  {s.label}{s.req && <em>*</em>}
                </div>
              </div>
            )
          }
          return (
            <label key={s.key} className={`pgslot${s.req ? ' req' : ''}`} htmlFor={`photo-${s.key}`}>
              <div className="pgslot-empty">
                <span className="pgslot-plus">+</span>
                <span className="pgslot-label">{s.label}{s.req && <em>*</em>}</span>
                <span className="pgslot-tap">탭하여 추가</span>
              </div>
              <input
                type="file"
                id={`photo-${s.key}`}
                accept="image/*"
                className="photo-file-input"
                style={{display:'none'}}
                onChange={e => {
                  const file = e.target.files && e.target.files[0]
                  if (file) onChangePhoto(s.key, file)
                }}
              />
            </label>
          )
        })}
      </div>
      <div className="field" style={{marginTop:'16px'}}>
        <label>상태 설명</label>
        <textarea
          rows="4"
          placeholder="정비 이력, 보관 방식, 포함 품목, 특이사항 등"
          value={d.desc}
          onChange={e => onChange('desc', e.target.value)}
        />
      </div>
      <div className="cta-row" style={{marginTop:'16px'}}>
        <button className="wide-btn" style={{background:'var(--soft)',color:'var(--navy)',fontWeight:900}} onClick={onPrev}>이전</button>
        <button className="primary" style={{borderRadius:'var(--r-md)',fontWeight:900}} onClick={onNext}>미리보기</button>
      </div>
    </div>
  )
}

function Step6({ d, sellMode, onPrev, onSubmit }) {
  const [consented, setConsented] = useState(false)
  const priceStr = d.price ? won(Number(d.price)) : '미입력'
  const titleStr = [d.brand, d.model, d.year ? d.year + '년' : ''].filter(Boolean).join(' ') || '선박 정보 미입력'
  const photoUrls = PHOTO_SLOTS.map(s => d.photos[s.key]).filter(Boolean)

  return (
    <div className="sell-card">
      <h2>접수 미리보기</h2>
      {photoUrls.length
        ? (
          <div className="preview-photo-strip">
            <div className="preview-photo-main" style={{backgroundImage:`url('${photoUrls[0]}')`}} />
            {photoUrls.length > 1 && (
              <div className="preview-photo-row">
                {photoUrls.slice(1).map((u, i) => (
                  <div key={i} className="preview-photo-thumb" style={{backgroundImage:`url('${u}')`}} />
                ))}
              </div>
            )}
          </div>
        )
        : (
          <div className="preview-photo-empty">
            📷 등록된 사진이 없습니다<br/>
            <small>사진을 등록하면 매물 노출 확률이 높아집니다</small>
          </div>
        )
      }
      <div className="preview-card">
        <div className={`preview-mode-badge${sellMode === 'pro' ? ' orange' : ''}`}>
          {sellMode === 'pro' ? '내마린팔기 Pro' : '내마린팔기 Self'}
        </div>
        <div className="preview-title">{titleStr}</div>
        <div className="preview-price">{priceStr}</div>
        <div className="info-grid" style={{marginTop:'12px'}}>
          {[
            ['선종', d.type], ['지역', d.region || '-'],
            ['운항', d.hours ? d.hours + 'h' : '-'], ['엔진', d.engine],
            ['등록증', d.regStatus], ['보험', d.insStatus]
          ].map(([k, v]) => (
            <div key={k} className="info"><span>{k}</span><strong>{v}</strong></div>
          ))}
        </div>
      </div>
      <div className="notice" style={{marginTop:'14px'}}>
        {sellMode === 'pro'
          ? '전문 평가사 방문 후 48시간 검증 딜러 입찰로 진행됩니다.'
          : '사진 기반 72시간 검증 딜러 입찰이 진행됩니다.'}
      </div>
      <label className="consent-row">
        <input type="checkbox" checked={consented} onChange={e => setConsented(e.target.checked)} />
        <span>모두 인증의 범위와 한계 안내를 확인했으며, 등록 정보가 사실임에 동의합니다.</span>
      </label>
      <div className="cta-row" style={{marginTop:'12px'}}>
        <button className="wide-btn" style={{background:'var(--soft)',color:'var(--navy)',fontWeight:900}} onClick={onPrev}>이전</button>
        <button
          className="primary"
          style={{borderRadius:'var(--r-md)',fontWeight:900}}
          disabled={!consented}
          onClick={onSubmit}
        >
          등록 요청
        </button>
      </div>
    </div>
  )
}

export default function Sell({
  sellStep, setSellStep,
  sellMode, setSellMode,
  sellData, setSellData,
  submitSell
}) {
  const s = sellStep
  // 로컬 상태로 관리해 타이핑 시 App 리렌더 방지
  const [local, setLocal] = useState(sellData)

  function onChange(key, val) {
    setLocal(prev => ({ ...prev, [key]: val }))
  }

  function onChangePhoto(key, file) {
    setLocal(prev => {
      const oldUrl = prev.photos[key]
      if (oldUrl) URL.revokeObjectURL(oldUrl)
      return {
        ...prev,
        photos: { ...prev.photos, [key]: URL.createObjectURL(file) },
        photoFiles: { ...prev.photoFiles, [key]: file }
      }
    })
  }

  function onRemovePhoto(key) {
    setLocal(prev => {
      const oldUrl = prev.photos[key]
      if (oldUrl) URL.revokeObjectURL(oldUrl)
      const photos = { ...prev.photos }
      const photoFiles = { ...prev.photoFiles }
      delete photos[key]
      delete photoFiles[key]
      return { ...prev, photos, photoFiles }
    })
  }

  function onNext() {
    setSellData(local)
    setSellStep(s => Math.min(6, s + 1))
  }
  function onPrev() {
    setSellData(local)
    setSellStep(s => Math.max(0, s - 1))
  }

  const steps = Array.from({ length: 7 }, (_, i) => (
    <div key={i} className={`step${i <= s ? ' active' : ''}`} />
  ))

  const stepComponents = [
    <Step0 key={0} sellMode={sellMode} setSellMode={setSellMode} onNext={onNext} />,
    <Step1 key={1} d={local} onChange={onChange} onNext={onNext} onPrev={onPrev} />,
    <Step2 key={2} d={local} onChange={onChange} onNext={onNext} onPrev={onPrev} />,
    <Step3 key={3} d={local} onChange={onChange} onNext={onNext} onPrev={onPrev} />,
    <Step4 key={4} d={local} onChange={onChange} onNext={onNext} onPrev={onPrev} />,
    <Step5 key={5} d={local} onChange={onChange} onChangePhoto={onChangePhoto} onRemovePhoto={onRemovePhoto} onNext={onNext} onPrev={onPrev} />,
    <Step6 key={6} d={local} sellMode={sellMode} onPrev={onPrev} onSubmit={() => submitSell(local)} />,
  ]

  return (
    <section>
      <h1 className="detail-title" style={{marginBottom:'4px'}}>내마린팔기</h1>
      <div className="sell-stepper">{steps}</div>
      <div className="sell-step-label">단계 {s + 1} / 7</div>
      {stepComponents[s]}
    </section>
  )
}
