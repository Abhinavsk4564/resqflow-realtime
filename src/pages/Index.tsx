import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { EmergencyServices } from "@/components/EmergencyServices";
import { ResourceRequest } from "@/components/ResourceRequest";

import { VolunteerForm } from "@/components/VolunteerForm";
import { EmergencyChatbot } from "@/components/EmergencyChatbot";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <EmergencyServices />
      <ResourceRequest />
      
      <VolunteerForm />
      <EmergencyChatbot />
    </div>
  );
};

export default Index;
