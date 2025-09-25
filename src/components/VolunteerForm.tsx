import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Download, Users } from "lucide-react";
import * as XLSX from 'xlsx';

interface VolunteerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  availability: string;
  message: string;
  timestamp: string;
}

const skillOptions = [
  "Medical/First Aid",
  "Search and Rescue",
  "Food Service",
  "Transportation",
  "Translation",
  "Construction/Repair",
  "Counseling/Mental Health",
  "Administrative",
  "Technology Support",
  "Emergency Communications"
];

export const VolunteerForm = () => {
  const { toast } = useToast();
  const [volunteers, setVolunteers] = useState<VolunteerData[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    skills: [] as string[],
    availability: "",
    message: ""
  });

  const handleSkillChange = (skill: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      skills: checked 
        ? [...prev.skills, skill]
        : prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newVolunteer: VolunteerData = {
      id: crypto.randomUUID(),
      ...formData,
      timestamp: new Date().toISOString()
    };
    
    setVolunteers(prev => [...prev, newVolunteer]);
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      skills: [],
      availability: "",
      message: ""
    });
    
    toast({
      title: "Registration Successful!",
      description: "Thank you for volunteering. We'll contact you soon with opportunities.",
    });
  };

  const exportToExcel = () => {
    if (volunteers.length === 0) {
      toast({
        title: "No Data",
        description: "No volunteer data to export.",
        variant: "destructive"
      });
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(volunteers.map(v => ({
      Name: v.name,
      Email: v.email,
      Phone: v.phone,
      Location: v.location,
      Skills: v.skills.join(', '),
      Availability: v.availability,
      Message: v.message,
      "Registration Date": new Date(v.timestamp).toLocaleDateString(),
      "Registration Time": new Date(v.timestamp).toLocaleTimeString()
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Volunteers');
    XLSX.writeFile(workbook, `volunteer_data_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: "Export Successful",
      description: "Volunteer data has been exported to Excel file.",
    });
  };

  return (
    <section id="volunteer" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Volunteer Registration</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our community of volunteers and make a difference in emergency response and disaster relief.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <Users className="h-6 w-6" />
                Register as Volunteer
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, State"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Skills & Expertise</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {skillOptions.map(skill => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={formData.skills.includes(skill)}
                        onCheckedChange={(checked) => handleSkillChange(skill, checked as boolean)}
                      />
                      <Label htmlFor={skill} className="text-sm">{skill}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="availability">Availability *</Label>
                <Select value={formData.availability} onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate Response (24/7)</SelectItem>
                    <SelectItem value="weekdays">Weekdays Only</SelectItem>
                    <SelectItem value="weekends">Weekends Only</SelectItem>
                    <SelectItem value="evenings">Evenings Only</SelectItem>
                    <SelectItem value="flexible">Flexible Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Additional Information</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell us about your experience or any additional information..."
                  rows={4}
                />
              </div>

              <Button type="submit" variant="success" className="w-full">
                Register as Volunteer
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold">Volunteer Data</h3>
              <Button 
                variant="outline" 
                onClick={exportToExcel}
                disabled={volunteers.length === 0}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export to Excel
              </Button>
            </div>

            <div className="space-y-4">
              <div className="text-center p-8 bg-muted/50 rounded-lg">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="text-xl font-semibold mb-2">
                  {volunteers.length} Registered Volunteers
                </h4>
                <p className="text-muted-foreground">
                  Real-time volunteer registration data
                </p>
              </div>

              {volunteers.length > 0 && (
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {volunteers.slice(-5).reverse().map(volunteer => (
                    <div key={volunteer.id} className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium">{volunteer.name}</h5>
                        <span className="text-xs text-muted-foreground">
                          {new Date(volunteer.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{volunteer.location}</p>
                      <p className="text-sm text-muted-foreground">
                        Skills: {volunteer.skills.slice(0, 2).join(', ')}
                        {volunteer.skills.length > 2 && ` +${volunteer.skills.length - 2} more`}
                      </p>
                    </div>
                  ))}
                  {volunteers.length > 5 && (
                    <p className="text-center text-muted-foreground text-sm">
                      Showing latest 5 volunteers. Export to see all data.
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};