import { useState } from "react";
import { Loader2, Quote } from "lucide-react";
import { Stars } from "./stars";
import { useComments, useCreateComment } from "../queries/shop";
import { dateFr } from "../lib/site";

export function CommentForm({ productId = null, compact }: { productId?: number | null; compact?: boolean }) {
  const create = useCreateComment();
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate({ productId, author, content, rating }, {
      onSuccess: () => { setContent(""); setSent(true); setTimeout(() => setSent(false), 4000); },
    });
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="font-display text-xl font-extrabold">Laisser un commentaire</p>
        <Stars value={rating} onChange={setRating} size={20} />
      </div>
      <input required minLength={2} className="input" aria-label="Votre nom" placeholder="Votre nom" value={author} onChange={(e) => setAuthor(e.target.value)} />
      <textarea required minLength={2} rows={compact ? 2 : 3} className="input resize-none" aria-label="Votre avis sur notre service ou ce produit…" placeholder="Votre avis sur notre service ou ce produit…" value={content} onChange={(e) => setContent(e.target.value)} />
      {create.isError && <p className="text-sm text-destructive">{create.error.message}</p>}
      {sent && <p className="text-sm text-[#25d366]">Merci ! Votre commentaire est publié.</p>}
      <button disabled={create.isPending} className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-bold text-primary-foreground hover:brightness-110 disabled:opacity-60">
        {create.isPending && <Loader2 className="size-4 animate-spin" />} Publier
      </button>
    </form>
  );
}

export function CommentList({ productId, limit }: { productId?: number | null; limit?: number }) {
  const { data, isLoading } = useComments();
  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  let list = data ?? [];
  if (productId !== undefined) list = list.filter((c) => c.productId === productId);
  if (limit) list = list.slice(0, limit);
  if (!list.length) return <p className="py-4 text-sm text-muted-foreground">Aucun commentaire pour l'instant. Soyez le premier !</p>;
  return (
    <ul className="space-y-3">
      {list.map((c) => (
        <li key={c.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-primary/15 font-display text-lg font-extrabold text-primary">{c.author.charAt(0).toUpperCase()}</span>
              <div><p className="font-bold leading-tight">{c.author}</p><p className="text-xs text-muted-foreground">{dateFr(c.createdAt)}</p></div>
            </div>
            <Stars value={c.rating} />
          </div>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-foreground/90">{c.content}</p>
        </li>
      ))}
    </ul>
  );
}

export function CommentsSection() {
  return (
    <section id="avis" className="mx-auto max-w-6xl px-5 py-20">
      <div className="mb-10 flex items-end gap-4">
        <Quote className="size-10 text-primary" />
        <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Avis clients</p>
          <h2 className="text-4xl font-extrabold sm:text-5xl">Ils nous font confiance</h2></div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <CommentList productId={null} limit={8} />
        <div className="lg:sticky lg:top-24 self-start"><CommentForm /></div>
      </div>
    </section>
  );
}
