import { CarFront, CircleGauge, Droplets, Cog, Zap, Disc3 } from "lucide-react";

const services = [
  { icon: CircleGauge, title: "Diagnostic", text: "Lecture électronique des codes défauts et contrôle complet avant toute intervention." },
  { icon: Droplets, title: "Vidange & entretien", text: "Huile, filtres, liquides : l'entretien régulier qui prolonge la vie du moteur." },
  { icon: Disc3, title: "Freinage", text: "Plaquettes, disques, étriers et purge du circuit pour freiner en toute sécurité." },
  { icon: CarFront, title: "Suspension & train", text: "Amortisseurs, rotules, géométrie : retrouvez confort et tenue de route." },
  { icon: Cog, title: "Moteur & distribution", text: "Courroie, embrayage, joints : réparations mécaniques lourdes et précises." },
  { icon: Zap, title: "Électricité auto", text: "Batterie, démarreur, alternateur, éclairage : tout le circuit électrique." },
];

export function Services() {
  return (
    <section id="services" className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Atelier</p>
        <h2 className="mb-10 text-4xl font-extrabold sm:text-6xl">Ce que nous réparons</h2>
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="group relative bg-background p-7 transition hover:bg-card">
              <span className="absolute right-5 top-4 font-display text-5xl font-black text-white/[0.04]">0{i + 1}</span>
              <Icon className="mb-5 size-8 text-primary" strokeWidth={1.75} />
              <h3 className="text-2xl font-extrabold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
