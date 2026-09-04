import { getAllBlocks } from "@/content/curriculum";
import { ResourceLink } from "@/lib/types";

export function getBlocksForSubtopic(subtopicId: string) {
  return getAllBlocks().filter((b) => b.subtopics.includes(subtopicId));
}

/**
 * Recursos ALTERNATIVOS (método distinto al ya intentado) para cuando un sub-tema
 * falla 2 veces seguidas tras el repaso — regla fija #9: "no repitas el mismo enfoque".
 * Se prioriza cambiar el FORMATO (video explicado vs. texto/lab) para los huecos declarados.
 */
const ALTERNATE_RESOURCES: Record<string, ResourceLink[]> = {
  "enum4linux": [
    { label: "IppSec — 'Kenobi' walkthrough (YouTube, explicación en video paso a paso)", url: "https://www.youtube.com/c/ippsec", platform: "Docs" },
  ],
  "gobuster-dir": [
    { label: "OWASP — Testing Directory Traversal / directory enumeration (referencia escrita alternativa)", url: "https://owasp.org/www-project-web-security-testing-guide/", platform: "Docs" },
  ],
  "hydra-bruteforce": [
    { label: "TryHackMe — Brute It (room alternativo, enfoque distinto a Hydra)", url: "https://tryhackme.com/room/bruteit", platform: "TryHackMe" },
  ],
  "tool-selection": [
    { label: "Haz tu propia tabla física (papel/pizarra) de los 3 escenarios y dibújala de memoria 3 veces — cambia el canal de texto a escritura manual", url: "#", platform: "Otro" },
  ],
  "msf-search-use": [
    { label: "IppSec — búsqueda 'metasploit' (YouTube, ver el flujo en video en vez de leerlo)", url: "https://www.youtube.com/c/ippsec", platform: "Docs" },
  ],
  "msf-lhost-lport": [
    { label: "Dibuja a mano el diagrama atacante<->víctima con flechas de conexión antes de escribir el comando (cambia el canal de memorización)", url: "#", platform: "Otro" },
  ],
  "msf-hashdump": [
    { label: "TryHackMe — Metasploit: Exploitation (room con enfoque distinto de post-explotación)", url: "https://tryhackme.com/room/rpmetasploit", platform: "TryHackMe" },
  ],
};

const GENERIC_ALTERNATE: ResourceLink = {
  label: "Cambia el canal: explica el proceso en voz alta grabándote, o escríbelo a mano en papel antes de teclearlo. Evita repetir el mismo lab en el mismo formato.",
  url: "#",
  platform: "Otro",
};

export function getAlternateResources(subtopicId: string): ResourceLink[] {
  return ALTERNATE_RESOURCES[subtopicId] ?? [GENERIC_ALTERNATE];
}
