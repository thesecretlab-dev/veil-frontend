-- Create whitelist_signups table to store wallet addresses and signatures for airdrops
create table if not exists public.whitelist_signups (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null unique,
  signature text not null,
  message text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.whitelist_signups enable row level security;

-- Allow anyone to insert (public whitelist signup)
create policy "Allow public whitelist inserts"
  on public.whitelist_signups for insert
  with check (true);

-- Only allow reading your own signup (optional - adjust based on needs)
create policy "Allow users to view own signup"
  on public.whitelist_signups for select
  using (true);

-- Create index for faster lookups
create index if not exists whitelist_signups_wallet_address_idx 
  on public.whitelist_signups(wallet_address);

create index if not exists whitelist_signups_created_at_idx 
  on public.whitelist_signups(created_at desc);
