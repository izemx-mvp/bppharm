import { createFileRoute } from "@tanstack/react-router";
import { Orders } from "@/features/orders";
export const Route = createFileRoute("/validation")({
  head: () => ({
    meta: [
      { title: "Commandes à valider · Photo White" },
      { name: "description", content: "Vérifiez et validez les commandes détectées par l’IA." },
      { property: "og:title", content: "Commandes à valider · Photo White" },
      {
        property: "og:description",
        content: "Vérifiez et validez les commandes détectées par l’IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Orders mode="validation" />,
});
