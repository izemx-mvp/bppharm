export const money = (n: number) => `${new Intl.NumberFormat("fr-MA").format(n)} MAD`;
export const kpis = {
  revenue: 487350,
  orders: 1248,
  basket: 390,
  conversion: 18.7,
  conversations: 3842,
  savings: 42800,
  hours: 128,
};
export const names = [
  "Sara El Amrani",
  "Imane Berrada",
  "Salma Alaoui",
  "Yasmine Bennani",
  "Mehdi El Idrissi",
  "Karim Amrani",
  "Nadia Bouaziz",
  "Omar Benjelloun",
  "Hajar Tazi",
  "Amine Chraibi",
  "Lina Idrissi",
  "Rania El Fassi",
  "Anas Bennis",
  "Hind Mansouri",
  "Youssef Alaoui",
];
export const channels = ["WhatsApp", "Site web", "Instagram", "Facebook", "Messenger"];
export const statuses = [
  "À valider",
  "Confirmée",
  "En préparation",
  "Expédiée",
  "Livrée",
  "Annulée",
  "Nouvelle",
  "À vérifier",
];
export const products = [
  {
    id: 1,
    name: "Crème solaire invisible SPF 50+",
    short: "Solaire invisible",
    price: 189,
    category: "Protection solaire",
    reference: "PW-SOL-001",
    sales: 342,
    growth: 24.8,
  },
  {
    id: 2,
    name: "Crème solaire opale SPF 50+",
    short: "Solaire opale",
    price: 189,
    category: "Protection solaire",
    reference: "PW-SOL-002",
    sales: 286,
    growth: 18.2,
  },
  {
    id: 3,
    name: "Crème anti-taches",
    short: "Crème anti-taches",
    price: 229,
    category: "Anti-taches",
    reference: "PW-AT-003",
    sales: 218,
    growth: 16.5,
  },
  {
    id: 4,
    name: "Mousse purifiante",
    short: "Mousse purifiante",
    price: 149,
    category: "Nettoyants",
    reference: "PW-MP-004",
    sales: 174,
    growth: 12.3,
  },
  {
    id: 5,
    name: "Sérum éclaircissant",
    short: "Sérum éclaircissant",
    price: 280,
    category: "Sérums",
    reference: "PW-SE-005",
    sales: 152,
    growth: 21.4,
  },
  {
    id: 6,
    name: "AH Crème hydratante",
    short: "Crème hydratante",
    price: 169,
    category: "Hydratation",
    reference: "PW-AH-006",
    sales: 136,
    growth: 9.7,
  },
];
export interface Order {
  id: string;
  client: string;
  channel: string;
  commercial: string;
  city: string;
  status: string;
  date: string;
  score: number;
  items: { product: number; qty: number; price: number }[];
  phone: string;
  email: string;
  address: string;
  note: string;
  history: string[];
}
export const orderTotal = (o: Order) => o.items.reduce((a, i) => a + i.qty * i.price, 0);
export const seedOrders: Order[] = Array.from({ length: 24 }, (_, i) => ({
  id: `PW-${2481 - i}`,
  client: names[i % 15] ?? "Sara El Amrani",
  channel: channels[i % 5] ?? "WhatsApp",
  commercial: ["Sarah", "Mehdi", "Imane"][i % 3] ?? "Sarah",
  city: ["Casablanca", "Rabat", "Marrakech", "Tanger", "Fès"][i % 5] ?? "Casablanca",
  status: statuses[i % 8] ?? "À valider",
  date: `2026-10-${String(6 - (i % 6)).padStart(2, "0")}`,
  score: 96 - (i % 13),
  items:
    i === 0
      ? [
          { product: 1, qty: 2, price: 189 },
          { product: 5, qty: 1, price: 280 },
        ]
      : [{ product: (i % 6) + 1, qty: (i % 3) + 1, price: products[i % 6]?.price ?? 189 }],
  phone: `+212 6${String(12345678 + i)}`,
  email: `client${i + 1}@exemple.ma`,
  address: `${12 + i}, rue des Jasmins`,
  note: "Livraison en journée. Appeler avant le passage.",
  history: ["10:32 · Commande détectée par l’IA", "10:33 · Informations extraites"],
}));
export interface Idea {
  id: number;
  title: string;
  description: string;
  product: number;
  platform: string;
  type: string;
  objective: string;
  status: string;
  date: string;
  time: string;
  caption: string;
  hashtags: string;
  cta: string;
  hook: string;
  visual: string;
}
const titles = [
  "Routine anti-taches en 3 étapes",
  "Le soleil change. Votre protection aussi.",
  "Votre peau mérite une pause",
  "SPF 50+ : votre allié au quotidien",
  "Le secret d’un teint lumineux",
  "Une routine, mille bénéfices",
  "Hydratation : le bon geste",
  "La douceur qui fait la différence",
  "3 mythes sur la protection solaire",
  "Les essentiels de votre salle de bain",
  "Peau sensible, attention particulière",
  "Votre rituel du soir",
  "Un sérum, un nouveau départ",
  "Le soin qui vous ressemble",
  "Les bons réflexes de l’automne",
  "Votre routine en 60 secondes",
  "Focus ingrédient : acide hyaluronique",
  "Le glow commence ici",
  "Le geste solaire, toute l’année",
  "Écouter les besoins de votre peau",
];
export const seedIdeas: Idea[] = titles.map((title, i) => ({
  id: i + 1,
  title,
  description:
    [
      "Une routine experte pour révéler l’éclat naturel de votre peau.",
      "Éduquer votre communauté sur les gestes qui font la différence.",
      "Mettre en lumière l’expertise dermatologique Photo White.",
    ][i % 3] ?? "Une routine experte pour votre peau.",
  product: (i % 6) + 1,
  platform: ["Instagram", "Facebook", "TikTok", "LinkedIn"][i % 4] ?? "Instagram",
  type: ["Carrousel", "Reel", "Post", "Story"][i % 4] ?? "Post",
  objective: ["Éducation", "Conversion", "Engagement"][i % 3] ?? "Éducation",
  status: i < 12 ? "Planifiée" : i < 16 ? "À valider" : "Brouillon",
  date: `2026-10-${String(7 + i).padStart(2, "0")}`,
  time: "18:30",
  caption:
    "Chaque peau a son histoire. Offrez-lui une routine adaptée avec Photo White. Une formule experte pour une peau lumineuse, jour après jour.",
  hashtags: "#PhotoWhite #Skincare #RoutineVisage #Dermocosmétique",
  cta: "Découvrez votre routine idéale.",
  hook: "Et si votre peau retrouvait tout son éclat ?",
  visual: "Gros plan du produit sur fond clair, lumière naturelle et texture du soin.",
}));
export interface Message {
  role: "client" | "ai" | "human";
  text: string;
  time: string;
}
export interface Conversation {
  id: number;
  name: string;
  channel: string;
  unread: number;
  status: string;
  human: boolean;
  city: string;
  messages: Message[];
  notes: string[];
}
export const seedConversations: Conversation[] = names.map((name, i) => ({
  id: i + 1,
  name,
  channel: channels[i % 5] ?? "WhatsApp",
  unread: i < 5 ? (i % 3) + 1 : 0,
  status: i % 6 === 0 ? "En attente" : i % 7 === 0 ? "Résolue" : "Ouverte",
  human: i % 4 === 2,
  city: ["Casablanca", "Rabat", "Marrakech"][i % 3] ?? "Casablanca",
  messages: [
    {
      role: "client",
      text:
        i === 0
          ? "Bonjour ! Est-ce que la crème anti-taches convient aux peaux sensibles ?"
          : "Bonjour, je voudrais en savoir plus sur vos soins Photo White.",
      time: "10:42",
    },
    {
      role: "ai",
      text: "Bonjour ! Merci de votre intérêt pour Photo White. Notre crème anti-taches s’intègre à une routine adaptée. Pour une peau sensible, nous recommandons un test sur une petite zone et l’avis de votre dermatologue. 🌿",
      time: "10:42",
    },
    {
      role: "client",
      text:
        i === 0
          ? "Merci ! Et est-ce que je peux l’utiliser avec votre crème solaire ?"
          : "Quels sont les délais de livraison à Casablanca ?",
      time: "10:44",
    },
  ],
  notes: ["Cliente fidèle, préfère être contactée sur WhatsApp."],
}));
export interface RecordItem {
  id: number;
  title: string;
  body: string;
  category: string;
  active: boolean;
  tags: string;
}
const faqTitles = [
  "La crème anti-taches convient-elle aux peaux sensibles ?",
  "Comment appliquer la crème solaire SPF 50+ ?",
  "Quels sont les délais de livraison ?",
  "Puis-je payer à la livraison ?",
  "Comment choisir mon soin Photo White ?",
  "Peut-on associer sérum et crème anti-taches ?",
  "La crème solaire laisse-t-elle des traces ?",
  "Comment suivre ma commande ?",
  "Livrez-vous partout au Maroc ?",
  "Comment effectuer un retour ?",
  "Quelle routine pour une peau grasse ?",
  "À quelle fréquence utiliser la mousse ?",
  "Les produits sont-ils testés dermatologiquement ?",
  "Comment contacter un conseiller ?",
  "Quelle différence entre solaire opale et invisible ?",
];
export const seedFaq: RecordItem[] = faqTitles.map((title, i) => ({
  id: i + 1,
  title,
  body:
    [
      "Pour une peau sensible, effectuez un test cutané et demandez conseil à votre dermatologue avant utilisation.",
      "Appliquez généreusement avant l’exposition et renouvelez régulièrement.",
      "Livraison de démonstration estimée sous 2 à 3 jours ouvrés au Maroc.",
    ][i % 3] ?? "Conseil Photo White.",
  category: ["Produits", "Utilisation", "Livraison"][i % 3] ?? "Produits",
  active: i < 13,
  tags: "Photo White, conseils",
}));
export const seedKnowledge: RecordItem[] = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  title:
    i < 6
      ? (products[i]?.name ?? "Produit Photo White")
      : ([
          "Guide des routines visage",
          "Catalogue Photo White 2026",
          "Conditions de livraison",
          "Politique de retour",
          "Conseils peau sensible",
          "Procédure de validation commande",
          "Guide de tonalité de marque",
          "Protocole réclamation",
          "Protection solaire au quotidien",
          "Routine hydratation",
          "Conditions de vente",
          "Charte service client",
        ][i - 6] ?? "Information Photo White"),
  body:
    i < 6
      ? "Formule dermocosmétique, fiche produit et conseils d’utilisation."
      : "Information interne de démonstration pour les agents Photo White.",
  category:
    i < 6
      ? "Produits"
      : (["Documents", "Informations générales", "Livraison & Conditions", "Procédures"][i % 4] ??
        "Documents"),
  active: true,
  tags: "Validé, Octobre 2026",
}));
export const seedNotifications = [
  {
    id: 1,
    title: "Une commande attend votre validation",
    body: "#PW-2481 · Sara El Amrani · 658 MAD",
    type: "Commande",
    read: false,
  },
  {
    id: 2,
    title: "Votre publication est prête",
    body: "Routine anti-taches · Instagram",
    type: "Marketing",
    read: false,
  },
  {
    id: 3,
    title: "Conversation transférée à Sarah",
    body: "Imane Berrada · WhatsApp",
    type: "Service client",
    read: false,
  },
  {
    id: 4,
    title: "Objectif mensuel atteint à 84 %",
    body: "487 350 MAD de chiffre d’affaires",
    type: "Direction",
    read: true,
  },
  {
    id: 5,
    title: "Document indexé avec succès",
    body: "Catalogue Photo White 2026",
    type: "IA",
    read: true,
  },
];
export function updateOrderStatus(order: Order, status: string): Order {
  return {
    ...order,
    status,
    history: [
      ...order.history,
      `${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} · ${status} par Sarah`,
    ],
  };
}

export const defaultIdea: Idea = {
  id: 0,
  title: "Routine Photo White",
  description: "Une routine experte pour votre peau.",
  product: 1,
  platform: "Instagram",
  type: "Post",
  objective: "Éducation",
  status: "Brouillon",
  date: "2026-10-07",
  time: "18:30",
  caption: "Révélez votre éclat avec Photo White.",
  hashtags: "#PhotoWhite",
  cta: "Découvrez votre routine",
  hook: "Votre peau mérite le meilleur",
  visual: "Une lumière naturelle et des soins experts.",
};
export const defaultOrder: Order = {
  id: "PW-2481",
  client: "Sara El Amrani",
  channel: "WhatsApp",
  commercial: "Sarah",
  city: "Casablanca",
  status: "À valider",
  date: "2026-10-06",
  score: 96,
  items: [
    { product: 1, qty: 2, price: 189 },
    { product: 5, qty: 1, price: 280 },
  ],
  phone: "+212 6 12 34 56 78",
  email: "client@exemple.ma",
  address: "12 rue des Jasmins",
  note: "Livraison en journée",
  history: [],
};
