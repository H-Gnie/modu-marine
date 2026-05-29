import { PHOTO_SLOTS } from './src/data.js';
import { state, freshSellData, saveState, loadState } from './src/state.js';
import { byId, showToast } from './src/utils.js';
import {
  filteredListings, card,
  home, search, detail, compare,
  sell, garage, more, dealer
} from './src/views.js';

const app = document.querySelector('#app');
let qTimer = null;

function renderResults() {
  const rows = filteredListings();
  const countEl = document.getElementById('search-count');
  const resultsEl = document.getElementById('search-results');
  if (countEl) countEl.textContent = `매물 ${rows.length}대`;
  if (resultsEl) resultsEl.innerHTML = rows.length ? rows.map(x => card(x)).join('') : '<div class="empty">조건에 맞는 매물이 없습니다.</div>';
}

function render() {
  document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.toggle('active', b.dataset.tab === state.tab));
  const isPadded = ['search','sell','garage','more','dealer','compare'].includes(state.tab);
  const isDetail = state.tab === 'detail';
  app.className = 'screen' + (isPadded ? ' padded' : '') + (isDetail ? ' detail-pad' : '');
  if (state.tab === 'home') app.innerHTML = home();
  else if (state.tab === 'search') app.innerHTML = search();
  else if (state.tab === 'detail') app.innerHTML = detail();
  else if (state.tab === 'compare') app.innerHTML = compare();
  else if (state.tab === 'sell') app.innerHTML = sell();
  else if (state.tab === 'garage') app.innerHTML = garage();
  else if (state.tab === 'dealer') app.innerHTML = dealer();
  else app.innerHTML = more();

  // 상단 비교 뱃지
  const badge = document.getElementById('cmpTopBadge');
  if (badge) {
    const n = state.compared.size;
    badge.textContent = n || '';
    badge.classList.toggle('visible', n > 0);
  }
  // 플로팅 비교 바 — 비교함·상세에서는 숨김
  const cmpBar = document.getElementById('cmpBar');
  const label = document.getElementById('cmpBarLabel');
  if (cmpBar && label) {
    const showBar = state.compared.size > 0 && !['compare', 'detail'].includes(state.tab);
    cmpBar.classList.toggle('hidden', !showBar);
    label.textContent = `비교함 ${state.compared.size}대`;
  }
}

function setTab(tab) { state.tab = tab; state.listing = null; render(); window.scrollTo(0, 0); }
function viewDetail(id) { state.listing = byId(id); state.tab = 'detail'; state.recent = [Number(id), ...state.recent.filter(x => x !== Number(id))].slice(0, 8); saveState(); render(); window.scrollTo(0, 0); }

document.addEventListener('click', e => {
  const tab = e.target.closest('[data-tab]');
  if (tab) return setTab(tab.dataset.tab);

  const wish = e.target.closest('[data-wish]');
  if (wish) {
    const id = Number(wish.dataset.wish);
    state.wished.has(id) ? state.wished.delete(id) : state.wished.add(id);
    showToast(state.wished.has(id) ? '찜했습니다' : '찜을 해제했습니다');
    saveState();
    return render();
  }

  const cmp = e.target.closest('[data-compare]');
  if (cmp) {
    const id = Number(cmp.dataset.compare);
    const adding = !state.compared.has(id);
    if (adding && state.compared.size >= 4) return showToast('비교함은 최대 4대까지 가능합니다');
    adding ? state.compared.add(id) : state.compared.delete(id);
    showToast(adding ? `비교함에 추가됐습니다 (${state.compared.size}대)` : '비교함에서 제거됐습니다');
    saveState();
    return render();
  }

  // Gallery thumb click — swap main image without full re-render
  const thumb = e.target.closest('.detail-thumb');
  if (thumb) {
    const url = thumb.dataset.src;
    const idx = thumb.dataset.idx;
    const mainImg = document.querySelector('.detail-main-img');
    if (mainImg && url) {
      mainImg.style.backgroundImage = `url('${url}')`;
      document.querySelectorAll('.detail-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const countEl = document.querySelector('.detail-img-count');
      const total = document.querySelectorAll('.detail-thumb').length;
      if (countEl) countEl.textContent = `${idx} / ${total}`;
    }
    return;
  }

  // Photo slot remove button
  const removePhoto = e.target.closest('[data-remove-photo]');
  if (removePhoto) {
    e.stopPropagation();
    const key = removePhoto.dataset.removePhoto;
    if (state.sellData.photos[key]) URL.revokeObjectURL(state.sellData.photos[key]);
    delete state.sellData.photos[key];
    return render();
  }

  // 사진 슬롯은 <label for="..."> 방식으로 브라우저가 직접 처리 — JS 불필요
  if (e.target.type === 'file') return;

  const d = e.target.closest('[data-detail]');
  if (d) return viewDetail(d.dataset.detail);

  const service = e.target.closest('[data-service]');
  if (service) { state.filters.service = service.dataset.service; state.filters.q = ''; return setTab('search'); }

  const sf = e.target.closest('[data-service-filter]');
  if (sf) { state.filters.service = sf.dataset.serviceFilter; return render(); }

  const budget = e.target.closest('[data-budget]');
  if (budget) { state.filters.maxPrice = budget.dataset.budget; state.filters.category = '전체'; return setTab('search'); }

  const theme = e.target.closest('[data-theme]');
  if (theme) { state.filters.category = theme.dataset.theme; return setTab('search'); }

  if (e.target.closest('[data-open-ai]')) return showToast('AI시세 화면은 다음 단계에서 연결합니다');

  const action = e.target.closest('[data-action]');
  if (action) return showToast(action.dataset.action);

  const mode = e.target.closest('[data-mode]');
  if (mode) { state.sellMode = mode.dataset.mode; return render(); }

  if (e.target.closest('[data-next]')) {
    document.querySelectorAll('[data-sell-key]').forEach(el => {
      state.sellData[el.dataset.sellKey] = el.value;
    });
    state.sellStep = Math.min(6, state.sellStep + 1);
    return render();
  }
  if (e.target.closest('[data-prev]')) {
    state.sellStep = Math.max(0, state.sellStep - 1);
    return render();
  }

  if (e.target.id === 'submitSell') {
    document.querySelectorAll('[data-sell-key]').forEach(el => {
      state.sellData[el.dataset.sellKey] = el.value;
    });
    const d = state.sellData;
    const photoUrls = PHOTO_SLOTS.map(s => d.photos[s.key]).filter(Boolean);
    state.sellRequests.unshift({
      mode: state.sellMode === 'pro' ? '내마린팔기 Pro' : '내마린팔기 Self',
      status: '접수 완료',
      type: d.type, brand: d.brand, model: d.model,
      year: d.year, price: d.price, region: d.region,
      created: new Date().toLocaleDateString('ko-KR'),
      image: photoUrls[0] || '',
      photos: {...d.photos},
      diagnosisNoticeVersion: '1.0',
      diagnosisNoticeAcceptedAt: new Date().toISOString(),
      consentAcceptedAt: new Date().toISOString(),
    });
    state.sellStep = 0;
    state.sellData = freshSellData();
    saveState();
    showToast('내마린팔기 접수 완료');
    return setTab('garage');
  }

  if (e.target.closest('[data-do-search]')) {
    state.filters.category = '전체';
    state.filters.service = '전체매물';
    return setTab('search');
  }

  if (e.target.closest('#cmpBarBtn')) return setTab('compare');
  if (e.target.closest('#homeBtn')) return setTab('home');
  if (e.target.closest('#backBtn')) {
    if (state.tab === 'detail') return setTab('search');
    if (state.tab === 'dealer') return setTab('more');
    return setTab('home');
  }
  if (e.target.closest('#wishBtn')) return setTab('garage');
  if (e.target.closest('#compareBtn')) return setTab('compare');

  if (e.target.closest('[data-compare-clear]')) {
    state.compared.clear();
    saveState();
    return render();
  }
});

document.addEventListener('input', e => {
  if (e.target.id === 'homeSearch') {
    state.filters.q = e.target.value;
  }
  if (e.target.id === 'q') {
    state.filters.q = e.target.value;
    clearTimeout(qTimer);
    qTimer = setTimeout(renderResults, 350);
  }
  if (['category', 'maxPrice', 'region', 'sort'].includes(e.target.id)) {
    state.filters[e.target.id] = e.target.value;
    render();
  }
});

document.addEventListener('change', e => {
  if (['category', 'maxPrice', 'region', 'sort'].includes(e.target.id)) {
    state.filters[e.target.id] = e.target.value;
    render();
    return;
  }
  if (e.target.id === 'consentCheck') {
    const btn = document.getElementById('submitSell');
    if (btn) btn.disabled = !e.target.checked;
    return;
  }
  if (e.target.classList.contains('photo-file-input')) {
    const key = e.target.dataset.photoKey;
    const file = e.target.files && e.target.files[0];
    if (file && key) {
      if (state.sellData.photos[key]) URL.revokeObjectURL(state.sellData.photos[key]);
      state.sellData.photos[key] = URL.createObjectURL(file);
      render();
    }
  }
});

loadState();
render();
