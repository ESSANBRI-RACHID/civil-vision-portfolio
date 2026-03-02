import { useState, useMemo } from "react";
import { Project, Category, getProjects, getCategories } from "@/lib/projectsData";
import ProjectCard from "./ProjectCard";
import Lightbox from "./Lightbox";

const ProjectGallery = () => {
  const projects = useMemo(() => getProjects(), []);
  const cats = useMemo(() => getCategories(), []);
  const [activeFilter, setActiveFilter] = useState<Category | "Tous">("Tous");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      activeFilter === "Tous"
        ? projects
        : projects.filter((p) => p.category === activeFilter),
    [projects, activeFilter]
  );

  const selectedProject = selectedIndex !== null ? filtered[selectedIndex] : null;

  return (
    <section id="projets" className="px-6 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <p className="font-body text-sm uppercase tracking-[0.3em] text-primary">
          Portfolio
        </p>
        <h2 className="mt-2 font-heading text-4xl font-bold text-foreground md:text-5xl">
          Nos Réalisations
        </h2>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap gap-3">
          {["Tous", ...cats].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat as Category | "Tous")}
              className={`rounded-sm px-5 py-2 font-body text-xs uppercase tracking-wider transition-all ${
                activeFilter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/20 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onClick={() => setSelectedIndex(i)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center font-body text-muted-foreground">
            Aucun projet dans cette catégorie.
          </p>
        )}
      </div>

      {/* Lightbox */}
      {selectedProject && selectedIndex !== null && (
        <Lightbox
          project={selectedProject}
          onClose={() => setSelectedIndex(null)}
          onPrev={() => setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))}
          onNext={() =>
            setSelectedIndex((prev) =>
              prev !== null && prev < filtered.length - 1 ? prev + 1 : prev
            )
          }
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < filtered.length - 1}
        />
      )}
    </section>
  );
};

export default ProjectGallery;
