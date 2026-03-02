import { useState } from "react";
import { SocialLink, getSocialLinks, saveSocialLinks } from "@/lib/socialLinksData";
import { Share2, ExternalLink } from "lucide-react";

const AdminSocialLinks = () => {
  const [links, setLinks] = useState<SocialLink[]>(getSocialLinks());
  const [open, setOpen] = useState(false);

  const update = (id: string, updates: Partial<SocialLink>) => {
    const updated = links.map((l) => (l.id === id ? { ...l, ...updates } : l));
    setLinks(updated);
    saveSocialLinks(updated);
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Share2 className="h-3.5 w-3.5" />
        Réseaux sociaux
      </button>

      {open && (
        <div className="rounded-md border border-border bg-secondary/30 p-4 space-y-3">
          <h4 className="font-body text-xs uppercase tracking-wider text-muted-foreground">
            Gérer les réseaux sociaux
          </h4>
          {links.map((link) => (
            <div key={link.id} className="flex items-center gap-3 rounded-md bg-secondary/50 p-3">
              <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={link.enabled}
                  onChange={(e) => update(link.id, { enabled: e.target.checked })}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                <span className="font-body text-sm font-medium text-foreground w-24">{link.label}</span>
              </label>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="url"
                  placeholder={`URL ${link.label}...`}
                  value={link.url}
                  onChange={(e) => update(link.id, { url: e.target.value })}
                  className="flex-1 rounded-md border border-border bg-secondary px-3 py-1.5 font-body text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-40"
                  disabled={!link.enabled}
                />
                {link.url && link.enabled && (
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSocialLinks;
