import { createFileRoute } from "@tanstack/react-router";
import { Applications } from "@/features/resources";
export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [
      { title: "Applications & Canaux · Photo White" },
      { name: "description", content: "Vos canaux de communication Photo White." },
      { property: "og:title", content: "Applications & Canaux · Photo White" },
      { property: "og:description", content: "Vos canaux de communication Photo White." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Applications />,
});
