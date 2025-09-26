import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Download, Package, AlertTriangle } from "lucide-react";
import * as XLSX from 'xlsx';

interface ResourceRequest {
  id: string;
  name: string;
  phone: string;
  location: string;
  resourceType: string;
  urgency: string;
  quantity: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'processing' | 'fulfilled';
}

const resourceTypes = [
  "Food & Water",
  "Medical Supplies",
  "Shelter Materials",
  "Clothing & Blankets",
  "Baby/Child Supplies",
  "Personal Hygiene",
  "Tools & Equipment",
  "Transportation",
  "Communication Devices",
  "Financial Assistance"
];

const urgencyLevels = [
  "Critical - Life Threatening",
  "High - Within 24 Hours",
  "Medium - Within 3 Days",
  "Low - Within 1 Week"
];

export const ResourceRequest = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<ResourceRequest[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    resourceType: "",
    urgency: "",
    quantity: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: ResourceRequest = {
      id: crypto.randomUUID(),
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    setRequests(prev => [...prev, newRequest]);
    
    // Reset form
    setFormData({
      name: "",
      phone: "",
      location: "",
      resourceType: "",
      urgency: "",
      quantity: "",
      description: ""
    });
    
    toast({
      title: "Request Submitted!",
      description: "Your resource request has been received. Our team will contact you soon.",
    });
  };

  const exportToExcel = () => {
    if (requests.length === 0) {
      toast({
        title: "No Data",
        description: "No resource requests to export.",
        variant: "destructive"
      });
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(requests.map(r => ({
      "Request ID": r.id,
      Name: r.name,
      Phone: r.phone,
      Location: r.location,
      "Resource Type": r.resourceType,
      Urgency: r.urgency,
      Quantity: r.quantity,
      Description: r.description,
      Status: r.status,
      "Request Date": new Date(r.timestamp).toLocaleDateString(),
      "Request Time": new Date(r.timestamp).toLocaleTimeString()
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Resource Requests');
    XLSX.writeFile(workbook, `resource_requests_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: "Export Successful",
      description: "Resource request data has been exported to Excel file.",
    });
  };

  const getUrgencyColor = (urgency: string) => {
    if (urgency.includes('Critical')) return 'text-emergency';
    if (urgency.includes('High')) return 'text-warning';
    if (urgency.includes('Medium')) return 'text-relief';
    return 'text-success';
  };

  return (
    <section id="resources" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Resource Request Center</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Request emergency resources and supplies. All requests are processed in real-time and tracked for fulfillment.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Package className="h-6 w-6" />
              <h3 className="text-2xl font-semibold">Submit Resource Request</h3>
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
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Current Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Full address or nearest landmark"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="resourceType">Resource Type *</Label>
                  <Select value={formData.resourceType} onValueChange={(value) => setFormData(prev => ({ ...prev, resourceType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select resource type" />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="urgency">Urgency Level *</Label>
                  <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity/Amount Needed *</Label>
                <Input
                  id="quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="e.g., 5 people, 20 items, 1 week supply"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide specific details about your needs, any special circumstances, or additional context..."
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" variant="emergency" className="w-full">
                Submit Resource Request
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};