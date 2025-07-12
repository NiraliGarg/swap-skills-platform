import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, User, MapPin, Clock } from "lucide-react";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";

export function UserCard({ user, isLoggedIn, onRequest, onViewProfile }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <CardContent className="p-6">
        {/* Landscape Layout */}
        <div className="flex items-center space-x-6">
          {/* Left: Avatar */}
          <div className="flex-shrink-0">
            <Avatar 
              className="w-20 h-20 cursor-pointer hover:ring-2 hover:ring-primary transition-all" 
              onClick={() => onViewProfile(user.id)}
            >
              <AvatarImage src={user.avatar || avatarPlaceholder} />
              <AvatarFallback>
                <User className="w-10 h-10" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Center: User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <h3 
                className="font-semibold text-xl text-card-foreground truncate cursor-pointer hover:text-primary transition-colors"
                onClick={() => onViewProfile(user.id)}
              >
                {user.name}
              </h3>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{user.rating}/5</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Location and Availability */}
              <div className="space-y-2">
                {user.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {user.location}
                  </div>
                )}
                {user.availability && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {user.availability}
                  </div>
                )}
              </div>

              {/* Skills */}
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
            </div>
          </div>

          {/* Right: Action Button */}
          <div className="flex-shrink-0">
            <Button
              variant="default"
              size="lg"
              onClick={() => onRequest(user.id)}
              disabled={!isLoggedIn}
              className="px-8"
            >
              {isLoggedIn ? 'Request Swap' : 'Login to Request'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}