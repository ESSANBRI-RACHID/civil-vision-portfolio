import { cn } from "@/lib/utils";

interface RayakLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
};

const RayakLogo = ({ size = "md", className }: RayakLogoProps) => (
  <a href="#" className={cn("group flex items-center gap-2", className)}>
    {/* Geometric mark */}
    <span className="relative flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 border border-primary/30 transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/50">
      <span className="font-heading text-sm font-bold text-primary">R</span>
      <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent" />
    </span>
    {/* Wordmark */}
    <span className={cn("font-heading font-bold tracking-[0.15em] text-foreground", sizeClasses[size])}>
      RAY<span className="text-gradient">AK</span>
    </span>
  </a>
);

export default RayakLogo;
