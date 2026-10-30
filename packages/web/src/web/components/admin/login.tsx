import { useState } from "react";
import { Link } from "wouter";
import { Loader2, Lock, Wrench } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminLogin } from "../../queries/shop";
import { setAdminToken } from "../../lib/admin-token";

export function AdminLogin({ onDone }: { onDone: () => void }) {
  const login = useAdminLogin();
  const qc = useQueryClient();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ phone, code }, {
      onSuccess: ({ token }) => { setAdminToken(token); qc.invalidateQueries(); onDone(); },
    });
  };

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-7 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-md bg-primary text-primary-foreground"><Wrench /></span>
          <div><p className="font-display text-2xl font-black leading-none">Espace admin</p><p className="text-sm text-muted-foreground">AinaGaraCoréen</p></div>
        </div>
        <label className="block text-sm"><span className="mb-1 block text-muted-foreground">Numéro de téléphone</span>
          <input aria-label="Numéro de téléphone" required type="tel" inputMode="tel" autoComplete="username" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03X XX XXX XX" /></label>
        <label className="block text-sm"><span className="mb-1 block text-muted-foreground">Code unique</span>
          <input aria-label="Code unique" required type="password" autoComplete="current-password" className="input" value={code} onChange={(e) => setCode(e.target.value)} /></label>
        {login.isError && <p className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">{login.error.message}</p>}
        <button disabled={login.isPending} className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 font-bold text-primary-foreground hover:brightness-110 disabled:opacity-60">
          {login.isPending ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />} Se connecter
        </button>
        <Link to="/" className="block text-center text-sm text-muted-foreground underline-offset-4 hover:underline">← Retour au site</Link>
      </form>
    </div>
  );
}
