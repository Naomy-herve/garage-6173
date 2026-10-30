import { MessageCircle, Phone, ShoppingCart } from "lucide-react";
import { Modal } from "./modal";
import { CommentForm, CommentList } from "./comments";
import { money, tel, wa } from "../lib/site";

type P = { id: number; name: string; brand: string; image: string; price: number; detail: string; usage: string };

export function ProductDialog({ product, onClose, onOrder }: { product: P | null; onClose: () => void; onOrder: (p: P) => void }) {
  if (!product) return null;
  return (
    <Modal open onClose={onClose} title={product.name} wide>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-lg bg-background">
          {product.image && <img src={product.image} alt={product.name} className="size-full object-cover" />}
        </div>
        <div className="flex flex-col">
          {product.brand && <span className="mb-2 w-fit rounded bg-secondary px-2 py-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">{product.brand}</span>}
          <p className="font-display text-5xl font-extrabold text-primary">{money(product.price)}</p>
          {product.detail && <><h4 className="mt-5 text-sm font-bold uppercase tracking-widest text-muted-foreground">Détails</h4>
            <p className="mt-1 leading-relaxed">{product.detail}</p></>}
          {product.usage && <><h4 className="mt-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">Utilité</h4>
            <p className="mt-1 leading-relaxed">{product.usage}</p></>}
          <div className="mt-6 grid gap-2">
            <button onClick={() => onOrder(product)} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-bold text-primary-foreground hover:brightness-110">
              <ShoppingCart className="size-5" /> Commander
            </button>
            <div className="grid grid-cols-2 gap-2">
              <a href={wa(`Bonjour, je suis intéressé par : ${product.name} (${money(product.price)}).`)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#25d366] px-3 py-2.5 text-sm font-bold text-black hover:brightness-110">
                <MessageCircle className="size-4" /> WhatsApp
              </a>
              <a href={tel} className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2.5 text-sm font-bold hover:bg-secondary">
                <Phone className="size-4" /> Appeler
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-6">
        <h4 className="mb-4 font-display text-2xl font-extrabold">Avis sur ce produit</h4>
        <div className="space-y-4">
          <CommentList productId={product.id} />
          <CommentForm productId={product.id} compact />
        </div>
      </div>
    </Modal>
  );
}
