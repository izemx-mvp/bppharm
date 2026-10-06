import { createFileRoute } from "@tanstack/react-router";
import { Community } from "@/features/community";
export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community Manager IA · Photo White" },
      { name: "description", content: "Idées de contenus et créations pour Photo White." },
      { property: "og:title", content: "Community Manager IA · Photo White" },
      { property: "og:description", content: "Idées de contenus et créations pour Photo White." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Community />,
});
