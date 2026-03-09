import coverMarrakech from "@/assets/cover-marrakech.jpg";

const HERO_KEY = "gc-portfolio-hero";
const STATS_KEY = "gc-portfolio-stats";
const CONTACT_KEY = "gc-portfolio-contact";

export interface HeroSettings {
  image: string;
  subtitle: string;
  title1: string;
  title2: string;
  description: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours: string;
}

const defaultHero: HeroSettings = {
  image: coverMarrakech,
  subtitle: "Ingénierie & Construction",
  title1: "RAYAK",
  title2: "Construction",
  description: "Portfolio de projets de génie civil — ponts, bâtiments, barrages, routes et tunnels conçus avec précision et passion.",
};

const defaultStats: StatItem[] = [
  { id: "1", label: "Projets réalisés", value: 150, suffix: "+" },
  { id: "2", label: "Années d'expérience", value: 25, suffix: "" },
  { id: "3", label: "Clients satisfaits", value: 80, suffix: "+" },
  { id: "4", label: "Ingénieurs", value: 45, suffix: "" },
];

const defaultContact: ContactInfo = {
  phone: "+212 5 22 00 00 00",
  email: "contact@rayak.ma",
  address: "123 Boulevard Mohammed V, Casablanca, Maroc",
  hours: "Lun - Ven : 8h00 - 18h00",
};

export const getHeroSettings = (): HeroSettings => {
  const stored = localStorage.getItem(HERO_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { return defaultHero; }
  }
  return defaultHero;
};

export const saveHeroSettings = (s: HeroSettings) => {
  localStorage.setItem(HERO_KEY, JSON.stringify(s));
};

export const getStats = (): StatItem[] => {
  const stored = localStorage.getItem(STATS_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { return defaultStats; }
  }
  return defaultStats;
};

export const saveStats = (s: StatItem[]) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(s));
};

export const getContactInfo = (): ContactInfo => {
  const stored = localStorage.getItem(CONTACT_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { return defaultContact; }
  }
  return defaultContact;
};

export const saveContactInfo = (c: ContactInfo) => {
  localStorage.setItem(CONTACT_KEY, JSON.stringify(c));
};
