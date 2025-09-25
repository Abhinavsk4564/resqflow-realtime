import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, MapPin, Users } from "lucide-react";
import heroImage from "@/assets/hero-relief.jpg";
import { LiveStats } from "./LiveStats";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 gradient-emergency opacity-75"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-emergency/20 text-white px-4 py-2 rounded-full text-sm">
              <div className="w-2 h-2 bg-white rounded-full live-indicator"></div>
              24/7 Emergency Support Available
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Help and Resources{" "}
            <span className="text-relief">When You Need It</span>{" "}
            Most
          </h1>
          
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Connecting communities with critical disaster relief resources, 
            emergency services, and volunteer opportunities. Your safety and recovery are our priority.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="emergency" size="lg" className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Call Emergency Hotline
            </Button>
            <Button variant="relief" size="lg" className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Find Local Resources
            </Button>
            <Button variant="success" size="lg" className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Volunteer Today
            </Button>
          </div>
          
          <LiveStats />
        </div>
      </div>
    </section>
  );
};