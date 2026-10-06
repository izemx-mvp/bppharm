import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Wallet,
  ShoppingBag,
  ShoppingBasket,
  TrendingUp,
  Bot,
  Clock3,
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  CalendarDays,
  SlidersHorizontal,
  Instagram,
  MessageCircle,
  Globe,
  Facebook,
  CircleCheck,
  Feather,
  Headphones,
  Activity,
  Ellipsis,
  Download,
  X,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Button,
  PageHeader,
  Kpi,
  Panel,
  Badge,
  Select,
  IconButton,
  Modal,
  FormField,
  Avatar,
  Status,
  downloadFile,
} from "./common";
import { QuickActions } from "./shell";
import { useDemo } from "./store";
import { kpis, products, money, channels, orderTotal } from "./data";
import { productImages } from "./assets";
import { toast } from "sonner";
const sales = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  current:
    [
      6500, 6100, 7300, 6800, 8400, 8000, 10100, 9500, 7900, 9600, 11100, 10200, 13300, 12600,
      14300, 11900, 12700, 15200, 14700, 13200, 16400, 15400, 17800, 16300, 18200, 17700, 21100,
      19200, 20300, 22400,
    ][i] ?? 6500,
  previous: 5500 + i * 320 + Math.sin(i * 1.7) * 1600,
}));
export function Dashboard() {
  const demo = useDemo();
  const [period, setPeriod] = useState("Ce mois");
  const [metric, setMetric] = useState("CA");
  const [granularity, setGranularity] = useState("Jour");
  const [channel, setChannel] = useState("Tous les canaux");
  const [product, setProduct] = useState("Tous les produits");
  const [commercial, setCommercial] = useState("Tous les commerciaux");
  const [filterOpen, setFilterOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [dates, setDates] = useState({ start: "2026-10-01", end: "2026-10-31" });
  const factor =
    (period === "Aujourd’hui"
      ? 0.045
      : period === "7 derniers jours"
        ? 0.27
        : period === "Trimestre"
          ? 2.76
          : 1) *
    (channel === "Tous les canaux" ? 1 : 0.32) *
    (product === "Tous les produits" ? 1 : 0.18) *
    (commercial === "Tous les commerciaux" ? 1 : 0.35);
  const data = sales
    .filter((_, i) =>
      granularity === "Semaine" ? i % 7 === 0 : granularity === "Mois" ? i % 5 === 0 : true,
    )
    .map((s) => ({
      ...s,
      current: Math.round(
        (s.current * factor) / (metric === "CA" ? 1 : metric === "Commandes" ? 390 : 1200),
      ),
      previous: Math.round(
        (s.previous * factor) / (metric === "CA" ? 1 : metric === "Commandes" ? 390 : 1200),
      ),
    }));
  return (
    <>
      <PageHeader
        title="Bonjour Sarah"
        description="Voici ce qui se passe chez Photo White aujourd’hui."
        action={<QuickActions />}
      />
      <div className="dashboard-filterbar">
        <div className="period-control">
          {["Aujourd’hui", "7 derniers jours", "Ce mois", "Trimestre"].map((p) => (
            <Button
              key={p}
              variant="ghost"
              className={period === p ? "selected" : ""}
              onClick={() => setPeriod(p)}
            >
              {p}
            </Button>
          ))}
        </div>
        <div className="filter-right">
          <Button variant="outline" onClick={() => setCustom(true)}>
            <CalendarDays />
            {period === "Période personnalisée"
              ? `${dates.start} — ${dates.end}`
              : "1 – 31 oct. 2026"}
            <ChevronDown />
          </Button>
          <Button variant="outline" onClick={() => setFilterOpen(!filterOpen)}>
            <SlidersHorizontal />
            Filtres{factor !== 1 && <span className="filter-dot" />}
          </Button>
        </div>
      </div>
      {filterOpen && (
        <div className="filter-extra">
          <Select
            value={channel}
            onChange={setChannel}
            options={["Tous les canaux", ...channels]}
          />
          <Select
            value={product}
            onChange={setProduct}
            options={["Tous les produits", ...products.map((p) => p.name)]}
          />
          <Select
            value={commercial}
            onChange={setCommercial}
            options={["Tous les commerciaux", "Sarah", "Mehdi", "Imane"]}
          />
          <Button
            variant="ghost"
            onClick={() => {
              setChannel("Tous les canaux");
              setProduct("Tous les produits");
              setCommercial("Tous les commerciaux");
            }}
          >
            <X />
            Réinitialiser
          </Button>
        </div>
      )}
      <div className="kpi-grid">
        <Kpi
          label="Chiffre d’affaires"
          value={money(Math.round(kpis.revenue * factor))}
          change="18,4 %"
          icon={<Wallet />}
        />
        <Kpi
          label="Commandes"
          value={Math.round(kpis.orders * factor).toLocaleString("fr-FR")}
          change="12,8 %"
          icon={<ShoppingBag />}
        />
        <Kpi label="Panier moyen" value="390 MAD" change="7,2 %" icon={<ShoppingBasket />} />
        <Kpi label="Taux de conversion" value="18,7 %" change="2,4 pts" icon={<TrendingUp />} />
        <Kpi
          label="Conversations IA"
          value={Math.round(kpis.conversations * factor).toLocaleString("fr-FR")}
          change="24,6 %"
          icon={<Bot />}
        />
        <Kpi
          label="Gain estimé grâce à l’IA"
          value={money(Math.round(kpis.savings * factor))}
          icon={<Clock3 />}
          sub="128 heures économisées"
        />
      </div>
      <div className="business-grid">
        <Panel
          title="Évolution des ventes"
          sub="Une belle dynamique pour votre activité"
          className="sales-panel"
          action={
            <div className="chart-actions">
              <div className="small-segments">
                {["CA", "Commandes", "Conversion"].map((m) => (
                  <Button
                    key={m}
                    variant="ghost"
                    size="sm"
                    className={metric === m ? "selected" : ""}
                    onClick={() => setMetric(m)}
                  >
                    {m}
                  </Button>
                ))}
              </div>
              <Select
                value={granularity}
                onChange={setGranularity}
                options={["Jour", "Semaine", "Mois"]}
              />
            </div>
          }
        >
          <div className="chart-summary">
            <strong>
              {metric === "CA"
                ? money(Math.round(kpis.revenue * factor))
                : metric === "Commandes"
                  ? Math.round(kpis.orders * factor)
                  : "18,7 %"}
            </strong>
            <Badge kind="green">
              <ArrowUpRight size={12} />
              18,4 %
            </Badge>
            <div className="chart-legend">
              <span>
                <i />
                Période actuelle
              </span>
              <span>
                <i />
                Période précédente
              </span>
            </div>
          </div>
          <div className="sales-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 4" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  interval={4}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  tickFormatter={(v) => `${v} oct.`}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  tickFormatter={(v) => (metric === "CA" ? `${v / 1000}k` : v)}
                />
                <Tooltip
                  formatter={(v: number) => (metric === "CA" ? money(v) : v)}
                  labelFormatter={(v) => `${v} octobre`}
                  contentStyle={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Area
                  name="Période précédente"
                  type="monotone"
                  dataKey="previous"
                  stroke="var(--chart-3)"
                  strokeDasharray="5 5"
                  fill="none"
                  strokeWidth={1.5}
                />
                <Area
                  name="Période actuelle"
                  type="monotone"
                  dataKey="current"
                  stroke="var(--chart-1)"
                  fill="url(#salesFill)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel
          title="Vos agents IA"
          sub="Une équipe qui ne s’arrête jamais"
          action={
            <Badge kind="green">
              <span className="online-dot" />
              En ligne
            </Badge>
          }
          className="agents-panel"
        >
          {[
            {
              name: "Community Manager",
              icon: Feather,
              description: "8 publications programmées",
              url: "/community",
              kind: "purple",
              value: "24",
              label: "idées créées",
            },
            {
              name: "Service Client",
              icon: Headphones,
              description: "92 % de taux de résolution",
              url: "/conversations",
              kind: "green",
              value: "1 284",
              label: "conversations traitées",
            },
            {
              name: "Commandes",
              icon: ShoppingBag,
              description: `${demo.orders.filter((o) => o.status === "À valider").length} commandes à valider`,
              url: "/validation",
              kind: "amber",
              value: "156",
              label: "commandes détectées",
            },
          ].map((a) => (
            <Link to={a.url} key={a.name} className="agent-row">
              <span className={`agent-symbol ${a.kind}`}>
                <a.icon size={20} />
              </span>
              <div>
                <strong>{a.name}</strong>
                <span>{a.description}</span>
                <div className="agent-stat">
                  <b>{a.value}</b> {a.label}
                </div>
              </div>
              <ArrowUpRight size={17} />
            </Link>
          ))}
          <div className="ai-benefit">
            <span className="benefit-icon">
              <Clock3 size={21} />
            </span>
            <div>
              <strong>128 heures gagnées ce mois</strong>
              <span>Plus de temps pour ce qui compte.</span>
            </div>
          </div>
        </Panel>
      </div>
      <div className="dashboard-middle">
        <Panel
          title="Performance par canal"
          sub="Là où vos clients vous retrouvent"
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/reports">
                Voir le rapport <ArrowUpRight />
              </Link>
            </Button>
          }
        >
          <div className="channel-list">
            {channels.map((c, i) => {
              const Icon =
                [MessageCircle, Globe, Instagram, Facebook, MessagesIcon][i] ?? MessageCircle;
              return (
                <div className="channel-row" key={c}>
                  <span className={`channel-icon channel-${i}`}>
                    <Icon size={18} />
                  </span>
                  <div className="channel-label">
                    <strong>{c}</strong>
                    <span>
                      {[1842, 964, 682, 248, 106][i]} conversations ·{" "}
                      {[24.8, 18.6, 14.2, 10.8, 8.4][i]} % conv.
                    </span>
                  </div>
                  <div className="channel-bar">
                    <progress max={100} value={[90, 65, 45, 25, 13][i]} />
                  </div>
                  <div className="channel-value">
                    <strong>
                      {money(Math.round(([224182, 131584, 77976, 38988, 14620][i] ?? 0) * factor))}
                    </strong>
                    <span>{[574, 337, 200, 100, 37][i]} commandes</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
        <Panel
          title="Produits les plus performants"
          sub="Les favoris de vos clients"
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/knowledge">
                Tous les produits <ArrowUpRight />
              </Link>
            </Button>
          }
        >
          <div className="product-table">
            <div className="product-table-head">
              <span>PRODUIT</span>
              <span>VENTES</span>
              <span>ÉVOLUTION</span>
            </div>
            {products.slice(0, 5).map((p, i) => (
              <div className="top-product" key={p.id}>
                <span className="product-thumb">
                  <img src={productImages[i]} alt={p.name} />
                </span>
                <div>
                  <strong>{p.short}</strong>
                  <span>{money(p.price * p.sales)}</span>
                </div>
                <b>{p.sales}</b>
                <span className="positive">+{p.growth} %</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <div className="dashboard-bottom">
        <Panel
          title="Commandes à suivre"
          sub="Chaque commande, au bon endroit"
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/orders">
                Toutes les commandes <ArrowUpRight />
              </Link>
            </Button>
          }
        >
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>COMMANDE</th>
                  <th>CLIENT</th>
                  <th>TOTAL</th>
                  <th>STATUT</th>
                </tr>
              </thead>
              <tbody>
                {demo.orders.slice(0, 4).map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link to="/orders" className="reference">
                        #{o.id}
                      </Link>
                      <small>{o.channel}</small>
                    </td>
                    <td>{o.client}</td>
                    <td className="font-medium">{money(orderTotal(o))}</td>
                    <td>
                      <Status value={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel
          title="Activité récente"
          sub="Votre activité, en un coup d’œil"
          action={
            <Badge kind="green">
              <span className="online-dot" />
              En direct
            </Badge>
          }
        >
          <div className="activity-list">
            {[
              {
                icon: ShoppingBag,
                title: "Commande #PW-2481 détectée",
                sub: "Via WhatsApp · À valider",
                time: "Il y a 2 min",
                kind: "amber",
              },
              {
                icon: Bot,
                title: "Une nouvelle réponse apportée par l’IA",
                sub: "Question sur la crème anti-taches",
                time: "Il y a 5 min",
                kind: "green",
              },
              {
                icon: Instagram,
                title: "Publication programmée sur Instagram",
                sub: "Routine anti-taches en 3 étapes",
                time: "Il y a 12 min",
                kind: "purple",
              },
              {
                icon: MessageCircle,
                title: "Conversation transférée à Sarah",
                sub: "Imane Berrada · WhatsApp",
                time: "Il y a 18 min",
                kind: "blue",
              },
            ].map((a) => (
              <div className="activity-row" key={a.title}>
                <span className={`agent-symbol ${a.kind}`}>
                  <a.icon size={16} />
                </span>
                <div>
                  <strong>{a.title}</strong>
                  <span>{a.sub}</span>
                </div>
                <time>{a.time}</time>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Modal open={custom} onClose={() => setCustom(false)} title="Période personnalisée">
        <div className="form-grid">
          <FormField label="Du">
            <input
              type="date"
              value={dates.start}
              onChange={(e) => setDates({ ...dates, start: e.target.value })}
            />
          </FormField>
          <FormField label="Au">
            <input
              type="date"
              min={dates.start}
              value={dates.end}
              onChange={(e) => setDates({ ...dates, end: e.target.value })}
            />
          </FormField>
        </div>
        <Button
          onClick={() => {
            setPeriod("Période personnalisée");
            setCustom(false);
            toast.success("Période mise à jour");
          }}
        >
          Appliquer
        </Button>
      </Modal>
    </>
  );
}
function MessagesIcon() {
  return <MessageCircle size={18} />;
}
