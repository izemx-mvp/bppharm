import { useState } from "react";
import {
  Leaf,
  Check,
  Plus,
  Trash2,
  ShieldCheck,
  Globe,
  Feather,
  Bot,
  Clock3,
  Instagram,
  Facebook,
  Upload,
  UserRound,
  Bell,
  LockKeyhole,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  ArrowUpRight,
  MessageCircle,
  BarChart3,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button, PageHeader, Panel, FormField, Select, Badge, Modal, Avatar } from "./common";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useDemo } from "./store";
import { logoUrl } from "./assets";
import { CosmeticScene } from "./cosmetic-scene";
export function Configuration({
  kind = "community",
}: {
  kind?: "community" | "agent" | "general";
}) {
  const { config, setConfig, rules, setRules } = useDemo();
  const [draft, setDraft] = useState({ ...config });
  const [tones, setTones] = useState(
    (
      config[`${kind}-tones`] ||
      (kind === "agent" ? "Chaleureux, Professionnel" : "Premium, Éducatif")
    ).split(", "),
  );
  const [objectives, setObjectives] = useState(
    (config["objectives"] || "Notoriété, Vente").split(", "),
  );
  const [platforms, setPlatforms] = useState(
    (config["platforms"] || "true,true,false,false").split(",").map((v) => v === "true"),
  );
  const [days, setDays] = useState(
    (config["days"] || "true,true,true,true,true,false,false").split(",").map((v) => v === "true"),
  );
  const [rule, setRule] = useState<(typeof rules)[number] | null>(null);
  const [tab, setTab] = useState("Profil");
  const [avatar, setAvatar] = useState("");
  const [alerts, setAlerts] = useState([true, true, true, false]);
  const [start, setStart] = useState(config["start"] || "09:00");
  const [end, setEnd] = useState(config["end"] || "18:00");
  const field = (key: string, value: string) => setDraft({ ...draft, [key]: value });
  const toggle = (values: string[], value: string) =>
    values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
  const save = () => {
    setConfig({
      ...draft,
      [`${kind}-tones`]: tones.join(", "),
      objectives: objectives.join(", "),
      platforms: platforms.join(","),
      days: days.join(","),
      start,
      end,
    });
    toast.success("Configuration enregistrée avec succès");
  };
  return (
    <>
      <PageHeader
        eyebrow={
          kind === "general"
            ? "VOTRE ESPACE"
            : kind === "community"
              ? "COMMUNITY MANAGER IA"
              : "SERVICE CLIENT IA"
        }
        title={
          kind === "general"
            ? "Paramètres de l’espace"
            : kind === "community"
              ? "Configuration de marque"
              : "Paramètres de l’agent"
        }
        description={
          kind === "community"
            ? "Votre identité, votre voix et vos ambitions. L’agent s’adapte à vous."
            : kind === "agent"
              ? "Un agent qui connaît votre marque et respecte vos règles."
              : "Personnalisez votre espace et les préférences de votre équipe."
        }
        action={
          <Button onClick={save}>
            <Check />
            Enregistrer la configuration
          </Button>
        }
      />
      {kind === "general" && (
        <div className="resource-tabs">
          {["Profil", "Notifications", "Sécurité", "Équipe"].map((t) => (
            <Button
              variant="ghost"
              key={t}
              className={tab === t ? "selected" : ""}
              onClick={() => setTab(t)}
            >
              {t}
            </Button>
          ))}
        </div>
      )}
      <div className="settings-layout">
        <div className="settings-main">
          {(kind !== "general" || tab === "Profil") && (
            <Panel
              title={
                kind === "agent"
                  ? "Identité de votre agent"
                  : kind === "general"
                    ? "Votre profil"
                    : "Identité de marque"
              }
              sub="Les informations qui vous rendent unique."
            >
              <div className="settings-brand">
                <label className="brand-upload">
                  {avatar ? (
                    <img src={avatar} alt="Image personnalisée" />
                  ) : kind === "agent" ? (
                    <Leaf size={32} />
                  ) : kind === "general" ? (
                    <Avatar name="Sarah Bennani" />
                  ) : (
                    <img src={logoUrl} alt="Photo White" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setAvatar(URL.createObjectURL(f));
                        toast.success("Image mise à jour");
                      }
                    }}
                  />
                  <span>
                    <Upload size={13} />
                    Modifier
                  </span>
                </label>
                <div>
                  <strong>
                    {kind === "agent"
                      ? "Nour · Photo White"
                      : kind === "general"
                        ? "Sarah Bennani"
                        : "Photo White"}
                  </strong>
                  <p>
                    {kind === "agent"
                      ? "Votre conseillère dermocosmétique"
                      : kind === "general"
                        ? "Administratrice · BPPHARM"
                        : "L’expertise dermocosmétique"}
                  </p>
                </div>
              </div>
              <div className="form-grid">
                <FormField
                  label={
                    kind === "agent"
                      ? "Nom de l’agent"
                      : kind === "general"
                        ? "Nom complet"
                        : "Nom de la marque"
                  }
                >
                  <input
                    value={
                      draft[
                        kind === "agent" ? "agent" : kind === "general" ? "profile" : "brand"
                      ] || (kind === "general" ? "Sarah Bennani" : "")
                    }
                    onChange={(e) =>
                      field(
                        kind === "agent" ? "agent" : kind === "general" ? "profile" : "brand",
                        e.target.value,
                      )
                    }
                  />
                </FormField>
                <FormField label={kind === "general" ? "Adresse e-mail" : "Site web"}>
                  <input
                    value={
                      kind === "general"
                        ? draft["email"] || "admin@photowhite.ma"
                        : draft["website"]
                    }
                    onChange={(e) =>
                      field(kind === "general" ? "email" : "website", e.target.value)
                    }
                  />
                </FormField>
              </div>
              {kind !== "general" && (
                <FormField
                  label={kind === "agent" ? "Message d’accueil" : "Description de la marque"}
                >
                  <textarea
                    rows={3}
                    value={draft[kind === "agent" ? "welcome" : "description"]}
                    onChange={(e) =>
                      field(kind === "agent" ? "welcome" : "description", e.target.value)
                    }
                  />
                </FormField>
              )}
            </Panel>
          )}
          {kind !== "general" && (
            <Panel title="Tonalité & langage" sub="Une voix cohérente à chaque interaction.">
              <FormField label="Tonalités">
                <div className="choice-chips">
                  {(kind === "community"
                    ? ["Professionnel", "Premium", "Éducatif", "Accessible", "Expert", "Inspirant"]
                    : ["Chaleureux", "Professionnel", "Expert", "Commercial"]
                  ).map((t) => (
                    <Button
                      key={t}
                      variant={tones.includes(t) ? "secondary" : "outline"}
                      onClick={() => setTones(toggle(tones, t))}
                    >
                      {tones.includes(t) && <Check size={13} />} {t}
                    </Button>
                  ))}
                </div>
              </FormField>
              <div className="form-grid">
                <FormField label="Langue">
                  <Select
                    value={draft["language"] ?? "Français"}
                    onChange={(v) => field("language", v)}
                    options={["Français", "Arabe", "Darija"]}
                  />
                </FormField>
                {kind === "community" && (
                  <FormField label="Taille des légendes">
                    <Select
                      value={draft["length"] || "Moyenne"}
                      onChange={(v) => field("length", v)}
                      options={["Courte", "Moyenne", "Longue"]}
                    />
                  </FormField>
                )}
              </div>
            </Panel>
          )}
          {kind === "community" && (
            <>
              <Panel
                title="Objectifs marketing"
                sub="Donnez une direction claire à votre créativité."
              >
                <div className="choice-chips">
                  {["Notoriété", "Engagement", "Acquisition", "Vente", "Fidélisation"].map((o) => (
                    <Button
                      variant={objectives.includes(o) ? "secondary" : "outline"}
                      key={o}
                      onClick={() => setObjectives(toggle(objectives, o))}
                    >
                      {objectives.includes(o) && <Check size={13} />} {o}
                    </Button>
                  ))}
                </div>
              </Panel>
              <Panel title="Plateformes & fréquence" sub="Un rythme adapté à votre communauté.">
                <div className="platform-settings">
                  {["Instagram", "Facebook", "LinkedIn", "TikTok"].map((p, i) => (
                    <div key={p}>
                      <Instagram size={20} />
                      <strong>{p}</strong>
                      <Switch
                        aria-label={`Activer ${p}`}
                        checked={platforms[i] ?? false}
                        onCheckedChange={(v) =>
                          setPlatforms(platforms.map((x, j) => (j === i ? v : x)))
                        }
                      />
                    </div>
                  ))}
                </div>
                <FormField label="Publications par semaine">
                  <div className="frequency-input">
                    <input
                      type="number"
                      min={1}
                      max={14}
                      value={draft["frequency"]}
                      onChange={(e) => field("frequency", e.target.value)}
                    />
                    <span>posts / semaine</span>
                  </div>
                </FormField>
              </Panel>
            </>
          )}
          {kind === "agent" && (
            <>
              <Panel
                title="Disponibilité & autonomie"
                sub="Définissez le cadre d’action de votre agent."
              >
                <FormField label="Jours de disponibilité">
                  <div className="choice-chips">
                    {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d, i) => (
                      <Button
                        key={d}
                        variant={days[i] ? "secondary" : "outline"}
                        onClick={() => setDays(days.map((x, j) => (j === i ? !x : x)))}
                      >
                        {d}
                      </Button>
                    ))}
                  </div>
                </FormField>
                <div className="form-grid">
                  <FormField label="De">
                    <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
                  </FormField>
                  <FormField label="À">
                    <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
                  </FormField>
                </div>
                <FormField label="Niveau d’autonomie">
                  <Slider
                    min={1}
                    max={3}
                    step={1}
                    value={[Number(draft["autonomy"])]}
                    onValueChange={(v) => field("autonomy", String(v[0]))}
                  />
                  <div className="autonomy-labels">
                    <span>Faible</span>
                    <span>Élevé</span>
                  </div>
                  <Badge kind="green">
                    Mode {draft["autonomy"]} ·{" "}
                    {
                      ["Suggestion uniquement", "Réponse automatique aux FAQ", "Autonomie étendue"][
                        Number(draft["autonomy"]) - 1
                      ]
                    }
                  </Badge>
                </FormField>
              </Panel>
              <Panel
                title="Règles d’escalade"
                sub="L’IA sait quand passer le relais."
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setRule({
                        id: Date.now(),
                        condition: "",
                        action: "Transférer à un humain",
                        active: true,
                      })
                    }
                  >
                    <Plus />
                    Ajouter une règle
                  </Button>
                }
              >
                <div className="rules-list">
                  {rules.map((r) => (
                    <div className="rule-row" key={r.id}>
                      <ShieldCheck size={18} />
                      <div>
                        <Button variant="link" onClick={() => setRule({ ...r })}>
                          Si {r.condition}
                        </Button>
                        <p>
                          <ArrowRight size={13} />
                          {r.action}
                        </p>
                      </div>
                      <Switch
                        checked={r.active}
                        aria-label="Activer la règle"
                        onCheckedChange={(v) =>
                          setRules(rules.map((x) => (x.id === r.id ? { ...x, active: v } : x)))
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Supprimer la règle"
                        onClick={() => {
                          setRules(rules.filter((x) => x.id !== r.id));
                          toast.success("Règle supprimée");
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              </Panel>
            </>
          )}
          {kind === "general" && tab === "Notifications" && (
            <Panel
              title="Préférences de notifications"
              sub="Les bonnes informations, au bon moment."
            >
              {[
                "Commandes à valider",
                "Publications prêtes",
                "Transferts de conversations",
                "Résumé quotidien par e-mail",
              ].map((l, i) => (
                <div className="settings-toggle" key={l}>
                  <strong>{l}</strong>
                  <Switch
                    aria-label={l}
                    checked={alerts[i] ?? false}
                    onCheckedChange={(v) => {
                      setAlerts(alerts.map((x, j) => (j === i ? v : x)));
                      toast.success("Préférence mise à jour");
                    }}
                  />
                </div>
              ))}
            </Panel>
          )}
          {kind === "general" && tab === "Sécurité" && (
            <Panel
              title="Sécurité de votre espace"
              sub="Mise à jour simulée pour votre démonstration."
            >
              <FormField label="Mot de passe actuel">
                <input
                  type="password"
                  value={draft["oldPassword"] || ""}
                  onChange={(e) => field("oldPassword", e.target.value)}
                />
              </FormField>
              <FormField label="Nouveau mot de passe">
                <input
                  type="password"
                  value={draft["newPassword"] || ""}
                  onChange={(e) => field("newPassword", e.target.value)}
                />
              </FormField>
              <Button
                onClick={() => {
                  if ((draft["newPassword"] || "").length < 8) {
                    toast.error("Utilisez au moins 8 caractères");
                    return;
                  }
                  field("newPassword", "");
                  toast.success("Mot de passe mis à jour · Simulation");
                }}
              >
                <LockKeyhole />
                Mettre à jour
              </Button>
            </Panel>
          )}
          {kind === "general" && tab === "Équipe" && <TeamPanel />}
        </div>
        <aside className="settings-aside">
          <div className="settings-agent-icon">
            <Leaf size={29} />
          </div>
          <Badge kind="green">{kind === "general" ? "Équipe connectée" : "Agent actif"}</Badge>
          <h2>
            {kind === "community"
              ? "Votre marque prend la parole."
              : kind === "agent"
                ? "Un conseil juste. Une relation durable."
                : "Un espace qui vous ressemble."}
          </h2>
          <p>
            {kind === "community"
              ? "Votre agent crée des contenus en accord avec vos produits, votre tonalité et vos objectifs."
              : kind === "agent"
                ? "Nour s’appuie sur votre base de connaissances et passe le relais selon vos règles."
                : "Votre équipe Photo White reste synchronisée autour des mêmes informations."}
          </p>
          <div className="settings-check">
            <Check />
            Identité cohérente
          </div>
          <div className="settings-check">
            <Check />
            Expertise dermocosmétique
          </div>
          <div className="settings-check">
            <Check />
            Contrôle humain
          </div>
        </aside>
      </div>
      <Modal
        open={!!rule}
        onClose={() => setRule(null)}
        title="Règle d’escalade"
        description="Définissez une condition et la réponse de votre agent."
      >
        {rule && (
          <>
            <FormField label="Si…">
              <input
                value={rule.condition}
                onChange={(e) => setRule({ ...rule, condition: e.target.value })}
              />
            </FormField>
            <FormField label="Alors…">
              <Select
                value={rule.action}
                onChange={(v) => setRule({ ...rule, action: v })}
                options={[
                  "Transférer à un humain",
                  "Demander validation humaine",
                  "Affecter au service client",
                ]}
              />
            </FormField>
            <Button
              disabled={!rule.condition.trim()}
              onClick={() => {
                setRules(
                  rules.some((r) => r.id === rule.id)
                    ? rules.map((r) => (r.id === rule.id ? rule : r))
                    : [...rules, rule],
                );
                setRule(null);
                toast.success("Règle enregistrée");
              }}
            >
              <Check />
              Enregistrer la règle
            </Button>
          </>
        )}
      </Modal>
    </>
  );
}
function TeamPanel() {
  const [members, setMembers] = useState([
    { name: "Sarah Bennani", role: "Administratrice" },
    { name: "Mehdi El Idrissi", role: "Commercial" },
    { name: "Imane Berrada", role: "Service client" },
  ]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Commercial");
  return (
    <>
      <Panel
        title="Collaborateurs"
        action={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus />
            Inviter
          </Button>
        }
      >
        {members.map((m) => (
          <div className="team-row" key={m.name}>
            <Avatar name={m.name} />
            <div>
              <strong>{m.name}</strong>
              <span>{m.role}</span>
            </div>
            <Badge kind="green">Actif</Badge>
          </div>
        ))}
      </Panel>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Inviter un collaborateur"
        description="Invitation simulée dans votre espace."
      >
        <FormField label="Nom">
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </FormField>
        <FormField label="E-mail">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormField>
        <FormField label="Rôle">
          <Select
            value={role}
            onChange={setRole}
            options={["Commercial", "Service client", "Community Manager", "Administratrice"]}
          />
        </FormField>
        <Button
          disabled={!name || !email.includes("@")}
          onClick={() => {
            setMembers([...members, { name, role }]);
            setOpen(false);
            toast.success("Collaborateur ajouté à la démonstration");
          }}
        >
          Inviter
        </Button>
      </Modal>
    </>
  );
}
export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@photowhite.ma");
  const [password, setPassword] = useState("admin123");
  const [visible, setVisible] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const login = (direct = false) => {
    if (!direct && (email !== "admin@photowhite.ma" || password !== "admin123")) {
      setError("Ces identifiants ne correspondent pas au compte de démonstration.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      navigate({ to: "/" });
      toast.success("Bienvenue dans votre espace Photo White");
    }, 1200);
  };
  return (
    <div className="login-page">
      <div className="login-visual">
        <div className="login-silk" aria-hidden="true" />
        <div className="login-brand">
          <img src={logoUrl} alt="Photo White" />
          <Badge>BPPHARM</Badge>
        </div>
        <div className="login-copy">
          <div className="eyebrow">VOTRE ACTIVITÉ. UNE NOUVELLE DIMENSION.</div>
          <h1>
            Pilotez votre activité
            <br />
            avec l’intelligence
            <br />
            artificielle.
          </h1>
          <p>
            Marketing, service client, commandes et performances réunis dans une seule plateforme.
          </p>
        </div>
        <CosmeticScene />
        <div className="login-floating-stats">
          <div>
            <MessageCircle />
            <strong>1 240</strong>
            <span>conversations traitées</span>
          </div>
          <div>
            <ShieldCheck />
            <strong>94 %</strong>
            <span>de demandes prises en charge</span>
          </div>
          <div>
            <Clock3 />
            <strong>128 h</strong>
            <span>économisées</span>
          </div>
        </div>
        <div className="login-bottom">L’expertise dermocosmétique. L’intelligence en plus.</div>
      </div>
      <div className="login-form-side">
        <span className="login-security">
          <ShieldCheck size={14} />
          Espace professionnel sécurisé
        </span>
        <div className="login-form">
          <span className="login-leaf">
            <Leaf size={26} />
          </span>
          <h2>Bienvenue.</h2>
          <p>Connectez-vous à votre espace Photo White.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
          >
            <FormField label="Adresse e-mail">
              <input
                type="email"
                required
                placeholder="vous@photowhite.ma"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>
            <FormField label="Mot de passe">
              <div className="password-field">
                <input
                  type={visible ? "text" : "password"}
                  required
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </FormField>
            <div className="login-options">
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Se souvenir de moi
              </label>
              <Button type="button" variant="link" onClick={() => setForgot(true)}>
                Mot de passe oublié ?
              </Button>
            </div>
            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" size="lg" className="login-submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Connexion…
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight />
                </>
              )}
            </Button>
          </form>
          <div className="login-divider">
            <span>ou découvrez votre futur espace</span>
          </div>
          <Button
            variant="outline"
            size="lg"
            className="login-demo"
            disabled={loading}
            onClick={() => login(true)}
          >
            Accéder à la démonstration <ArrowUpRight />
          </Button>
          <div className="demo-credentials">
            <Badge>COMPTE DÉMO</Badge>
            <span>
              admin@photowhite.ma <i>·</i> admin123
            </span>
          </div>
        </div>
        <div className="login-legal">© 2026 BPPHARM / Photo White · Tous droits réservés.</div>
      </div>
      <Modal
        open={forgot}
        onClose={() => setForgot(false)}
        title="Réinitialiser votre mot de passe"
        description="Envoi simulé pour le compte de démonstration."
      >
        <FormField label="Adresse e-mail">
          <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
        </FormField>
        <Button
          disabled={!resetEmail.includes("@")}
          onClick={() => {
            setForgot(false);
            toast.success("Demande de réinitialisation enregistrée · Simulation");
          }}
        >
          Envoyer le lien
        </Button>
      </Modal>
    </div>
  );
}
