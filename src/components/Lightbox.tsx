import { useEffect, useCallback } from "react";
import { Project } from "@/lib/projectsData";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  project: Project;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const Lightbox = ({ project, onClose, onPrev, onNext, hasPrev, hasNext }: LightboxProps) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    },
    [onClose, onPrev, onNext, hasPrev, hasNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      <div
        className="lightbox-enter glass relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative aspect-video w-full md:aspect-auto md:w-1/2">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/30 hidden md:block" />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-sm bg-primary/20 px-3 py-1 font-body text-xs uppercase tracking-wider text-primary">
              {project.category}
            </span>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <h2 className="mt-2 font-heading text-2xl font-bold text-foreground md:text-3xl">
            {project.title}
          </h2>

          <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
            {project.fullDescription}
          </p>

          {/* Metadata */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {Object.entries(project.metadata).map(([key, value]) =>
              value ? (
                <div key={key} className="rounded-md bg-secondary/50 p-3">
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                    {key}
                  </p>
                  <p className="mt-1 font-body text-sm font-medium text-foreground">
                    {value}
                  </p>
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="absolute bottom-4 left-4 flex gap-2 md:bottom-auto md:left-auto md:right-8 md:top-1/2 md:-translate-y-1/2 md:flex-col">
          <button
            disabled={!hasPrev}
            onClick={onPrev}
            className="rounded-full bg-secondary/80 p-2 text-foreground transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            disabled={!hasNext}
            onClick={onNext}
            className="rounded-full bg-secondary/80 p-2 text-foreground transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
