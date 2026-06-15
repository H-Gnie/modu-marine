-- ============================================================
-- 모두의 마린 — payments 테이블 (MM-104 토스페이먼츠)
-- Supabase 대시보드 → SQL Editor에서 이 블록만 실행
-- ============================================================

create table if not exists public.payments (
  id bigserial primary key,
  order_id text unique not null,        -- 클라이언트가 생성하는 주문 고유 ID
  user_id uuid references public.profiles(id) on delete set null,
  listing_id bigint,                    -- 더미 매물(900000+)도 올 수 있어 FK 미설정
  product_name text not null,
  amount int not null,                  -- 원 단위
  status text default 'pending' check (status in ('pending', 'paid', 'failed', 'canceled')),
  payment_key text,                     -- 토스 결제 키
  method text,                          -- 카드/계좌이체 등
  created_at timestamptz default now(),
  paid_at timestamptz
);

alter table public.payments enable row level security;

-- 본인 결제 내역만 조회 가능. 쓰기는 서버(service role)가 RLS 우회해 처리하므로 정책 불필요.
create policy "payments_select" on public.payments for select
  using (auth.uid() = user_id);
