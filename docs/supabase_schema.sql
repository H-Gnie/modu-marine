-- ============================================================
-- 모두의 마린 Supabase DB 스키마
-- Supabase 대시보드 → SQL Editor에서 전체 실행
-- ============================================================

-- 1. profiles (auth.users 확장)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  nickname text,
  avatar_url text,
  phone text,
  role text default 'user' check (role in ('user', 'dealer', 'admin')),
  created_at timestamptz default now()
);

-- 신규 유저 가입 시 자동으로 profiles 생성
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. listings (매물)
create table public.listings (
  id bigserial primary key,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  status text default 'active' check (status in ('active', 'reserved', 'sold', 'hidden')),

  -- 기본 정보
  type text not null,           -- 제트스키, 모터보트, 낚시보트, 요트, RIB
  brand text,
  model text,
  year int,
  price int not null,           -- 만원 단위

  -- 제원
  length_m numeric(5,2),        -- 선체 길이 (m)
  engine text,
  engine_hours int,             -- 운항시간
  horsepower int,

  -- 위치
  region text,
  marina text,

  -- 상태
  hull_grade text,              -- A, B+, B, C
  engine_grade text,
  electrical_grade text,
  drive_grade text,
  has_accident boolean default false,
  has_flood boolean default false,
  has_grounding boolean default false,

  -- 배지
  is_certified boolean default false,    -- 모두인증
  is_diagnosed boolean default false,   -- 모두진단
  has_delivery boolean default false,   -- 홈배송
  has_trailer boolean default false,
  has_video boolean default false,
  is_direct boolean default false,       -- 직거래

  -- AI시세
  ai_price_min int,
  ai_price_max int,

  -- 설명
  description text,
  options text[],               -- 포함 옵션 배열

  -- 판매 모드
  sell_mode text default 'self' check (sell_mode in ('self', 'pro')),

  -- 이미지 (Storage URL 배열)
  images text[],

  -- 통계
  view_count int default 0,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- updated_at 자동 갱신
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger listings_updated_at
  before update on public.listings
  for each row execute function update_updated_at();

-- 3. wishlists (찜)
create table public.wishlists (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  listing_id bigint references public.listings(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, listing_id)
);

-- 4. inquiries (문의)
create table public.inquiries (
  id bigserial primary key,
  listing_id bigint references public.listings(id) on delete cascade not null,
  buyer_id uuid references public.profiles(id) on delete set null,
  buyer_name text,
  buyer_phone text,
  buyer_email text,
  message text not null,
  inquiry_type text default 'general' check (inquiry_type in ('general', 'visit', 'delivery')),
  status text default 'pending' check (status in ('pending', 'replied', 'closed')),
  created_at timestamptz default now()
);

-- 5. RLS (Row Level Security) 설정
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.wishlists enable row level security;
alter table public.inquiries enable row level security;

-- profiles: 본인만 수정 가능, 조회는 모두 가능
create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- listings: 조회는 모두, 등록/수정/삭제는 본인만
create policy "listings_select" on public.listings for select using (status = 'active' or seller_id = auth.uid());
create policy "listings_insert" on public.listings for insert with check (auth.uid() = seller_id);
create policy "listings_update" on public.listings for update using (auth.uid() = seller_id);
create policy "listings_delete" on public.listings for delete using (auth.uid() = seller_id);

-- wishlists: 본인만 접근
create policy "wishlists_select" on public.wishlists for select using (auth.uid() = user_id);
create policy "wishlists_insert" on public.wishlists for insert with check (auth.uid() = user_id);
create policy "wishlists_delete" on public.wishlists for delete using (auth.uid() = user_id);

-- inquiries: 구매자 본인 + 판매자만 조회 가능
create policy "inquiries_select" on public.inquiries for select
  using (
    auth.uid() = buyer_id or
    auth.uid() = (select seller_id from public.listings where id = listing_id)
  );
create policy "inquiries_insert" on public.inquiries for insert with check (true);

-- 6. Storage 버킷 (SQL Editor에서 실행)
insert into storage.buckets (id, name, public) values ('listing-images', 'listing-images', true);

create policy "listing_images_select" on storage.objects for select using (bucket_id = 'listing-images');
create policy "listing_images_insert" on storage.objects for insert
  with check (bucket_id = 'listing-images' and auth.uid() is not null);
create policy "listing_images_delete" on storage.objects for delete
  using (bucket_id = 'listing-images' and auth.uid()::text = (storage.foldername(name))[1]);
