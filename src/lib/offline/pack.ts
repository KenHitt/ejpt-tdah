import { getAllBlocks, getAllWeeks } from "@/content/curriculum";
import { COMMAND_BANK } from "@/content/command-bank";
import { SUBTOPICS } from "@/content/subtopics";
import { OFFLINE_CACHE } from "./cache-name";

export function offlineUrls(): string[] {
  const blocks = getAllBlocks().map((b) => `/plan/${b.id}`);
  const focus = getAllBlocks().map((b) => `/focus/${b.id}`);
  const memory = COMMAND_BANK.map((c) => `/memory/${c.id}`);
  const weeks = getAllWeeks().map((w) => `/simulacro/skillcheck/${w.id}`);
  const rem = SUBTOPICS.map((s) => `/remediation/${s.id}`);
  return [
    "/",
    "/teoria",
    "/plan",
    "/glosario",
    "/como-usar",
    "/laboratorio",
    "/memory",
    "/progreso",
    "/simulacro",
    "/simulacro/full",
    "/login",
    "/manifest.webmanifest",
    "/icon.svg",
    ...blocks,
    ...focus,
    ...memory,
    ...weeks,
    ...rem,
  ];
}

function assetUrlsFromHtml(html: string, pageUrl: string): string[] {
  const origin = new URL(pageUrl).origin;
  const found = new Set<string>();
  const re = /(?:src|href)=["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const raw = m[1];
    if (raw.startsWith("data:") || raw.startsWith("mailto:")) continue;
    try {
      const abs = new URL(raw, pageUrl).href;
      if (!abs.startsWith(origin)) continue;
      const path = new URL(abs).pathname;
      if (path.startsWith("/_next/") || path.startsWith("/icon") || path.endsWith(".svg") || path.endsWith(".webmanifest")) {
        found.add(abs);
      }
    } catch {
      /* ignore */
    }
  }
  return Array.from(found);
}

async function put(cache: Cache, url: string, res: Response) {
  try {
    await cache.put(url, res);
  } catch {
    /* quota */
  }
}

/** Descarga HTML + JS/CSS de Next para usar la app sin red (WiFi del móvil, una vez). */
export async function downloadOfflinePack(onProgress?: (done: number, total: number) => void): Promise<{ ok: number; fail: number }> {
  const cache = await caches.open(OFFLINE_CACHE);
  const urls = offlineUrls();
  const extra = new Set<string>();
  let ok = 0;
  let fail = 0;
  const total = urls.length;

  for (let i = 0; i < urls.length; i++) {
    const path = urls[i];
    const abs = new URL(path, window.location.origin).href;
    try {
      const res = await fetch(abs, {
        credentials: "same-origin",
        headers: { Accept: "text/html,application/xhtml+xml,*/*" },
      });
      if (!res.ok) {
        fail += 1;
        onProgress?.(i + 1, total);
        continue;
      }
      const clone = res.clone();
      const ctype = res.headers.get("content-type") ?? "";
      await put(cache, abs, clone);
      if (ctype.includes("text/html")) {
        const html = await res.text();
        assetUrlsFromHtml(html, abs).forEach((u) => extra.add(u));
      }
      ok += 1;
    } catch {
      fail += 1;
    }
    onProgress?.(i + 1, total);
  }

  const extras = Array.from(extra);
  for (const abs of extras) {
    try {
      const res = await fetch(abs, { credentials: "same-origin" });
      if (res.ok) {
        await put(cache, abs, res);
        ok += 1;
      } else fail += 1;
    } catch {
      fail += 1;
    }
  }

  return { ok, fail };
}
