import { listings } from './data.js';

export const won = n => n >= 10000 ? `${Math.floor(n/10000)}억${n%10000 ? (n%10000).toLocaleString() : ''}만원` : `${n.toLocaleString()}만원`;
export const byId = id => listings.find(x => x.id === Number(id));
export const gradeOf = s => s >= 98 ? 'S' : s >= 93 ? 'A+' : s >= 88 ? 'A' : s >= 83 ? 'B+' : 'B';

// 배지 색상 정책: 모두인증=밝은 파랑, 홈배송=흰 배경/검정 글씨, 그 외=기본(짙은 네이비)
export const badgeClass = b =>
  b === '모두인증' ? 'badge cert'
  : b === '홈배송' ? 'badge delivery'
  : 'badge';

// 화면에 표시할 배지 (모두진단 배지는 노출하지 않음 — 필터/로직용으로만 사용)
export const visibleBadges = (badges = []) => badges.filter(b => b !== '모두진단');
export function getPhotos(item) {
  if (item.photos) {
    const urls = Object.values(item.photos).filter(Boolean);
    if (urls.length) return urls;
  }
  return [item.image].filter(Boolean);
}
export const showToast = msg => {
  const toast = document.querySelector('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1600);
};
