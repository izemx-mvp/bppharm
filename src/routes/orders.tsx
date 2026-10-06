import { createFileRoute } from "@tanstack/react-router";
import { Orders } from "@/features/orders";
export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Commandes IA · Photo White" },
      { name: "description", content: "Gestion et suivi des commandes Photo White." },
      { property: "og:title", content: "Commandes IA · Photo White" },
      { property: "og:description", content: "Gestion et suivi des commandes Photo White." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Orders />,
});
