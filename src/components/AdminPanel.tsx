import { useState } from "react";
import { Project, Category, categories, getProjects, saveProjects } from "@/lib/projectsData";
import { X, Plus, Pencil, Trash2, Settings } from "lucide-react";

const emptyProject: Omit<Project, "id"> = {
  title: "",
  category: "Pont",
  image: "",
  shortDescription: "",
  fullDescription: "",
  metadata: { longueur: "", budget: "", duree: "", client: "", localisation: "" },
};

const AdminPanel = () => {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(getProjects());
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(emptyProject);

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
    setForm(rest);
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

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-primary p-4 text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-[0_4px_30px_hsl(var(--primary)/0.5)]"
        aria-label="Ouvrir le panneau admin"
      >
        <Settings className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative ml-auto h-full w-full max-w-lg overflow-y-auto bg-card shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card p-6">
          <h2 className="font-heading text-xl font-bold text-foreground">Administration</h2>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {editing ? "Modifier le projet" : "Ajouter un projet"}
            </h3>

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
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-wider text-muted-foreground">
                Image
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

          {/* Project List */}
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
                  <p className="font-body text-xs text-muted-foreground">{p.category}</p>
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
