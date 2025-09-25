import { Button } from "@/components/ui/button";
import { Heart, Phone } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-emergency" />
          <span className="text-2xl font-bold">Relief Hub</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#emergency" className="text-muted-foreground hover:text-foreground transition-colors">
            Emergency
          </a>
          <a href="#resources" className="text-muted-foreground hover:text-foreground transition-colors">
            Resources
          </a>
          <a href="#volunteer" className="text-muted-foreground hover:text-foreground transition-colors">
            Volunteer
          </a>
          <a href="#updates" className="text-muted-foreground hover:text-foreground transition-colors">
            Updates
          </a>
          <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
        </nav>
        
        <Button variant="emergency" className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Emergency: 911
        </Button>
      </div>
    </header>
  );
};