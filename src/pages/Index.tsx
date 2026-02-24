import HeroSection from "@/components/HeroSection";
import ProjectGallery from "@/components/ProjectGallery";
import Footer from "@/components/Footer";
import AdminPanel from "@/components/AdminPanel";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <ProjectGallery />
      <Footer />
      <AdminPanel />
    </main>
  );
};

export default Index;
