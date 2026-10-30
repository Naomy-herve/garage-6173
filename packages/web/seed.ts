import { db } from "./src/api/database";
import * as schema from "./src/api/database/schema";

const existing = await db.select().from(schema.products);
if (existing.length > 0) {
  console.log("Déjà rempli:", existing.length, "produits");
  process.exit(0);
}

const items = [
  { name: "Plaquettes de frein avant", brand: "Mobis", image: "/images/products/plaquettes.jpg", price: 85000,
    detail: "Jeu de 4 plaquettes de frein avant à garniture céramique, faible poussière et freinage silencieux. Compatibles avec la plupart des Hyundai et Kia récentes (i10, i20, Accent, Picanto, Rio).",
    usage: "Assure le freinage du véhicule. À remplacer dès que l'épaisseur de garniture est inférieure à 3 mm ou en cas de bruit de frottement." },
  { name: "Filtre à huile", brand: "Mann-Filter", image: "/images/products/filtre-huile.jpg", price: 18000,
    detail: "Filtre à huile à visser haute efficacité avec clapet anti-retour. Retient les impuretés métalliques et la suie.",
    usage: "Protège le moteur en filtrant l'huile. À changer à chaque vidange." },
  { name: "Huile moteur 5W-30 synthétique (4 L)", brand: "Castrol", image: "/images/products/huile-moteur.jpg", price: 120000,
    detail: "Huile 100% synthétique 5W-30, bidon de 4 litres. Excellent démarrage à froid et protection contre l'usure.",
    usage: "Lubrifie et refroidit le moteur. Vidange conseillée tous les 7 500 à 10 000 km." },
  { name: "Bougies d'allumage iridium (jeu de 4)", brand: "NGK", image: "/images/products/bougies.jpg", price: 95000,
    detail: "Jeu de 4 bougies à électrode iridium, longue durée de vie, allumage stable et économie de carburant.",
    usage: "Déclenche la combustion dans les moteurs essence. À remplacer tous les 40 000 à 60 000 km." },
  { name: "Batterie 12V 60Ah", brand: "Bosch", image: "/images/products/batterie.jpg", price: 380000,
    detail: "Batterie sans entretien 12V 60Ah, 540A au démarrage. Bornes standard, adaptée aux petites et moyennes berlines.",
    usage: "Alimente le démarreur et l'électronique du véhicule. Durée de vie moyenne : 3 à 5 ans." },
  { name: "Amortisseur avant (l'unité)", brand: "KYB", image: "/images/products/amortisseur.jpg", price: 210000,
    detail: "Amortisseur avant à gaz avec ressort, pour un meilleur confort et une tenue de route stable sur routes dégradées.",
    usage: "Absorbe les chocs de la route et maintient les pneus en contact avec le sol. Remplacer par paire." },
  { name: "Kit de distribution complet", brand: "Gates", image: "/images/products/courroie.jpg", price: 320000,
    detail: "Courroie de distribution avec galets tendeur et enrouleur. Kit complet pour un remplacement fiable.",
    usage: "Synchronise vilebrequin et arbre à cames. À remplacer tous les 90 000 à 120 000 km pour éviter la casse moteur." },
  { name: "Ampoules LED H7 (la paire)", brand: "Philips", image: "/images/products/led.jpg", price: 110000,
    detail: "Paire d'ampoules LED H7 6000K, éclairage blanc intense, refroidissement par ailettes aluminium.",
    usage: "Améliore la visibilité de nuit pour les feux de croisement et de route." },
];
await db.insert(schema.products).values(items);

await db.insert(schema.comments).values([
  { productId: null, author: "Rivo A.", rating: 5, content: "Service rapide et honnête. Ma Hyundai i10 a retrouvé tous ses freins en une demi-journée." },
  { productId: null, author: "Njaka R.", rating: 5, content: "Pièces d'origine à bon prix, et on m'a expliqué clairement chaque réparation." },
  { productId: null, author: "Hanta M.", rating: 4, content: "Très bon accueil, diagnostic précis. Je recommande pour les voitures coréennes." },
]);
console.log("Seed OK");
process.exit(0);
