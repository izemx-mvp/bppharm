import { createFileRoute } from "@tanstack/react-router";
import { Login } from "@/features/settings";
export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Connexion · Photo White" },
      { name: "description", content: "Connectez-vous à votre espace intelligent Photo White." },
      { property: "og:title", content: "Connexion · Photo White" },
      {
        property: "og:description",
        content: "Connectez-vous à votre espace intelligent Photo White.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Login />,
});
