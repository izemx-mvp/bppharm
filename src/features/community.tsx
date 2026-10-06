import { useState } from "react";
import {
  Feather,
  Plus,
  Wand2,
  Grid2X2,
  List,
  ArrowUpRight,
  CalendarDays,
  Instagram,
  Facebook,
  ChevronLeft,
  ChevronRight,
  Send,
  ImagePlus,
  Check,
  Clock,
  Copy,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  PageHeader,
  Panel,
  Badge,
  Status,
  SearchInput,
  Select,
  IconButton,
  Modal,
  FormField,
  ItemMenu,
  ConfirmDelete,
  AiLoading,
  Empty,
  useAiSimulation,
  Pagination,
} from "./common";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useDemo } from "./store";
import { products, seedIdeas, defaultIdea, type Idea } from "./data";
import { productImages } from "./assets";
import editorial from "@/assets/skincare-editorial.jpg";
export function Community() {
  const { ideas, setIdeas } = useDemo();
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("Toutes les plateformes");
  const [type, setType] = useState("Tous les formats");
  const [status, setStatus] = useState("Tous les statuts");
  const [product, setProduct] = useState("Tous les produits");
  const [objective, setObjective] = useState("Tous les objectifs");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [generate, setGenerate] = useState(false);
  const [count, setCount] = useState("5");
  const [genProduct, setGenProduct] = useState(
    products[0]?.name ?? "Crème solaire invisible SPF 50+",
  );
  const [genPlatform, setGenPlatform] = useState("Instagram");
  const [genObjective, setGenObjective] = useState("Éducation");
  const [editing, setEditing] = useState<Idea | null>(null);
  const [detail, setDetail] = useState<Idea | null>(null);
  const [del, setDel] = useState<number | null>(null);
  const [manual, setManual] = useState(false);
  const [step, setStep] = useState(1);
  const [media, setMedia] = useState("");
  const [uploadType, setUploadType] = useState("");
  const ai = useAiSimulation();
  const [postLoading, setPostLoading] = useState(false);
  const [schedule, setSchedule] = useState(false);
  const filtered = ideas.filter(
    (i) =>
      (i.title + " " + i.description).toLowerCase().includes(search.toLowerCase()) &&
      (platform === "Toutes les plateformes" || i.platform === platform) &&
      (type === "Tous les formats" || i.type === type) &&
      (status === "Tous les statuts" || i.status === status) &&
      (product === "Tous les produits" || products[i.product - 1]?.name === product) &&
      (objective === "Tous les objectifs" || i.objective === objective),
  );
  const updateFilter = (fn: (v: string) => void) => (v: string) => {
    fn(v);
    setPage(1);
  };
  const save = (item: Idea) => {
    setIdeas(
      ideas.some((i) => i.id === item.id)
        ? ideas.map((i) => (i.id === item.id ? item : i))
        : [item, ...ideas],
    );
    toast.success("Publication enregistrée");
    setEditing(null);
    setManual(false);
    setSchedule(false);
  };
  const duplicate = (i: Idea) => {
    setIdeas([
      { ...i, id: Date.now(), title: i.title + " · Copie", status: "Brouillon" },
      ...ideas,
    ]);
    toast.success("Idée dupliquée");
  };
  const generatePost = (i: Idea) => {
    setEditing({ ...i });
    setPostLoading(true);
    setTimeout(() => {
      setPostLoading(false);
      toast.success("Votre publication est prête");
    }, 1400);
  };
  const blank = () => ({
    ...defaultIdea,
    id: Date.now(),
    title: "",
    caption: "",
    status: "Brouillon",
  });
  return (
    <>
      <PageHeader
        eyebrow="VOTRE AGENT CRÉATIF"
        title="Community Manager IA"
        description="Imaginez, créez et planifiez les contenus qui font rayonner Photo White."
        action={
          <Button onClick={() => setGenerate(true)}>
            <Wand2 />
            Générer des idées
          </Button>
        }
      />
      <div className="community-stats">
        {[
          { value: ideas.length, label: "Idées disponibles", icon: Feather },
          {
            value: ideas.filter((i) => i.status === "Planifiée").length,
            label: "Publications programmées",
            icon: CalendarDays,
          },
          { value: 12, label: "Publiées ce mois", icon: Send },
          {
            value: ideas.filter((i) => i.status === "À valider").length,
            label: "En attente de validation",
            icon: Clock,
          },
        ].map((s) => (
          <div key={s.label}>
            <span className="mini-stat-icon">
              <s.icon size={18} />
            </span>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
      <div className="community-feature">
        <img src={editorial} alt="Univers dermocosmétique Photo White" />
        <div>
          <Badge kind="green">INSPIRATION DU MOIS</Badge>
          <h2>
            De nouvelles idées.
            <br />
            Le même éclat.
          </h2>
          <p>Votre expertise, transformée en contenus qui inspirent.</p>
          <Button variant="outline" onClick={() => setGenerate(true)}>
            Trouver ma prochaine idée <ArrowUpRight />
          </Button>
        </div>
      </div>
      <div className="section-title-row">
        <h2>
          Vos idées de contenus <span>{ideas.length}</span>
        </h2>
        <Button
          variant="outline"
          onClick={() => {
            setEditing(blank());
            setManual(true);
            setStep(1);
            setMedia("");
          }}
        >
          <Plus />
          Création manuelle
        </Button>
      </div>
      <div className="content-toolbar">
        <SearchInput
          value={search}
          onChange={updateFilter(setSearch)}
          placeholder="Rechercher une idée…"
        />
        <Select
          value={platform}
          onChange={updateFilter(setPlatform)}
          options={["Toutes les plateformes", "Instagram", "Facebook", "LinkedIn", "TikTok"]}
        />
        <Select
          value={type}
          onChange={updateFilter(setType)}
          options={["Tous les formats", "Carrousel", "Reel", "Post", "Story"]}
        />
        <Select
          value={status}
          onChange={updateFilter(setStatus)}
          options={[
            "Tous les statuts",
            "Brouillon",
            "À valider",
            "Planifiée",
            "Publiée",
            "Annulée",
          ]}
        />
        <div className="view-control">
          <IconButton label="Vue grille" onClick={() => setView("grid")}>
            <Grid2X2 />
          </IconButton>
          <IconButton label="Vue liste" onClick={() => setView("list")}>
            <List />
          </IconButton>
        </div>
      </div>
      <div className="secondary-filters">
        <Select
          value={product}
          onChange={updateFilter(setProduct)}
          options={["Tous les produits", ...products.map((p) => p.name)]}
        />
        <Select
          value={objective}
          onChange={updateFilter(setObjective)}
          options={[
            "Tous les objectifs",
            "Éducation",
            "Conversion",
            "Engagement",
            "Notoriété",
            "Vente",
            "Lancement",
          ]}
        />
      </div>
      <div className={`ideas-grid ${view === "list" ? "ideas-list" : ""}`}>
        {filtered.slice((page - 1) * 9, page * 9).map((idea, i) => (
          <article className="idea-card" key={idea.id}>
            <div className={`idea-preview preview-${idea.product % 3}`}>
              <img
                src={productImages[idea.product - 1]}
                alt={products[idea.product - 1]?.name}
                loading="lazy"
              />
              <span className="idea-platform">
                <Instagram size={13} />
                {idea.platform}
              </span>
              <span className="idea-format">{idea.type}</span>
            </div>
            <div className="idea-body">
              <div className="idea-product">
                {products[idea.product - 1]?.short}
                <ItemMenu
                  onView={() => setDetail(idea)}
                  onEdit={() => setEditing({ ...idea })}
                  onDuplicate={() => duplicate(idea)}
                  onDelete={() => setDel(idea.id)}
                  extra={[
                    {
                      label: "Planifier",
                      action: () => {
                        setEditing({ ...idea });
                        setSchedule(true);
                      },
                    },
                    { label: "Générer le post", action: () => generatePost(idea) },
                  ]}
                />
              </div>
              <h3>{idea.title}</h3>
              <p>{idea.description}</p>
              <div className="idea-meta">
                <Badge>{idea.objective}</Badge>
                <Status value={idea.status} />
              </div>
              <div className="idea-footer">
                <span>
                  <CalendarDays size={13} />
                  {new Date(idea.date + "T12:00").toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <Button variant="ghost" size="sm" onClick={() => generatePost(idea)}>
                  Générer le post <ArrowUpRight />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <Empty
          title="Aucune idée pour ces filtres"
          action={<Button onClick={() => setGenerate(true)}>Générer une idée</Button>}
        />
      )}
      <Pagination page={page} setPage={setPage} total={filtered.length} size={9} />
      <Modal
        open={generate}
        onClose={() => setGenerate(false)}
        title="Une nouvelle dose d’inspiration"
        description="Votre agent imagine des contenus adaptés à votre marque."
      >
        {ai.loading ? (
          <AiLoading text={ai.stage} />
        ) : (
          <>
            <div className="form-grid">
              <FormField label="Produit">
                <Select
                  value={genProduct}
                  onChange={setGenProduct}
                  options={products.map((p) => p.name)}
                />
              </FormField>
              <FormField label="Objectif">
                <Select
                  value={genObjective}
                  onChange={setGenObjective}
                  options={[
                    "Notoriété",
                    "Engagement",
                    "Conversion",
                    "Vente",
                    "Éducation",
                    "Lancement",
                  ]}
                />
              </FormField>
              <FormField label="Plateforme">
                <Select
                  value={genPlatform}
                  onChange={setGenPlatform}
                  options={["Instagram", "Facebook", "LinkedIn", "TikTok"]}
                />
              </FormField>
              <FormField label="Nombre d’idées">
                <Select value={count} onChange={setCount} options={["3", "5", "10"]} />
              </FormField>
            </div>
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setGenerate(false)}>
                Annuler
              </Button>
              <Button
                onClick={() =>
                  ai.run(() => {
                    const p = products.find((p) => p.name === genProduct)?.id || 1;
                    const fresh = Array.from({ length: Number(count) }, (_, i) => ({
                      ...(seedIdeas[i] ?? defaultIdea),
                      id: Date.now() + i,
                      title:
                        [
                          `Le rituel ${products[p - 1]?.short ?? "Photo White"}`,
                          `Votre peau, notre expertise`,
                          `L’éclat au quotidien`,
                          `Le bon soin au bon moment`,
                          `Une nouvelle routine à adopter`,
                        ][i % 5] ?? "Une routine Photo White",
                      product: p,
                      platform: genPlatform,
                      objective: genObjective,
                      status: "Brouillon",
                    }));
                    setIdeas([...fresh, ...ideas]);
                    setGenerate(false);
                    setPage(1);
                    toast.success(`${count} nouvelles idées ont été générées.`);
                  })
                }
              >
                <Wand2 />
                Générer
              </Button>
            </div>
          </>
        )}
      </Modal>
      <Sheet
        open={detail !== null}
        onOpenChange={(v) => {
          if (!v) setDetail(null);
        }}
      >
        <SheetContent className="detail-sheet sm:max-w-xl">
          <SheetTitle>Détail de l’idée</SheetTitle>
          <SheetDescription>Le concept et les recommandations de votre agent.</SheetDescription>
          {detail && (
            <>
              <div className="detail-preview">
                <img src={productImages[detail.product - 1]} alt={detail.title} />
              </div>
              <Badge>
                {detail.platform} · {detail.type}
              </Badge>
              <h2>{detail.title}</h2>
              <p>{detail.description}</p>
              {[
                ["Audience", "Femmes et hommes, 25–45 ans, sensibles à leur routine de soin"],
                ["Produit", products[detail.product - 1]?.name],
                ["Objectif", detail.objective],
                ["Angle marketing", "L’expertise dermocosmétique, accessible au quotidien"],
                ["Suggestion de texte", detail.caption],
                ["Hashtags", detail.hashtags],
                ["CTA", detail.cta],
                ["Recommandations créatives", detail.visual],
              ].map(([l, v]) => (
                <div className="detail-section" key={l}>
                  <h4>{l}</h4>
                  <p>{v}</p>
                </div>
              ))}
              <div className="modal-actions">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing({ ...detail });
                    setDetail(null);
                  }}
                >
                  <Pencil />
                  Modifier
                </Button>
                <Button
                  onClick={() => {
                    generatePost(detail);
                    setDetail(null);
                  }}
                >
                  <Wand2 />
                  Générer
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <Sheet
        open={editing !== null && !manual && !schedule}
        onOpenChange={(v) => {
          if (!v) setEditing(null);
        }}
      >
        <SheetContent className="detail-sheet sm:max-w-xl">
          <SheetTitle>Votre publication</SheetTitle>
          <SheetDescription>Affinez chaque détail avant la publication.</SheetDescription>
          {postLoading ? (
            <AiLoading text="L’agent prépare votre publication…" />
          ) : (
            editing && (
              <>
                <div className="post-preview">
                  <img src={productImages[editing.product - 1]} alt={editing.title} />
                  <Badge>{editing.platform}</Badge>
                </div>
                <div className="post-transformations">
                  {["Régénérer", "Raccourcir", "Plus commercial", "Plus premium"].map((a, i) => (
                    <Button
                      key={a}
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (i === 0) {
                          setPostLoading(true);
                          setTimeout(() => {
                            setPostLoading(false);
                            setEditing({
                              ...editing,
                              caption:
                                "Révélez votre éclat naturel avec Photo White. Des soins experts pour accompagner votre peau chaque jour. Découvrez une routine pensée pour vous.",
                            });
                          }, 1100);
                        } else
                          setEditing({
                            ...editing,
                            caption:
                              i === 1
                                ? editing.caption.split(".").slice(0, 2).join(".") + "."
                                : i === 2
                                  ? "Découvrez notre sélection Photo White et trouvez votre soin idéal. " +
                                    editing.caption
                                  : "L’excellence du soin, la signature Photo White. " +
                                    editing.caption,
                          });
                        toast.success("Texte retravaillé");
                      }}
                    >
                      <Wand2 size={12} />
                      {a}
                    </Button>
                  ))}
                </div>
                <PostFields editing={editing} setEditing={setEditing} />
                <div className="modal-actions">
                  <Button
                    variant="outline"
                    onClick={() => save({ ...editing, status: "Brouillon" })}
                  >
                    Enregistrer brouillon
                  </Button>
                  <Button onClick={() => setSchedule(true)}>
                    <CalendarDays />
                    Planifier
                  </Button>
                </div>
              </>
            )
          )}
        </SheetContent>
      </Sheet>
      <Modal
        open={schedule && !!editing}
        onClose={() => setSchedule(false)}
        title="Planifier votre publication"
        description={editing?.title}
      >
        {editing && (
          <>
            <div className="form-grid">
              <FormField label="Date">
                <input
                  type="date"
                  value={editing.date}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                />
              </FormField>
              <FormField label="Heure">
                <input
                  type="time"
                  value={editing.time}
                  onChange={(e) => setEditing({ ...editing, time: e.target.value })}
                />
              </FormField>
            </div>
            <FormField label="Statut">
              <Select
                value={editing.status}
                onChange={(v) => setEditing({ ...editing, status: v })}
                options={["Brouillon", "À valider", "Planifiée", "Publiée"]}
              />
            </FormField>
            <Button
              onClick={() => {
                save({
                  ...editing,
                  status: editing.status === "Publiée" ? "Publiée" : "Planifiée",
                });
                toast.success("Publication ajoutée au planning éditorial");
              }}
            >
              <CalendarDays />
              Confirmer la planification
            </Button>
          </>
        )}
      </Modal>
      <Modal
        open={manual && !!editing}
        onClose={() => {
          setManual(false);
          setEditing(null);
        }}
        title="Créer une publication"
        description={`Étape ${step} sur 4 · ${["Contenu", "Plateforme", "Média", "Publication"][step - 1]}`}
        wide
      >
        {editing && (
          <>
            <div className="step-indicator">
              {[1, 2, 3, 4].map((s) => (
                <span key={s} className={s <= step ? "done" : ""}>
                  {s < step ? <Check size={15} /> : s}
                </span>
              ))}
            </div>
            {step === 1 && (
              <>
                <FormField label="Titre">
                  <input
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  />
                </FormField>
                <FormField label="Idée">
                  <textarea
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  />
                </FormField>
                <FormField label="Texte">
                  <textarea
                    value={editing.caption}
                    onChange={(e) => setEditing({ ...editing, caption: e.target.value })}
                  />
                </FormField>
                <div className="form-grid">
                  <FormField label="Produit">
                    <Select
                      value={
                        products[editing.product - 1]?.name ?? "Crème solaire invisible SPF 50+"
                      }
                      onChange={(v) =>
                        setEditing({
                          ...editing,
                          product: products.find((p) => p.name === v)?.id || 1,
                        })
                      }
                      options={products.map((p) => p.name)}
                    />
                  </FormField>
                  <FormField label="Objectif">
                    <Select
                      value={editing.objective}
                      onChange={(v) => setEditing({ ...editing, objective: v })}
                      options={["Notoriété", "Engagement", "Conversion", "Vente", "Éducation"]}
                    />
                  </FormField>
                </div>
              </>
            )}
            {step === 2 && (
              <div className="platform-options">
                {["Instagram", "Facebook", "LinkedIn", "TikTok"].map((p) => (
                  <Button
                    key={p}
                    variant={editing.platform === p ? "default" : "outline"}
                    onClick={() => setEditing({ ...editing, platform: p })}
                  >
                    <Instagram />
                    {p}
                  </Button>
                ))}
              </div>
            )}
            {step === 3 && (
              <label
                className="upload-zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files[0];
                  if (f) {
                    setMedia(URL.createObjectURL(f));
                    setUploadType(f.type);
                    toast.success("Média ajouté");
                  }
                }}
              >
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setMedia(URL.createObjectURL(f));
                      setUploadType(f.type);
                    }
                  }}
                />
                {media ? (
                  uploadType.startsWith("video") ? (
                    <video src={media} controls />
                  ) : (
                    <img src={media} alt="Aperçu du média" />
                  )
                ) : (
                  <>
                    <ImagePlus />
                    <strong>Ajouter votre image ou vidéo</strong>
                    <span>Glissez votre fichier ou cliquez pour le sélectionner</span>
                  </>
                )}
              </label>
            )}
            {step === 4 && (
              <>
                <FormField label="Publication">
                  <Select
                    value={editing.status === "Publiée" ? "Publier maintenant" : "Planifier"}
                    onChange={(v) =>
                      setEditing({
                        ...editing,
                        status: v === "Publier maintenant" ? "Publiée" : "Planifiée",
                      })
                    }
                    options={["Planifier", "Publier maintenant"]}
                  />
                </FormField>
                {editing.status !== "Publiée" && (
                  <div className="form-grid">
                    <FormField label="Date">
                      <input
                        type="date"
                        value={editing.date}
                        onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                      />
                    </FormField>
                    <FormField label="Heure">
                      <input
                        type="time"
                        value={editing.time}
                        onChange={(e) => setEditing({ ...editing, time: e.target.value })}
                      />
                    </FormField>
                  </div>
                )}
              </>
            )}
            <div className="modal-actions">
              <Button
                variant="outline"
                onClick={() =>
                  step === 1 ? (setManual(false), setEditing(null)) : setStep(step - 1)
                }
              >
                {step === 1 ? "Annuler" : "Précédent"}
              </Button>
              <Button
                onClick={() => {
                  if (step === 1 && !editing.title.trim()) {
                    toast.error("Ajoutez un titre");
                    return;
                  }
                  if (step < 4) setStep(step + 1);
                  else
                    save({
                      ...editing,
                      status: editing.status === "Publiée" ? "Publiée" : "Planifiée",
                    });
                }}
              >
                {step === 4 ? "Créer la publication" : "Continuer"}
                <ArrowUpRight />
              </Button>
            </div>
          </>
        )}
      </Modal>
      <ConfirmDelete
        open={del !== null}
        onClose={() => setDel(null)}
        onConfirm={() => {
          setIdeas(ideas.filter((i) => i.id !== del));
          toast.success("Idée supprimée");
        }}
      />
    </>
  );
}
function PostFields({ editing, setEditing }: { editing: Idea; setEditing: (i: Idea) => void }) {
  return (
    <div className="post-fields">
      {[
        { key: "title", label: "Titre" },
        { key: "hook", label: "Accroche" },
        { key: "caption", label: "Légende" },
        { key: "cta", label: "CTA" },
        { key: "hashtags", label: "Hashtags" },
        { key: "visual", label: "Suggestion visuelle" },
      ].map((f) => (
        <FormField key={f.key} label={f.label}>
          {f.key === "caption" || f.key === "visual" ? (
            <textarea
              rows={4}
              value={editing[f.key as keyof Idea]}
              onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
            />
          ) : (
            <input
              value={editing[f.key as keyof Idea]}
              onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
            />
          )}
        </FormField>
      ))}
      <FormField label="Plateforme">
        <Select
          value={editing.platform}
          onChange={(v) => setEditing({ ...editing, platform: v })}
          options={["Instagram", "Facebook", "LinkedIn", "TikTok"]}
        />
      </FormField>
      <FormField label="Produit">
        <Select
          value={products[editing.product - 1]?.name ?? "Crème solaire invisible SPF 50+"}
          onChange={(v) =>
            setEditing({ ...editing, product: products.find((p) => p.name === v)?.id || 1 })
          }
          options={products.map((p) => p.name)}
        />
      </FormField>
    </div>
  );
}
export function Planning() {
  const { ideas, setIdeas } = useDemo();
  const [date, setDate] = useState(new Date(2026, 9, 6));
  const [view, setView] = useState("Mois");
  const [selected, setSelected] = useState<Idea | null>(null);
  const [del, setDel] = useState<number | null>(null);
  const year = date.getFullYear(),
    month = date.getMonth();
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const days = Array.from({ length: view === "Mois" ? 35 : view === "Semaine" ? 7 : 1 }, (_, i) =>
    view === "Mois"
      ? new Date(year, month, 1 - offset + i)
      : view === "Semaine"
        ? new Date(year, month, date.getDate() - ((date.getDay() + 6) % 7) + i)
        : new Date(date),
  );
  const iso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const move = (n: number) =>
    setDate(
      view === "Mois"
        ? new Date(year, month + n, date.getDate())
        : new Date(year, month, date.getDate() + n * (view === "Semaine" ? 7 : 1)),
    );
  const change = (i: Idea, status: string) => {
    setIdeas(ideas.map((x) => (x.id === i.id ? { ...i, status } : x)));
    setSelected(null);
    toast.success(
      status === "Publiée" ? "Publication publiée avec succès" : "Publication mise à jour",
    );
  };
  return (
    <>
      <PageHeader
        eyebrow="COMMUNITY MANAGER IA"
        title="Planning éditorial"
        description="Le bon contenu, au bon moment. Votre marque garde le rythme."
        action={
          <Button asChild>
            <a href="/community">
              <Plus />
              Nouvelle publication
            </a>
          </Button>
        }
      />
      <div className="calendar-toolbar">
        <div>
          <Button variant="outline" onClick={() => setDate(new Date(2026, 9, 6))}>
            Aujourd’hui
          </Button>
          <IconButton label="Période précédente" onClick={() => move(-1)}>
            <ChevronLeft />
          </IconButton>
          <IconButton label="Période suivante" onClick={() => move(1)}>
            <ChevronRight />
          </IconButton>
          <h2>{date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</h2>
        </div>
        <div className="small-segments">
          {["Mois", "Semaine", "Jour"].map((v) => (
            <Button
              key={v}
              variant="ghost"
              className={view === v ? "selected" : ""}
              onClick={() => setView(v)}
            >
              {v}
            </Button>
          ))}
        </div>
      </div>
      <div className="calendar-legend">
        <span>
          <i className="legend-instagram" />
          Instagram
        </span>
        <span>
          <i className="legend-facebook" />
          Facebook
        </span>
        <span>
          <i className="legend-linkedin" />
          LinkedIn
        </span>
        <span>
          <i className="legend-tiktok" />
          TikTok
        </span>
        <Badge>
          {ideas.filter((i) => i.status === "Planifiée").length} publications planifiées
        </Badge>
      </div>
      <div className={`editorial-calendar calendar-${view.toLowerCase()}`}>
        <div className="calendar-weekdays">
          {(view === "Jour"
            ? [date.toLocaleDateString("fr-FR", { weekday: "long" })]
            : ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
          ).map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="calendar-days">
          {days.map((day) => (
            <div
              key={iso(day)}
              className={`calendar-cell ${day.getMonth() !== month ? "outside" : ""} ${iso(day) === "2026-10-06" ? "today" : ""}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const id = Number(e.dataTransfer.getData("text/plain"));
                setIdeas(
                  ideas.map((i) =>
                    i.id === id ? { ...i, date: iso(day), status: "Planifiée" } : i,
                  ),
                );
                toast.success(
                  `Publication replanifiée au ${day.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} à 18:30.`,
                );
              }}
            >
              <span className="day-number">{day.getDate()}</span>
              {ideas
                .filter((i) => i.date === iso(day) && i.status !== "Annulée")
                .map((i) => (
                  <Button
                    variant="ghost"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", String(i.id))}
                    className={`calendar-event event-${i.platform.toLowerCase()}`}
                    key={i.id}
                    onClick={() => setSelected({ ...i })}
                  >
                    <span>
                      {i.time} · {i.platform}
                    </span>
                    <strong>{i.title}</strong>
                    <small>{i.status}</small>
                  </Button>
                ))}
            </div>
          ))}
        </div>
      </div>
      <div className="calendar-note">
        <span className="online-dot" />
        Votre agent prépare les prochains contenus Photo White.
      </div>
      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title="Publication"
        description={selected?.title}
        wide
      >
        {selected && (
          <>
            <div className="calendar-post-detail">
              <img src={productImages[selected.product - 1]} alt={selected.title} />
              <div>
                <Badge>{selected.platform}</Badge>
                <FormField label="Titre">
                  <input
                    value={selected.title}
                    onChange={(e) => setSelected({ ...selected, title: e.target.value })}
                  />
                </FormField>
                <FormField label="Contenu">
                  <textarea
                    rows={4}
                    value={selected.caption}
                    onChange={(e) => setSelected({ ...selected, caption: e.target.value })}
                  />
                </FormField>
              </div>
            </div>
            <div className="form-grid">
              <FormField label="Date">
                <input
                  type="date"
                  value={selected.date}
                  onChange={(e) => setSelected({ ...selected, date: e.target.value })}
                />
              </FormField>
              <FormField label="Heure">
                <input
                  type="time"
                  value={selected.time}
                  onChange={(e) => setSelected({ ...selected, time: e.target.value })}
                />
              </FormField>
            </div>
            <FormField label="Statut">
              <Select
                value={selected.status}
                onChange={(v) => setSelected({ ...selected, status: v })}
                options={["Brouillon", "À valider", "Planifiée", "Publiée", "Annulée"]}
              />
            </FormField>
            <div className="post-transformations">
              <Button
                variant="outline"
                onClick={() => {
                  setIdeas([
                    {
                      ...selected,
                      id: Date.now(),
                      title: selected.title + " · Copie",
                      status: "Brouillon",
                    },
                    ...ideas,
                  ]);
                  toast.success("Publication dupliquée");
                  setSelected(null);
                }}
              >
                <Copy />
                Dupliquer
              </Button>
              <Button variant="outline" onClick={() => change(selected, "Annulée")}>
                Annuler la publication
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setDel(selected.id);
                  setSelected(null);
                }}
              >
                <Trash2 />
                Supprimer
              </Button>
            </div>
            <div className="modal-actions">
              <Button variant="outline" onClick={() => change(selected, "Publiée")}>
                <Send />
                Publier maintenant
              </Button>
              <Button onClick={() => change(selected, selected.status)}>
                <Check />
                Enregistrer
              </Button>
            </div>
          </>
        )}
      </Modal>
      <ConfirmDelete
        open={del !== null}
        onClose={() => setDel(null)}
        onConfirm={() => {
          setIdeas(ideas.filter((i) => i.id !== del));
          toast.success("Publication supprimée");
        }}
      />
    </>
  );
}
