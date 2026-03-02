export interface SocialLink {
  id: string;
  label: string;
  icon: string;
  url: string;
  enabled: boolean;
}

const STORAGE_KEY = "gc-portfolio-socials";

const defaultSocialLinks: SocialLink[] = [
  { id: "facebook", label: "Facebook", icon: "Facebook", url: "https://facebook.com", enabled: true },
  { id: "instagram", label: "Instagram", icon: "Instagram", url: "https://instagram.com", enabled: true },
  { id: "linkedin", label: "LinkedIn", icon: "Linkedin", url: "https://linkedin.com", enabled: true },
  { id: "youtube", label: "YouTube", icon: "Youtube", url: "https://youtube.com", enabled: true },
  { id: "twitter", label: "Twitter / X", icon: "Twitter", url: "", enabled: false },
  { id: "tiktok", label: "TikTok", icon: "Music2", url: "", enabled: false },
];

export const getSocialLinks = (): SocialLink[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultSocialLinks;
    }
  }
  return defaultSocialLinks;
};

export const saveSocialLinks = (links: SocialLink[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
};
