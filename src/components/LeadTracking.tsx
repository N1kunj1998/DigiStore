import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Download, TrendingUp, Eye, MousePointer } from "lucide-react";

interface LeadData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  interests: string[];
  source: string;
  productId: string;
  productTitle: string;
  timestamp: Date;
  status: 'new' | 'contacted' | 'nurturing' | 'converted';
}

// Mock data - in a real app, this would come from your backend
const mockLeads: LeadData[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    company: 'Tech Corp',
    interests: ['Productivity', 'Leadership'],
    source: 'free_download',
    productId: 'free-1',
    productTitle: 'The Ultimate Productivity Checklist',
    timestamp: new Date('2024-01-15'),
    status: 'new'
  },
  {
    id: '2',
    email: 'sarah.smith@company.com',
    firstName: 'Sarah',
    lastName: 'Smith',
    interests: ['Personal Development', 'Goal Setting'],
    source: 'popup_bundle',
    productId: 'popup-bundle',
    productTitle: 'Free Productivity Bundle',
    timestamp: new Date('2024-01-14'),
    status: 'nurturing'
  },
  {
    id: '3',
    email: 'mike.wilson@startup.io',
    firstName: 'Mike',
    lastName: 'Wilson',
    company: 'Startup Inc',
    interests: ['Business Strategy', 'Communication'],
    source: 'sample-1',
    productId: 'sample-1',
    productTitle: 'Free Sample: Atomic Habits',
    timestamp: new Date('2024-01-13'),
    status: 'contacted'
  }
];

export const LeadTracking = () => {
  const [leads, setLeads] = useState<LeadData[]>(mockLeads);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'nurturing' | 'converted'>('all');

  const filteredLeads = leads.filter(lead => 
    filter === 'all' || lead.status === filter
  );

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    nurturing: leads.filter(l => l.status === 'nurturing').length,
    converted: leads.filter(l => l.status === 'converted').length,
    conversionRate: Math.round((leads.filter(l => l.status === 'converted').length / leads.length) * 100) || 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'nurturing': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Lead Tracking Dashboard</h1>
        <div className="flex gap-2">
          {(['all', 'new', 'contacted', 'nurturing', 'converted'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Leads</p>
                <p className="text-2xl font-bold">{stats.new}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{stats.conversionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Converted</p>
                <p className="text-2xl font-bold">{stats.converted}</p>
              </div>
              <Download className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold">{lead.firstName} {lead.lastName}</h3>
                      <p className="text-sm text-muted-foreground">{lead.email}</p>
                      {lead.company && (
                        <p className="text-xs text-muted-foreground">{lead.company}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{lead.productTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                    <div className="flex gap-1">
                      {lead.interests.slice(0, 2).map((interest) => (
                        <Badge key={interest} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
