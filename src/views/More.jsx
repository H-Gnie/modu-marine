import React from 'react'

export default function More({ setTab, goServiceSearch, showToast, onRestoreChat, fabVisible }) {
  return (
    <>
      <div className="panel">
        <h1 className="detail-title" style={{marginTop:0}}>전체서비스</h1>
        <div className="service-menu">
          <button onClick={() => goServiceSearch('전체매물')}>내마린사기</button>
          <button onClick={() => goServiceSearch('모두인증')}>모두인증</button>
          <button onClick={() => goServiceSearch('모두진단')}>모두진단</button>
          <button onClick={() => goServiceSearch('홈배송')}>홈배송</button>
          <button onClick={() => showToast('AI시세 화면은 다음 단계에서 연결합니다')}>AI시세</button>
          <button onClick={() => setTab('sell')}>내마린팔기</button>
          <button onClick={() => setTab('garage')}>내마린고</button>
          <button onClick={() => showToast('마린론 상담 화면은 준비 중입니다')}>마린론</button>
          <button onClick={() => showToast('보험/정비 화면은 준비 중입니다')}>보험/정비</button>
          <button onClick={() => showToast('고객센터 연결 화면은 준비 중입니다')}>고객센터</button>
        </div>
      </div>

      <section className="section">
        <div className="section-head"><h2>인증 · 진단 기준 안내</h2></div>
        <div className="notice-accordion">
          <details className="notice-details">
            <summary className="notice-summary">모두 인증이란?</summary>
            <div className="notice-body">
              모두 인증은 모두의 마린이 정한 민간 기준을 통과한 매물에 부여되는 표시입니다.<br/><br/>
              <b>인증 기준</b>: 모두 진단 완료 · 서류/소유권/저당/압류 확인 · 사고/침수/좌초 이력 고지 · 내부 검수자 승인<br/><br/>
              <b>인증이 보장하지 않는 것</b>: 선박의 무하자, 향후 고장 없음, 법정 운항 가능성, 특정 목적 적합성, 보험 인수 가능성<br/><br/>
              모두 인증은 법정 선박검사, 선급검사, 제조사 보증을 대체하지 않습니다. 구매 전 직접 확인 및 시운전을 권장합니다.
            </div>
          </details>
          <details className="notice-details">
            <summary className="notice-summary">모두 진단이란?</summary>
            <div className="notice-body">
              선박/해양장비 점검 경험을 갖춘 진단자가 표준 체크리스트에 따라 현장에서 확인한 상태 리포트입니다.<br/><br/>
              <b>점검 범위</b>: 선체·갑판·엔진·추진계·전장·조타·연료계·계류장비·서류·소유권 관련 확인<br/><br/>
              <b>점검 방식</b>: 비분해 육안 확인, 작동 확인, 사진/영상, 계측값, 판매자 제출 서류 확인, 시운전 여부<br/><br/>
              <b>점검 한계</b>: 수중부·내부 부품 미분해, 잠재 하자, 점검 이후 상태 변화, 판매자 허위자료 가능성은 확인 불가합니다.<br/><br/>
              본 리포트는 법정 선박검사, 선급검사, 제조사 보증, 보험 인수 심사를 대체하지 않습니다.
            </div>
          </details>
          <details className="notice-details">
            <summary className="notice-summary">점검 한계 및 유의사항</summary>
            <div className="notice-body">
              모두의 마린은 진단/인증 과정에서 확인한 정보와 확인하지 못한 항목을 구분하여 공개합니다.<br/><br/>
              판매자가 제공한 자료가 허위이거나 점검 당시 확인할 수 없었던 숨은 하자가 있는 경우, 책임 범위는 관련 법령·개별 계약·판매자 귀책 여부 및 모두의 마린의 고의 또는 과실 여부에 따라 달라질 수 있습니다.<br/><br/>
              최종 구매 계약 전 직접 확인, 시운전, 별도 정비소 점검 또는 전문가 검토를 진행하시기 바랍니다.
            </div>
          </details>
          <details className="notice-details">
            <summary className="notice-summary">분쟁 및 문의</summary>
            <div className="notice-body">
              진단/인증 결과에 대한 정정 요청, 재진단 요청, 분쟁은 고객센터를 통해 접수할 수 있습니다.<br/><br/>
              <button className="wide-btn" style={{marginTop:'8px'}} onClick={() => showToast('고객센터 연결 화면은 준비 중입니다')}>고객센터 문의</button>
            </div>
          </details>
        </div>
      </section>

      {!fabVisible && (
        <section className="section">
          <div className="section-head"><h2>AI 매물 추천</h2></div>
          <button className="dealer-entry" onClick={onRestoreChat}>
            <div className="dealer-entry-left">
              <div className="dealer-entry-icon">🤖</div>
              <div>
                <div className="dealer-entry-title">AI 챗봇 다시 켜기</div>
                <div className="dealer-entry-sub">원하는 조건을 말하면 매물을 찾아드립니다</div>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </section>
      )}

      <section className="section" style={{paddingBottom:'22px'}}>
        <button className="dealer-entry" onClick={() => setTab('dealer')}>
          <div className="dealer-entry-left">
            <div className="dealer-entry-icon">⚓</div>
            <div>
              <div className="dealer-entry-title">딜러·마리나 센터</div>
              <div className="dealer-entry-sub">매물 관리, 문의 확인, 정산 현황</div>
            </div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </section>
    </>
  )
}
