import { motion } from "motion/react";
import { ArrowDown, MessageCircle, Phone } from "lucide-react";
import { SITE, tel, wa } from "../lib/site";

const item = (i: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-end overflow-hidden grain">
      <img src="/images/hero.jpg" alt="Atelier de mécanique AinaGaraCoréen" className="absolute inset-0 -z-20 size-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/75 to-background/10" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-background to-transparent" />
      <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-32">
        <motion.p {...item(0)} className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          <span className="size-1.5 rounded-full bg-primary" /> Spécialiste voitures coréennes
        </motion.p>
        <motion.h1 {...item(1)} className="max-w-3xl text-[clamp(3.5rem,11vw,9rem)] font-black leading-[0.86]">
          Votre auto,<br /><span className="text-primary">entre de bonnes</span><br />mains.
        </motion.h1>
        <motion.p {...item(2)} className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/80">
          Diagnostic, entretien, réparation et pièces d'origine pour Hyundai, Kia, SsangYong et Daewoo. Commandez vos pièces en ligne ou appelez directement l'atelier.
        </motion.p>
        <motion.div {...item(3)} className="mt-8 flex flex-wrap gap-3">
          <a href="#produits" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 font-bold text-primary-foreground hover:brightness-110">Voir les produits <ArrowDown className="size-4" /></a>
          <a href={tel} className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-black/30 px-6 py-3.5 font-bold backdrop-blur hover:bg-white/10"><Phone className="size-4" />{SITE.phoneDisplay}</a>
          <a href={wa("Bonjour AinaGaraCoréen, ")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[#25d366] px-6 py-3.5 font-bold text-black hover:brightness-110"><MessageCircle className="size-4" />WhatsApp</a>
        </motion.div>
      </div>
    </section>
  );
}
