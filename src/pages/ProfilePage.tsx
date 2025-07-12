import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/Header";
import { X, Plus, User, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";

interface ProfilePageProps {
  user: {
    id: string;
    name: string;
    email: string;
    location?: string;
    avatar?: string;
    skillsOffered: string[];
    skillsWanted: string[];
    availability?: string;
    isPublic: boolean;
  };
  onUpdateUser: (user: any) => void;
  onLogout: () => void;
}

export default function ProfilePage({ user, onUpdateUser, onLogout }: ProfilePageProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    location: user.location || "",
    availability: user.availability || "",
    isPublic: user.isPublic
  });
  
  const [skillsOffered, setSkillsOffered] = useState(user.skillsOffered);
  const [skillsWanted, setSkillsWanted] = useState(user.skillsWanted);
  const [newSkillOffered, setNewSkillOffered] = useState("");
  const [newSkillWanted, setNewSkillWanted] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleAddSkillOffered = () => {
    if (newSkillOffered.trim() && !skillsOffered.includes(newSkillOffered.trim())) {
      setSkillsOffered([...skillsOffered, newSkillOffered.trim()]);
      setNewSkillOffered("");
      setHasChanges(true);
    }
  };

  const handleRemoveSkillOffered = (skill: string) => {
    setSkillsOffered(skillsOffered.filter(s => s !== skill));
    setHasChanges(true);
  };

  const handleAddSkillWanted = () => {
    if (newSkillWanted.trim() && !skillsWanted.includes(newSkillWanted.trim())) {
      setSkillsWanted([...skillsWanted, newSkillWanted.trim()]);
      setNewSkillWanted("");
      setHasChanges(true);
    }
  };

  const handleRemoveSkillWanted = (skill: string) => {
    setSkillsWanted(skillsWanted.filter(s => s !== skill));
    setHasChanges(true);
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...formData,
      skillsOffered,
      skillsWanted
    };
    
    onUpdateUser(updatedUser);
    setHasChanges(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleDiscard = () => {
    setFormData({
      name: user.name,
      location: user.location || "",
      availability: user.availability || "",
      isPublic: user.isPublic
    });
    setSkillsOffered(user.skillsOffered);
    setSkillsWanted(user.skillsWanted);
    setHasChanges(false);
  };

  const handleUploadPhoto = () => {
    toast({
      title: "Photo Upload",
      description: "Photo upload functionality would be implemented here.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Profile Photo */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.avatar || avatarPlaceholder} />
                <AvatarFallback>
                  <User className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={handleUploadPhoto}>
                <Upload className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>
            </div>

            {/* Skills Offered */}
            <div>
              <Label>Skills Offered</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {skillsOffered.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => handleRemoveSkillOffered(skill)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill you can teach"
                  value={newSkillOffered}
                  onChange={(e) => setNewSkillOffered(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkillOffered()}
                />
                <Button onClick={handleAddSkillOffered} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Skills Wanted */}
            <div>
              <Label>Skills Wanted</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {skillsWanted.map((skill) => (
                  <Badge key={skill} variant="outline" className="flex items-center gap-1">
                    {skill}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => handleRemoveSkillWanted(skill)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill you want to learn"
                  value={newSkillWanted}
                  onChange={(e) => setNewSkillWanted(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkillWanted()}
                />
                <Button onClick={handleAddSkillWanted} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Availability */}
            <div>
              <Label htmlFor="availability">Availability</Label>
              <Textarea
                id="availability"
                placeholder="When are you available for skill swaps? (e.g., weekends, evenings after 6pm)"
                value={formData.availability}
                onChange={(e) => handleInputChange("availability", e.target.value)}
                rows={3}
              />
            </div>

            {/* Profile Visibility */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Profile Visibility</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Make your profile visible to other users
                </p>
              </div>
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
              />
            </div>

            {/* Action Buttons */}
            {hasChanges && (
              <div className="flex space-x-3 pt-4 border-t">
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDiscard}
                  className="flex-1"
                >
                  Discard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}