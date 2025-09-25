import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface Stats {
  emergencySupport: string;
  activeVolunteers: number;
  familiesHelped: number;
}

export const LiveStats = () => {
  const [stats, setStats] = useState<Stats>({
    emergencySupport: "24/7",
    activeVolunteers: 500,
    familiesHelped: 1000
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeVolunteers: prev.activeVolunteers + Math.floor(Math.random() * 3),
        familiesHelped: prev.familiesHelped + Math.floor(Math.random() * 2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center p-6">
        <div className="text-3xl font-bold text-relief mb-2">{stats.emergencySupport}</div>
        <div className="text-white/90">Emergency Support</div>
      </Card>
      
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center p-6">
        <div className="text-3xl font-bold text-success mb-2">{stats.activeVolunteers}+</div>
        <div className="text-white/90">Active Volunteers</div>
      </Card>
      
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center p-6">
        <div className="text-3xl font-bold text-warning mb-2">{stats.familiesHelped}+</div>
        <div className="text-white/90">Families Helped</div>
      </Card>
    </div>
  );
};