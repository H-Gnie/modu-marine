import React from 'react'

export default function License({ goLicense }) {
  return (
    <>
      <div className="panel">
        <h1 className="detail-title" style={{marginTop:0}}>조종면허 가이드</h1>
        <p className="license-intro">
          내 면허로 운항할 수 있는 마린을 골라보세요. 추진기관 <b>5마력 이상</b>의 동력수상레저기구는
          조종면허가 필요합니다.
        </p>
      </div>

      <section className="section">
        <div className="license-card">
          <span className="license-tag general">일반조종면허</span>
          <h2>제트스키 · 모터보트 · 낚시보트 · RIB</h2>
          <p>
            수상오토바이·모터보트·고무보트(RIB) 등 동력수상레저기구를 운항할 수 있는 면허입니다.
            2급은 일반 레저 운항, 1급은 시험·교육 등 추가 자격에 해당합니다.
          </p>
          <button className="license-cta" onClick={() => goLicense('general')}>
            일반면허로 운항 가능한 매물 보기 →
          </button>
        </div>

        <div className="license-card">
          <span className="license-tag yacht">요트조종면허</span>
          <h2>세일링 요트</h2>
          <p>돛(세일)과 보조 동력을 갖춘 요트를 운항할 수 있는 면허입니다.</p>
          <button className="license-cta" onClick={() => goLicense('yacht')}>
            요트면허로 운항 가능한 매물 보기 →
          </button>
        </div>
      </section>

      <section className="section" style={{paddingBottom:'28px'}}>
        <div className="panel">
          <h2 style={{margin:'0 0 12px',fontSize:'16px',fontWeight:950,color:'var(--navy)'}}>면허 취득 한눈에</h2>
          <div className="license-steps">
            <div className="license-step"><span>1</span><div><b>필기시험</b><em>법규·운항·기관·기상 등</em></div></div>
            <div className="license-step"><span>2</span><div><b>실기시험</b><em>또는 면제교육 이수 시 실기 면제</em></div></div>
            <div className="license-step"><span>3</span><div><b>면허 발급</b><em>합격 후 조종면허증 교부</em></div></div>
          </div>
          <p className="diagnosis-notice">
            응시 자격·시험 일정·운항 가능 범위의 정확한 기준은 해양경찰청 및 시험 시행기관(한국해양교통안전공단 등)
            공고를 확인하세요. 본 안내는 매물 선택을 돕기 위한 참고용입니다.
          </p>
        </div>
      </section>
    </>
  )
}
