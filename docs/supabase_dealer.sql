-- ============================================================
-- 모두의 마린 — 딜러 전환(사업자 인증) 컬럼 (MM-202)
-- Supabase 대시보드 → SQL Editor에서 이 블록만 실행
-- ============================================================
-- profiles.role 은 이미 존재하며 'user' | 'dealer' | 'admin' 체크가 걸려 있음.
-- 사업자 인증 통과 시 role 을 'dealer' 로 올리고 아래 사업자 정보를 저장한다.

alter table public.profiles
  add column if not exists biz_no text,              -- 사업자등록번호 (숫자 10자리)
  add column if not exists biz_name text,            -- 상호
  add column if not exists ceo_name text,            -- 대표자명
  add column if not exists dealer_verified_at timestamptz;

-- (선택) 사업자번호 중복 가입 방지
create unique index if not exists profiles_biz_no_uniq
  on public.profiles (biz_no) where biz_no is not null;
