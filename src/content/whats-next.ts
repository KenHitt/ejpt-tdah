import { PromptCheck } from "@/lib/types";

export interface WhatsNode {
  id: string;
  setupEs: string;
  output?: string;
  check: PromptCheck;
  nextByChoice: Record<string, string>;
}

export const WHATS_NEXT_START = "n0";

export const WHATS_NEXT: Record<string, WhatsNode> = {
  n0: {
    id: "n0",
    setupEs: "TARGET 10.10.10.15 (simulado; no lo escanees en casa). Nmap:",
    output: "21/tcp open ftp\n22/tcp open ssh\n80/tcp open http\n445/tcp open smb",
    check: {
      id: "n0",
      promptEs: "What's your next move?",
      choices: [
        { id: "ftp", textEs: "Enumerar FTP", ok: true, whyRightEs: "Anonymous/banner es barato y a menudo cambia el box." },
        { id: "ssh", textEs: "Hydra contra SSH ya", whyWrongEs: "WRONG PRIORITY. Posible, pero saltas enum de más valor." },
        { id: "http", textEs: "Enumerar HTTP", ok: true, whyRightEs: "80 → dirs, tech, auth surface." },
        { id: "smb", textEs: "Enumerar SMB", ok: true, whyRightEs: "445 → users/shares. Alta prioridad eJPT." },
        { id: "rescan", textEs: "Rescan everything", whyWrongEs: "Ya tienes un mapa. Re-scanear el mismo top no es el siguiente movimiento." },
      ],
      justifyPromptEs: "Why?",
      justifyKeywords: ["enum", "share", "dir", "anon", "user", "prioridad", "smb", "http", "ftp"],
      explanationEs: "FTP/HTTP/SMB son enum. Hydra SSH y rescan son mala prioridad aquí.",
      failKind: "reasoning",
      subtopicId: "tool-selection",
    },
    nextByChoice: { ftp: "n-ftp", http: "n-http", smb: "n-smb", ssh: "n0", rescan: "n0" },
  },
  "n-http": {
    id: "n-http",
    setupEs: "Elegiste HTTP/80.",
    output: "Apache 2.4\nLogin page\nrobots.txt",
    check: {
      id: "n-http2",
      promptEs: "Now what?",
      choices: [
        { id: "robots", textEs: "Leer robots.txt / dirs", ok: true, whyRightEs: "Superficie web: rutas ocultas antes de brute login." },
        { id: "hydra", textEs: "Hydra al login ya", whyWrongEs: "WRONG PRIORITY. Primero rutas y usuarios; brute es caro." },
        { id: "msf", textEs: "search apache al azar", whyWrongEs: "Sin enum de dirs/params, es lotería." },
      ],
      justifyPromptEs: "Why?",
      justifyKeywords: ["dir", "ruta", "robot", "login", "enum"],
      explanationEs: "Login existe, pero robots/dirs primero.",
      failKind: "reasoning",
      subtopicId: "gobuster-dir",
    },
    nextByChoice: { robots: "end", hydra: "n-http", msf: "n-http" },
  },
  "n-smb": {
    id: "n-smb",
    setupEs: "Elegiste SMB.",
    output: "IPC$\ntmp  DISK\nusers listed: msfadmin",
    check: {
      id: "n-smb2",
      promptEs: "Now what?",
      choices: [
        { id: "share", textEs: "Entrar al share / listar más", ok: true, whyRightEs: "Users+shares son input. smbclient/smbmap." },
        { id: "hydra", textEs: "Hydra SSH con msfadmin ya", ok: true, whyRightEs: "Ahora SÍ hay usuario. Sigue siendo lab propio." },
        { id: "rand", textEs: "Exploit aleatorio de Samba", whyWrongEs: "Sin versión/módulo coincidente, no." },
      ],
      justifyPromptEs: "Why?",
      justifyKeywords: ["user", "share", "smb", "hydra", "msfadmin"],
      explanationEs: "El resultado cambió la estrategia: ahora hay user.",
      failKind: "reasoning",
      subtopicId: "smb-manual",
    },
    nextByChoice: { share: "end", hydra: "end", rand: "n-smb" },
  },
  "n-ftp": {
    id: "n-ftp",
    setupEs: "Elegiste FTP.",
    output: "Anonymous login allowed\n-rw-r--r-- note.txt",
    check: {
      id: "n-ftp2",
      promptEs: "Now what?",
      choices: [
        { id: "get", textEs: "Bajar note.txt y leer", ok: true, whyRightEs: "Evidencia. Puede dar users/paths." },
        { id: "msf", textEs: "vsftpd exploit sin versión", whyWrongEs: "Primero el archivo. La versión sale de -sV, no de adivinar." },
      ],
      justifyPromptEs: "Why?",
      justifyKeywords: ["note", "archivo", "enum", "leer", "anon"],
      explanationEs: "Anonymous + file = loot de enum, no exploit todavía.",
      failKind: "reasoning",
      subtopicId: "ftp-ssh-enum",
    },
    nextByChoice: { get: "end", msf: "n-ftp" },
  },
};
