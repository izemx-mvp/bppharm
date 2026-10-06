import { useState, useRef } from "react";
import {
  Bot,
  CheckCheck,
  Headphones,
  Clock3,
  MessagesSquare,
  Search,
  UserRoundCheck,
  ArrowRightLeft,
  Check,
  Plus,
  Smile,
  Paperclip,
  Wand2,
  Send,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Leaf,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  PageHeader,
  Button,
  Kpi,
  Avatar,
  Badge,
  Status,
  SearchInput,
  Select,
  IconButton,
  Modal,
  FormField,
  ItemMenu,
} from "./common";
import { useDemo } from "./store";
import { money, orderTotal, defaultOrder, type Conversation as ConversationData } from "./data";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
export function Conversations() {
  const { conversations, setConversations, orders } = useDemo();
  const [selected, setSelected] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Toutes");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [assign, setAssign] = useState(false);
  const [employee, setEmployee] = useState("Sarah");
  const [note, setNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [attachment, setAttachment] = useState("");
  const [emoji, setEmoji] = useState(false);
  const [clientVisible, setClientVisible] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);
  const c = conversations.find((c) => c.id === selected) || conversations[0];
  const update = (next: ConversationData) =>
    setConversations(conversations.map((x) => (x.id === next.id ? next : x)));
  if (!c) return <div className="empty-state">Aucune conversation.</div>;
  const filtered = conversations.filter(
    (c) =>
      (c.name + " " + c.messages.at(-1)?.text).toLowerCase().includes(search.toLowerCase()) &&
      (filter === "Toutes" ||
        (filter === "Non lues" && c.unread > 0) ||
        (filter === "IA" && !c.human) ||
        (filter === "Humain" && c.human) ||
        (filter === "En attente" && c.status === "En attente") ||
        (filter === "Résolues" && c.status === "Résolue")),
  );
  const send = () => {
    if (!text.trim() && !attachment) return;
    update({
      ...c,
      messages: [
        ...c.messages,
        {
          role: "human",
          text: text + (attachment ? `\n📎 ${attachment}` : ""),
          time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        },
      ],
      unread: 0,
      human: true,
    });
    setText("");
    setAttachment("");
    toast.success("Message envoyé");
  };
  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      setText(
        "Oui, vous pouvez intégrer une protection solaire SPF 50+ à votre routine. Appliquez votre crème solaire en dernière étape le matin et renouvelez-la régulièrement. Pour un conseil personnalisé, notre équipe est à votre disposition. 🌿",
      );
      setLoading(false);
      toast.success("Réponse préparée · Vous pouvez la modifier avant envoi");
    }, 1500);
  };
  return (
    <>
      <PageHeader
        eyebrow="VOTRE AGENT RELATION CLIENT"
        title="Service Client IA"
        description="Chaque conversation compte. Offrez à vos clients une attention sur mesure."
      />
      <div className="support-kpis">
        <Kpi
          label="Conversations ouvertes"
          value="182"
          icon={<MessagesSquare />}
          sub="15 conversations dans votre boîte"
        />
        <Kpi label="Traitées par l’IA" value="1 284" change="24,6 %" icon={<Bot />} />
        <Kpi label="Taux de résolution" value="92 %" change="4,2 pts" icon={<CheckCheck />} />
        <Kpi
          label="Temps moyen de réponse"
          value="1 min 34 s"
          icon={<Clock3 />}
          sub="− 42 s ce mois"
        />
      </div>
      <div className={`support-workspace ${!clientVisible ? "hide-client" : ""}`}>
        <div className="conversation-list">
          <div className="inbox-heading">
            <h2>
              Conversations <Badge>{conversations.length}</Badge>
            </h2>
          </div>
          <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un client…" />
          <div className="inbox-filters">
            {["Toutes", "Non lues", "IA", "Humain", "En attente", "Résolues"].map((f) => (
              <Button
                key={f}
                variant="ghost"
                size="sm"
                className={f === filter ? "selected" : ""}
                onClick={() => setFilter(f)}
              >
                {f}
              </Button>
            ))}
          </div>
          <div className="conversation-items">
            {filtered.map((item) => (
              <Button
                variant="ghost"
                key={item.id}
                className={`conversation-item ${selected === item.id ? "selected-conversation" : ""}`}
                onClick={() => {
                  setSelected(item.id);
                  setText("");
                  setAttachment("");
                  update({ ...item, unread: 0 });
                }}
              >
                <Avatar name={item.name} />
                <div>
                  <div className="conversation-name">
                    <strong>{item.name}</strong>
                    <time>10:{44 - (item.id % 10)}</time>
                  </div>
                  <p>{item.messages.at(-1)?.text}</p>
                  <div className="conversation-meta">
                    <span className="channel-mini">{item.channel}</span>
                    <span className={item.human ? "human-mini" : "ai-mini"}>
                      {item.human ? "Humain" : "IA"}
                    </span>
                    {item.unread > 0 && <b>{item.unread}</b>}
                  </div>
                </div>
              </Button>
            ))}
            {filtered.length === 0 && (
              <div className="empty-state">Aucune conversation trouvée.</div>
            )}
          </div>
        </div>
        <div className="chat-column">
          <div className="chat-header">
            <Avatar name={c.name} />
            <div>
              <strong>{c.name}</strong>
              <span>
                <i className="online-dot" />
                {c.channel} · {c.human ? "Conversation gérée par " + employee : "Agent IA actif"}
              </span>
            </div>
            <IconButton label="Fiche client" onClick={() => setClientVisible(!clientVisible)}>
              <UserRoundCheck />
            </IconButton>
            <ItemMenu
              extra={[
                { label: "Assigner", action: () => setAssign(true) },
                { label: "Transférer", action: () => setAssign(true) },
                {
                  label: "Résoudre",
                  action: () => {
                    update({ ...c, status: "Résolue", unread: 0 });
                    toast.success("Conversation résolue");
                  },
                },
                {
                  label: "Réouvrir",
                  action: () => {
                    update({ ...c, status: "Ouverte" });
                    toast.success("Conversation réouverte");
                  },
                },
              ]}
            />
          </div>
          <div className="chat-assistance-bar">
            <span>
              <Leaf size={16} />
              {c.human ? "Vous avez pris le relais" : "Nour, votre agent Photo White, est actif"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                update({ ...c, human: !c.human });
                toast.success(
                  c.human ? "Conversation rendue à l’IA" : "Conversation gérée par Sarah",
                );
              }}
            >
              {c.human ? "Rendre à l’IA" : "Prendre le relais"}
              <ArrowRightLeft size={13} />
            </Button>
          </div>
          <Conversation className="chat-transcript">
            <ConversationContent className="chat-messages">
              <div className="chat-date">Aujourd’hui, 6 octobre</div>
              {c.messages.map((m, i) => (
                <Message
                  key={i}
                  from={m.role === "client" ? "user" : "assistant"}
                  className={`support-message ${m.role}`}
                >
                  <div className="message-sender">
                    {m.role === "ai" ? (
                      <>
                        <span className="agent-identity">
                          <Leaf size={11} />
                        </span>
                        Nour · Photo White
                      </>
                    ) : m.role === "human" ? (
                      "Sarah Bennani"
                    ) : (
                      c.name
                    )}
                  </div>
                  <MessageContent className="support-message-content">
                    <MessageResponse>{m.text}</MessageResponse>
                  </MessageContent>
                  <div className="message-time">
                    {m.time}
                    {m.role === "ai" && (
                      <span>
                        <Bot size={11} />
                        Réponse générée par l’IA
                      </span>
                    )}
                    {m.role === "human" && <CheckCheck size={12} />}
                  </div>
                </Message>
              ))}
              {loading && (
                <div className="chat-thinking">
                  <Leaf size={16} />
                  <Shimmer>Nour prépare une réponse…</Shimmer>
                </div>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
          <div className="chat-composer">
            <Button
              variant="outline"
              className="generate-reply"
              disabled={loading}
              onClick={generate}
            >
              <Wand2 /> {text ? "Régénérer une réponse IA" : "Générer une réponse IA"}
            </Button>
            {attachment && (
              <Badge>
                <Paperclip size={12} />
                {attachment}
                <IconButton label="Retirer la pièce jointe" onClick={() => setAttachment("")}>
                  <X size={12} />
                </IconButton>
              </Badge>
            )}
            <PromptInput onSubmit={() => send()} className="support-prompt">
              <PromptInputTextarea
                aria-label="Votre message"
                placeholder="Écrivez votre message…"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <PromptInputFooter>
                <div className="composer-tools">
                  <IconButton label="Ajouter un emoji" onClick={() => setEmoji(!emoji)}>
                    <Smile />
                  </IconButton>
                  <IconButton label="Joindre un fichier" onClick={() => fileRef.current?.click()}>
                    <Paperclip />
                  </IconButton>
                  <span>Réponse à {c.name.split(" ")[0]}</span>
                </div>
                <PromptInputSubmit
                  aria-label="Envoyer le message"
                  status={loading ? "submitted" : "ready"}
                  disabled={loading || (!text.trim() && !attachment)}
                >
                  <Send size={16} />
                </PromptInputSubmit>
              </PromptInputFooter>
            </PromptInput>
            {emoji && (
              <div className="emoji-menu">
                {["😊", "🌿", "☀️", "💛", "Merci !"].map((e) => (
                  <Button
                    variant="ghost"
                    key={e}
                    onClick={() => {
                      setText(text + e);
                      setEmoji(false);
                    }}
                  >
                    {e}
                  </Button>
                ))}
              </div>
            )}
            <input
              className="hidden"
              type="file"
              ref={fileRef}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setAttachment(f.name);
                  toast.success("Pièce jointe ajoutée");
                }
              }}
            />
          </div>
        </div>
        <aside className="client-sidebar">
          <div className="client-heading">
            Fiche client
            <Status value={c.status} />
          </div>
          <div className="client-identity">
            <Avatar name={c.name} />
            <h3>{c.name}</h3>
            <Badge kind="green">Cliente fidèle</Badge>
          </div>
          <div className="client-contact">
            <span>
              <Phone size={14} />
              +212 6 12 34 56 78
            </span>
            <span>
              <Mail size={14} />
              client{c.id}@exemple.ma
            </span>
            <span>
              <MapPin size={14} />
              {c.city}, Maroc
            </span>
          </div>
          <div className="client-section">
            <h4>Historique commercial</h4>
            <div className="client-commerce">
              <div>
                <strong>7</strong>
                <span>Commandes</span>
              </div>
              <div>
                <strong>
                  2 780 <small>MAD</small>
                </strong>
                <span>Total dépensé</span>
              </div>
            </div>
            <p>
              Panier moyen <b>397 MAD</b>
            </p>
          </div>
          <div className="client-section">
            <h4>Dernière commande</h4>
            <div className="client-order">
              <ShoppingBag size={18} />
              <div>
                <strong>#{orders.find((o) => o.client === c.name)?.id || "PW-2475"}</strong>
                <span>
                  {money(
                    orderTotal(
                      orders.find((o) => o.client === c.name) || orders[0] || defaultOrder,
                    ),
                  )}
                </span>
              </div>
              <Status value={orders.find((o) => o.client === c.name)?.status || "Livrée"} />
            </div>
          </div>
          <div className="client-section">
            <h4>Tags</h4>
            <div className="client-tags">
              <Badge>Cliente fidèle</Badge>
              <Badge>Anti-taches</Badge>
              <Badge>Peau sensible</Badge>
            </div>
          </div>
          <div className="client-section">
            <h4>
              Notes internes{" "}
              <IconButton label="Ajouter une note" onClick={() => setNote(true)}>
                <Plus size={15} />
              </IconButton>
            </h4>
            {c.notes.map((n, i) => (
              <div className="client-note" key={i}>
                <span>Sarah · Aujourd’hui</span>
                <p>{n}</p>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => setNote(true)}>
              <Plus />
              Ajouter une note
            </Button>
          </div>
        </aside>
      </div>
      <Modal
        open={assign}
        onClose={() => setAssign(false)}
        title="Assigner la conversation"
        description={c.name}
      >
        <FormField label="Collaborateur">
          <Select
            value={employee}
            onChange={setEmployee}
            options={["Sarah", "Mehdi", "Imane", "Service client"]}
          />
        </FormField>
        <Button
          onClick={() => {
            update({ ...c, human: true, status: "En attente" });
            setAssign(false);
            toast.success(`Conversation transférée à ${employee}`);
          }}
        >
          <ArrowRightLeft />
          Confirmer le transfert
        </Button>
      </Modal>
      <Modal open={note} onClose={() => setNote(false)} title="Ajouter une note interne">
        <FormField label="Note">
          <textarea
            autoFocus
            rows={4}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
        </FormField>
        <Button
          disabled={!noteText.trim()}
          onClick={() => {
            update({ ...c, notes: [...c.notes, noteText] });
            setNoteText("");
            setNote(false);
            toast.success("Note ajoutée");
          }}
        >
          Enregistrer la note
        </Button>
      </Modal>
    </>
  );
}
