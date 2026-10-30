import { useState } from "react";
import { Link } from "wouter";
import { Loader2, LogOut, MessageSquare, Package, ShoppingBag } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminCheck, useAdminOrders } from "../queries/shop";
import { AdminLogin } from "../components/admin/login";
import { ProductsTab } from "../components/admin/products-tab";
import { OrdersTab } from "../components/admin/orders-tab";
import { CommentsTab } from "../components/admin/comments-tab";
import { clearAdminToken } from "../lib/admin-token";

const tabs = [
  { id: "produits", label: "Produits", icon: Package },
  { id: "commandes", label: "Commandes", icon: ShoppingBag },
  { id: "commentaires", label: "Commentaires", icon: MessageSquare },
] as const;

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("produits");
  const orders = useAdminOrders();
  const fresh = orders.data?.filter((o) => o.status === "nouvelle").length ?? 0;
  return (
    <div className="mx-auto min-h-screen max-w-4xl px-5 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Administration</p>
          <h1 className="text-4xl font-black">Aina<span className="text-primary">Gara</span>Coréen</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-secondary">Voir le site</Link>
          <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-secondary"><LogOut className="size-4" />Quitter</button>
        </div>
      </div>
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`relative inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-bold transition ${tab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <Icon className="size-4" />{label}
            {id === "commandes" && fresh > 0 && <span className="rounded-full bg-white px-1.5 text-xs text-black">{fresh}</span>}
          </button>
        ))}
      </div>
      {tab === "produits" && <ProductsTab />}
      {tab === "commandes" && <OrdersTab />}
      {tab === "commentaires" && <CommentsTab />}
    </div>
  );
}

export default function AdminPage() {
  const check = useAdminCheck();
  const qc = useQueryClient();
  if (check.isLoading) return <div className="grid min-h-screen place-items-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  if (!check.data?.ok) return <AdminLogin onDone={() => check.refetch()} />;
  return <Dashboard onLogout={() => { clearAdminToken(); qc.clear(); check.refetch(); }} />;
}
