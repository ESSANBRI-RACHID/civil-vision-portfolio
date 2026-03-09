import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProjectGallery from "@/components/ProjectGallery";
import StatsSection from "@/components/StatsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AdminPanel from "@/components/AdminPanel";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProjectGallery />
      <StatsSection />
      <ContactSection />
      <Footer />
      <AdminPanel />
    </main>
  );
};

export default Index;
