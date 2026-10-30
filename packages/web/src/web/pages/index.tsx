import { SiteHeader } from "../components/site-header";
import { Hero } from "../components/hero";
import { Services } from "../components/services";
import { ProductsSection } from "../components/products-section";
import { CommentsSection } from "../components/comments";
import { Contact } from "../components/contact";
import { SiteFooter } from "../components/site-footer";

export default function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Hero />
        <Services />
        <ProductsSection />
        <CommentsSection />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}
