export const PORT_HUNT: { port: number; service: string; proto: string; why: string; tool: string; keywords: string[] }[] = [
  { port: 21, service: "ftp", proto: "tcp", why: "anonymous / banners", tool: "ftp o nmap ftp-anon", keywords: ["ftp"] },
  { port: 22, service: "ssh", proto: "tcp", why: "login remoto", tool: "ssh / hydra si hay user", keywords: ["ssh"] },
  { port: 80, service: "http", proto: "tcp", why: "apps y dirs", tool: "curl / gobuster", keywords: ["http"] },
  { port: 139, service: "netbios", proto: "tcp", why: "SMB clásico", tool: "enum4linux", keywords: ["smb", "netbios"] },
  { port: 443, service: "https", proto: "tcp", why: "HTTP cifrado", tool: "igual que 80", keywords: ["https", "http"] },
  { port: 445, service: "smb", proto: "tcp", why: "shares/users", tool: "enum4linux / smbclient", keywords: ["smb"] },
  { port: 3306, service: "mysql", proto: "tcp", why: "datos", tool: "cliente mysql si hay creds", keywords: ["mysql", "sql"] },
  { port: 3389, service: "rdp", proto: "tcp", why: "Windows remoto", tool: "no en MS2 Linux", keywords: ["rdp"] },
];
