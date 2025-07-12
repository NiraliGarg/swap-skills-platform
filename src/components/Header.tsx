import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Home, MessageSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  user?: {
    name: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 
            className="text-xl font-bold text-primary cursor-pointer hover:text-primary-hover transition-colors"
            onClick={() => navigate('/')}
          >
            Skill Swap Platform
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className={location.pathname === '/' ? 'bg-accent' : ''}
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/requests')}
                className={location.pathname === '/requests' ? 'bg-accent' : ''}
              >
                <MessageSquare className="w-4 h-4" />
                Requests
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/profile')}
                className={location.pathname === '/profile' ? 'bg-accent' : ''}
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                Profile
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}