export const SITE = {
  name: "AinaGaraCoréen",
  phoneLocal: "0385623528",
  phoneDisplay: "038 56 235 28",
  phoneIntl: "+261385623528",
  whatsapp: "261385623528",
  email: "mamyherver@gmail.com",
};

export const tel = `tel:${SITE.phoneIntl}`;
export const mailto = (subject = "", body = "") =>
  `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
export const wa = (text = "") =>
  `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const money = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n).replace(/ | /g, " ") + " Ar";

export const dateFr = (d: Date | string | number) =>
  new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
