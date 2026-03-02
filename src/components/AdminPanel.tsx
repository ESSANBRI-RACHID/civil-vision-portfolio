import { useState } from "react";
import { Project, ProjectImage, Category, getProjects, saveProjects, getCategories, saveCategories } from "@/lib/projectsData";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { X, Plus, Pencil, Trash2, Settings, LogOut, ImagePlus, Tag } from "lucide-react";
import AdminSocialLinks from "./AdminSocialLinks";

const emptyProject: Omit<Project, "id"> = {
  title: "",
  category: "",
  image: "",
  shortDescription: "",
  fullDescription: "",
  additionalImages: [],
  metadata: { longueur: "", budget: "", duree: "", client: "", localisation: "" },
};

const AdminPanel = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(getProjects());
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(emptyProject);
  const [cats, setCats] = useState<string[]>(getCategories());
  const [newCat, setNewCat] = useState("");
  const [showCatManager, setShowCatManager] = useState(false);

  if (loading) return null;
  if (!user || !isAdmin) {
    return (
      <button
        onClick={() => navigate("/login")}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-primary p-4 text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-[0_4px_30px_hsl(var(--primary)/0.5)]"
        aria-label="Se connecter"
      >
        <Settings className="h-6 w-6" />
      </button>
    );
  }

  const save = (updated: Project[]) => {
    setProjects(updated);
    saveProjects(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.category) return;

    if (editing) {
      save(projects.map((p) => (p.id === editing.id ? { ...form, id: editing.id } : p)));
    } else {
      save([...projects, { ...form, id: Date.now().toString() }]);
    }
    setForm(emptyProject);
    setEditing(null);
  };

  const handleEdit = (p: Project) => {
    setEditing(p);
    const { id, ...rest } = p;
    setForm({ ...rest, additionalImages: rest.additionalImages || [] });
  };

  const handleDelete = (id: string) => {
    save(projects.filter((p) => p.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, image: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleAdditionalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newImg: ProjectImage = { url: reader.result as string, description: "" };
      setForm({ ...form, additionalImages: [...(form.additionalImages || []), newImg] });
    };
    reader.readAsDataURL(file);
  };

  const updateAdditionalImage = (index: number, updates: Partial<ProjectImage>) => {
    const imgs = [...(form.additionalImages || [])];
    imgs[index] = { ...imgs[index], ...updates };
    setForm({ ...form, additionalImages: imgs });
  };

  const replaceAdditionalImage = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateAdditionalImage(index, { url: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const removeAdditionalImage = (index: number) => {
    const imgs = (form.additionalImages || []).filter((_, i) => i !== index);
    setForm({ ...form, additionalImages: imgs });
  };

  if (!open) {
    return (
      <div className="fixed bottom-6 right-6 z-40 flex gap-2">
        <button
          onClick={() => signOut()}
          className="rounded-full bg-secondary p-3 text-secondary-foreground shadow-lg transition-all hover:scale-110"
          aria-label="Se déconnecter"
        >
          <LogOut className="h-5 w-5" />
        </button>
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-primary p-4 text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-[0_4px_30px_hsl(var(--primary)/0.5)]"
          aria-label="Ouvrir le panneau admin"
        >
          <Settings className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative ml-auto h-full w-full max-w-lg overflow-y-auto bg-card shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card p-6">
          <h2 className="font-heading text-xl font-bold text-foreground">Administration</h2>
          <div className="flex items-center gap-3">
            <button onClick={() => signOut()} className="text-muted-foreground hover:text-foreground" title="Déconnexion">
              <LogOut className="h-5 w-5" />
            </button>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {editing ? "Modifier le projet" : "Ajouter un projet"}
              </h3>
              <button
                type="button"
                onClick={() => setShowCatManager(!showCatManager)}
                className="flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Tag className="h-3.5 w-3.5" />
                Catégories
              </button>
            </div>

            <AdminSocialLinks />

            {showCatManager && (
              <div className="rounded-md border border-border bg-secondary/30 p-4 space-y-3">
                <h4 className="font-body text-xs uppercase tracking-wider text-muted-foreground">Gérer les catégories</h4>
                <div className="flex flex-wrap gap-2">
                  {cats.map((cat) => (
                    <span key={cat} className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-body text-xs text-primary">
                      {cat}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = cats.filter((c) => c !== cat);
                          setCats(updated);
                          saveCategories(updated);
                        }}
                        className="ml-1 text-destructive hover:text-destructive/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    placeholder="Nouvelle catégorie..."
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    className="flex-1 rounded-md border border-border bg-secondary px-3 py-1.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newCat.trim() && !cats.includes(newCat.trim())) {
                          const updated = [...cats, newCat.trim()];
                          setCats(updated);
                          saveCategories(updated);
                          setNewCat("");
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newCat.trim() && !cats.includes(newCat.trim())) {
                        const updated = [...cats, newCat.trim()];
                        setCats(updated);
                        saveCategories(updated);
                        setNewCat("");
                      }
                    }}
                    className="rounded-md bg-primary px-3 py-1.5 font-body text-xs text-primary-foreground hover:bg-primary/80 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            <input
              placeholder="Titre du projet"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-md border border-border bg-secondary px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />

            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
              className="w-full rounded-md border border-border bg-secondary px-4 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">-- Catégorie --</option>
              {cats.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-wider text-muted-foreground">
                Image principale
              </label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full font-body text-sm text-muted-foreground file:mr-3 file:rounded-sm file:border-0 file:bg-primary/20 file:px-3 file:py-1 file:text-xs file:text-primary" />
              {form.image && (
                <img src={form.image} alt="Preview" className="mt-2 h-24 w-full rounded-md object-cover" />
              )}
            </div>

            <textarea
              placeholder="Description courte"
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              className="w-full rounded-md border border-border bg-secondary px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={2}
            />

            <textarea
              placeholder="Description complète"
              value={form.fullDescription}
              onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
              className="w-full rounded-md border border-border bg-secondary px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            />

            <div className="grid grid-cols-2 gap-3">
              {(["longueur", "budget", "duree", "client", "localisation"] as const).map((key) => (
                <input
                  key={key}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={form.metadata[key] || ""}
                  onChange={(e) =>
                    setForm({ ...form, metadata: { ...form.metadata, [key]: e.target.value } })
                  }
                  className="rounded-md border border-border bg-secondary px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ))}
            </div>

            {/* Additional Images Section */}
            <div className="space-y-3">
              <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground">
                Photos supplémentaires
              </label>

              {(form.additionalImages || []).map((img, index) => (
                <div key={index} className="rounded-md border border-border bg-secondary/50 p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <img src={img.url} alt={`Photo ${index + 1}`} className="h-16 w-24 rounded object-cover flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <textarea
                        placeholder="Description de la photo..."
                        value={img.description}
                        onChange={(e) => updateAdditionalImage(index, { description: e.target.value })}
                        className="w-full rounded-md border border-border bg-secondary px-3 py-1.5 font-body text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <label className="cursor-pointer rounded bg-primary/20 px-2 py-1 font-body text-xs text-primary hover:bg-primary/30 transition-colors">
                          Remplacer
                          <input type="file" accept="image/*" onChange={(e) => replaceAdditionalImage(index, e)} className="hidden" />
                        </label>
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="rounded bg-destructive/20 px-2 py-1 font-body text-xs text-destructive hover:bg-destructive/30 transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border p-3 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <ImagePlus className="h-4 w-4" />
                <span className="font-body text-xs">Ajouter une photo</span>
                <input type="file" accept="image/*" onChange={handleAdditionalImageUpload} className="hidden" />
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-md bg-primary px-5 py-2 font-body text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                <Plus className="h-4 w-4" />
                {editing ? "Mettre à jour" : "Ajouter"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => { setEditing(null); setForm(emptyProject); }}
                  className="rounded-md bg-secondary px-5 py-2 font-body text-sm text-secondary-foreground hover:bg-secondary/80"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>

          <div className="mt-8 space-y-3">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              Projets ({projects.length})
            </h3>
            {projects.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-md bg-secondary/50 p-3"
              >
                {p.image && (
                  <img src={p.image} alt={p.title} className="h-10 w-14 rounded object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate font-body text-sm font-medium text-foreground">{p.title}</p>
                  <p className="font-body text-xs text-muted-foreground">
                    {p.category} · {(p.additionalImages || []).length + 1} photo(s)
                  </p>
                </div>
                <button onClick={() => handleEdit(p)} className="text-muted-foreground hover:text-primary">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
