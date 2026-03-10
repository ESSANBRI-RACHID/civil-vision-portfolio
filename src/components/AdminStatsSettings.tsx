import { useState } from "react";
import { getStats, saveStats, StatItem } from "@/lib/siteSettingsData";
import { Save } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const AdminStatsSettings = () => {
  const [stats, setStats] = useState<StatItem[]>(getStats());
  const [dirty, setDirty] = useState(false);

  const update = (id: string, field: keyof StatItem, value: string | number) => {
    setStats((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
    setDirty(true);
  };

  const handleSave = () => {
    saveStats(stats);
    setDirty(false);
    toast.success("Compteurs enregistrés");
  };

  return (
    <div className="space-y-3 rounded-md border border-border bg-secondary/30 p-4">
      <h4 className="font-body text-xs uppercase tracking-wider text-muted-foreground">Compteurs</h4>
      {stats.map((stat) => (
        <div key={stat.id} className="grid grid-cols-3 gap-2">
          <input
            value={stat.label}
            onChange={(e) => update(stat.id, "label", e.target.value)}
            className="col-span-2 rounded-md border border-border bg-secondary px-3 py-1.5 font-body text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Label"
          />
          <div className="flex gap-1">
            <input
              type="number"
              value={stat.value}
              onChange={(e) => update(stat.id, "value", parseInt(e.target.value) || 0)}
              className="w-full rounded-md border border-border bg-secondary px-2 py-1.5 font-body text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              value={stat.suffix}
              onChange={(e) => update(stat.id, "suffix", e.target.value)}
              className="w-10 rounded-md border border-border bg-secondary px-1 py-1.5 font-body text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="+"
            />
          </div>
        </div>
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

export default AdminStatsSettings;
