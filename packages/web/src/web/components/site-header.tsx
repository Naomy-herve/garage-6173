import { useState } from "react";
import { Menu, MessageCircle, Phone, Wrench, X } from "lucide-react";
import { SITE, tel, wa } from "../lib/site";

const links = [
  ["Services", "#services"],
  ["Produits", "#produits"],
  ["Avis", "#avis"],
  ["Contact", "#contact"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground"><Wrench className="size-5" strokeWidth={2.5} /></span>
          <span className="font-display text-2xl font-black leading-none tracking-wide">Aina<span className="text-primary">Gara</span>Coréen</span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map(([l, h]) => <a key={h} href={h} className="text-sm font-semibold text-muted-foreground transition hover:text-foreground">{l}</a>)}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <a href={wa("Bonjour AinaGaraCoréen, ")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[#25d366] px-3.5 py-2 text-sm font-bold text-black hover:brightness-110"><MessageCircle className="size-4" />WhatsApp</a>
          <a href={tel} className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-sm font-bold text-primary-foreground hover:brightness-110"><Phone className="size-4" />{SITE.phoneDisplay}</a>
        </div>
        <button className="p-2 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="space-y-1 border-t border-white/10 bg-background px-5 pb-5 pt-3 md:hidden">
          {links.map(([l, h]) => <a key={h} href={h} onClick={() => setOpen(false)} className="block py-2.5 text-lg font-semibold">{l}</a>)}
          <div className="grid grid-cols-2 gap-2 pt-3">
            <a href={wa("Bonjour AinaGaraCoréen, ")} className="flex items-center justify-center gap-2 rounded-md bg-[#25d366] py-3 font-bold text-black"><MessageCircle className="size-4" />WhatsApp</a>
            <a href={tel} className="flex items-center justify-center gap-2 rounded-md bg-primary py-3 font-bold text-primary-foreground"><Phone className="size-4" />Appeler</a>
          </div>
        </div>
      )}
    </header>
  );
}
