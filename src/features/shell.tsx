import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Feather,
  MessagesSquare,
  ShoppingBag,
  BarChart3,
  Settings2,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Bell,
  CircleHelp,
  Search,
  Plus,
  ArrowUpRight,
  LogOut,
  CheckCheck,
  X,
  Leaf,
  CalendarDays,
  FileQuestion,
  BookOpen,
  Plug,
  SlidersHorizontal,
  CheckCircle2,
  History,
  Menu,
  Command,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";
import { Button, Avatar, Badge, IconButton, Modal } from "./common";
import { logoUrl } from "./assets";
import { useDemo } from "./store";
import { toast, Toaster } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const navigation = [
  { label: "Dashboard", url: "/", icon: LayoutDashboard },
  {
    label: "Community Manager IA",
    icon: Feather,
    children: [
      { label: "Idées de contenus", url: "/community", icon: Feather },
      { label: "Planning éditorial", url: "/planning", icon: CalendarDays },
      { label: "Configuration", url: "/community-config", icon: SlidersHorizontal },
    ],
  },
  {
    label: "Service Client IA",
    icon: MessagesSquare,
    children: [
      { label: "Conversations", url: "/conversations", icon: MessagesSquare, badge: "15" },
      { label: "FAQ", url: "/faq", icon: FileQuestion },
      { label: "Base de connaissances", url: "/knowledge", icon: BookOpen },
      { label: "Applications", url: "/applications", icon: Plug },
      { label: "Paramètres de l’agent", url: "/agent-settings", icon: SlidersHorizontal },
    ],
  },
  {
    label: "Commandes IA",
    icon: ShoppingBag,
    children: [
      { label: "Toutes les commandes", url: "/orders", icon: ShoppingBag },
      { label: "À valider", url: "/validation", icon: CheckCircle2, badge: "3" },
      { label: "Historique", url: "/history", icon: History },
    ],
  },
  { label: "Rapports", url: "/reports", icon: BarChart3 },
  { label: "Paramètres", url: "/settings", icon: Settings2 },
];
const allLinks = navigation.flatMap((n) => n.children || [n]);
export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [groups, setGroups] = useState<Record<string, boolean>>({
    "Community Manager IA": true,
    "Service Client IA": true,
    "Commandes IA": true,
  });
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [help, setHelp] = useState(false);
  const demo = useDemo();
  const label = allLinks.find((n) => n.url === location.pathname)?.label || "Photo White";
  const unread = demo.notifications.filter((n) => !n.read).length;
  if (location.pathname === "/login")
    return (
      <>
        {children}
        <Toaster richColors position="bottom-right" />
      </>
    );
  const go = (url: string) => {
    navigate({ to: url });
    setMobileOpen(false);
    setSearchOpen(false);
  };
  return (
    <div className={`app-frame ${collapsed ? "is-collapsed" : ""}`}>
      <div className="workspace-ambience" aria-hidden="true" />
      <aside className={`app-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <Link to="/" className="brand-block">
          <img src={logoUrl} alt="Photo White" />
          <span>BPPHARM · WORKSPACE</span>
        </Link>
        <div className="workspace-switch">
          <span className="workspace-icon">
            <Leaf size={17} />
          </span>
          {!collapsed && (
            <>
              <div>
                <strong>Espace Photo White</strong>
                <span>Équipe commerciale</span>
              </div>
              <ChevronDown size={15} />
            </>
          )}
        </div>
        {!collapsed && <div className="nav-caption">VOTRE ESPACE</div>}
        <nav>
          {navigation.map((n) => (
            <div key={n.label}>
              {!collapsed && n.label === "Community Manager IA" && <div className="nav-section-label">INTELLIGENCE ARTIFICIELLE</div>}
              {!collapsed && n.label === "Rapports" && <div className="nav-section-label">GESTION & ANALYSE</div>}
              {n.children ? (
                <>
                  <Button
                    variant="ghost"
                    className={`nav-group ${n.children.some((c) => c.url === location.pathname) ? "group-active" : ""}`}
                    title={n.label}
                    onClick={() => {
                      if (collapsed) {
                        setCollapsed(false);
                        setGroups({ ...groups, [n.label]: true });
                      } else setGroups({ ...groups, [n.label]: !groups[n.label] });
                    }}
                  >
                    <n.icon size={19} />
                    {!collapsed && (
                      <>
                        <span>{n.label}</span>
                        <ChevronDown className={groups[n.label] ? "rotate-180" : ""} />
                      </>
                    )}
                  </Button>
                  {!collapsed && groups[n.label] && (
                    <div className="nav-children">
                      {n.children.map((c) => (
                        <Link
                          key={c.url}
                          to={c.url}
                          onClick={() => setMobileOpen(false)}
                          className={location.pathname === c.url ? "nav-child active" : "nav-child"}
                        >
                          <span>{c.label}</span>
                          {c.badge && (
                            <span className="nav-count">
                              {c.url === "/validation"
                                ? demo.orders.filter((o) => o.status === "À valider").length
                                : c.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={n.url}
                  onClick={() => setMobileOpen(false)}
                  title={n.label}
                  className={`nav-link ${location.pathname === n.url ? "active" : ""}`}
                >
                  <n.icon size={19} />
                  {!collapsed && <span>{n.label}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          {!collapsed && (
            <div className="agent-health">
              <span className="online-dot" />
              <div>
                <strong>Vos agents sont actifs</strong>
                <span>3 agents · Tout est opérationnel</span>
              </div>
            </div>
          )}
          <div className="sidebar-profile">
            <Avatar name="Sarah Bennani" />
            {!collapsed && (
              <div>
                <strong>Sarah Bennani</strong>
                <span>Administratrice</span>
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu du profil">
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => go("/settings")}>
                  <Settings2 />
                  Mon profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => go("/login")}>
                  <LogOut />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
      <div className="app-body">
        <header className="topbar">
          <div className="topbar-breadcrumb">
            <IconButton
              label="Rétracter le menu"
              onClick={() => {
                if (window.innerWidth < 1000) setMobileOpen(!mobileOpen);
                else setCollapsed(!collapsed);
              }}
            >
              {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            </IconButton>
            <span className="breadcrumb-home">Espace Photo White</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{label}</strong>
          </div>
          <div className="topbar-tools">
            <ThemeToggle />
            <Button variant="ghost" className="global-search" onClick={() => setSearchOpen(true)}>
              <Search size={16} />
              <span>Rechercher…</span>
              <kbd>⌘ K</kbd>
            </Button>
            <span className="toolbar-divider" />
            <IconButton label="Notifications" onClick={() => setNotificationsOpen(true)}>
              <span className="notification-button">
                <Bell size={18} />
                {unread > 0 && <i />}
              </span>
            </IconButton>
            <IconButton label="Aide" onClick={() => setHelp(true)}>
              <CircleHelp size={18} />
            </IconButton>
            <Button variant="ghost" className="topbar-avatar" onClick={() => go("/settings")}>
              <Avatar name="Sarah Bennani" size="small" />
            </Button>
          </div>
        </header>
        <main className={`main-content ${location.pathname === "/" ? "direction-dashboard" : ""}`} key={location.pathname}>
          {children}
          <footer className="app-footer">
            <span>© 2026 BPPHARM · Photo White</span>
            <span>
              <span className="online-dot" />
              Tous les systèmes opérationnels
            </span>
            <span>Powered by intelligence</span>
          </footer>
        </main>
      </div>
      <Modal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Recherche globale"
        description="Retrouvez vos commandes, clients et espaces."
      >
        <div className="search-field">
          <Search size={18} />
          <input
            autoFocus
            placeholder="Rechercher dans Photo White…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="search-results">
          {allLinks
            .filter((n) => n.label.toLowerCase().includes(search.toLowerCase()))
            .map((n) => (
              <Button key={n.url} variant="ghost" onClick={() => go(n.url || "/")}>
                <n.icon />
                {n.label}
                <ArrowRight />
              </Button>
            ))}
          {search &&
            demo.orders
              .filter((o) => (o.id + " " + o.client).toLowerCase().includes(search.toLowerCase()))
              .slice(0, 5)
              .map((o) => (
                <Button key={o.id} variant="ghost" onClick={() => go("/orders")}>
                  <ShoppingBag />
                  {o.id} · {o.client}
                </Button>
              ))}
        </div>
      </Modal>
      <Modal
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        title="Notifications"
        description={`${unread} notifications non lues`}
      >
        <Button
          variant="ghost"
          className="justify-start"
          onClick={() =>
            demo.setNotifications(demo.notifications.map((n) => ({ ...n, read: true })))
          }
        >
          <CheckCheck />
          Tout marquer comme lu
        </Button>
        <div className="notification-list">
          {demo.notifications.map((n) => (
            <div key={n.id} className={n.read ? "notification read" : "notification"}>
              <span className="notification-icon">
                <Bell size={17} />
              </span>
              <div>
                <Badge>{n.type}</Badge>
                <strong>{n.title}</strong>
                <p>{n.body}</p>
              </div>
              <IconButton
                label="Marquer comme lu"
                onClick={() =>
                  demo.setNotifications(
                    demo.notifications.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
                  )
                }
              >
                <CheckCheck />
              </IconButton>
              <IconButton
                label="Supprimer la notification"
                onClick={() =>
                  demo.setNotifications(demo.notifications.filter((x) => x.id !== n.id))
                }
              >
                <X />
              </IconButton>
            </div>
          ))}
          {demo.notifications.length === 0 && <p>Aucune notification.</p>}
        </div>
      </Modal>
      <Modal
        open={help}
        onClose={() => setHelp(false)}
        title="Centre d’aide Photo White"
        description="Votre équipe et vos agents, réunis."
      >
        <div className="help-content">
          <BookOpen />
          <h3>Un accompagnement à chaque étape</h3>
          <p>
            Retrouvez les réponses aux questions produits et les procédures de votre équipe dans
            votre espace.
          </p>
          <Button
            onClick={() => {
              setHelp(false);
              go("/knowledge");
            }}
          >
            Consulter la base de connaissances <ArrowUpRight />
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setHelp(false);
              go("/faq");
            }}
          >
            Questions fréquentes
          </Button>
        </div>
      </Modal>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
export function ThemeToggle() {
  const { darkMode, setDarkMode } = useDemo();
  return (
    <Button variant="ghost" size="icon" className="theme-toggle" aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"} title={darkMode ? "Mode clair" : "Mode sombre"} onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
export function QuickActions() {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="primary-action">
          <Plus />
          Action rapide
          <ChevronDown size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {[
          { label: "Générer un post", url: "/community" },
          { label: "Créer une FAQ", url: "/faq" },
          { label: "Ajouter une information", url: "/knowledge" },
          { label: "Créer une commande", url: "/orders" },
          { label: "Ouvrir une conversation", url: "/conversations" },
        ].map((a) => (
          <DropdownMenuItem
            key={a.label}
            onClick={() => {
              navigate({ to: a.url });
              toast.info(a.label, { description: "Votre espace est prêt." });
            }}
          >
            {a.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
