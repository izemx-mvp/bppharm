import { useState } from "react";
import {
  Plus,
  Upload,
  FileText,
  BookOpen,
  Check,
  Plug,
  MessageCircle,
  Globe,
  Instagram,
  Facebook,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Wand2,
  ArrowUpRight,
  Download,
  BarChart3,
  CalendarDays,
  Users,
  Bot,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  PageHeader,
  SearchInput,
  Select,
  Panel,
  Badge,
  Status,
  ItemMenu,
  Modal,
  FormField,
  ConfirmDelete,
  Pagination,
  AiLoading,
  Empty,
  useAiSimulation,
  downloadFile,
} from "./common";
import { useDemo } from "./store";
import { products, money, type RecordItem } from "./data";
import { productImages } from "./assets";
export function Resources({ kind = "faq" }: { kind?: "faq" | "knowledge" }) {
  const demo = useDemo();
  const records = kind === "faq" ? demo.faqs : demo.knowledge;
  const setRecords = kind === "faq" ? demo.setFaqs : demo.setKnowledge;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(kind === "faq" ? "Toutes les catégories" : "Produits");
  const [status, setStatus] = useState("Tous les statuts");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<RecordItem | null>(null);
  const [view, setView] = useState<RecordItem | null>(null);
  const [del, setDel] = useState<number | null>(null);
  const [importing, setImporting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const ai = useAiSimulation();
  const tabs = [
    "Produits",
    "Documents",
    "Informations générales",
    "Livraison & Conditions",
    "Procédures",
  ];
  const categories =
    kind === "faq" ? ["Toutes les catégories", "Produits", "Utilisation", "Livraison"] : tabs;
  const filtered = records.filter(
    (r) =>
      (r.title + " " + r.body).toLowerCase().includes(search.toLowerCase()) &&
      (category === "Toutes les catégories" || r.category === category) &&
      (status === "Tous les statuts" || (status === "Active" ? r.active : !r.active)),
  );
  const add = () =>
    setEditing({
      id: Date.now(),
      title: "",
      body: "",
      category: category === "Toutes les catégories" ? "Produits" : category,
      active: true,
      tags: "",
    });
  const save = () => {
    if (!editing?.title.trim() || !editing.body.trim()) {
      toast.error("Renseignez le titre et le contenu");
      return;
    }
    setRecords(
      records.some((r) => r.id === editing.id)
        ? records.map((r) => (r.id === editing.id ? editing : r))
        : [editing, ...records],
    );
    setEditing(null);
    toast.success(kind === "faq" ? "FAQ enregistrée" : "Information enregistrée");
  };
  const upload = (f: File) => {
    setFile(f);
    toast.success("Document ajouté à l’import");
  };
  return (
    <>
      <PageHeader
        eyebrow="SERVICE CLIENT IA"
        title={kind === "faq" ? "Questions fréquentes" : "Base de connaissances"}
        description={
          kind === "faq"
            ? "Des réponses justes, cohérentes et toujours à portée de votre agent."
            : "Toute votre expertise Photo White, au même endroit."
        }
        action={
          <div className="flex gap-2">
            {kind === "knowledge" && (
              <Button variant="outline" onClick={() => setImporting(true)}>
                <Upload />
                Importer un document
              </Button>
            )}
            <Button onClick={add}>
              <Plus />
              {kind === "faq" ? "Ajouter une FAQ" : "Ajouter une information"}
            </Button>
          </div>
        }
      />
      {kind === "knowledge" && (
        <div className="resource-tabs">
          {tabs.map((t) => (
            <Button
              key={t}
              variant="ghost"
              className={category === t ? "selected" : ""}
              onClick={() => {
                setCategory(t);
                setPage(1);
              }}
            >
              {t}
            </Button>
          ))}
        </div>
      )}
      <div className="content-toolbar">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder={kind === "faq" ? "Rechercher une question…" : "Rechercher une information…"}
        />
        {kind === "faq" && (
          <Select
            value={category}
            onChange={(v) => {
              setCategory(v);
              setPage(1);
            }}
            options={categories}
          />
        )}
        <Select
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          options={["Tous les statuts", "Active", "Inactive"]}
        />
        <Badge kind="green">
          <ShieldCheck size={13} />
          {records.filter((r) => r.active).length} sources actives
        </Badge>
      </div>
      {kind === "knowledge" && category === "Produits" ? (
        <div className="knowledge-products">
          {filtered.slice((page - 1) * 8, page * 8).map((r) => {
            const p = products.find((p) => p.name === r.title) || products[(r.id - 1) % 6];
            if (!p) return null;
            return (
              <article className="knowledge-product" key={r.id}>
                <div className="knowledge-product-image">
                  <img src={productImages[p.id - 1]} alt={p.name} />
                  <Status value={r.active ? "Active" : "Inactive"} />
                </div>
                <div>
                  <div className="idea-product">
                    {p.category}
                    <ItemMenu
                      onView={() => setView(r)}
                      onEdit={() => setEditing({ ...r })}
                      onDelete={() => setDel(r.id)}
                      extra={[
                        {
                          label: r.active ? "Désactiver" : "Activer",
                          action: () =>
                            setRecords(
                              records.map((x) => (x.id === r.id ? { ...x, active: !x.active } : x)),
                            ),
                        },
                      ]}
                    />
                  </div>
                  <h3>{r.title}</h3>
                  <span className="resource-ref">{p.reference}</span>
                  <div className="knowledge-product-footer">
                    <strong>{money(p.price)}</strong>
                    <Badge kind="green">En stock</Badge>
                  </div>
                  <small>Mis à jour le 6 octobre 2026</small>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="data-table-panel table-scroll">
          <table>
            <thead>
              <tr>
                <th>{kind === "faq" ? "QUESTION" : "INFORMATION"}</th>
                <th>CATÉGORIE</th>
                <th>{kind === "faq" ? "RÉPONSE" : "CONTENU"}</th>
                <th>STATUT</th>
                <th>MODIFICATION</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice((page - 1) * 8, page * 8).map((r) => (
                <tr key={r.id}>
                  <td>
                    <Button variant="link" className="record-title" onClick={() => setView(r)}>
                      {kind === "knowledge" && <FileText size={16} />}
                      <span>{r.title}</span>
                    </Button>
                  </td>
                  <td>
                    <Badge>{r.category}</Badge>
                  </td>
                  <td className="record-body">{r.body}</td>
                  <td>
                    <Status value={r.active ? "Active" : "Inactive"} />
                  </td>
                  <td>6 oct. 2026</td>
                  <td>
                    <ItemMenu
                      onView={() => setView(r)}
                      onEdit={() => setEditing({ ...r })}
                      onDuplicate={() => {
                        setRecords([
                          { ...r, id: Date.now(), title: r.title + " · Copie" },
                          ...records,
                        ]);
                        toast.success("Élément dupliqué");
                      }}
                      onDelete={() => setDel(r.id)}
                      extra={[
                        {
                          label: r.active ? "Désactiver" : "Activer",
                          action: () => {
                            setRecords(
                              records.map((x) => (x.id === r.id ? { ...x, active: !x.active } : x)),
                            );
                            toast.success("Statut mis à jour");
                          },
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {filtered.length === 0 && (
        <Empty
          action={
            <Button onClick={add}>
              <Plus />
              Ajouter
            </Button>
          }
        />
      )}
      <Pagination page={page} setPage={setPage} total={filtered.length} />
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={kind === "faq" ? "Éditer une FAQ" : "Éditer une information"}
        description="Vos agents utilisent uniquement les sources actives."
      >
        {editing && (
          <>
            <FormField label={kind === "faq" ? "Question" : "Titre"}>
              <input
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </FormField>
            <FormField label={kind === "faq" ? "Réponse" : "Contenu"}>
              <textarea
                rows={5}
                value={editing.body}
                onChange={(e) => setEditing({ ...editing, body: e.target.value })}
              />
            </FormField>
            <div className="form-grid">
              <FormField label="Catégorie">
                <Select
                  value={editing.category}
                  onChange={(v) => setEditing({ ...editing, category: v })}
                  options={categories.filter((c) => c !== "Toutes les catégories")}
                />
              </FormField>
              <FormField label="Statut">
                <Select
                  value={editing.active ? "Active" : "Inactive"}
                  onChange={(v) => setEditing({ ...editing, active: v === "Active" })}
                  options={["Active", "Inactive"]}
                />
              </FormField>
            </div>
            <FormField label="Tags">
              <input
                value={editing.tags}
                onChange={(e) => setEditing({ ...editing, tags: e.target.value })}
              />
            </FormField>
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Annuler
              </Button>
              <Button onClick={save}>
                <Check />
                Enregistrer
              </Button>
            </div>
          </>
        )}
      </Modal>
      <Modal
        open={!!view}
        onClose={() => setView(null)}
        title={view?.title || "Détail"}
        description={view?.category}
      >
        {view && (
          <>
            <Status value={view.active ? "Active" : "Inactive"} />
            <p className="resource-detail-body">{view.body}</p>
            <Badge>{view.tags}</Badge>
            <Button
              onClick={() => {
                setEditing({ ...view });
                setView(null);
              }}
            >
              Modifier
            </Button>
          </>
        )}
      </Modal>
      <ConfirmDelete
        open={del !== null}
        onClose={() => setDel(null)}
        onConfirm={() => {
          setRecords(records.filter((r) => r.id !== del));
          toast.success("Élément supprimé");
        }}
      />
      <Modal
        open={importing}
        onClose={() => setImporting(false)}
        title="Importer un document"
        description="PDF ou DOCX · Indexation simulée dans votre base."
      >
        {ai.loading ? (
          <AiLoading text="Analyse du document…" />
        ) : (
          <>
            <label
              className="upload-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) upload(f);
              }}
            >
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(f);
                }}
              />
              <Upload />
              <strong>{file?.name || "Sélectionner ou glisser un document"}</strong>
              <span>PDF, DOCX</span>
            </label>
            <Button
              disabled={!file}
              onClick={() =>
                ai.run(() => {
                  setRecords([
                    {
                      id: Date.now(),
                      title: file?.name || "Document importé",
                      body: "Document analysé et indexé dans la base de connaissances de démonstration.",
                      category: "Documents",
                      active: true,
                      tags: "Importé",
                    },
                    ...records,
                  ]);
                  setCategory("Documents");
                  setImporting(false);
                  setFile(null);
                  toast.success("Document indexé avec succès");
                })
              }
            >
              <Wand2 />
              Analyser et indexer
            </Button>
          </>
        )}
      </Modal>
    </>
  );
}
export function Applications() {
  const { connections, setConnections } = useDemo();
  const [config, setConfig] = useState<number | null>(null);
  const [account, setAccount] = useState("Photo White · Compte professionnel");
  const [syncFrequency, setSyncFrequency] = useState("Toutes les 5 minutes");
  const [loading, setLoading] = useState<number | null>(null);
  const apps = ["WhatsApp Business", "Site Photo White", "Instagram", "Facebook", "Messenger"];
  const icons = [MessageCircle, Globe, Instagram, Facebook, MessageCircle];
  const act = (i: number, action: string) => {
    setLoading(i);
    setTimeout(() => {
      if (action === "Connecter" || action === "Déconnecter")
        setConnections(connections.map((v, j) => (j === i ? !v : v)));
      setLoading(null);
      toast.success(
        action === "Tester"
          ? "Connexion testée avec succès"
          : action === "Synchroniser"
            ? "Synchronisation terminée"
            : action === "Connecter"
              ? `${apps[i]} connecté`
              : `${apps[i]} déconnecté`,
      );
    }, 1100);
  };
  return (
    <>
      <PageHeader
        eyebrow="SERVICE CLIENT IA"
        title="Applications & Canaux"
        description="Votre marque reste proche de vos clients, sur chaque canal."
      />
      <div className="connections-summary">
        <Plug />
        <strong>{connections.filter(Boolean).length} canaux connectés</strong>
        <span>Un seul espace pour toutes vos conversations.</span>
        <Badge kind="green">Synchronisation active</Badge>
      </div>
      <div className="application-grid">
        {apps.map((name, i) => {
          const Icon = icons[i] ?? MessageCircle;
          return (
            <article className="application-card" key={name}>
              <div className="application-card-top">
                <span className={`application-logo channel-${i}`}>
                  <Icon size={27} />
                </span>
                <Status value={connections[i] ? "Connecté" : "Non connecté"} />
              </div>
              <h2>{name}</h2>
              <p>
                {
                  [
                    "Vos conversations et commandes WhatsApp",
                    "Le chat et les commandes de votre boutique",
                    "Messages privés et commentaires Instagram",
                    "Votre communauté Facebook",
                    "Les conversations Messenger",
                  ][i]
                }
              </p>
              <div className="application-details">
                <span>
                  Dernière synchronisation<b>{connections[i] ? "Il y a 2 minutes" : "—"}</b>
                </span>
                <span>
                  Conversations<b>{connections[i] ? [1842, 964, 682, 248, 0][i] : 0}</b>
                </span>
              </div>
              {loading === i ? (
                <AiLoading text="Connexion en cours…" />
              ) : (
                <div className="application-actions">
                  <Button variant="outline" onClick={() => setConfig(i)}>
                    Configurer
                  </Button>
                  <ItemMenu
                    extra={[
                      {
                        label: connections[i] ? "Déconnecter" : "Connecter",
                        action: () => act(i, connections[i] ? "Déconnecter" : "Connecter"),
                      },
                      { label: "Tester", action: () => act(i, "Tester") },
                      { label: "Synchroniser", action: () => act(i, "Synchroniser") },
                    ]}
                  />
                  {!connections[i] && (
                    <Button onClick={() => act(i, "Connecter")}>
                      <Plug />
                      Connecter
                    </Button>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
      <Modal
        open={config !== null}
        onClose={() => setConfig(null)}
        title={`Configurer ${apps[config || 0]}`}
        description="Les connexions sont simulées dans cette démonstration."
      >
        <FormField label="Compte">
          <input value={account} onChange={(e) => setAccount(e.target.value)} />
        </FormField>
        <FormField label="Synchronisation">
          <Select
            value={syncFrequency}
            onChange={setSyncFrequency}
            options={["Toutes les 5 minutes", "Toutes les 15 minutes", "Toutes les heures"]}
          />
        </FormField>
        <Button
          onClick={() => {
            setConfig(null);
            toast.success("Configuration enregistrée");
          }}
        >
          <Check />
          Enregistrer
        </Button>
      </Modal>
    </>
  );
}
export function Reports() {
  const [period, setPeriod] = useState("Ce mois");
  const [department, setDepartment] = useState("Tous les départements");
  const [channel, setChannel] = useState("Tous les canaux");
  const [reports, setReports] = useState([
    { id: 1, title: "Rapport Commercial", date: "6 octobre 2026", type: "Commercial" },
    { id: 2, title: "Rapport Service Client", date: "5 octobre 2026", type: "Service Client" },
    { id: 3, title: "Rapport Community Management", date: "4 octobre 2026", type: "Marketing" },
    { id: 4, title: "Rapport Agents IA", date: "3 octobre 2026", type: "Agents IA" },
    { id: 5, title: "Rapport Commandes", date: "2 octobre 2026", type: "Commandes" },
  ]);
  const [view, setView] = useState<(typeof reports)[number] | null>(null);
  const [generation, setGeneration] = useState(false);
  const ai = useAiSimulation();
  const [reportType, setReportType] = useState("Commercial");
  const exportReport = (title: string, format: string) => {
    downloadFile(
      title + "." + (format === "Excel" ? "csv" : "html"),
      format === "Excel"
        ? "Indicateur;Valeur\nChiffre d’affaires;487350 MAD\nCommandes;1248\nConversations IA;3842\nHeures économisées;128"
        : `<html><head><title>${title}</title></head><body><h1>Photo White · ${title}</h1><p>${period} · ${channel}</p><h2>487 350 MAD de chiffre d’affaires</h2><p>1 248 commandes · 3 842 conversations IA · 128 heures économisées</p><p>Rapport de démonstration. Utilisez l’impression du navigateur pour enregistrer en PDF.</p></body></html>`,
      format === "Excel" ? "text/csv" : "text/html",
    );
    toast.success(
      format === "Excel"
        ? "Export compatible Excel téléchargé"
        : "Rapport imprimable téléchargé · Enregistrement PDF via votre navigateur",
    );
  };
  return (
    <>
      <PageHeader
        eyebrow="DIRECTION"
        title="Rapports & Analytics"
        description="Transformez les données de votre activité en décisions éclairées."
        action={
          <Button onClick={() => setGeneration(true)}>
            <Wand2 />
            Générer un rapport
          </Button>
        }
      />
      <div className="content-toolbar">
        <Select
          value={period}
          onChange={setPeriod}
          options={["Ce mois", "7 derniers jours", "Trimestre"]}
        />
        <Select
          value={department}
          onChange={setDepartment}
          options={[
            "Tous les départements",
            "Commercial",
            "Service Client",
            "Marketing",
            "Agents IA",
            "Commandes",
          ]}
        />
        <Select
          value={channel}
          onChange={setChannel}
          options={["Tous les canaux", "WhatsApp", "Site web", "Instagram", "Facebook"]}
        />
      </div>
      <div className="reports-overview">
        <BarChart3 />
        <div>
          <h2>Un mois sous le signe de la croissance.</h2>
          <p>+18,4 % de chiffre d’affaires et 128 heures rendues à votre équipe.</p>
        </div>
        <Badge kind="green">Octobre 2026</Badge>
      </div>
      <div className="reports-grid">
        {reports
          .filter((r) => department === "Tous les départements" || r.type === department)
          .map((r, i) => {
            const Icon = [BarChart3, Users, CalendarDays, Bot, ShoppingBag][i % 5] ?? BarChart3;
            return (
              <article className="report-card" key={r.id}>
                <span className="report-icon">
                  <Icon />
                </span>
                <Badge kind="green">Disponible</Badge>
                <h2>{r.title}</h2>
                <p>
                  {r.date} · {period} · {channel}
                </p>
                <div className="report-mini-stats">
                  <div>
                    <strong>{i % 2 === 0 ? "18,4 %" : "92 %"}</strong>
                    <span>{i % 2 === 0 ? "Croissance" : "Performance"}</span>
                  </div>
                  <div>
                    <strong>{i % 2 === 0 ? "1 248" : "128 h"}</strong>
                    <span>{i % 2 === 0 ? "Commandes" : "Économisées"}</span>
                  </div>
                </div>
                <div className="report-actions">
                  <Button variant="outline" onClick={() => setView(r)}>
                    Voir le rapport <ArrowUpRight />
                  </Button>
                  <ItemMenu
                    extra={[
                      { label: "Exporter PDF", action: () => exportReport(r.title, "PDF") },
                      { label: "Exporter Excel", action: () => exportReport(r.title, "Excel") },
                    ]}
                  />
                </div>
              </article>
            );
          })}
      </div>
      <Modal
        open={generation}
        onClose={() => setGeneration(false)}
        title="Générer un rapport"
        description="Consolidation des données de votre espace de démonstration."
      >
        {ai.loading ? (
          <AiLoading text="Génération du rapport…" />
        ) : (
          <>
            <FormField label="Département">
              <Select
                value={reportType}
                onChange={setReportType}
                options={["Commercial", "Service Client", "Marketing", "Agents IA", "Commandes"]}
              />
            </FormField>
            <FormField label="Période">
              <Select
                value={period}
                onChange={setPeriod}
                options={["Ce mois", "7 derniers jours", "Trimestre"]}
              />
            </FormField>
            <Button
              onClick={() =>
                ai.run(() => {
                  setReports([
                    {
                      id: Date.now(),
                      title: `Rapport ${reportType}`,
                      date: "6 octobre 2026",
                      type: reportType,
                    },
                    ...reports,
                  ]);
                  setGeneration(false);
                  toast.success("Rapport généré avec succès");
                })
              }
            >
              <Wand2 />
              Générer le rapport
            </Button>
          </>
        )}
      </Modal>
      <Modal
        open={!!view}
        onClose={() => setView(null)}
        title={view?.title || "Rapport"}
        description={`${period} · ${channel}`}
        wide
      >
        <div className="report-reading">
          <h2>Une activité en croissance</h2>
          <div className="report-mini-stats">
            <div>
              <strong>487 350 MAD</strong>
              <span>Chiffre d’affaires</span>
            </div>
            <div>
              <strong>1 248</strong>
              <span>Commandes</span>
            </div>
            <div>
              <strong>92 %</strong>
              <span>Taux de résolution</span>
            </div>
          </div>
          <h3>Points clés</h3>
          <p>
            WhatsApp reste le premier canal commercial. La protection solaire domine les ventes.
            L’assistance IA permet à l’équipe de se concentrer sur les demandes à forte valeur.
          </p>
          <h3>Recommandations</h3>
          <p>
            Renforcer les publications éducatives, suivre les commandes à valider et actualiser les
            réponses de la base de connaissances.
          </p>
        </div>
        <div className="modal-actions">
          <Button variant="outline" onClick={() => exportReport(view?.title || "rapport", "Excel")}>
            <Download />
            Exporter Excel
          </Button>
          <Button onClick={() => exportReport(view?.title || "rapport", "PDF")}>
            <Download />
            Exporter PDF
          </Button>
        </div>
      </Modal>
    </>
  );
}
