import { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({
  open, onClose, title, children, wide,
}: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <dialog open aria-label={title} className="fixed inset-0 z-50 m-0 flex h-full w-full max-h-none max-w-none items-end justify-center bg-transparent p-0 text-foreground sm:items-center sm:p-6">
      <button type="button" aria-label="Fermer la fenêtre" tabIndex={-1} className="absolute inset-0 cursor-default bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${wide ? "sm:max-w-3xl" : "sm:max-w-lg"} max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-xl border border-border bg-card shadow-2xl`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur px-5 py-3">
          <h3 className="text-2xl font-extrabold leading-none">{title}</h3>
          <button onClick={onClose} aria-label="Fermer" className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </dialog>
  );
}
