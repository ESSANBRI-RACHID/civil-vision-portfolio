import { Project } from "@/lib/projectsData";

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

const ProjectCard = ({ project, index, onClick }: ProjectCardProps) => {
  return (
    <div
      className="animate-fade-up group cursor-pointer overflow-hidden rounded-lg bg-card transition-all duration-500 hover:shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.3)]"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
        <span className="absolute bottom-3 left-3 rounded-sm bg-primary/90 px-3 py-1 font-body text-xs uppercase tracking-wider text-primary-foreground">
          {project.category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-heading text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
          {project.title}
        </h3>
        <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {project.shortDescription}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
          <span className="font-body uppercase tracking-wider">Voir le détail</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
