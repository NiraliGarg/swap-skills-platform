import { useState } from "react";
import { Header } from "@/components/Header";
import { UserCard } from "@/components/UserCard";
import { SwapRequestModal } from "@/components/SwapRequestModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Mock data
const mockUsers = [
  {
    id: "1",
    name: "Sarah Chen",
    location: "San Francisco, CA",
    skillsOffered: ["React", "TypeScript", "UI/UX Design"],
    skillsWanted: ["Python", "Machine Learning", "Data Analysis"],
    rating: 4.8,
    availability: "Weekends, Evenings"
  },
  {
    id: "2", 
    name: "Marcus Johnson",
    location: "Austin, TX",
    skillsOffered: ["Python", "Django", "Machine Learning"],
    skillsWanted: ["React", "Mobile Development", "Cloud Architecture"],
    rating: 4.5,
    availability: "Weekdays after 6PM"
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    location: "New York, NY", 
    skillsOffered: ["Graphic Design", "Figma", "Brand Strategy"],
    skillsWanted: ["Web Development", "JavaScript", "CSS"],
    rating: 4.9,
    availability: "Flexible"
  },
  {
    id: "4",
    name: "David Kim",
    location: "Seattle, WA",
    skillsOffered: ["Node.js", "AWS", "DevOps"],
    skillsWanted: ["Mobile Development", "Swift", "React Native"],
    rating: 4.3,
    availability: "Weekends"
  },
  {
    id: "5",
    name: "Lisa Wang",
    location: "Los Angeles, CA",
    skillsOffered: ["Product Management", "Agile", "User Research"],
    skillsWanted: ["Data Science", "SQL", "Analytics"],
    rating: 4.7,
    availability: "Evenings, Some weekends"
  },
  {
    id: "6",
    name: "Ahmed Hassan",
    location: "Chicago, IL",
    skillsOffered: ["Mobile Development", "React Native", "Flutter"],
    skillsWanted: ["Backend Development", "Microservices", "Docker"],
    rating: 4.6,
    availability: "Weekdays after 7PM"
  }
];

interface HomePageProps {
  user?: {
    id: string;
    name: string;
    avatar?: string;
    skillsOffered: string[];
  };
  onLogout?: () => void;
}

export default function HomePage({ user, onLogout }: HomePageProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const filteredUsers = mockUsers.filter(u => {
    const matchesSearch = searchTerm === "" || 
      u.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAvailability = availabilityFilter === "" || 
      u.availability?.toLowerCase().includes(availabilityFilter.toLowerCase());
    
    return matchesSearch && matchesAvailability;
  });

  const handleRequest = (userId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to request skill swaps.",
      });
      navigate('/login');
      return;
    }
    
    const targetUser = mockUsers.find(u => u.id === userId);
    if (targetUser) {
      setSelectedUser(targetUser);
      setIsRequestModalOpen(true);
    }
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  const handleSubmitRequest = (request: any) => {
    toast({
      title: "Request Sent!",
      description: `Your skill swap request has been sent to ${selectedUser?.name}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by skill or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All availability</SelectItem>
                  <SelectItem value="weekends">Weekends</SelectItem>
                  <SelectItem value="evenings">Evenings</SelectItem>
                  <SelectItem value="weekdays">Weekdays</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* User Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredUsers.map((userData) => (
            <UserCard
              key={userData.id}
              user={userData}
              isLoggedIn={!!user}
              onRequest={handleRequest}
              onViewProfile={handleViewProfile}
            />
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No users found matching your criteria.
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center space-x-2">
          <Button variant="outline" disabled>Previous</Button>
          <Button variant="default">1</Button>
          <Button variant="outline">2</Button>
          <Button variant="outline">3</Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>

      {/* Swap Request Modal */}
      {selectedUser && (
        <SwapRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          onSubmit={handleSubmitRequest}
          targetUser={selectedUser}
          currentUserSkills={user?.skillsOffered || []}
        />
      )}
    </div>
  );
}