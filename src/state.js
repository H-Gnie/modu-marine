import { listings } from './data.js';

export const state = {
  tab: 'home',
  listing: null,
  filters: { category: '전체', maxPrice: '', region: '전체', certified: false, delivery: false, sort: '추천순', q: '', service: '전체매물' },
  wished: new Set(),
  compared: new Set(),
  recent: [],
  sellStep: 0,
  sellMode: 'self',
  sellData: { type:'제트스키', brand:'', model:'', year:'', hin:'', price:'', region:'경기', marina:'', engine:'아웃보드', hours:'', length:'', hp:'', regStatus:'정상', inspStatus:'유효', insStatus:'가입', desc:'', photos:{} },
  sellRequests: []
};

export const freshSellData = () => ({
  type:'제트스키',
  brand:'',
  model:'',
  year:'',
  hin:'',
  price:'',
  region:'경기',
  marina:'',
  engine:'아웃보드',
  hours:'',
  length:'',
  hp:'',
  regStatus:'정상',
  inspStatus:'유효',
  insStatus:'가입',
  desc:'',
  photos:{}
});

export function saveState() {
  try {
    localStorage.setItem('modu_wished', JSON.stringify([...state.wished]));
    localStorage.setItem('modu_compared', JSON.stringify([...state.compared]));
    localStorage.setItem('modu_recent', JSON.stringify(state.recent));
    localStorage.setItem('modu_sellRequests', JSON.stringify(state.sellRequests));
  } catch(e) {}
}

export function loadState() {
  try {
    const w = localStorage.getItem('modu_wished');
    if (w) {
      const parsed = JSON.parse(w);
      state.wished = new Set(Array.isArray(parsed) ? parsed.map(Number).filter(Number.isFinite) : []);
    }
    const c = localStorage.getItem('modu_compared');
    if (c) {
      const parsed = JSON.parse(c);
      state.compared = new Set(Array.isArray(parsed) ? parsed.map(Number).filter(Number.isFinite) : []);
    }
    const r = localStorage.getItem('modu_recent');
    if (r) {
      const parsed = JSON.parse(r);
      state.recent = Array.isArray(parsed) ? parsed.map(Number).filter(Number.isFinite).slice(0, 8) : [];
    }
    const s = localStorage.getItem('modu_sellRequests');
    if (s) {
      const parsed = JSON.parse(s);
      state.sellRequests = Array.isArray(parsed) ? parsed.filter(x => x && typeof x === 'object') : [];
    }
  } catch(e) {
    state.wished = new Set();
    state.compared = new Set();
    state.recent = [];
    state.sellRequests = [];
  }
}
