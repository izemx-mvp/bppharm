import { createFileRoute } from "@tanstack/react-router";
import { Configuration } from "@/features/settings";
export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Paramètres de l’espace · Photo White" },
      { name: "description", content: "Votre profil et les préférences de votre équipe." },
      { property: "og:title", content: "Paramètres de l’espace · Photo White" },
      { property: "og:description", content: "Votre profil et les préférences de votre équipe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Configuration kind="general" />,
});
