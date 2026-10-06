import { useState } from "react";
import {
  Plus,
  ShoppingBag,
  CheckCheck,
  Wallet,
  Bot,
  Clock3,
  Check,
  X,
  Download,
  ArrowRight,
  ArrowUpRight,
  Trash2,
  MessageCircle,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  PageHeader,
  Kpi,
  Badge,
  Status,
  SearchInput,
  Select,
  Modal,
  FormField,
  Pagination,
  ItemMenu,
  ConfirmDelete,
  Empty,
  Avatar,
  downloadFile,
} from "./common";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useDemo } from "./store";
import {
  seedOrders,
  defaultOrder,
  products,
  channels,
  statuses,
  money,
  orderTotal,
  updateOrderStatus,
  type Order,
} from "./data";
import { productImages } from "./assets";
export function Orders({ mode = "all" }: { mode?: "all" | "validation" | "history" }) {
  const { orders, setOrders } = useDemo();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Tous les statuts");
  const [channel, setChannel] = useState("Tous les canaux");
  const [commercial, setCommercial] = useState("Tous les commerciaux");
  const [city, setCity] = useState("Toutes les villes");
  const [product, setProduct] = useState("Tous les produits");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Order | null>(null);
  const [editing, setEditing] = useState<Order | null>(null);
  const [del, setDel] = useState<string | null>(null);
  const [reject, setReject] = useState<Order | null>(null);
  const [reason, setReason] = useState("");
  const base =
    mode === "validation"
      ? orders.filter((o) => o.status === "À valider" || o.status === "À vérifier")
      : mode === "history"
        ? orders.filter((o) => !["À valider", "Nouvelle", "À vérifier"].includes(o.status))
        : orders;
  const filtered = base.filter(
    (o) =>
      (o.id + " " + o.client).toLowerCase().includes(search.toLowerCase()) &&
      (status === "Tous les statuts" || o.status === status) &&
      (channel === "Tous les canaux" || o.channel === channel) &&
      (commercial === "Tous les commerciaux" || o.commercial === commercial) &&
      (city === "Toutes les villes" || o.city === city) &&
      (product === "Tous les produits" ||
        o.items.some((i) => products[i.product - 1]?.name === product)) &&
      (!date || o.date === date),
  );
  const changeStatus = (o: Order, s: string) => {
    const next = updateOrderStatus(o, s);
    setOrders(orders.map((x) => (x.id === o.id ? next : x)));
    if (selected?.id === o.id) setSelected(next);
    toast.success(
      s === "Confirmée" ? `Commande #${o.id} créée avec succès.` : `Commande #${o.id} : ${s}`,
    );
  };
  const save = (o: Order) => {
    if (!o.client.trim()) {
      toast.error("Le nom du client est requis");
      return;
    }
    setOrders(
      orders.some((x) => x.id === o.id)
        ? orders.map((x) => (x.id === o.id ? o : x))
        : [o, ...orders],
    );
    setEditing(null);
    setSelected(o);
    toast.success("Commande enregistrée");
  };
  const startNew = () =>
    setEditing({
      ...defaultOrder,
      id: `PW-${2500 + orders.length}`,
      client: "",
      status: "Nouvelle",
      items: [{ product: 1, qty: 1, price: 189 }],
      history: ["Commande créée manuellement par Sarah"],
    });
  const updateFilter = (fn: (v: string) => void) => (v: string) => {
    fn(v);
    setPage(1);
  };
  return (
    <>
      <PageHeader
        eyebrow="VOTRE AGENT COMMERCIAL"
        title={
          mode === "validation"
            ? "Commandes à valider"
            : mode === "history"
              ? "Historique des commandes"
              : "Commandes IA"
        }
        description={
          mode === "validation"
            ? "Votre agent a fait le travail. Vous gardez le dernier mot."
            : "De la première conversation à la livraison, ne perdez jamais le fil."
        }
        action={
          <Button onClick={startNew}>
            <Plus />
            Créer une commande
          </Button>
        }
      />
      <div className="order-kpis">
        <Kpi label="Commandes détectées" value="156" change="18,4 %" icon={<Bot />} />
        <Kpi
          label="À valider"
          value={String(
            orders.filter((o) => o.status === "À valider" || o.status === "À vérifier").length,
          )}
          icon={<ShoppingBag />}
          sub="Votre attention est requise"
        />
        <Kpi
          label="Confirmées"
          value={String(orders.filter((o) => o.status === "Confirmée").length)}
          icon={<CheckCheck />}
          sub="Prêtes à être préparées"
        />
        <Kpi
          label="CA généré par l’IA"
          value="61 840 MAD"
          icon={<Wallet />}
          sub="24 heures économisées"
        />
      </div>
      {mode === "validation" && (
        <div className="validation-banner">
          <ShieldCheck />
          <div>
            <strong>L’intelligence de l’IA, la précision de votre équipe.</strong>
            <span>
              Vérifiez les informations extraites de la conversation avant de confirmer la commande.
            </span>
          </div>
          <Badge kind="green">Confiance moyenne 94 %</Badge>
        </div>
      )}
      <div className="content-toolbar">
        <SearchInput
          value={search}
          onChange={updateFilter(setSearch)}
          placeholder="Rechercher une commande ou un client…"
        />
        <Select
          value={status}
          onChange={updateFilter(setStatus)}
          options={["Tous les statuts", ...statuses]}
        />
        <Select
          value={channel}
          onChange={updateFilter(setChannel)}
          options={["Tous les canaux", ...channels]}
        />
        <Button
          variant="outline"
          onClick={() => {
            downloadFile(
              "commandes-photowhite.csv",
              "Référence;Client;Canal;Total MAD;Statut\n" +
                filtered
                  .map((o) => `${o.id};${o.client};${o.channel};${orderTotal(o)};${o.status}`)
                  .join("\n"),
            );
            toast.success("Export téléchargé");
          }}
        >
          <Download />
          Exporter
        </Button>
      </div>
      <div className="secondary-filters">
        <Select
          value={commercial}
          onChange={updateFilter(setCommercial)}
          options={["Tous les commerciaux", "Sarah", "Mehdi", "Imane"]}
        />
        <Select
          value={city}
          onChange={updateFilter(setCity)}
          options={["Toutes les villes", "Casablanca", "Rabat", "Marrakech", "Tanger", "Fès"]}
        />
        <Select
          value={product}
          onChange={updateFilter(setProduct)}
          options={["Tous les produits", ...products.map((p) => p.name)]}
        />
        <input
          type="date"
          aria-label="Filtrer par date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setPage(1);
          }}
        />
        {date && (
          <Button variant="ghost" onClick={() => setDate("")}>
            <X />
            Effacer
          </Button>
        )}
      </div>
      <div className="data-table-panel table-scroll">
        <table className="orders-table">
          <thead>
            <tr>
              <th>COMMANDE</th>
              <th>CLIENT</th>
              <th>CANAL</th>
              <th>COMMERCIAL</th>
              <th>{mode === "validation" ? "CONFIANCE IA" : "ARTICLES"}</th>
              <th>TOTAL</th>
              <th>STATUT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice((page - 1) * 8, page * 8).map((o) => (
              <tr key={o.id}>
                <td>
                  <Button
                    variant="link"
                    className="reference"
                    onClick={() => setSelected({ ...o })}
                  >
                    #{o.id}
                  </Button>
                  <small>
                    {new Date(o.date + "T12:00").toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </small>
                </td>
                <td>
                  <div className="table-client">
                    <Avatar name={o.client} size="small" />
                    <div>
                      <strong>{o.client}</strong>
                      <small>{o.city}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge>{o.channel}</Badge>
                </td>
                <td>{o.commercial}</td>
                <td>
                  {mode === "validation" ? (
                    <Badge kind="green">
                      <ShieldCheck size={12} />
                      {o.score} %
                    </Badge>
                  ) : (
                    o.items.reduce((a, i) => a + i.qty, 0) + " articles"
                  )}
                </td>
                <td className="font-semibold">{money(orderTotal(o))}</td>
                <td>
                  {mode === "validation" ? (
                    <Status value={o.status} />
                  ) : (
                    <Select
                      value={o.status}
                      onChange={(v) => changeStatus(o, v)}
                      options={statuses}
                    />
                  )}
                </td>
                <td>
                  {mode === "validation" ? (
                    <div className="table-actions">
                      <Button size="sm" onClick={() => changeStatus(o, "Confirmée")}>
                        <Check />
                        Valider
                      </Button>
                      <ItemMenu
                        onView={() => setSelected({ ...o })}
                        onEdit={() => setEditing({ ...o, items: o.items.map((i) => ({ ...i })) })}
                        extra={[{ label: "Rejeter", action: () => setReject(o) }]}
                      />
                    </div>
                  ) : (
                    <ItemMenu
                      onView={() => setSelected({ ...o })}
                      onEdit={() => setEditing({ ...o, items: o.items.map((i) => ({ ...i })) })}
                      onDelete={() => setDel(o.id)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <Empty
            title={
              mode === "validation"
                ? "Toutes vos commandes ont été vérifiées"
                : "Aucune commande trouvée"
            }
          />
        )}
        <Pagination page={page} setPage={setPage} total={filtered.length} />
      </div>
      <Sheet
        open={!!selected}
        onOpenChange={(v) => {
          if (!v) setSelected(null);
        }}
      >
        <SheetContent className="detail-sheet order-detail-sheet sm:max-w-3xl">
          <SheetTitle>Commande #{selected?.id}</SheetTitle>
          <SheetDescription>Informations extraites et suivi de la commande.</SheetDescription>
          {selected && (
            <>
              <div className="order-detail-heading">
                <Status value={selected.status} />
                <Badge kind="green">
                  <ShieldCheck size={13} />
                  Confiance IA {selected.score} %
                </Badge>
              </div>
              <div className="order-detail-grid">
                <div>
                  <div className="source-conversation">
                    <h3>
                      <MessageCircle size={17} />
                      Conversation source
                    </h3>
                    <Badge>{selected.channel}</Badge>
                    <div className="source-message">
                      <strong>{selected.client}</strong>
                      <p>Bonjour, je souhaite commander vos soins Photo White.</p>
                      <time>10:30</time>
                    </div>
                    <div className="source-message ai">
                      <strong>Nour · Photo White</strong>
                      <p>
                        Avec plaisir ! Vous souhaitez{" "}
                        {selected.items
                          .map((i) => `${i.qty} ${products[i.product - 1]?.short}`)
                          .join(" et ")}{" "}
                        ?
                      </p>
                    </div>
                    <div className="source-message">
                      <strong>{selected.client}</strong>
                      <p>
                        <mark>
                          Oui je confirme{" "}
                          {selected.items
                            .map((i) => `${i.qty} ${products[i.product - 1]?.short}`)
                            .join(" et ")}
                          .
                        </mark>
                      </p>
                      <time>10:32</time>
                    </div>
                    <div className="source-message">
                      <p>
                        Livraison au {selected.address}, {selected.city}.
                      </p>
                    </div>
                  </div>
                  <h3 className="timeline-title">Historique de la commande</h3>
                  <div className="timeline">
                    {selected.history.map((h, i) => (
                      <div key={i}>
                        <span />
                        <p>{h}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3>Informations extraites par IA</h3>
                  <div className="detail-section">
                    <h4>Client</h4>
                    <strong>{selected.client}</strong>
                    <p>
                      {selected.phone}
                      <br />
                      {selected.email}
                    </p>
                  </div>
                  <div className="detail-section">
                    <h4>Livraison</h4>
                    <p>
                      {selected.address}
                      <br />
                      {selected.city}, Maroc
                    </p>
                  </div>
                  <div className="order-items">
                    {selected.items.map((i, index) => (
                      <div key={index}>
                        <img
                          src={productImages[i.product - 1]}
                          alt={products[i.product - 1]?.name}
                        />
                        <div>
                          <strong>{products[i.product - 1]?.short}</strong>
                          <span>
                            {products[i.product - 1]?.reference} · Qté {i.qty}
                          </span>
                        </div>
                        <b>{money(i.qty * i.price)}</b>
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    <span>Total</span>
                    <strong>{money(orderTotal(selected))}</strong>
                  </div>
                  <div className="detail-section">
                    <h4>Commercial</h4>
                    <p>{selected.commercial}</p>
                    <h4>Notes</h4>
                    <p>{selected.note}</p>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <Button variant="outline" onClick={() => setReject(selected)}>
                  <X />
                  Rejeter
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing({ ...selected, items: selected.items.map((i) => ({ ...i })) });
                    setSelected(null);
                  }}
                >
                  Modifier
                </Button>
                {["À valider", "À vérifier", "Nouvelle"].includes(selected.status) ? (
                  <Button onClick={() => changeStatus(selected, "Confirmée")}>
                    <Check />
                    Valider la commande
                  </Button>
                ) : (
                  <Select
                    value={selected.status}
                    onChange={(v) => changeStatus(selected, v)}
                    options={statuses}
                  />
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.client ? "Modifier la commande" : "Créer une commande"}
        description="Les informations restent modifiables avant validation."
        wide
      >
        {editing && (
          <>
            <div className="form-grid">
              {[
                { key: "client", label: "Nom du client" },
                { key: "phone", label: "Téléphone" },
                { key: "email", label: "E-mail" },
                { key: "address", label: "Adresse" },
                { key: "city", label: "Ville" },
              ].map((f) => (
                <FormField key={f.key} label={f.label}>
                  <input
                    value={editing[f.key as keyof Order] as string}
                    onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                  />
                </FormField>
              ))}
              <FormField label="Commercial">
                <Select
                  value={editing.commercial}
                  onChange={(v) => setEditing({ ...editing, commercial: v })}
                  options={["Sarah", "Mehdi", "Imane"]}
                />
              </FormField>
              <FormField label="Canal">
                <Select
                  value={editing.channel}
                  onChange={(v) => setEditing({ ...editing, channel: v })}
                  options={channels}
                />
              </FormField>
              <FormField label="Statut">
                <Select
                  value={editing.status}
                  onChange={(v) => setEditing({ ...editing, status: v })}
                  options={statuses}
                />
              </FormField>
            </div>
            <h3>Articles de la commande</h3>
            {editing.items.map((item, index) => (
              <div key={index} className="edit-order-line">
                <Select
                  value={products[item.product - 1]?.name ?? "Crème solaire invisible SPF 50+"}
                  onChange={(v) => {
                    const p = products.find((p) => p.name === v);
                    if (p)
                      setEditing({
                        ...editing,
                        items: editing.items.map((x, j) =>
                          j === index ? { ...x, product: p.id, price: p.price } : x,
                        ),
                      });
                  }}
                  options={products.map((p) => p.name)}
                />
                <FormField label="Quantité">
                  <input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        items: editing.items.map((x, j) =>
                          j === index ? { ...x, qty: Math.max(1, Number(e.target.value)) } : x,
                        ),
                      })
                    }
                  />
                </FormField>
                <FormField label="Prix MAD">
                  <input
                    type="number"
                    min={0}
                    value={item.price}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        items: editing.items.map((x, j) =>
                          j === index ? { ...x, price: Math.max(0, Number(e.target.value)) } : x,
                        ),
                      })
                    }
                  />
                </FormField>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Retirer l’article"
                  disabled={editing.items.length === 1}
                  onClick={() =>
                    setEditing({ ...editing, items: editing.items.filter((_, j) => j !== index) })
                  }
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() =>
                setEditing({
                  ...editing,
                  items: [...editing.items, { product: 1, qty: 1, price: 189 }],
                })
              }
            >
              <Plus />
              Ajouter un article
            </Button>
            <FormField label="Notes">
              <textarea
                value={editing.note}
                onChange={(e) => setEditing({ ...editing, note: e.target.value })}
              />
            </FormField>
            <div className="order-total">
              <span>Total</span>
              <strong>{money(orderTotal(editing))}</strong>
            </div>
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Annuler
              </Button>
              <Button onClick={() => save(editing)}>
                <Check />
                Enregistrer
              </Button>
            </div>
          </>
        )}
      </Modal>
      <Modal
        open={!!reject}
        onClose={() => setReject(null)}
        title="Rejeter la commande"
        description={reject?.id}
      >
        <FormField label="Motif du rejet">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Informations à corriger, demande du client…"
          />
        </FormField>
        <Button
          variant="destructive"
          onClick={() => {
            if (reject) changeStatus({ ...reject, note: reason || reject.note }, "Annulée");
            setReject(null);
            setReason("");
          }}
        >
          Confirmer le rejet
        </Button>
      </Modal>
      <ConfirmDelete
        open={!!del}
        onClose={() => setDel(null)}
        onConfirm={() => {
          setOrders(orders.filter((o) => o.id !== del));
          toast.success("Commande supprimée");
        }}
      />
    </>
  );
}
