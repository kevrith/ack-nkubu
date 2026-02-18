-- ACK Book of Common Prayer tables
-- Each "section" is a unit of liturgical content (collect, canticle, service, office)

create table if not exists bcp_sections (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,           -- e.g. "collect-advent1", "canticle-te-deum"
  title       text not null,                  -- Display heading
  season      text,                           -- advent|christmas|epiphany|lent|easter|ordinary|saints
  section_type text not null,                 -- collect|canticle|service|office|psalm|litany
  liturgical_color text,                      -- purple|white|red|green|rose
  week_number int,                            -- For ordered Sundays (1-27 etc.)
  content     jsonb not null default '[]',    -- Array of content parts
  is_active   boolean not null default true,
  order_index int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Indexes
create index if not exists bcp_sections_season_idx on bcp_sections(season);
create index if not exists bcp_sections_type_idx   on bcp_sections(section_type);
create index if not exists bcp_sections_slug_idx   on bcp_sections(slug);

-- RLS: everyone can read BCP content
alter table bcp_sections enable row level security;

create policy "BCP sections are publicly readable"
  on bcp_sections for select using (is_active = true);

create policy "Admins can manage BCP sections"
  on bcp_sections for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin','clergy')
    )
  );

-- Trigger to keep updated_at fresh
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bcp_sections_updated_at
  before update on bcp_sections
  for each row execute procedure touch_updated_at();
