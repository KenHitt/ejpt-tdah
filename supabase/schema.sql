-- =============================================================================
-- Esquema de Supabase para "eJPT en 3 Meses" (plan de estudio + tracking).
-- Pégalo completo en el SQL Editor de tu proyecto Supabase (Database > SQL Editor)
-- y ejecútalo una sola vez.
-- =============================================================================

-- Extensión necesaria para gen_random_uuid()
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Tabla principal: un snapshot JSON por usuario con TODO su progreso.
-- Se mantiene simple a propósito (un solo documento versionable) para que la
-- app pueda sincronizar rápido; el mismo JSON se cachea también en localStorage
-- como fallback offline. Si más adelante quieres reportes SQL más finos
-- (ej. "promedio de score por sub-tema entre todos mis intentos"), puedes migrar
-- estos campos a tablas normalizadas (attempts, failures, sessions) reutilizando
-- la misma estructura de datos que ya usa la app en /src/lib/types.ts.
-- -----------------------------------------------------------------------------
create table if not exists public.progress_snapshots (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.progress_snapshots enable row level security;

create policy "Los usuarios solo leen su propio progreso"
  on public.progress_snapshots for select
  using (auth.uid() = user_id);

create policy "Los usuarios solo insertan su propio progreso"
  on public.progress_snapshots for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios solo actualizan su propio progreso"
  on public.progress_snapshots for update
  using (auth.uid() = user_id);

create policy "Los usuarios solo eliminan su propio progreso"
  on public.progress_snapshots for delete
  using (auth.uid() = user_id);

-- Trigger para mantener updated_at siempre actualizado.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_progress_snapshots_updated_at on public.progress_snapshots;
create trigger trg_progress_snapshots_updated_at
  before update on public.progress_snapshots
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- (Opcional / futuro) Tablas normalizadas si luego quieres queries analíticas
-- más ricas en vez de leer/escribir el JSON completo cada vez. Se dejan listas
-- para no tener que rediseñar el esquema después. No son usadas por el MVP.
-- -----------------------------------------------------------------------------
create table if not exists public.simulacro_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  simulacro_id text not null,
  started_at timestamptz not null,
  finished_at timestamptz,
  duration_sec int not null default 1200,
  question_ids jsonb not null default '[]'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  score numeric,
  passed boolean,
  created_at timestamptz not null default now()
);

alter table public.simulacro_attempts enable row level security;

create policy "Los usuarios gestionan sus propios intentos de simulacro"
  on public.simulacro_attempts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.subtopic_failures (
  user_id uuid not null references auth.users (id) on delete cascade,
  subtopic_id text not null,
  fail_count int not null default 0,
  last_failed_at timestamptz,
  status text not null default 'open',
  remediation_attempts int not null default 0,
  primary key (user_id, subtopic_id)
);

alter table public.subtopic_failures enable row level security;

create policy "Los usuarios gestionan sus propios fallos por sub-tema"
  on public.subtopic_failures for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  regime_day_type text not null check (regime_day_type in ('trabajo', 'libre')),
  hours_planned numeric not null default 0,
  hours_actual numeric not null default 0,
  blocks_completed jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.study_sessions enable row level security;

create policy "Los usuarios gestionan sus propias sesiones de estudio"
  on public.study_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
