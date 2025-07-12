import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { UserCard } from "@/components/UserCard";
import { SwapRequestModal } from "@/components/SwapRequestModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Filter, Users, ArrowRight, Sparkles } from "lucide-react";
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

export default function HomePage({ user, onLogout }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showProfiles, setShowProfiles] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const profilesPerPage = 3;

  // Loading animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingComplete(true);
      setTimeout(() => setShowProfiles(true), 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = mockUsers.filter(u => {
    const matchesSearch = searchTerm === "" || 
      u.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAvailability = availabilityFilter === "" || availabilityFilter === "all" || 
      u.availability?.toLowerCase().includes(availabilityFilter.toLowerCase());
    
    return matchesSearch && matchesAvailability;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / profilesPerPage);
  const startIndex = (currentPage - 1) * profilesPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + profilesPerPage);

  const handleRequest = (userId) => {
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

  const handleViewProfile = (userId) => {
    navigate(`/user/${userId}`);
  };

  const handleSubmitRequest = (request) => {
    toast({
      title: "Request Sent!",
      description: `Your skill swap request has been sent to ${selectedUser?.name}.`,
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Loading screen component
  if (!loadingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="relative">
            <Users className="w-20 h-20 mx-auto text-primary animate-pulse" />
            <Sparkles className="w-6 h-6 absolute -top-2 -right-2 text-primary animate-bounce" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Skill Swap Platform
            </h1>
            <p className="text-xl text-muted-foreground animate-fade-in">
              Connecting learners and teachers worldwide
            </p>
            <div className="flex items-center justify-center space-x-2 mt-6">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:0.1s]"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8">
        {!showProfiles ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4 animate-fade-in">
              <h2 className="text-3xl font-bold text-primary">Welcome to Skill Exchange!</h2>
              <p className="text-lg text-muted-foreground">Discover amazing people to learn with</p>
              <ArrowRight className="w-8 h-8 mx-auto text-primary animate-bounce" />
            </div>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="mb-8 space-y-4 animate-fade-in">
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
                      <SelectItem value="all">All availability</SelectItem>
                      <SelectItem value="weekends">Weekends</SelectItem>
                      <SelectItem value="evenings">Evenings</SelectItem>
                      <SelectItem value="weekdays">Weekdays</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* User Cards Grid - Landscape Layout */}
            <div className="space-y-6 mb-8 animate-fade-in">
              {currentUsers.map((userData) => (
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
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index + 1}>
                      <PaginationLink
                        onClick={() => handlePageChange(index + 1)}
                        isActive={currentPage === index + 1}
                        className="cursor-pointer"
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
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