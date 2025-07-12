import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { User, ArrowRight, Clock, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";

// Mock data for incoming requests
const mockRequests = [
  {
    id: "1",
    fromUser: {
      id: "user1",
      name: "Sarah Chen",
      avatar: "",
    },
    skillOffered: "React",
    skillWanted: "Python",
    message: "Hi! I'd love to help you with React in exchange for some Python fundamentals. I have 3 years of React experience.",
    status: "pending" as const,
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2", 
    fromUser: {
      id: "user2",
      name: "Marcus Johnson",
      avatar: "",
    },
    skillOffered: "Machine Learning",
    skillWanted: "TypeScript",
    message: "I can teach you ML concepts and Python libraries. Would be great to learn TypeScript from you!",
    status: "pending" as const,
    createdAt: "2024-01-14T15:45:00Z"
  },
  {
    id: "3",
    fromUser: {
      id: "user3", 
      name: "Elena Rodriguez",
      avatar: "",
    },
    skillOffered: "Figma",
    skillWanted: "React",
    message: "I'm a designer looking to learn frontend development. Can help with Figma and design systems!",
    status: "accepted" as const,
    createdAt: "2024-01-13T09:20:00Z"
  },
  {
    id: "4",
    fromUser: {
      id: "user4",
      name: "David Kim", 
      avatar: "",
    },
    skillOffered: "AWS",
    skillWanted: "Node.js",
    message: "I have AWS certifications and can help with cloud architecture. Looking to improve my Node.js skills.",
    status: "rejected" as const,
    createdAt: "2024-01-12T14:10:00Z"
  }
];

interface RequestsPageProps {
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  onLogout: () => void;
}

export default function RequestsPage({ user, onLogout }: RequestsPageProps) {
  const [filter, setFilter] = useState("all");
  const [requests, setRequests] = useState(mockRequests);

  const filteredRequests = requests.filter(request => {
    if (filter === "all") return true;
    return request.status === filter;
  });

  const handleAccept = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: "accepted" as const } : req
      )
    );
    
    const request = requests.find(r => r.id === requestId);
    toast({
      title: "Request Accepted!",
      description: `You've accepted ${request?.fromUser.name}'s skill swap request.`,
    });
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: "rejected" as const } : req
      )
    );
    
    const request = requests.find(r => r.id === requestId);
    toast({
      title: "Request Rejected",
      description: `You've rejected ${request?.fromUser.name}'s skill swap request.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-orange-600 border-orange-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "accepted":
        return <Badge variant="default" className="bg-success text-success-foreground"><Check className="w-3 h-3 mr-1" />Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Skill Swap Requests</h1>
          <p className="text-muted-foreground">Manage incoming requests from other users</p>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter requests" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={request.fromUser.avatar || avatarPlaceholder} />
                      <AvatarFallback>
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{request.fromUser.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Requested on {formatDate(request.createdAt)}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                {/* Skill Swap Summary */}
                <div className="flex items-center justify-center mb-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <Badge variant="secondary" className="mb-1">They Offer</Badge>
                    <p className="font-medium">{request.skillOffered}</p>
                  </div>
                  <ArrowRight className="mx-6 text-muted-foreground" />
                  <div className="text-center">
                    <Badge variant="outline" className="mb-1">You Offer</Badge>
                    <p className="font-medium">{request.skillWanted}</p>
                  </div>
                </div>

                {/* Message */}
                {request.message && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Message:</h4>
                    <p className="text-muted-foreground italic bg-muted/30 p-3 rounded">
                      "{request.message}"
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                {request.status === "pending" && (
                  <div className="flex space-x-3">
                    <Button
                      variant="success"
                      onClick={() => handleAccept(request.id)}
                      className="flex-1"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(request.id)}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {filter === "all" 
                ? "No skill swap requests yet." 
                : `No ${filter} requests found.`
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredRequests.length > 0 && (
          <div className="flex justify-center space-x-2 mt-8">
            <Button variant="outline" disabled>Previous</Button>
            <Button variant="default">1</Button>
            <Button variant="outline">Next</Button>
          </div>
        )}
      </div>
    </div>
  );
}