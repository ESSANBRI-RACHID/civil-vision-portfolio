import { useState } from "react";
import { getCategories, saveCategories } from "@/lib/projectsData";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { X, Plus, Pencil, Trash2, Settings, LogOut, ImagePlus, Tag, Save } from "lucide-react";
import AdminSocialLinks from "./AdminSocialLinks";
import AdminHeroSettings from "./AdminHeroSettings";
import AdminStatsSettings from "./AdminStatsSettings";
import AdminContactSettings from "./AdminContactSettings";
import AdminMessages from "./AdminMessages";
import { toast } from "@/components/ui/sonner";

interface FormImage {
  file?: File;
  url?: string;
  description: string;
  previewUrl: string;
}

const AdminPanel = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { projects, loading, saveProject, deleteProject, uploadImage } = useProjects();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [meta, setMeta] = useState({ longueur: "", budget: "", duree: "", client: "", localisation: "" });
  const [additionalImages, setAdditionalImages] = useState<FormImage[]>([]);
  const [saving, setSaving] = useState(false);

  const [cats, setCats] = useState<string[]>(getCategories());
  const [newCat, setNewCat] = useState("");
  const [showCatManager, setShowCatManager] = useState(false);

  if (authLoading) return null;
  if (!user || !isAdmin) {
    return (
      <button onClick={() => navigate("/login")} className="fixed bottom-6 right-6 z-40 rounded-full bg-primary p-4 text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-[0_4px_30px_hsl(var(--primary)/0.5)]" aria-label="Se connecter">
        <Settings className="h-6 w-6" />
      </button>
    );
  }

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setCategory("");
    setMainImageFile(null);
    setMainImagePreview("");
    setShortDesc("");
    setFullDesc("");
    setMeta({ longueur: "", budget: "", duree: "", client: "", localisation: "" });
    setAdditionalImages([]);
  };

  const handleEdit = (p: typeof projects[0]) => {
    setEditingId(p.id);
    setTitle(p.title);
    setCategory(p.category);
    setMainImageFile(null);
    setMainImagePreview(p.image_url);
    setShortDesc(p.short_description);
    setFullDesc(p.full_description);
    setMeta({
      longueur: p.metadata.longueur || "",
      budget: p.metadata.budget || "",
      duree: p.metadata.duree || "",
      client: p.metadata.client || "",
      localisation: p.metadata.localisation || "",
    });
    setAdditionalImages(
      p.additional_images.map((img) => ({ url: img.url, description: img.description, previewUrl: img.url }))
    );
  };

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAdditionalImages((prev) => [...prev, { file, description: "", previewUrl: URL.createObjectURL(file) }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category) return;
    setSaving(true);

    let imageUrl = mainImagePreview;
    if (mainImageFile) {
      const uploaded = await uploadImage(mainImageFile);
      if (!uploaded) { setSaving(false); return; }
      imageUrl = uploaded;
    }

    await saveProject(
      {
        ...(editingId ? { id: editingId } : {}),
        title,
        category,
        image_url: imageUrl,
        short_description: shortDesc,
        full_description: fullDesc,
        metadata: meta,
      },
      additionalImages.map((img) => ({
        file: img.file,
        url: img.url,
        description: img.description,
      }))
    );
    resetForm();
    setSaving(false);
  };

  if (!open) {
    return (
      <div className="fixed bottom-6 right-6 z-40 flex gap-2">
        <button onClick={() => signOut()} className="rounded-full bg-secondary p-3 text-secondary-foreground shadow-lg transition-all hover:scale-110" aria-label="Se déconnecter">
          <LogOut className="h-5 w-5" />
        </button>
        <button onClick={() => setOpen(true)} className="rounded-full bg-primary p-4 text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-[0_4px_30px_hsl(var(--primary)/0.5)]" aria-label="Ouvrir le panneau admin">
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
            <button onClick={() => signOut()} className="text-muted-foreground hover:text-foreground" title="Déconnexion"><LogOut className="h-5 w-5" /></button>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {editingId ? "Modifier le projet" : "Ajouter un projet"}
              </h3>
              <button type="button" onClick={() => setShowCatManager(!showCatManager)} className="flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 font-body text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Tag className="h-3.5 w-3.5" /> Catégories
              </button>
            </div>

            <AdminMessages />
            <AdminHeroSettings />
            <AdminStatsSettings />
            <AdminContactSettings />
            <AdminSocialLinks />

            {showCatManager && (
              <div className="rounded-md border border-border bg-secondary/30 p-4 space-y-3">
                <h4 className="font-body text-xs uppercase tracking-wider text-muted-foreground">Gérer les catégories</h4>
                <div className="flex flex-wrap gap-2">
                  {cats.map((cat) => (
                    <span key={cat} className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-body text-xs text-primary">
                      {cat}
                      <button type="button" onClick={() => { const u = cats.filter((c) => c !== cat); setCats(u); saveCategories(u); }} className="ml-1 text-destructive hover:text-destructive/80"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input placeholder="Nouvelle catégorie..." value={newCat} onChange={(e) => setNewCat(e.target.value)} className="flex-1 rounded-md border border-border bg-secondary px-3 py-1.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (newCat.trim() && !cats.includes(newCat.trim())) { const u = [...cats, newCat.trim()]; setCats(u); saveCategories(u); setNewCat(""); } } }} />
                  <button type="button" onClick={() => { if (newCat.trim() && !cats.includes(newCat.trim())) { const u = [...cats, newCat.trim()]; setCats(u); saveCategories(u); setNewCat(""); } }} className="rounded-md bg-primary px-3 py-1.5 font-body text-xs text-primary-foreground hover:bg-primary/80 transition-colors"><Plus className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            )}

            <input placeholder="Titre du projet" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-md border border-border bg-secondary px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />

            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-border bg-secondary px-4 py-2 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">-- Catégorie --</option>
              {cats.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>

            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-wider text-muted-foreground">Image principale</label>
              <input type="file" accept="image/*" onChange={handleMainImage} className="w-full font-body text-sm text-muted-foreground file:mr-3 file:rounded-sm file:border-0 file:bg-primary/20 file:px-3 file:py-1 file:text-xs file:text-primary" />
              {mainImagePreview && <img src={mainImagePreview} alt="Preview" className="mt-2 h-24 w-full rounded-md object-cover" />}
            </div>

            <textarea placeholder="Description courte" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} className="w-full rounded-md border border-border bg-secondary px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" rows={2} />

            <textarea placeholder="Description complète" value={fullDesc} onChange={(e) => setFullDesc(e.target.value)} className="w-full rounded-md border border-border bg-secondary px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" rows={4} />

            <div className="grid grid-cols-2 gap-3">
              {(["longueur", "budget", "duree", "client", "localisation"] as const).map((key) => (
                <input key={key} placeholder={key.charAt(0).toUpperCase() + key.slice(1)} value={meta[key]} onChange={(e) => setMeta({ ...meta, [key]: e.target.value })} className="rounded-md border border-border bg-secondary px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              ))}
            </div>

            {/* Additional Images */}
            <div className="space-y-3">
              <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground">Photos supplémentaires</label>
              {additionalImages.map((img, index) => (
                <div key={index} className="rounded-md border border-border bg-secondary/50 p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <img src={img.previewUrl} alt={`Photo ${index + 1}`} className="h-16 w-24 rounded object-cover flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <textarea placeholder="Description de la photo..." value={img.description} onChange={(e) => { const imgs = [...additionalImages]; imgs[index] = { ...imgs[index], description: e.target.value }; setAdditionalImages(imgs); }} className="w-full rounded-md border border-border bg-secondary px-3 py-1.5 font-body text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" rows={2} />
                      <button type="button" onClick={() => setAdditionalImages(additionalImages.filter((_, i) => i !== index))} className="rounded bg-destructive/20 px-2 py-1 font-body text-xs text-destructive hover:bg-destructive/30 transition-colors">Supprimer</button>
                    </div>
                  </div>
                </div>
              ))}
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border p-3 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <ImagePlus className="h-4 w-4" />
                <span className="font-body text-xs">Ajouter une photo</span>
                <input type="file" accept="image/*" onChange={handleAddImage} className="hidden" />
              </label>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-md bg-primary px-5 py-2 font-body text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:opacity-50">
                <Save className="h-4 w-4" />
                {saving ? "Enregistrement..." : editingId ? "Mettre à jour" : "Ajouter"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="rounded-md bg-secondary px-5 py-2 font-body text-sm text-secondary-foreground hover:bg-secondary/80">Annuler</button>
              )}
            </div>
          </form>

          <div className="mt-8 space-y-3">
            <h3 className="font-heading text-lg font-semibold text-foreground">Projets ({projects.length})</h3>
            {loading ? (
              <p className="font-body text-sm text-muted-foreground">Chargement...</p>
            ) : projects.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-md bg-secondary/50 p-3">
                {p.image_url && <img src={p.image_url} alt={p.title} className="h-10 w-14 rounded object-cover" />}
                <div className="flex-1 min-w-0">
                  <p className="truncate font-body text-sm font-medium text-foreground">{p.title}</p>
                  <p className="font-body text-xs text-muted-foreground">{p.category} · {p.additional_images.length + 1} photo(s)</p>
                </div>
                <button onClick={() => handleEdit(p)} className="text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => deleteProject(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
