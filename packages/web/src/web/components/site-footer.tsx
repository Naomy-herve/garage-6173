import { Link } from "wouter";
import { SITE } from "../lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} {SITE.name} — Mécanique automobile & pièces.</p>
        <Link to="/admin" className="underline-offset-4 hover:text-foreground hover:underline">Espace administrateur</Link>
      </div>
    </footer>
  );
}
