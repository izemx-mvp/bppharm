import { useState, useId, Children, isValidElement, cloneElement, type ReactElement, type ReactNode } from "react";
import {
  ArrowUpRight,
  Check,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Trash2,
  Copy,
  Pencil,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
export { Button };
export function PageHeader({
  title,
  description,
  action,
  eyebrow,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
export function Badge({ children, kind = "neutral" }: { children: ReactNode; kind?: string }) {
  return <span className={cn("status-badge", `badge-${kind}`)}>{children}</span>;
}
export function Status({ value }: { value: string }) {
  return (
    <Badge
      kind={
        ["Confirmée", "Livrée", "Publiée", "Connecté", "Active", "Résolue"].includes(value)
          ? "green"
          : ["À valider", "À vérifier", "En attente"].includes(value)
            ? "amber"
            : ["Annulée", "Non connecté"].includes(value)
              ? "red"
              : value === "Planifiée" || value === "Expédiée"
                ? "blue"
                : "neutral"
      }
    >
      {value}
    </Badge>
  );
}
export function Avatar({ name, size = "normal" }: { name: string; size?: string }) {
  return (
    <span className={cn("person-avatar", size === "small" && "avatar-small")}>
      {name
        .split(" ")
        .slice(0, 2)
        .map((s) => s[0])
        .join("")}
    </span>
  );
}
export function IconButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button variant="ghost" size="icon" title={label} aria-label={label} onClick={onClick}>
      {children}
    </Button>
  );
}
export function Kpi({
  label,
  value,
  change,
  icon,
  sub,
}: {
  label: string;
  value: string;
  change?: string;
  icon: ReactNode;
  sub?: string;
}) {
  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <span>{label}</span>
        <span className="kpi-icon">{icon}</span>
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-bottom">
        {change ? (
          <>
            <span className="positive">
              <ArrowUpRight size={13} />
              {change}
            </span>
            <span>vs mois précédent</span>
          </>
        ) : (
          <span>{sub}</span>
        )}
      </div>
    </div>
  );
}
export function Panel({
  title,
  sub,
  action,
  children,
  className,
}: {
  title: string;
  sub?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("panel", className)}>
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>
          {sub && <p>{sub}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
export function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  label?: string;
}) {
  return (
    <select
      className="field-select"
      aria-label={label || options[0]}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
export function SearchInput({
  value,
  onChange,
  placeholder = "Rechercher…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="search-field">
      <Search size={16} />
      <input
        aria-label={placeholder}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
export function Pagination({
  page,
  setPage,
  total,
  size = 8,
}: {
  page: number;
  setPage: (n: number) => void;
  total: number;
  size?: number;
}) {
  const pages = Math.max(1, Math.ceil(total / size));
  return (
    <div className="pagination">
      <span>
        {total === 0 ? 0 : (page - 1) * size + 1}–{Math.min(page * size, total)} sur {total}{" "}
        résultats
      </span>
      <div>
        <IconButton label="Page précédente" onClick={() => setPage(Math.max(1, page - 1))}>
          <ChevronLeft />
        </IconButton>
        <span>
          {page} / {pages}
        </span>
        <IconButton label="Page suivante" onClick={() => setPage(Math.min(pages, page + 1))}>
          <ChevronRight />
        </IconButton>
      </div>
    </div>
  );
}
export function FormField({ label, children }: { label: string; children: ReactNode }) {
  const id = useId();
  let linked = false;
  const linkControl = (node: ReactNode): ReactNode => Children.map(node, child => {
    if (!isValidElement(child)) return child;
    const element = child as ReactElement<{id?:string;children?:ReactNode}>;
    if (!linked && (child.type === "input" || child.type === "textarea" || child.type === Select)) {
      linked = true;
      return cloneElement(element, { id });
    }
    if (element.props.children) return cloneElement(element, {}, linkControl(element.props.children));
    return child;
  });
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {linkControl(children)}
    </div>
  );
}
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string | undefined;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className={cn("demo-modal", wide && "max-w-3xl")}>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description || "Espace Photo White"}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}
export function AiLoading({ text = "Analyse de votre marque…" }: { text?: string }) {
  return (
    <div className="ai-loading">
      <Loader2 className="animate-spin" />
      <strong>{text}</strong>
      <div className="shimmer-line" />
      <div className="shimmer-line short" />
    </div>
  );
}
export function Empty({
  title = "Aucun résultat",
  action,
}: {
  title?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <Search />
      <h3>{title}</h3>
      {action}
    </div>
  );
}
export function ItemMenu({
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  extra,
}: {
  onView?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  extra?: { label: string; action: () => void }[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Actions" title="Actions">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye />
            Voir détail
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil />
            Modifier
          </DropdownMenuItem>
        )}
        {onDuplicate && (
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy />
            Dupliquer
          </DropdownMenuItem>
        )}
        {extra?.map((e) => (
          <DropdownMenuItem key={e.label} onClick={e.action}>
            <Check />
            {e.label}
          </DropdownMenuItem>
        ))}
        {onDelete && (
          <DropdownMenuItem className="text-destructive" onClick={onDelete}>
            <Trash2 />
            Supprimer
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export function ConfirmDelete({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Supprimer cet élément ?"
      description="Cette action retirera l’élément de votre espace."
    >
      <div className="modal-actions">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Supprimer
        </Button>
      </div>
    </Modal>
  );
}
export function useAiSimulation() {
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("Analyse des données…");
  const run = async (action: () => void) => {
    setLoading(true);
    setStage("Analyse des données…");
    await new Promise((r) => setTimeout(r, 650));
    setStage("Création du contenu…");
    await new Promise((r) => setTimeout(r, 700));
    action();
    setLoading(false);
  };
  return { loading, stage, run };
}
export function downloadFile(name: string, content: string, type = "text/csv;charset=utf-8") {
  const url = URL.createObjectURL(new Blob(["\ufeff", content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
