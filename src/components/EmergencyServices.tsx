import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Home, 
  Utensils, 
  Droplets, 
  Shield, 
  Car,
  MapPin,
  Clock
} from "lucide-react";

const services = [
  {
    icon: Heart,
    title: "Medical Emergency",
    description: "Immediate medical assistance and health services",
    contact: "911",
    action: "Call Now",
    variant: "emergency" as const
  },
  {
    icon: Home,
    title: "Emergency Shelter",
    description: "Safe temporary housing and accommodation",
    contact: "311",
    action: "Find Shelter",
    variant: "relief" as const
  },
  {
    icon: Utensils,
    title: "Food Assistance",
    description: "Emergency food supplies and meal programs",
    contact: "(555) 123-4567",
    action: "Get Food",
    variant: "success" as const
  },
  {
    icon: Droplets,
    title: "Clean Water",
    description: "Access to safe drinking water and supplies",
    contact: "(555) 123-4568",
    action: "Find Water",
    variant: "relief" as const
  },
  {
    icon: Shield,
    title: "Safety Services",
    description: "Police and security assistance",
    contact: "911",
    action: "Request Help",
    variant: "emergency" as const
  },
  {
    icon: Car,
    title: "Emergency Transport",
    description: "Evacuation and transportation services",
    contact: "(555) 123-4569",
    action: "Get Transport",
    variant: "warning" as const
  }
];

export const EmergencyServices = () => {
  return (
    <section id="emergency" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Emergency Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Quick access to critical emergency services and resources. Don't wait - get the help you need immediately.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>
                
                <p className="text-muted-foreground mb-4">{service.description}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{service.contact}</div>
                  </div>
                  <Button variant={service.variant}>
                    {service.action}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
        
        <Card className="p-6 bg-success/10 border-success/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full live-indicator"></div>
                <span className="font-semibold">Current Emergency Status</span>
              </div>
              <Badge variant="outline" className="text-success border-success/50">
                All services operational - Response time: 2-5 minutes
              </Badge>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              View Emergency Map
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};