import { useState } from "react";
import { getContactInfo, saveContactInfo, ContactInfo } from "@/lib/siteSettingsData";
import { Save } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const AdminContactSettings = () => {
  const [info, setInfo] = useState<ContactInfo>(getContactInfo());
  const [dirty, setDirty] = useState(false);

  const update = (field: keyof ContactInfo, value: string) => {
    setInfo((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const handleSave = () => {
    saveContactInfo(info);
    setDirty(false);
    toast.success("Informations de contact enregistrées");
  };

  return (
    <div className="space-y-3 rounded-md border border-border bg-secondary/30 p-4">
      <h4 className="font-body text-xs uppercase tracking-wider text-muted-foreground">Informations de contact</h4>
      {([
        { key: "phone" as const, label: "Téléphone" },
        { key: "email" as const, label: "Email" },
        { key: "address" as const, label: "Adresse" },
        { key: "hours" as const, label: "Horaires" },
      ]).map(({ key, label }) => (
        <input
          key={key}
          placeholder={label}
          value={info[key]}
          onChange={(e) => update(key, e.target.value)}
          className="w-full rounded-md border border-border bg-secondary px-3 py-1.5 font-body text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      ))}
      <button
        type="button"
        onClick={handleSave}
        disabled={!dirty}
        className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 font-body text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Save className="h-3.5 w-3.5" />
        Enregistrer
      </button>
    </div>
  );
};

export default AdminContactSettings;
