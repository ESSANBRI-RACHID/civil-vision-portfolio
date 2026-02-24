import projectBridge from "@/assets/project-bridge.jpg";
import projectBuilding from "@/assets/project-building.jpg";
import projectDam from "@/assets/project-dam.jpg";
import projectRoad from "@/assets/project-road.jpg";
import projectTunnel from "@/assets/project-tunnel.jpg";

export type Category = "Pont" | "Bâtiment" | "Barrage" | "Route" | "Tunnel";

export interface Project {
  id: string;
  title: string;
  category: Category;
  image: string;
  shortDescription: string;
  fullDescription: string;
  metadata: {
    longueur?: string;
    budget?: string;
    duree?: string;
    client?: string;
    localisation?: string;
  };
}

const STORAGE_KEY = "gc-portfolio-projects";

const defaultProjects: Project[] = [
  {
    id: "1",
    title: "Pont de l'Arc Moderne",
    category: "Pont",
    image: projectBridge,
    shortDescription: "Pont à haubans de 850m traversant l'estuaire.",
    fullDescription: "Ce pont à haubans emblématique relie deux rives de l'estuaire avec une travée principale de 450m. Conçu pour résister aux vents de 200 km/h et aux séismes de magnitude 7, il représente l'excellence de l'ingénierie structurelle moderne. Le tablier en béton précontraint est soutenu par 128 haubans répartis en éventail.",
    metadata: { longueur: "850 m", budget: "320 M€", duree: "4 ans", client: "Ministère des Transports", localisation: "Estuaire Sud" },
  },
  {
    id: "2",
    title: "Tour Horizon",
    category: "Bâtiment",
    image: projectBuilding,
    shortDescription: "Gratte-ciel de 45 étages en structure mixte acier-béton.",
    fullDescription: "La Tour Horizon est un gratte-ciel de 180 mètres combinant bureaux, commerces et logements. Sa structure innovante en noyau béton et exosquelette acier permet des plateaux libres de 1200 m². La façade double-peau assure une performance énergétique exceptionnelle.",
    metadata: { longueur: "180 m (hauteur)", budget: "150 M€", duree: "3 ans", client: "Groupe Immobilier Atlas", localisation: "Centre-ville" },
  },
  {
    id: "3",
    title: "Barrage des Cèdres",
    category: "Barrage",
    image: projectDam,
    shortDescription: "Barrage-voûte de 120m de hauteur en béton compacté.",
    fullDescription: "Le barrage des Cèdres est un ouvrage de type voûte simple courbure, conçu pour la production hydroélectrique et la régulation des crues. Sa capacité de retenue est de 450 millions de m³. L'usine hydroélectrique intégrée produit 200 MW.",
    metadata: { longueur: "120 m (hauteur)", budget: "280 M€", duree: "5 ans", client: "Compagnie Nationale d'Énergie", localisation: "Vallée des Cèdres" },
  },
  {
    id: "4",
    title: "Autoroute Transalpine",
    category: "Route",
    image: projectRoad,
    shortDescription: "Échangeur autoroutier à 4 niveaux avec 12 bretelles.",
    fullDescription: "Cet échangeur autoroutier complexe gère le trafic de 120 000 véhicules par jour. La conception à 4 niveaux avec rampes hélicoïdales minimise l'emprise au sol. Les murs de soutènement en terre armée atteignent 25 mètres de hauteur.",
    metadata: { longueur: "3.2 km", budget: "95 M€", duree: "2.5 ans", client: "Direction des Routes", localisation: "Périphérie Nord" },
  },
  {
    id: "5",
    title: "Tunnel du Mont Serein",
    category: "Tunnel",
    image: projectTunnel,
    shortDescription: "Tunnel bi-tube de 6.5 km percé au tunnelier.",
    fullDescription: "Le tunnel du Mont Serein est un ouvrage bi-tube foré au tunnelier à pression de terre. Chaque tube a un diamètre excavé de 11.5 m. Le revêtement en voussoirs préfabriqués assure l'étanchéité et la résistance aux pressions géostatiques. Le système de ventilation longitudinal gère les situations d'urgence.",
    metadata: { longueur: "6.5 km", budget: "520 M€", duree: "6 ans", client: "Société d'Autoroutes du Sud", localisation: "Mont Serein" },
  },
];

export const getProjects = (): Project[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultProjects;
    }
  }
  return defaultProjects;
};

export const saveProjects = (projects: Project[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const categories: Category[] = ["Pont", "Bâtiment", "Barrage", "Route", "Tunnel"];
