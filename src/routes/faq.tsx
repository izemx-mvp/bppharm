import { createFileRoute } from "@tanstack/react-router";
import { Resources } from "@/features/resources";
export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Questions fréquentes · Photo White" },
      { name: "description", content: "Les réponses expertes aux questions Photo White." },
      { property: "og:title", content: "Questions fréquentes · Photo White" },
      { property: "og:description", content: "Les réponses expertes aux questions Photo White." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Resources />,
});
