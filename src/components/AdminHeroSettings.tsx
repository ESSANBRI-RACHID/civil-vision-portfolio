import { useState } from "react";
import { getHeroSettings, saveHeroSettings, HeroSettings } from "@/lib/siteSettingsData";
import { ImagePlus } from "lucide-react";

const AdminHeroSettings = () => {
  const [hero, setHero] = useState<HeroSettings>(getHeroSettings());

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxW = 1920;
        const ratio = 8 / 5;
        let w = Math.min(img.width, maxW);
        let h = w / ratio;
        if (h > img.height) { h = img.height; w = h * ratio; }
        const sx = (img.width - w) / 2;
        const sy = (img.height - h) / 2;
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")?.drawImage(img, sx, sy, w, h, 0, 0, w, h);
        const url = canvas.toDataURL("image/jpeg", 0.85);
        const updated = { ...hero, image: url };
        setHero(updated);
        saveHeroSettings(updated);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3 rounded-md border border-border bg-secondary/30 p-4">
      <h4 className="font-body text-xs uppercase tracking-wider text-muted-foreground">Image Hero</h4>
      {hero.image && (
        <img src={hero.image} alt="Hero preview" className="h-28 w-full rounded-md object-cover" />
      )}
      <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border p-3 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
        <ImagePlus className="h-4 w-4" />
        <span className="font-body text-xs">Changer l'image Hero</span>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </label>
      <p className="font-body text-[10px] text-muted-foreground">Recadrage automatique 8:5</p>
    </div>
  );
};

export default AdminHeroSettings;
