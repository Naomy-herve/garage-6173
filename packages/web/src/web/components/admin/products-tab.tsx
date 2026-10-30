import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2, PackageOpen } from "lucide-react";
import { useProducts, useSaveProduct } from "../../queries/shop";
import { ProductForm, emptyProduct, type EditProduct } from "./product-form";
import { money } from "../../lib/site";

export function ProductsTab() {
  const { data, isLoading } = useProducts();
  const { remove } = useSaveProduct();
  const [editing, setEditing] = useState<EditProduct | null>(null);

  const del = (id: number, name: string) => {
    if (confirm(`Supprimer « ${name} » ? Cette action est définitive.`)) remove.mutate({ id });
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-muted-foreground">{data?.length ?? 0} produit(s)</p>
        <button onClick={() => setEditing(emptyProduct)} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 font-bold text-primary-foreground hover:brightness-110">
          <Plus className="size-4" /> Ajouter un produit
        </button>
      </div>
      {isLoading ? <div className="flex justify-center py-16"><Loader2 className="size-7 animate-spin text-primary" /></div>
        : !data?.length ? <div className="grid place-items-center gap-2 rounded-xl border border-dashed border-border py-16 text-muted-foreground"><PackageOpen className="size-9" />Aucun produit.</div>
        : (
          <ul className="space-y-2">
            {data.map((p) => (
              <li key={p.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-3">
                <div className="size-16 shrink-0 overflow-hidden rounded-md bg-background">{p.image && <img src={p.image} alt="" className="size-full object-cover" />}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.brand || "—"} · <span className="font-semibold text-primary">{money(p.price)}</span></p>
                </div>
                <button onClick={() => setEditing(p)} className="rounded-md border border-border p-2.5 hover:bg-secondary" aria-label="Modifier"><Pencil className="size-4" /></button>
                <button onClick={() => del(p.id, p.name)} disabled={remove.isPending} className="rounded-md border border-destructive/40 p-2.5 text-destructive hover:bg-destructive/10" aria-label="Supprimer"><Trash2 className="size-4" /></button>
              </li>
            ))}
          </ul>
        )}
      {editing && <ProductForm key={editing.id ?? "new"} initial={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
