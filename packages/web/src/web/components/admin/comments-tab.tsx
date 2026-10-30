import { Loader2, MessageSquareOff, Trash2 } from "lucide-react";
import { useComments, useProducts, useRemoveComment } from "../../queries/shop";
import { Stars } from "../stars";
import { dateFr } from "../../lib/site";

export function CommentsTab() {
  const { data, isLoading } = useComments();
  const products = useProducts();
  const remove = useRemoveComment();
  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="size-7 animate-spin text-primary" /></div>;
  if (!data?.length) return <div className="grid place-items-center gap-2 rounded-xl border border-dashed border-border py-16 text-muted-foreground"><MessageSquareOff className="size-9" />Aucun commentaire.</div>;
  return (
    <ul className="space-y-2">
      {data.map((c) => {
        const prod = products.data?.find((p) => p.id === c.productId);
        return (
          <li key={c.id} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3"><b>{c.author}</b><Stars value={c.rating} size={14} /><span className="text-xs text-muted-foreground">{dateFr(c.createdAt)}</span></div>
              <p className="mt-0.5 text-xs text-primary">{prod ? `Sur : ${prod.name}` : "Avis général"}</p>
              <p className="mt-2 text-sm">{c.content}</p>
            </div>
            <button onClick={() => confirm("Supprimer ce commentaire ?") && remove.mutate({ id: c.id })} className="rounded-md border border-destructive/40 p-2 text-destructive hover:bg-destructive/10" aria-label="Supprimer"><Trash2 className="size-4" /></button>
          </li>
        );
      })}
    </ul>
  );
}
