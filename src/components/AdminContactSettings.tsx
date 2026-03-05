import { useState } from "react";
import { getContactInfo, saveContactInfo, ContactInfo } from "@/lib/siteSettingsData";

const AdminContactSettings = () => {
  const [info, setInfo] = useState<ContactInfo>(getContactInfo());

  const update = (field: keyof ContactInfo, value: string) => {
    const updated = { ...info, [field]: value };
    setInfo(updated);
    saveContactInfo(updated);
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
    </div>
  );
};

export default AdminContactSettings;
