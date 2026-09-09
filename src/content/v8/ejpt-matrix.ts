/** Relación objetivos oficiales eJPT (dominios públicos INE) → evidencia de la academia.
 * No afirma que INE certifique esta app. GAP = dominio sin lab/quiz/drill asociado.
 */
export interface EjptObjectiveRow {
  domain: string;
  official: string;
  skillIds: string[];
  evidence: string[];
  gap: boolean;
}

export const EJPT_OBJECTIVE_MATRIX: EjptObjectiveRow[] = [
  {
    domain: "Assessment Methodologies",
    official: "Scoping, methodology, reporting mindset",
    skillIds: ["lab", "recon", "reporting", "exam-prep", "osint"],
    evidence: ["/laboratorio", "/clase", "/simulacro", "/operaciones/m01"],
    gap: false,
  },
  {
    domain: "Host & Network Auditing",
    official: "Host discovery, port/service identification, OS/network audit",
    skillIds: ["networking", "linux", "nmap", "enumeration", "smb", "http-enum", "ssh-ftp"],
    evidence: ["/clase/c01-d2", "/train/decisions", "/memory"],
    gap: false,
  },
  {
    domain: "Host & Network Penetration Testing",
    official: "Exploitation, transfer, pivoting, privesc (lab)",
    skillIds: ["vuln", "metasploit", "exploitation", "exploit-mod", "post", "privesc-linux", "privesc-windows", "pivoting", "chains"],
    evidence: ["/clase/c03-d1", "/operaciones/m05", "/operaciones/m08"],
    gap: false,
  },
  {
    domain: "Web Application Penetration Testing",
    official: "HTTP, common web vulns in a lab (SQLi/XSS/LFI class)",
    skillIds: ["web", "sqli", "xss", "lfi", "http-enum"],
    evidence: ["/clase/c05-d2", "/learn/sqli", "/operaciones/m04"],
    gap: false,
  },
];
