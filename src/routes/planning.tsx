import { createFileRoute } from "@tanstack/react-router";
import { Planning } from "@/features/community";
export const Route = createFileRoute("/planning")({
  head: () => ({
    meta: [
      { title: "Planning éditorial · Photo White" },
      { name: "description", content: "Le calendrier des publications Photo White." },
      { property: "og:title", content: "Planning éditorial · Photo White" },
      { property: "og:description", content: "Le calendrier des publications Photo White." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Planning />,
});
