import { describe, it, expect } from "vitest";
import {
  kpis,
  seedOrders,
  seedIdeas,
  seedConversations,
  seedFaq,
  seedKnowledge,
  orderTotal,
  updateOrderStatus,
} from "@/features/data";
describe("Photo White demonstration rules", () => {
  const firstOrder = seedOrders[0];
  if (!firstOrder) throw new Error("Missing demo order");
  it("uses the requested revenue of 487350 MAD", () => expect(kpis.revenue).toBe(487350));
  it("uses the requested 1248 orders KPI", () => expect(kpis.orders).toBe(1248));
  it("uses the requested average basket of 390 MAD", () => expect(kpis.basket).toBe(390));
  it("uses the requested 18.7 percent conversion", () => expect(kpis.conversion).toBe(18.7));
  it("uses the requested 3842 AI conversations", () => expect(kpis.conversations).toBe(3842));
  it("uses the requested estimated savings of 42800 MAD", () => expect(kpis.savings).toBe(42800));
  it("uses the requested 128 saved hours", () => expect(kpis.hours).toBe(128));
  it("provides at least 20 orders", () => expect(seedOrders.length).toBeGreaterThanOrEqual(20));
  it("provides at least 20 ideas", () => expect(seedIdeas.length).toBeGreaterThanOrEqual(20));
  it("provides at least 12 scheduled posts", () =>
    expect(seedIdeas.filter((i) => i.status === "Planifiée").length).toBeGreaterThanOrEqual(12));
  it("provides at least 15 conversations and distinct clients", () =>
    expect(new Set(seedConversations.map((c) => c.name)).size).toBeGreaterThanOrEqual(15));
  it("provides at least 15 FAQ entries", () => expect(seedFaq.length).toBeGreaterThanOrEqual(15));
  it("provides at least 15 knowledge entries", () =>
    expect(seedKnowledge.length).toBeGreaterThanOrEqual(15));
  it("totals the requested order PW-2481 at 658 MAD", () =>
    expect(orderTotal(firstOrder)).toBe(658));
  it("validation confirms the order and appends history", () => {
    const o = updateOrderStatus(firstOrder, "Confirmée");
    expect(o.status).toBe("Confirmée");
    expect(o.history.length).toBe(firstOrder.history.length + 1);
    expect(firstOrder.status).toBe("À valider");
  });
});
