import { useState } from "react";
import { Mail, MessageCircle, Phone, Send } from "lucide-react";
import { SITE, mailto, tel, wa } from "../lib/site";

export function Contact() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const text = `Bonjour AinaGaraCoréen, c'est ${name || "…"}.\n${msg}`;
  const ready = name.trim().length > 1 && msg.trim().length > 1;

  const card = "flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition hover:border-primary/60";
  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-20">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Contact</p>
      <h2 className="mb-10 text-4xl font-extrabold sm:text-6xl">Parlons de votre voiture</h2>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <a href={tel} className={card}><span className="grid size-12 place-items-center rounded-lg bg-primary/15 text-primary"><Phone /></span>
            <span><span className="block text-xs uppercase tracking-widest text-muted-foreground">Appeler</span><span className="font-display text-3xl font-extrabold">{SITE.phoneDisplay}</span></span></a>
          <a href={wa("Bonjour AinaGaraCoréen, ")} target="_blank" rel="noreferrer" className={card}><span className="grid size-12 place-items-center rounded-lg bg-[#25d366]/15 text-[#25d366]"><MessageCircle /></span>
            <span><span className="block text-xs uppercase tracking-widest text-muted-foreground">WhatsApp</span><span className="font-display text-3xl font-extrabold">Écrire maintenant</span></span></a>
          <a href={mailto("Demande AinaGaraCoréen")} className={card}><span className="grid size-12 place-items-center rounded-lg bg-accent/20 text-[#7b98ff]"><Mail /></span>
            <span className="min-w-0"><span className="block text-xs uppercase tracking-widest text-muted-foreground">Email</span><span className="block truncate text-lg font-bold">{SITE.email}</span></span></a>
        </div>
        <div className="space-y-3 rounded-xl border border-border bg-card p-6">
          <p className="font-display text-2xl font-extrabold">Envoyer un message</p>
          <input className="input" aria-label="Votre nom" placeholder="Votre nom" value={name} onChange={(e) => setName(e.target.value)} />
          <textarea className="input resize-none" rows={4} aria-label="Votre voiture, la panne, votre question…" placeholder="Votre voiture, la panne, votre question…" value={msg} onChange={(e) => setMsg(e.target.value)} />
          <div className="grid gap-2 sm:grid-cols-2">
            <a aria-disabled={!ready} href={ready ? wa(text) : undefined} target="_blank" rel="noreferrer"
              className={`inline-flex items-center justify-center gap-2 rounded-md bg-[#25d366] px-4 py-3 font-bold text-black ${ready ? "hover:brightness-110" : "pointer-events-none opacity-40"}`}><Send className="size-4" />Par WhatsApp</a>
            <a aria-disabled={!ready} href={ready ? mailto(`Message de ${name}`, msg) : undefined}
              className={`inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-3 font-bold ${ready ? "hover:bg-secondary" : "pointer-events-none opacity-40"}`}><Mail className="size-4" />Par email</a>
          </div>
        </div>
      </div>
    </section>
  );
}
