import { createContext, useContext, useState, type ReactNode } from "react";
import {
  seedOrders,
  seedIdeas,
  seedConversations,
  seedFaq,
  seedKnowledge,
  seedNotifications,
  type Order,
  type Idea,
  type Conversation,
  type RecordItem,
} from "./data";
function useDemoState() {
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [ideas, setIdeas] = useState<Idea[]>(seedIdeas);
  const [conversations, setConversations] = useState<Conversation[]>(seedConversations);
  const [faqs, setFaqs] = useState<RecordItem[]>(seedFaq);
  const [knowledge, setKnowledge] = useState<RecordItem[]>(seedKnowledge);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [connections, setConnections] = useState([true, true, true, true, false]);
  const [config, setConfig] = useState<Record<string, string>>({
    brand: "Photo White",
    agent: "Nour · Photo White",
    website: "https://photowhite.ma",
    language: "Français",
    frequency: "3",
    tone: "Premium",
    autonomy: "2",
    welcome: "Bonjour et bienvenue chez Photo White ! Comment puis-je vous aider ?",
    description: "L’expertise dermocosmétique au service de votre peau.",
  });
  return {
    orders,
    setOrders,
    ideas,
    setIdeas,
    conversations,
    setConversations,
    faqs,
    setFaqs,
    knowledge,
    setKnowledge,
    notifications,
    setNotifications,
    connections,
    setConnections,
    config,
    setConfig,
  };
}
const DemoContext = createContext<ReturnType<typeof useDemoState> | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const state = useDemoState();
  return <DemoContext.Provider value={state}>{children}</DemoContext.Provider>;
}
export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("DemoProvider required");
  return context;
}
