# eJPT en 3 Meses — Plan de estudio interactivo

App web (Next.js) que implementa el plan de estudio completo para aprobar el **eJPT en 3 meses, al
primer intento**, calibrado para TDAH: bloques de 45-50 min, un objetivo verificable por bloque,
80% práctica / 20% teoría, drills de fijación, glosario bilingüe, simulacros cronometrados con
umbral de 70%, y un ciclo de feedback/remediación automático cuando reportas un fallo.

Todo el contenido curricular vive en código (`/src/content`). El progreso (bloques completados,
fallos por sub-tema, intentos de simulacro, horas de estudio) se guarda en **localStorage** siempre
(funciona sin configurar nada) y, opcionalmente, en **Supabase** si configuras las variables de
entorno — así no pierdes tu progreso al subir la app a Vercel y usarla desde varios dispositivos.

## Estructura del contenido

- `src/content/subtopics.ts` — registro de todos los sub-temas (incluye tus 2 huecos declarados:
  Metasploit y confusión Gobuster/Hydra/enum4linux, marcados con `knownGap: true`).
- `src/content/curriculum/month1-week{1..4}.ts` — **Mes 1 completo y detallado**: Nmap/recon,
  enumeración (con el bloque crítico de "cuándo usar Gobuster vs Hydra vs enum4linux"), Metasploit
  de memoria (search/use/set/exploit/sysinfo/hashdump/multi-handler), y explotación consolidada.
- `src/content/curriculum/month2-week{5..8}.ts` — Mes 2: Web (SQLi/XSS/LFI/RFI/auth bypass), redes
  (ARP spoofing/pivoting), post-explotación (privesc Linux/Windows). Arrancan los Simulacros #1 y #2.
- `src/content/curriculum/month3-week{9..12}.ts` — Mes 3: cadena completa cronometrada, reporting
  estilo examen, logística real de INE/eLearnSecurity, Simulacros #3, #4 y Final.
- `src/content/quizbank.ts` — banco de preguntas (bilingüe) usado por skill-checks y simulacros.

> Los bloques de Mes 2 y Mes 3 tienen contenido real y verificado, pero con menos ejercicios de
> fijación por bloque que el Mes 1 (que es donde viven tus huecos declarados). Pídeme en el chat
> "expande el bloque X de la semana Y con más drills" cuando llegues a esa semana, y lo amplío con
> el mismo nivel de detalle que el Mes 1 — así no front-cargamos contenido que todavía no necesitas
> (tal como pediste).

## Mecánica implementada (resumen técnico de las reglas fijas)

- **Bloques de hiperfoco**: cada `StudyBlock` tiene `durationMin` (45-50) y un `objective` de una
  sola línea, mostrado arriba de todo en `/plan/[blockId]`.
- **Fijación por repetición**: `DrillPractice` pide escribir cada comando de memoria y lo valida
  contra la respuesta esperada.
- **Simulacros** (`src/lib/simulacro.ts`): 15 preguntas aleatorias de TODO lo cubierto hasta la
  semana global actual (`pickFullSimulacroQuestions`), 20 min (`FULL_SIMULACRO_DURATION_SEC`),
  umbral 70% (`PASS_THRESHOLD_PERCENT`). Si repruebas, `markFullSimulacroFailedToday()` bloquea otro
  simulacro completo el mismo día (`canTakeFullSimulacroToday()`).
- **Ciclo de feedback/remediación** (`/remediation/[subtopicId]`): al reportar un fallo, no avanzas
  al siguiente tema — repasas SOLO ese sub-tema, haces drills nuevos, y un mini skill-check. Si el
  mismo sub-tema falla 2 veces seguidas, se marca `critical-risk` y se sugiere un recurso/método
  distinto (`src/lib/remediation.ts`).
- **Diagnóstico honesto de ritmo** (`/progreso`, `src/lib/regime.ts`): compara horas requeridas
  (con colchón real de 1.35x) contra horas reales registradas, según tu régimen 20x10, y da un
  número exacto de déficit — no una frase motivacional.

## Requisitos

- Node.js 20+
- Una cuenta de [Supabase](https://supabase.com) (gratis) — opcional pero recomendado.
- Una cuenta de [Vercel](https://vercel.com) (gratis) para desplegar.

## 1. Correr localmente

```bash
npm install
npm run dev
```

Abre http://localhost:3000. Sin configurar nada, ya funciona (progreso en localStorage).

## 2. Configurar Supabase (para guardar tu progreso en la nube)

1. Crea un proyecto nuevo en [supabase.com](https://supabase.com/dashboard).
2. Ve a **Project Settings > API** y copia `Project URL` y `anon public key`.
3. Copia `.env.example` a `.env.local` y pega esos dos valores:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
4. Ve a **SQL Editor** en el dashboard de Supabase, pega el contenido completo de
   [`supabase/schema.sql`](./supabase/schema.sql) y ejecútalo. Esto crea la tabla
   `progress_snapshots` (con Row Level Security, cada usuario solo ve su propio progreso) y tablas
   opcionales normalizadas para el futuro.
5. Ve a **Authentication > Providers** y confirma que el proveedor de **Email** (magic link) esté
   habilitado (viene habilitado por defecto).
6. Reinicia `npm run dev`. Entra a `/login`, escribe tu correo, y confirma el link mágico que te
   llega. A partir de ahí tu progreso sincroniza automáticamente con Supabase (con fallback a
   localStorage si te quedas sin conexión).

## 3. Desplegar en Vercel

```bash
npm install -g vercel   # si no lo tienes
vercel
```

O desde la web de Vercel: **Add New > Project**, importa este repositorio, y en
**Environment Variables** agrega las mismas dos variables (`NEXT_PUBLIC_SUPABASE_URL` y
`NEXT_PUBLIC_SUPABASE_ANON_KEY`). Vercel detecta Next.js automáticamente — no necesitas config
adicional.

Después del primer deploy, en Supabase ve a **Authentication > URL Configuration** y agrega tu
dominio de Vercel (`https://tu-app.vercel.app`) a **Redirect URLs**, o el link mágico de login no
redirigirá correctamente en producción.

## Scripts

```bash
npm run dev      # desarrollo local
npm run build    # build de producción (usado por Vercel)
npm run start    # sirve el build de producción localmente
npm run lint     # ESLint
```

## Siguientes pasos sugeridos

- Cuando termines el Mes 1, pide que se expandan los bloques de Mes 2/3 con el mismo nivel de
  detalle (drills, glosario, tabla comparativa) que el Mes 1.
- Si quieres reportes SQL más finos por sub-tema (ej. "% de aciertos históricos por categoría"),
  migra de `progress_snapshots` (JSON) a las tablas normalizadas ya dejadas listas en
  `supabase/schema.sql` (`simulacro_attempts`, `subtopic_failures`, `study_sessions`).
