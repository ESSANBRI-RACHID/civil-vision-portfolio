import { useState } from "react";
import { getStats, saveStats, StatItem } from "@/lib/siteSettingsData";

const AdminStatsSettings = () => {
  const [stats, setStats] = useState<StatItem[]>(getStats());

  const update = (id: string, field: keyof StatItem, value: string | number) => {
    const updated = stats.map((s) => (s.id === id ? { ...s, [field]: value } : s));
    setStats(updated);
    saveStats(updated);
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
    </div>
  );
};

export default AdminStatsSettings;
