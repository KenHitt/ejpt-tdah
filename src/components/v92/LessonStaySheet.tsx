"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { COURSE_LESSONS, getLesson } from "@/content/course";
import { LEARN_ARTICLES } from "@/content/learn-articles";
import { ACADEMY_TERMS } from "@/content/v92/terms";
import { getSkill } from "@/content/v6/skills";
import { learnMeta } from "@/content/v6/relations";
import { WEEK1_DECISION_DRILLS, EXTRA_DECISION_DRILLS, V8_ALL_DRILLS } from "@/content/decision-drills";
import { V9_ALL_DRILLS } from "@/content/v9/drills";
import { DecisionDrillRunner } from "@/components/trainer/DecisionDrillRunner";
import { LAB_HOST_DIAGRAM, LAB_WORKSHOP } from "@/content/workshops/lab-virtualbox";
import { COMMAND_BANK } from "@/content/command-bank";
import { WHATS_NEXT, WHATS_NEXT_START } from "@/content/whats-next";
import { PromptCheckCard } from "@/components/trainer/PromptCheckCard";
import { SafetyNote } from "@/components/SafetyNote";

type TermPeek = { term: string; def: string; purpose?: string; href?: string };

type Peek =
  | { kind: "learn"; id: string }
  | { kind: "term"; term: TermPeek }
  | { kind: "glossary" }
  | { kind: "decisions" }
  | { kind: "transfer" }
  | { kind: "whats-next" }
  | { kind: "memory" }
  | { kind: "lab" }
  | { kind: "skill"; id: string }
  | { kind: "lesson"; id: string }
  | { kind: "unknown"; href: string };

function parseHref(href: string): Peek {
  const path = href.split("?")[0];
  const learn = path.match(/^\/learn\/([^/]+)$/);
  if (learn) return { kind: "learn", id: learn[1] };
  const skill = path.match(/^\/master\/([^/]+)$/);
  if (skill) return { kind: "skill", id: skill[1] };
  const lesson = path.match(/^\/clase\/([^/]+)$/);
  if (lesson) return { kind: "lesson", id: lesson[1] };
  if (path === "/glosario") return { kind: "glossary" };
  if (path === "/train/decisions") return { kind: "decisions" };
  if (path === "/train/transfer") return { kind: "transfer" };
  if (path === "/train/whats-next") return { kind: "whats-next" };
  if (path === "/memory" || path.startsWith("/memory/")) return { kind: "memory" };
  if (path === "/laboratorio") return { kind: "lab" };
  return { kind: "unknown", href };
}

const StayCtx = createContext<{
  openHref: (href: string) => void;
  openTerm: (term: TermPeek) => void;
} | null>(null);

export function useLessonStay() {
  return useContext(StayCtx);
}

export function LessonStayProvider({ children }: { children: ReactNode }) {
  const [peek, setPeek] = useState<Peek | null>(null);
  const openHref = useCallback((href: string) => setPeek(parseHref(href)), []);
  const openTerm = useCallback((term: TermPeek) => setPeek({ kind: "term", term }), []);
  const close = useCallback(() => setPeek(null), []);
  const value = useMemo(() => ({ openHref, openTerm }), [openHref, openTerm]);

  return (
    <StayCtx.Provider value={value}>
      {children}
      <StayDialog peek={peek} onClose={close} onOpenHref={openHref} />
    </StayCtx.Provider>
  );
}

export function StayLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const stay = useLessonStay();
  if (!stay) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={`cursor-pointer text-left ${className ?? ""}`} onClick={() => stay.openHref(href)}>
      {children}
    </button>
  );
}

export function StayTermButton({
  term,
  children,
  className,
}: {
  term: TermPeek;
  children: ReactNode;
  className?: string;
}) {
  const stay = useLessonStay();
  return (
    <button type="button" className={`cursor-pointer text-left ${className ?? ""}`} onClick={() => stay?.openTerm(term)}>
      {children}
    </button>
  );
}

function StayDialog({
  peek,
  onClose,
  onOpenHref,
}: {
  peek: Peek | null;
  onClose: () => void;
  onOpenHref: (href: string) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const title = peek ? peekTitle(peek) : "";

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (peek && !d.open) d.showModal();
    if (!peek && d.open) d.close();
    document.body.style.overflow = peek ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [peek]);

  const dismiss = () => {
    ref.current?.close();
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 m-auto max-h-[90vh] w-[min(36rem,calc(100%-1.5rem))] overflow-hidden rounded-xl border border-slate-700 bg-slate-950 p-0 text-slate-100 shadow-2xl backdrop:bg-black/75"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) dismiss();
      }}
    >
      {peek && (
        <div className="flex max-h-[90vh] flex-col">
          <header className="flex items-start justify-between gap-3 border-b border-slate-800 px-4 py-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-red-400">Sigue en esta jornada</p>
              <h2 id={titleId} className="text-lg font-semibold text-white">
                {title}
              </h2>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="shrink-0 rounded-md border border-slate-700 px-2 py-1 text-sm text-slate-200 hover:border-red-600 hover:text-white"
            >
              Cerrar
            </button>
          </header>
          <div className="overflow-y-auto px-4 py-4">
            <PeekBody peek={peek} onOpenHref={onOpenHref} />
          </div>
          <footer className="border-t border-slate-800 px-4 py-3">
            <button
              type="button"
              onClick={dismiss}
              className="w-full rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
              Cerrar y seguir en esta jornada
            </button>
          </footer>
        </div>
      )}
    </dialog>
  );
}

function peekTitle(peek: Peek): string {
  if (peek.kind === "learn") return LEARN_ARTICLES.find((a) => a.id === peek.id)?.titleEs ?? "Ficha";
  if (peek.kind === "term") return peek.term.term;
  if (peek.kind === "glossary") return "Glosario de laboratorio";
  if (peek.kind === "decisions") return "Decision drill";
  if (peek.kind === "transfer") return "Transfer lab";
  if (peek.kind === "whats-next") return "What's next";
  if (peek.kind === "memory") return "SRS / memoria";
  if (peek.kind === "lab") return "Laboratorio (resumen)";
  if (peek.kind === "skill") return getSkill(peek.id)?.titleEs ?? "Skill";
  if (peek.kind === "lesson") return getLesson(peek.id)?.titleEs ?? "Jornada";
  return "Referencia";
}

function relatedFichaFits(term: string, href?: string) {
  if (!href) return false;
  const id = href.match(/^\/learn\/([^/]+)/)?.[1];
  if (!id) return href === "/laboratorio" && /host-only|virtualbox|snapshot|lab/i.test(term);
  const art = LEARN_ARTICLES.find((a) => a.id === id);
  if (!art) return false;
  const needle = term.toLowerCase();
  const hay = `${art.id} ${art.titleEs}`.toLowerCase();
  if (hay === needle || art.id.toLowerCase() === needle) return true;
  return needle
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .some((w) => hay.includes(w));
}

function PeekBody({ peek, onOpenHref }: { peek: Peek; onOpenHref: (href: string) => void }) {
  if (peek.kind === "term") {
    const t = peek.term;
    const catalog = ACADEMY_TERMS.find((x) => x.term.toLowerCase() === t.term.toLowerCase());
    const def = t.def || catalog?.def || "";
    const purpose = t.purpose || catalog?.purpose;
    const href = relatedFichaFits(t.term, t.href)
      ? t.href
      : relatedFichaFits(t.term, catalog?.href)
        ? catalog?.href
        : undefined;
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-200">{def}</p>
        {purpose && (
          <p className="text-sm text-slate-300">
            <span className="text-red-300">Para qué. </span>
            {purpose}
          </p>
        )}
        {href && (
          <button type="button" className="text-sm text-red-400 hover:underline" onClick={() => onOpenHref(href)}>
            Ficha del mismo tema
          </button>
        )}
      </div>
    );
  }
  if (peek.kind === "learn") return <LearnPeek id={peek.id} />;
  if (peek.kind === "glossary") return <GlossaryPeek />;
  if (peek.kind === "decisions") {
    return (
      <DecisionDrillRunner
        scenarios={[...WEEK1_DECISION_DRILLS, ...EXTRA_DECISION_DRILLS, ...V8_ALL_DRILLS]}
        onAllPassed={() => undefined}
      />
    );
  }
  if (peek.kind === "transfer") {
    return <DecisionDrillRunner scenarios={V9_ALL_DRILLS} onAllPassed={() => undefined} />;
  }
  if (peek.kind === "whats-next") return <WhatsNextPeek />;
  if (peek.kind === "memory") return <MemoryPeek />;
  if (peek.kind === "lab") return <LabPeek />;
  if (peek.kind === "skill") return <SkillPeek id={peek.id} onOpenHref={onOpenHref} />;
  if (peek.kind === "lesson") return <LessonPeek id={peek.id} />;
  return (
    <p className="text-sm text-slate-300">
      Este enlace no tiene panel propio. Ciérralo y sigue la jornada; el destino era {peek.href}.
    </p>
  );
}

function LearnPeek({ id }: { id: string }) {
  const a = LEARN_ARTICLES.find((x) => x.id === id);
  if (!a) return <p className="text-sm text-amber-200">No hay ficha con ese id. Sigue en la jornada.</p>;
  const meta = learnMeta(a.id);
  const sections = [
    ["Qué es", a.what],
    ["Por qué", a.why],
    ["Cómo", a.how],
    ["Cuándo", a.when],
    ["Ejemplo", a.example],
    ["Error típico", a.mistake],
  ] as const;
  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">
        {a.track} · ~{meta.minutes} min · no sustituye esta clase
      </p>
      {sections.map(([k, v]) => (
        <section key={k} className="rounded-md border border-slate-800 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-400">{k}</p>
          <p className="mt-1 text-sm text-slate-200">{v}</p>
        </section>
      ))}
    </div>
  );
}

function GlossaryPeek() {
  return (
    <ul className="space-y-2">
      {ACADEMY_TERMS.map((t) => (
        <li key={t.term} className="rounded-lg border border-slate-800 p-3">
          <p className="font-mono text-sm text-emerald-400">{t.term}</p>
          <p className="text-sm text-slate-200">{t.def}</p>
          <p className="mt-1 text-xs text-slate-400">Para qué: {t.purpose}</p>
        </li>
      ))}
    </ul>
  );
}

function MemoryPeek() {
  const cards = COMMAND_BANK.filter((c) => c.category === "Lab" || c.category === "Nmap").slice(0, 6);
  const list = cards.length ? cards : COMMAND_BANK.slice(0, 6);
  return (
    <ul className="space-y-3">
      {list.map((c) => (
        <li key={c.id} className="rounded-lg border border-slate-800 p-3">
          <p className="font-mono text-sm text-emerald-300">{c.fragment}</p>
          <p className="mt-1 text-sm text-slate-200">{c.toolQuestionEs}</p>
          <p className="mt-1 text-xs text-slate-400">{c.explanationEs}</p>
        </li>
      ))}
    </ul>
  );
}

function LabPeek() {
  const first = LAB_WORKSHOP[0];
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-300">
        Kali es el atacante en tu PC. VirtualBox solo tiene las víctimas. Host-Only es el switch del lab. Cierra este
        panel y sigue los pasos de la jornada; no hace falta irte a otra ruta.
      </p>
      <pre className="overflow-x-auto rounded-md bg-black p-3 font-mono text-[11px] text-emerald-200">{LAB_HOST_DIAGRAM}</pre>
      {first && <p className="text-sm leading-relaxed text-slate-200">{first.bodyEs}</p>}
    </div>
  );
}

function SkillPeek({ id, onOpenHref }: { id: string; onOpenHref: (href: string) => void }) {
  const skill = getSkill(id);
  if (!skill) return <p className="text-sm text-amber-200">Skill no encontrada.</p>;
  const lessons = skill.lessonIds.map((lid) => COURSE_LESSONS.find((l) => l.id === lid)).filter(Boolean);
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-200">{skill.whyEs}</p>
      <p className="text-xs text-slate-400">Jornadas de esta skill (se abren aquí, no te sacan):</p>
      <ul className="space-y-1">
        {lessons.map((l) =>
          l ? (
            <li key={l.id}>
              <button type="button" className="text-sm text-red-400 hover:underline" onClick={() => onOpenHref(`/clase/${l.id}`)}>
                {l.titleEs}
              </button>
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
}

function LessonPeek({ id }: { id: string }) {
  const lesson = getLesson(id);
  if (!lesson) return <p className="text-sm text-amber-200">Jornada no encontrada.</p>;
  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">Resumen de teoría. Tu clase actual no se cierra.</p>
      {lesson.read.map((s) => (
        <article key={s.h} className="rounded-lg border border-slate-800 p-3">
          <p className="text-xs font-semibold text-red-400">{s.h}</p>
          <p className="mt-1 text-sm text-slate-200">{s.p}</p>
        </article>
      ))}
    </div>
  );
}

function WhatsNextPeek() {
  const [id, setId] = useState(WHATS_NEXT_START);
  const [ok, setOk] = useState(false);
  const [choice, setChoice] = useState<string | undefined>();
  const node = WHATS_NEXT[id];
  if (id === "end" || !node) {
    return <p className="text-sm text-emerald-300">Cadena cerrada. Cierra y vuelve a la teoría de hoy.</p>;
  }
  return (
    <div className="space-y-3">
      <SafetyNote compact />
      <p className="whitespace-pre-wrap text-sm text-slate-300">{node.setupEs}</p>
      {node.output && <pre className="rounded bg-black p-3 font-mono text-xs text-emerald-200">{node.output}</pre>}
      <PromptCheckCard
        key={node.id}
        check={node.check}
        exerciseId={`whats-stay:${node.id}`}
        onPassed={() => setOk(true)}
        onChoice={setChoice}
      />
      {ok && (
        <button
          type="button"
          className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white"
          onClick={() => {
            const picked = choice ?? node.check.choices?.find((c) => c.ok)?.id ?? Object.keys(node.nextByChoice)[0];
            setChoice(undefined);
            setOk(false);
            setId(node.nextByChoice[picked] ?? "end");
          }}
        >
          Nuevo resultado
        </button>
      )}
    </div>
  );
}
