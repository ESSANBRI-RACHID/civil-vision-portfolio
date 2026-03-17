import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface ProjectImage {
  id: string;
  url: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  image_url: string;
  short_description: string;
  full_description: string;
  metadata: {
    longueur?: string;
    budget?: string;
    duree?: string;
    client?: string;
    localisation?: string;
  };
  additional_images: ProjectImage[];
  sort_order: number;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data: projectsData, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const { data: imagesData } = await supabase
      .from("project_images")
      .select("*")
      .order("sort_order", { ascending: true });

    const mapped: Project[] = (projectsData || []).map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      image_url: p.image_url,
      short_description: p.short_description,
      full_description: p.full_description,
      metadata: (p.metadata as Project["metadata"]) || {},
      sort_order: p.sort_order,
      additional_images: (imagesData || [])
        .filter((img) => img.project_id === p.id)
        .map((img) => ({ id: img.id, url: img.image_url, description: img.description })),
    }));

    setProjects(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("project-images")
      .upload(path, file);
    if (error) {
      toast.error("Erreur upload image");
      console.error(error);
      return null;
    }
    const { data } = supabase.storage.from("project-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const saveProject = async (
    project: Omit<Project, "id" | "additional_images" | "sort_order"> & { id?: string },
    additionalImages: { file?: File; url?: string; description: string }[]
  ) => {
    const meta = project.metadata || {};
    if (project.id) {
      // Update
      const { error } = await supabase.from("projects").update({
        title: project.title,
        category: project.category,
        image_url: project.image_url,
        short_description: project.short_description,
        full_description: project.full_description,
        metadata: meta,
        updated_at: new Date().toISOString(),
      }).eq("id", project.id);
      if (error) { toast.error("Erreur mise à jour"); return; }

      // Delete old additional images and re-insert
      await supabase.from("project_images").delete().eq("project_id", project.id);
      for (let i = 0; i < additionalImages.length; i++) {
        const img = additionalImages[i];
        let url = img.url;
        if (img.file) {
          url = await uploadImage(img.file) || undefined;
        }
        if (url) {
          await supabase.from("project_images").insert({
            project_id: project.id,
            image_url: url,
            description: img.description,
            sort_order: i,
          });
        }
      }
    } else {
      // Insert
      const { data, error } = await supabase.from("projects").insert({
        title: project.title,
        category: project.category,
        image_url: project.image_url,
        short_description: project.short_description,
        full_description: project.full_description,
        metadata: meta,
        sort_order: projects.length,
      }).select().single();
      if (error || !data) { toast.error("Erreur création"); return; }

      for (let i = 0; i < additionalImages.length; i++) {
        const img = additionalImages[i];
        let url = img.url;
        if (img.file) {
          url = await uploadImage(img.file) || undefined;
        }
        if (url) {
          await supabase.from("project_images").insert({
            project_id: data.id,
            image_url: url,
            description: img.description,
            sort_order: i,
          });
        }
      }
    }
    toast.success("Projet enregistré");
    fetchProjects();
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { toast.error("Erreur suppression"); return; }
    toast.success("Projet supprimé");
    fetchProjects();
  };

  return { projects, loading, fetchProjects, saveProject, deleteProject, uploadImage };
};
