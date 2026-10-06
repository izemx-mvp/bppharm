import { createFileRoute } from "@tanstack/react-router";
import { Configuration } from "@/features/settings";
export const Route = createFileRoute("/agent-settings")({
  head: () => ({
    meta: [
      { title: "Paramètres de l’agent · Photo White" },
      { name: "description", content: "Les règles de votre agent service client Photo White." },
      { property: "og:title", content: "Paramètres de l’agent · Photo White" },
      {
        property: "og:description",
        content: "Les règles de votre agent service client Photo White.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Configuration kind="agent" />,
});
