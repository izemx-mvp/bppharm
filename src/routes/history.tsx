import { createFileRoute } from "@tanstack/react-router";
import { Orders } from "@/features/orders";
export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Historique des commandes · Photo White" },
      { name: "description", content: "Retrouvez le suivi des commandes Photo White." },
      { property: "og:title", content: "Historique des commandes · Photo White" },
      { property: "og:description", content: "Retrouvez le suivi des commandes Photo White." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Orders mode="history" />,
});
