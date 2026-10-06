import { createFileRoute } from "@tanstack/react-router";
import { Configuration } from "@/features/settings";
export const Route = createFileRoute("/community-config")({
  head: () => ({
    meta: [
      { title: "Configuration de marque · Photo White" },
      { name: "description", content: "L’identité et les objectifs de votre marque Photo White." },
      { property: "og:title", content: "Configuration de marque · Photo White" },
      {
        property: "og:description",
        content: "L’identité et les objectifs de votre marque Photo White.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Configuration />,
});
