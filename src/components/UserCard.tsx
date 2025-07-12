import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, User, MapPin, Clock } from "lucide-react";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    location?: string;
    avatar?: string;
    skillsOffered: string[];
    skillsWanted: string[];
    rating: number;
    availability?: string;
  };
  isLoggedIn: boolean;
  onRequest: (userId: string) => void;
  onViewProfile: (userId: string) => void;
}

export function UserCard({ user, isLoggedIn, onRequest, onViewProfile }: UserCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar 
            className="w-16 h-16 cursor-pointer" 
            onClick={() => onViewProfile(user.id)}
          >
            <AvatarImage src={user.avatar || avatarPlaceholder} />
            <AvatarFallback>
              <User className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 
                className="font-semibold text-lg text-card-foreground truncate cursor-pointer hover:text-primary transition-colors"
                onClick={() => onViewProfile(user.id)}
              >
                {user.name}
              </h3>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{user.rating}/5</span>
              </div>
            </div>

            {user.location && (
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                {user.location}
              </div>
            )}

            {user.availability && (
              <div className="flex items-center text-sm text-muted-foreground mb-3">
                <Clock className="w-4 h-4 mr-1" />
                {user.availability}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Skills Offered</p>
                <div className="flex flex-wrap gap-1">
                  {user.skillsOffered.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Skills Wanted</p>
                <div className="flex flex-wrap gap-1">
                  {user.skillsWanted.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => onRequest(user.id)}
                disabled={!isLoggedIn}
                className="flex-1"
              >
                {isLoggedIn ? 'Request Swap' : 'Login to Request'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewProfile(user.id)}
                className="px-6"
              >
                View
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}