import { useState, useEffect } from "react";
import { getHeroSettings } from "@/lib/siteSettingsData";
import coverMarrakech from "@/assets/cover-marrakech.jpg";

const HeroSection = () => {
  const hero = getHeroSettings();
  const images = [hero.image, coverMarrakech];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <header className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="Projet de génie civil"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="animate-fade-up mb-4 font-body text-sm uppercase tracking-[0.3em] text-primary">
          {hero.subtitle}
        </p>
        <h1 className="animate-fade-up animate-fade-up-delay-1 font-heading text-5xl font-bold leading-tight text-foreground md:text-7xl lg:text-8xl">
          {hero.title1}<br />
          <span className="text-gradient">{hero.title2}</span>
        </h1>
        <p className="animate-fade-up animate-fade-up-delay-2 mt-6 max-w-xl font-body text-lg text-muted-foreground">
          {hero.description}
        </p>
        <div className="animate-fade-up animate-fade-up-delay-3 mt-10 flex gap-4">
          <a
            href="#projets"
            className="inline-flex items-center gap-2 rounded-sm border border-primary bg-primary/10 px-8 py-3 font-body text-sm uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            Découvrir les projets
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-sm bg-primary px-8 py-3 font-body text-sm uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/80"
          >
            Contactez-nous
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-8 w-5 rounded-full border-2 border-muted-foreground/50 p-1">
          <div className="mx-auto h-2 w-1 rounded-full bg-primary" />
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
