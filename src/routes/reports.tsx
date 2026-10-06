import { createFileRoute } from "@tanstack/react-router";
import { Reports } from "@/features/resources";
export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Rapports & Analytics · Photo White" },
      { name: "description", content: "Les performances commerciales de Photo White." },
      { property: "og:title", content: "Rapports & Analytics · Photo White" },
      { property: "og:description", content: "Les performances commerciales de Photo White." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Reports />,
});
