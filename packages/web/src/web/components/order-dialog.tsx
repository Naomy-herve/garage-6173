import { useState } from "react";
import { CheckCircle2, Loader2, MessageCircle, Minus, Phone, Plus } from "lucide-react";
import { Modal } from "./modal";
import { useCreateOrder } from "../queries/shop";
import { SITE, money, tel, wa } from "../lib/site";

type P = { id: number; name: string; price: number; brand: string };

export function OrderDialog({ product, onClose }: { product: P | null; onClose: () => void }) {
  const create = useCreateOrder();
  const [qty, setQty] = useState(1);
  const [f, setF] = useState({ customerName: "", phone: "", email: "", address: "", message: "" });
  const [done, setDone] = useState<null | { id: number; text: string }>(null);
  const [error, setError] = useState("");

  const close = () => {
    setDone(null); setError(""); setQty(1); create.reset(); onClose();
  };
  if (!product) return null;
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const text =
      `Bonjour ${SITE.name}, je souhaite commander :\n` +
      `• ${product.name}${product.brand ? ` (${product.brand})` : ""} × ${qty}\n` +
      `• Total : ${money(product.price * qty)}\n\n` +
      `Nom : ${f.customerName}\nTéléphone : ${f.phone}` +
      (f.address ? `\nAdresse : ${f.address}` : "") +
      (f.message ? `\nMessage : ${f.message}` : "");
    create.mutate(
      { productId: product.id, quantity: qty, ...f },
      {
        onSuccess: (r) => setDone({ id: r.id, text }),
        onError: (err) => setError(err.message || "Impossible d'envoyer la commande."),
      },
    );
  };

  return (
    <Modal open onClose={close} title={done ? "Commande reçue" : "Passer commande"}>
      {done ? (
        <div className="space-y-5 text-center py-2">
          <CheckCircle2 className="mx-auto size-14 text-[#25d366]" />
          <div>
            <p className="text-lg font-bold">Merci {f.customerName} !</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Votre commande n°{done.id} est enregistrée. Nous vous contactons très vite pour confirmer.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <a href={wa(done.text)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#25d366] px-4 py-3 font-bold text-black hover:brightness-110">
              <MessageCircle className="size-5" /> Confirmer sur WhatsApp
            </a>
            <a href={tel} className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-3 font-bold hover:bg-secondary">
              <Phone className="size-5" /> Appeler {SITE.phoneDisplay}
            </a>
          </div>
          <button onClick={close} className="text-sm text-muted-foreground underline underline-offset-4">Fermer</button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3">
            <div className="min-w-0">
              <p className="truncate font-bold">{product.name}</p>
              <p className="text-sm text-primary font-semibold">{money(product.price)}</p>
            </div>
            <div className="flex items-center gap-1 rounded-md border border-border">
              <button type="button" aria-label="Moins" onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2 hover:bg-secondary"><Minus className="size-4" /></button>
              <span className="w-8 text-center font-bold tabular-nums">{qty}</span>
              <button type="button" aria-label="Plus" onClick={() => setQty((q) => Math.min(99, q + 1))} className="p-2 hover:bg-secondary"><Plus className="size-4" /></button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm"><span className="mb-1 block text-muted-foreground">Nom complet *</span>
              <input aria-label="Nom complet" required minLength={2} className="input" value={f.customerName} onChange={set("customerName")} autoComplete="name" /></label>
            <label className="block text-sm"><span className="mb-1 block text-muted-foreground">Téléphone *</span>
              <input aria-label="Téléphone" required minLength={8} type="tel" className="input" value={f.phone} onChange={set("phone")} autoComplete="tel" placeholder="03X XX XXX XX" /></label>
          </div>
          <label className="block text-sm"><span className="mb-1 block text-muted-foreground">Email (facultatif)</span>
            <input aria-label="Email (facultatif)" type="email" className="input" value={f.email} onChange={set("email")} autoComplete="email" /></label>
          <label className="block text-sm"><span className="mb-1 block text-muted-foreground">Adresse / quartier de livraison</span>
            <input aria-label="Adresse / quartier de livraison" className="input" value={f.address} onChange={set("address")} /></label>
          <label className="block text-sm"><span className="mb-1 block text-muted-foreground">Message (modèle de voiture, précisions…)</span>
            <textarea aria-label="Message (modèle de voiture, précisions…)" rows={3} className="input resize-none" value={f.message} onChange={set("message")} /></label>
          {error && <p className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">{error}</p>}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div><p className="text-xs uppercase tracking-wider text-muted-foreground">Total</p>
              <p className="font-display text-3xl font-extrabold text-primary">{money(product.price * qty)}</p></div>
            <button disabled={create.isPending} className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-bold text-primary-foreground hover:brightness-110 disabled:opacity-60">
              {create.isPending && <Loader2 className="size-4 animate-spin" />} Envoyer la commande
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
