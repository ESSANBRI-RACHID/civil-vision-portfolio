import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

const socials = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 md:flex-row md:justify-between">
        <div className="text-center md:text-left">
          <h3 className="font-heading text-xl font-semibold text-foreground">
            Excellence <span className="text-gradient">Structurelle</span>
          </h3>
          <p className="mt-1 font-body text-sm text-muted-foreground">
            Ingénierie de génie civil d'exception
          </p>
        </div>

        <div className="flex gap-4">
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="rounded-full bg-secondary p-3 text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_4px_20px_hsl(var(--primary)/0.4)]"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>

        <p className="font-body text-xs text-muted-foreground">
          © {new Date().getFullYear()} GC Portfolio. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
