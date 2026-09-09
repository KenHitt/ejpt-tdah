/** Objetivos públicos INE (resumen) → skills y piezas de evidencia en la academia.
 * No afirma que esta app sea el examen oficial.
 */
export interface EjptObjectiveDetail {
  domain: string;
  objective: string;
  skillIds: string[];
  hrefs: string[];
}

export const EJPT_OBJECTIVE_DETAIL: EjptObjectiveDetail[] = [
  {
    domain: "Assessment Methodologies",
    objective: "Locate endpoints / identify ports and services",
    skillIds: ["recon", "nmap", "networking"],
    hrefs: ["/clase/c01-d2", "/train/decisions", "/learn/port-scan"],
  },
  {
    domain: "Assessment Methodologies",
    objective: "Identify OS and technical data from the surface",
    skillIds: ["nmap", "linux", "enumeration"],
    hrefs: ["/clase/c01-d3", "/train/10min"],
  },
  {
    domain: "Assessment Methodologies",
    objective: "Public / company / email information (in-scope only)",
    skillIds: ["osint", "recon"],
    hrefs: ["/learn/whois-dns", "/train/decisions"],
  },
  {
    domain: "Assessment Methodologies",
    objective: "Vulnerability identification and impact (hypothesis, not a scanner score)",
    skillIds: ["vuln", "reporting"],
    hrefs: ["/clase/c04-d1", "/learn/cve-select"],
  },
  {
    domain: "Host & Networking Auditing",
    objective: "Information from files, network and system",
    skillIds: ["linux", "post", "networking"],
    hrefs: ["/clase/c00-d5", "/clase/c08-d4"],
  },
  {
    domain: "Host & Networking Auditing",
    objective: "User accounts, file transfer, hashes/passwords (lab)",
    skillIds: ["linux", "smb", "post", "ssh-ftp"],
    hrefs: ["/clase/c02-d2", "/clase/c02-d4", "/learn/win-hash-concept"],
  },
  {
    domain: "Host & Network Penetration Testing",
    objective: "Identify / modify exploits; Metasploit; manual options",
    skillIds: ["vuln", "metasploit", "exploit-mod", "exploitation"],
    hrefs: ["/learn/exploit-placeholders", "/learn/poc-read-lab", "/clase/c03-d2"],
  },
  {
    domain: "Host & Network Penetration Testing",
    objective: "Pivoting, routing, port forwarding",
    skillIds: ["pivoting", "networking"],
    hrefs: ["/clase/c07-d1", "/operaciones/m08"],
  },
  {
    domain: "Host & Network Penetration Testing",
    objective: "Brute force and hash cracking (lab, with a user/hash in hand)",
    skillIds: ["ssh-ftp", "web", "post"],
    hrefs: ["/clase/c02-d6", "/train/15min"],
  },
  {
    domain: "Web Application Penetration Testing",
    objective: "Web recon, hidden files/directories, login brute force",
    skillIds: ["http-enum", "web"],
    hrefs: ["/clase/c02-d3", "/learn/http-json", "/train/transfer"],
  },
  {
    domain: "Web Application Penetration Testing",
    objective: "Common web vulnerabilities (SQLi / XSS / LFI class)",
    skillIds: ["sqli", "xss", "lfi", "web"],
    hrefs: ["/clase/c05-d2", "/learn/sqli", "/operaciones/m04"],
  },
];

export function detailsForSkill(skillId: string) {
  return EJPT_OBJECTIVE_DETAIL.filter((d) => d.skillIds.includes(skillId));
}

export function detailsForDomain(domain: string) {
  return EJPT_OBJECTIVE_DETAIL.filter((d) => d.domain === domain);
}
