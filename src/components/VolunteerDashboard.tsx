import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Users, Download, Calendar, MapPin, Clock, Phone, Mail } from "lucide-react";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";

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

// Mock data for demonstration - in real app this would come from props or context
const mockVolunteers: VolunteerData[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    skills: ["Medical/First Aid", "Search and Rescue"],
    availability: "immediate",
    message: "10 years of medical experience",
    timestamp: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 987-6543",
    location: "Los Angeles, CA",
    skills: ["Transportation", "Technology Support"],
    availability: "weekends",
    message: "Available with my truck for transportation",
    timestamp: "2024-01-14T14:20:00Z"
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 456-7890",
    location: "Houston, TX",
    skills: ["Food Service", "Translation"],
    availability: "flexible",
    message: "Bilingual Spanish/English",
    timestamp: "2024-01-13T09:15:00Z"
  }
];

interface VolunteerDashboardProps {
  volunteers?: VolunteerData[];
}

export const VolunteerDashboard = ({ volunteers = mockVolunteers }: VolunteerDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerData | null>(null);
  const { toast } = useToast();

  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    volunteers.forEach(volunteer => {
      volunteer.skills.forEach(skill => skills.add(skill));
    });
    return Array.from(skills).sort();
  }, [volunteers]);

  const availabilityOptions = [
    "immediate",
    "weekdays",
    "weekends", 
    "evenings",
    "flexible"
  ];

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter(volunteer => {
      const matchesSearch = 
        volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSkill = !skillFilter || volunteer.skills.includes(skillFilter);
      const matchesAvailability = !availabilityFilter || volunteer.availability === availabilityFilter;
      
      return matchesSearch && matchesSkill && matchesAvailability;
    });
  }, [volunteers, searchTerm, skillFilter, availabilityFilter]);

  const exportToExcel = () => {
    if (filteredVolunteers.length === 0) {
      toast({
        title: "No Data",
        description: "No volunteer data to export.",
        variant: "destructive"
      });
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredVolunteers.map(v => ({
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
    XLSX.writeFile(workbook, `volunteer_dashboard_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: "Export Successful",
      description: "Volunteer data has been exported to Excel file.",
    });
  };

  const getAvailabilityLabel = (availability: string) => {
    const labels: Record<string, string> = {
      immediate: "24/7 Immediate",
      weekdays: "Weekdays Only",
      weekends: "Weekends Only",
      evenings: "Evenings Only",
      flexible: "Flexible Schedule"
    };
    return labels[availability] || availability;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Volunteer Dashboard</h1>
            <p className="text-muted-foreground">
              Manage and view all registered volunteers
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{volunteers.length}</div>
              <div className="text-sm text-muted-foreground">Total Volunteers</div>
            </div>
            <Button onClick={exportToExcel} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search volunteers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Skills</SelectItem>
                  {allSkills.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Availability</SelectItem>
                  {availabilityOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {getAvailabilityLabel(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSkillFilter("");
                  setAvailabilityFilter("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Volunteers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Registered Volunteers ({filteredVolunteers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVolunteers.map((volunteer) => (
                  <TableRow key={volunteer.id}>
                    <TableCell>
                      <div className="font-medium">{volunteer.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {volunteer.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {volunteer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {volunteer.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {volunteer.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {volunteer.skills.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{volunteer.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-sm">{getAvailabilityLabel(volunteer.availability)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(volunteer.timestamp).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVolunteer(volunteer)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredVolunteers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No volunteers found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Volunteer Detail Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Volunteer Details</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedVolunteer(null)}
                >
                  Close
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-2">{selectedVolunteer.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p>{selectedVolunteer.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p>{selectedVolunteer.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Location</label>
                      <p>{selectedVolunteer.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Availability</label>
                      <p>{getAvailabilityLabel(selectedVolunteer.availability)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Skills & Expertise</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedVolunteer.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedVolunteer.message && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Additional Information</label>
                    <p className="mt-2 p-4 bg-muted/50 rounded-lg">{selectedVolunteer.message}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                  <p>{new Date(selectedVolunteer.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};