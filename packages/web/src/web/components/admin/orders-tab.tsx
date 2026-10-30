import { Loader2, Mail, MessageCircle, Phone, Trash2, Inbox } from "lucide-react";
import { useAdminOrders, useOrderActions } from "../../queries/shop";
import { dateFr, money } from "../../lib/site";

const STATUS = [
  ["nouvelle", "Nouvelle"],
  ["confirmee", "Confirmée"],
  ["livree", "Livrée"],
  ["annulee", "Annulée"],
] as const;
const color: Record<string, string> = {
  nouvelle: "bg-primary/15 text-primary", confirmee: "bg-accent/20 text-[#7b98ff]",
  livree: "bg-[#25d366]/15 text-[#25d366]", annulee: "bg-white/10 text-muted-foreground",
};

export function OrdersTab() {
  const { data, isLoading } = useAdminOrders();
  const { setStatus, remove } = useOrderActions();
  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="size-7 animate-spin text-primary" /></div>;
  if (!data?.length) return <div className="grid place-items-center gap-2 rounded-xl border border-dashed border-border py-16 text-muted-foreground"><Inbox className="size-9" />Aucune commande pour l'instant.</div>;
  return (
    <ul className="space-y-3">
      {data.map((o) => (
        <li key={o.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Commande n°{o.id} · {dateFr(o.createdAt)}</p>
              <p className="text-lg font-bold">{o.productName} <span className="text-muted-foreground">× {o.quantity}</span></p>
              <p className="font-display text-2xl font-extrabold text-primary">{money(o.unitPrice * o.quantity)}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${color[o.status]}`}>{o.status}</span>
          </div>
          <div className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
            <p><span className="text-muted-foreground">Client : </span><b>{o.customerName}</b></p>
            <p><span className="text-muted-foreground">Tél : </span>{o.phone}</p>
            {o.email && <p><span className="text-muted-foreground">Email : </span>{o.email}</p>}
            {o.address && <p><span className="text-muted-foreground">Adresse : </span>{o.address}</p>}
          </div>
          {o.message && <p className="mt-2 rounded-md bg-background p-2.5 text-sm">{o.message}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <select value={o.status} onChange={(e) => setStatus.mutate({ id: o.id, status: e.target.value as (typeof STATUS)[number][0] })}
              className="input !w-auto !py-2 text-sm">
              {STATUS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <a href={`tel:${o.phone}`} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-secondary"><Phone className="size-4" />Appeler</a>
            <a href={`https://wa.me/${o.phone.replace(/[^\d]/g, "").replace(/^0/, "261")}?text=${encodeURIComponent(`Bonjour ${o.customerName}, au sujet de votre commande n°${o.id} (${o.productName}) chez AinaGaraCoréen.`)}`} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#25d366] px-3 py-2 text-sm font-bold text-black"><MessageCircle className="size-4" />WhatsApp</a>
            {o.email && <a href={`mailto:${o.email}`} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-secondary"><Mail className="size-4" />Email</a>}
            <button onClick={() => confirm("Supprimer cette commande ?") && remove.mutate({ id: o.id })} className="ml-auto rounded-md border border-destructive/40 p-2 text-destructive hover:bg-destructive/10" aria-label="Supprimer"><Trash2 className="size-4" /></button>
          </div>
        </li>
      ))}
    </ul>
  );
}
