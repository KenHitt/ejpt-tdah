"use client";

import Link from "next/link";
import { LAB_DOWNLOADS } from "@/content/lab-catalog";
import { labWeek } from "@/content/curriculum/lab-week";
import { Checklist } from "@/components/Checklist";
import { WorkshopView } from "@/components/WorkshopView";
import { TroubleshootingList } from "@/components/TroubleshootingList";
import { LAB_TROUBLESHOOTING, LAB_WORKSHOP, LAB_HOST_DIAGRAM } from "@/content/workshops/lab-virtualbox";

export default function LaboratorioPage() {
  const b1 = labWeek.blocks[0];

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs text-emerald-400">WORKSHOP · Kali = host OS · VirtualBox = victims only</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Construcción del laboratorio de pentesting</h1>
        <p className="mt-2 text-sm text-slate-400">
          Solo máquinas propias / VMs educativas. Kali es el SO de este PC. No clones Kali dentro de VirtualBox. El taller
          explica el porqué; los bloques de 50 min demuestran que funciona.
        </p>
      </div>

      <div className="rounded-lg border border-emerald-800/50 bg-emerald-500/5 p-4 text-sm">
        <p className="font-semibold text-emerald-400">Tu setup (no el de un tutorial con Kali-VM)</p>
        <pre className="mt-2 overflow-x-auto font-mono text-[11px] leading-snug text-emerald-200">{LAB_HOST_DIAGRAM}</pre>
      </div>

      <WorkshopView sections={LAB_WORKSHOP} />
      <TroubleshootingList items={LAB_TROUBLESHOOTING} />

      <section>
        <h2 className="mb-2 text-lg font-semibold text-white">Demostrar (Focus, no solo leer)</h2>
        <p className="mb-2 text-sm text-slate-400">
          Empieza por el bloque 1. Recall + checklist. Completar ≠ haber abierto esta página.
        </p>
        <ul className="space-y-1">
          {labWeek.blocks.map((b) => (
            <li key={b.id}>
              <Link href={`/focus/${b.id}`} className="text-emerald-400 hover:underline">
                Focus: {b.title}
              </Link>
              <span className="text-slate-500"> · </span>
              <Link href={`/plan/${b.id}`} className="text-xs text-slate-400 hover:underline">
                plan
              </Link>
            </li>
          ))}
        </ul>
        {b1 && (
          <p className="mt-2 text-xs text-slate-500">
            Checkpoint bloque 1: Kali UP, víctima (bloque 2), Host-Only, vboxnet0, LHOST, RHOST, ping, NAT/Bridged/HO.
          </p>
        )}
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
        <h2 className="mb-2 text-lg font-semibold text-white">Después del lab: Linux mínimo (antes de Nmap)</h2>
        <p className="mb-2 text-sm text-slate-400">
          Filesystem, permisos, pipes, SSH a MS2. No es sysadmin. Focus de los bloques 6 y 7.
        </p>
        <ul className="space-y-1 text-sm">
          <li>
            <Link href="/focus/m0-w0-b6" className="text-emerald-400 hover:underline">
              Focus: Linux mínimo 1
            </Link>
          </li>
          <li>
            <Link href="/focus/m0-w0-b7" className="text-emerald-400 hover:underline">
              Focus: Linux mínimo 2 (SSH)
            </Link>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-white">Luego: redes mínimas (antes de Nmap)</h2>
        <p className="mb-2 text-sm text-slate-400">
          IPv4, /24, LHOST, TCP/UDP, puertos 22/80/445. No es CCNA. Bloques 8 y 9.
        </p>
        <ul className="space-y-1 text-sm">
          <li>
            <Link href="/focus/m0-w0-b8" className="text-emerald-400 hover:underline">
              Focus: Redes mínimas 1
            </Link>
          </li>
          <li>
            <Link href="/focus/m0-w0-b9" className="text-emerald-400 hover:underline">
              Focus: Redes mínimas 2 (puertos)
            </Link>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-white">Después: Nmap Semana 1 (tu MS2)</h2>
        <p className="mb-2 text-sm text-slate-400">
          Taller de flags (WHAT/WHY/WHEN/OUTPUT/NEXT) en Plan. Focus solo da un paso y recall. No escanées la LAN de casa.
        </p>
        <ul className="space-y-1 text-sm">
          <li>
            <Link href="/focus/m1-w1-b1" className="text-emerald-400 hover:underline">
              Focus: Host discovery (-sn, -p-, -sV, -oA)
            </Link>
            <span className="text-slate-500"> · </span>
            <Link href="/plan/m1-w1-b1" className="text-xs text-slate-400 hover:underline">
              taller
            </Link>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">Lab listo cuando</h2>
        <Checklist
          storageKey="lab-ready"
          items={[
            "Kali is the PC OS (not a VM)",
            "vboxnet0 UP; LHOST in ~/ejpt-lab.txt",
            "I can explain NAT vs Bridged vs Host-Only",
            "ping from Kali host to Metasploitable 2 works",
            "TARGET_MS2 is not equal to LHOST",
            "DVWA opens on http://127.0.0.1:4280",
            "I can SSH to MS2 as msfadmin and exit back to Kali",
            "I can tell Permission denied from No such file",
            "I can explain /24 and write LHOST from vboxnet0 (not wlan0)",
            "I know 22=SSH, 80=HTTP, 445=SMB and ping ≠ HTTP",
          ]}
        />
      </section>
    </div>
  );
}
