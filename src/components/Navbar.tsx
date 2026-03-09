import { useState, useEffect } from "react";
import RayakLogo from "./RayakLogo";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-500 ${
        scrolled
          ? "glass shadow-lg"
          : "bg-transparent"
      }`}
    >
      <RayakLogo size={scrolled ? "sm" : "md"} />

      <div className="hidden items-center gap-8 font-body text-sm uppercase tracking-widest text-muted-foreground md:flex">
        <a href="#projets" className="transition-colors hover:text-primary">Projets</a>
        <a href="#stats" className="transition-colors hover:text-primary">Chiffres</a>
        <a href="#contact" className="transition-colors hover:text-primary">Contact</a>
      </div>
    </nav>
  );
};

export default Navbar;
