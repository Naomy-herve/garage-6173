import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { Modal } from "../modal";
import { client } from "../../lib/api";
import { useSaveProduct } from "../../queries/shop";

export type EditProduct = { id?: number; name: string; brand: string; image: string; price: number; detail: string; usage: string };
export const emptyProduct: EditProduct = { name: "", brand: "", image: "", price: 0, detail: "", usage: "" };

export function ProductForm({ initial, onClose }: { initial: EditProduct | null; onClose: () => void }) {
  const { create, update } = useSaveProduct();
  const [f, setF] = useState<EditProduct>(initial ?? emptyProduct);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  if (!initial) return null;
  const pending = create.isPending || update.isPending;
  const set = (k: keyof EditProduct) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: k === "price" ? Number(e.target.value) : e.target.value }));

  const onFile = async (file?: File) => {
    if (!file) return;
    setError(""); setUploading(true);
    try {
      if (file.size > 8 * 1024 * 1024) throw new Error("Image trop lourde (max 8 Mo).");
      const { url, publicUrl } = await client.upload.presign({ filename: file.name, contentType: file.type });
      const res = await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type, "x-amz-acl": "public-read" } });
      if (!res.ok) throw new Error("Échec de l'envoi de l'image.");
      setF((s) => ({ ...s, image: publicUrl }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'envoi.");
    } finally { setUploading(false); }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const opts = { onSuccess: onClose, onError: (err: Error) => setError(err.message) };
    if (f.id) update.mutate({ ...f, id: f.id }, opts);
    else create.mutate(f, opts);
  };

  return (
    <Modal open onClose={onClose} title={f.id ? "Modifier le produit" : "Ajouter un produit"} wide>
      <form onSubmit={submit} className="grid gap-5 md:grid-cols-[220px_1fr]">
        <div>
          <div className="aspect-square overflow-hidden rounded-lg border border-dashed border-border bg-background">
            {f.image ? <img src={f.image} alt="" className="size-full object-cover" /> : <div className="grid size-full place-items-center text-muted-foreground"><ImagePlus className="size-8" /></div>}
          </div>
          <input aria-label="Fichier image" ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-border py-2 text-sm font-bold hover:bg-secondary disabled:opacity-60">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />} {f.image ? "Changer l'image" : "Choisir une image"}
          </button>
          <input className="input mt-2 text-xs" aria-label="ou coller un lien d'image" placeholder="ou coller un lien d'image" value={f.image} onChange={set("image")} />
        </div>
        <div className="space-y-3">
          <label className="block text-sm"><span className="mb-1 block text-muted-foreground">Nom du produit *</span>
            <input aria-label="Nom du produit" required className="input" value={f.name} onChange={set("name")} /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm"><span className="mb-1 block text-muted-foreground">Marque</span>
              <input aria-label="Marque" className="input" value={f.brand} onChange={set("brand")} /></label>
            <label className="block text-sm"><span className="mb-1 block text-muted-foreground">Prix (Ar) *</span>
              <input aria-label="Prix (Ar)" required type="number" min={0} step={500} className="input" value={f.price} onChange={set("price")} /></label>
          </div>
          <label className="block text-sm"><span className="mb-1 block text-muted-foreground">Détail</span>
            <textarea aria-label="Détail" rows={3} className="input resize-none" value={f.detail} onChange={set("detail")} /></label>
          <label className="block text-sm"><span className="mb-1 block text-muted-foreground">Utilité</span>
            <textarea aria-label="Utilité" rows={3} className="input resize-none" value={f.usage} onChange={set("usage")} /></label>
          {error && <p className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2.5 font-semibold hover:bg-secondary">Annuler</button>
            <button disabled={pending || uploading} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-bold text-primary-foreground hover:brightness-110 disabled:opacity-60">
              {pending && <Loader2 className="size-4 animate-spin" />} Enregistrer
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
