"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useSupabaseSession } from "@/lib/supabase/useSession";

export default function LoginPage() {
  const { user } = useSupabaseSession();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-md space-y-4 rounded-lg border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-300">
        <h1 className="text-xl font-bold text-white">Supabase no está configurado</h1>
        <p>
          Tu progreso se está guardando en <strong>localStorage</strong> (funciona perfecto para uso local). Para sincronizar en la
          nube y no perder tu progreso al cambiar de dispositivo, configura las variables de entorno de Supabase — instrucciones en
          el <code className="rounded bg-slate-800 px-1">README.md</code> del proyecto.
        </p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="mx-auto max-w-md space-y-4 rounded-lg border border-emerald-800/50 bg-emerald-500/5 p-6 text-sm text-slate-200">
        <h1 className="text-xl font-bold text-white">Sesión activa</h1>
        <p>
          Conectado como <strong>{user.email}</strong>. Tu progreso se sincroniza automáticamente con Supabase.
        </p>
        <button
          onClick={() => getSupabaseBrowserClient()?.auth.signOut()}
          className="rounded-md bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-lg border border-slate-800 bg-slate-900/40 p-6">
      <h1 className="text-xl font-bold text-white">Iniciar sesión</h1>
      <p className="text-sm text-slate-400">
        Recibirás un link mágico por correo (sin contraseña). Al iniciar sesión, tu progreso se sincroniza en Supabase.
      </p>
      {sent ? (
        <p className="text-sm text-emerald-400">✔ Revisa tu correo ({email}) y haz click en el link para entrar.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
          />
          <button type="submit" className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
            Enviar link mágico
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </form>
      )}
    </div>
  );
}
