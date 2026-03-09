import { Facebook, Instagram, Linkedin, Youtube, Twitter, Music2 } from "lucide-react";
import { getSocialLinks, SocialLink } from "@/lib/socialLinksData";
import RayakLogo from "./RayakLogo";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Facebook, Instagram, Linkedin, Youtube, Twitter, Music2,
};

const Footer = () => {
  const links = getSocialLinks().filter((l) => l.enabled && l.url);

  return (
    <footer className="border-t border-border bg-card px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 md:flex-row md:justify-between">
        <div className="text-center md:text-left">
          <RayakLogo size="md" />
          <p className="mt-2 font-body text-sm text-muted-foreground">
            Ingénierie & Construction d'exception
          </p>
        </div>

        <div className="flex gap-4">
          {links.map((link) => {
            const Icon = iconMap[link.icon];
            if (!Icon) return null;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="rounded-full bg-secondary p-3 text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_4px_20px_hsl(var(--primary)/0.4)]"
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>

        <p className="font-body text-xs text-muted-foreground">
          © {new Date().getFullYear()} RAYAK. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
