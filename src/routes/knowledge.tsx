import { createFileRoute } from "@tanstack/react-router";
import { Resources } from "@/features/resources";
export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Base de connaissances · Photo White" },
      { name: "description", content: "Produits, documents et expertise Photo White." },
      { property: "og:title", content: "Base de connaissances · Photo White" },
      { property: "og:description", content: "Produits, documents et expertise Photo White." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Resources kind="knowledge" />,
});
