import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/features/dashboard";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard Direction · Photo White" },
      {
        name: "description",
        content: "Ventes, commandes et performances des agents IA Photo White.",
      },
      { property: "og:title", content: "Dashboard Direction · Photo White" },
      { property: "og:description", content: "Votre centre de pilotage intelligent BPPHARM." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});
