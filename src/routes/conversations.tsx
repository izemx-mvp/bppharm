import { createFileRoute } from "@tanstack/react-router";
import { Conversations } from "@/features/conversations";
export const Route = createFileRoute("/conversations")({
  head: () => ({
    meta: [
      { title: "Service Client IA · Photo White" },
      { name: "description", content: "Conversations clients et assistance Photo White." },
      { property: "og:title", content: "Service Client IA · Photo White" },
      { property: "og:description", content: "Conversations clients et assistance Photo White." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Conversations />,
});
