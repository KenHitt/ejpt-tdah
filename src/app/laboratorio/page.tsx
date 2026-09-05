"use client";

import Link from "next/link";
import { LAB_DOWNLOADS } from "@/content/lab-catalog";
import { labWeek } from "@/content/curriculum/lab-week";
import { Checklist } from "@/components/Checklist";

export default function LaboratorioPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs text-emerald-400">YOUR SETUP · Kali = host OS · VirtualBox = victims only</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Lab local (Kali en el disco, no en una VM)</h1>
        <p className="mt-2 text-sm text-slate-400">
          Tú arrancas el PC en <strong>Kali Linux</strong> (sistema principal). VirtualBox se abre <em>dentro</em> de Kali y solo
          corre Metasploitable 2 y Kioptrix. No instales Kali otra vez dentro de VirtualBox.
        </p>
      </div>

      <div className="rounded-lg border border-emerald-800/50 bg-emerald-500/5 p-4 text-sm">
        <p className="font-semibold text-emerald-400">One picture</p>
        <pre className="mt-2 overflow-x-auto font-mono text-xs text-emerald-200">{`[ Internet / WiFi ]
        │
 [ Kali Linux  ← you type nmap here ]   LHOST = vboxnet0 (often 192.168.56.1)
        │
 [ VirtualBox Host-Only  vboxnet0 ]
        ├── guest: Metasploitable 2    RHOSTS = 192.168.56.101
        └── guest: Kioptrix Level 1    RHOSTS = 192.168.56.102

 Docker on Kali: DVWA → http://127.0.0.1:4280`}</pre>
      </div>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-white">Haz esto en orden (no saltes)</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>
            VirtualBox → Network Manager → Host-Only → <span className="font-mono text-emerald-300">vboxnet0</span>
          </li>
          <li>
            Kali terminal: <span className="font-mono text-emerald-300">ip -br a | grep vboxnet</span> → escribe LHOST en{" "}
            <span className="font-mono">~/ejpt-lab.txt</span>
          </li>
          <li>Import Metasploitable 2 → Adapter 1 = Host-Only, NAT off → login msfadmin/msfadmin</li>
          <li>
            <span className="font-mono text-emerald-300">ping -c 3 &lt;IP_MS2&gt;</span> y{" "}
            <span className="font-mono text-emerald-300">nmap -sV -p21,445 &lt;IP_MS2&gt;</span>
          </li>
          <li>
            DVWA: <span className="font-mono text-emerald-300">docker run --rm -d --name dvwa -p 4280:80 vulnerables/web-dvwa</span>
          </li>
        </ol>
        <p className="mt-3 text-sm">
          Los clics exactos están en los bloques (45 min cada uno), no en esta página:
        </p>
        <ul className="mt-2 space-y-1">
          {labWeek.blocks.map((b) => (
            <li key={b.id}>
              <Link href={`/plan/${b.id}`} className="text-emerald-400 hover:underline">
                {b.title}
              </Link>
              {b.titleEn && <span className="ml-2 font-mono text-xs text-slate-500">{b.titleEn}</span>}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-white">Downloads</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Required</th>
                <th className="px-3 py-2">RAM</th>
                <th className="px-3 py-2">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {LAB_DOWNLOADS.map((d) => (
                <tr key={d.id}>
                  <td className="px-3 py-2 font-medium text-white">{d.name}</td>
                  <td className="px-3 py-2">{d.required ? "yes" : "extra"}</td>
                  <td className="px-3 py-2 text-slate-400">{d.ram}</td>
                  <td className="px-3 py-2">
                    <a href={d.url} className="text-emerald-400 hover:underline" target="_blank" rel="noreferrer">
                      download
                    </a>
                    <p className="mt-1 text-xs text-slate-500">{d.notesEs}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">Done when / Listo cuando</h2>
        <Checklist
          storageKey="lab-ready"
          items={[
            "Kali is the PC OS (not a VM)",
            "vboxnet0 exists; LHOST is in ~/ejpt-lab.txt",
            "ping from Kali host to Metasploitable 2 works",
            "DVWA opens on http://127.0.0.1:4280",
            "Kioptrix 1 has a different IP than MS2",
          ]}
        />
      </section>
    </div>
  );
}
