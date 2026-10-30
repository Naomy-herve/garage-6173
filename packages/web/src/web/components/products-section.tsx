import { useMemo, useState } from "react";
import { Loader2, PackageOpen, Search, ShoppingCart } from "lucide-react";
import { useProducts } from "../queries/shop";
import { ProductDialog } from "./product-dialog";
import { OrderDialog } from "./order-dialog";
import { money } from "../lib/site";

type P = NonNullable<ReturnType<typeof useProducts>["data"]>[number];

export function ProductsSection() {
  const { data, isLoading, isError } = useProducts();
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("");
  const [view, setView] = useState<P | null>(null);
  const [order, setOrder] = useState<P | null>(null);

  const brands = useMemo(() => [...new Set((data ?? []).map((p) => p.brand).filter(Boolean))].sort(), [data]);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (data ?? []).filter(
      (p) => (!brand || p.brand === brand) && (!s || `${p.name} ${p.brand} ${p.usage} ${p.detail}`.toLowerCase().includes(s)),
    );
  }, [data, q, brand]);

  return (
    <section id="produits" className="mx-auto max-w-6xl px-5 py-20">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Boutique</p>
          <h2 className="text-4xl font-extrabold sm:text-6xl">Pièces & produits</h2>
          <p className="mt-2 max-w-md text-muted-foreground">Des pièces fiables pour voitures coréennes. Cliquez pour voir le détail, puis commandez en deux minutes.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une pièce…" className="input pl-9" aria-label="Rechercher" />
        </div>
      </div>

      {brands.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {["", ...brands].map((b) => (
            <button key={b || "all"} onClick={() => setBrand(b)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${brand === b ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"}`}>
              {b || "Toutes les marques"}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-primary" /></div>
      ) : isError ? (
        <p className="py-20 text-center text-destructive">Impossible de charger les produits. Réessayez.</p>
      ) : list.length === 0 ? (
        <div className="grid place-items-center gap-3 rounded-xl border border-dashed border-border py-20 text-muted-foreground">
          <PackageOpen className="size-10" /><p>Aucun produit trouvé.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => (
            <article key={p.id} className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/60">
              <button onClick={() => setView(p)} className="relative block aspect-square overflow-hidden bg-background text-left" aria-label={`Voir ${p.name}`}>
                {p.image ? <img src={p.image} alt={p.name} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
                  : <div className="grid size-full place-items-center text-muted-foreground"><PackageOpen className="size-10" /></div>}
                {p.brand && <span className="absolute left-3 top-3 rounded bg-black/70 px-2 py-1 text-[0.7rem] font-bold uppercase tracking-widest backdrop-blur">{p.brand}</span>}
              </button>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-xl font-extrabold leading-tight">{p.name}</h3>
                {p.usage && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.usage}</p>}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-3 pt-4">
                  <span className="whitespace-nowrap font-display text-2xl font-extrabold text-primary">{money(p.price)}</span>
                  <button onClick={() => setOrder(p)} className="inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-primary px-3 py-2 text-sm font-bold text-primary-foreground hover:brightness-110">
                    <ShoppingCart className="size-4" /> Commander
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ProductDialog product={view} onClose={() => setView(null)} onOrder={(p) => { setView(null); setOrder(p); }} />
      <OrderDialog product={order} onClose={() => setOrder(null)} />
    </section>
  );
}
