import React, { FC } from 'react';
import { FallingMenu } from './FallingMenu';
import { Link } from 'react-router-dom';
import { CircleUser } from 'lucide-react';
import Button from './Button';
import { useAuth } from '@/providers/AuthProvider';
import { logout } from '@/services/authService';

interface NavigationProps {
    fallingMenuPages: { label: string; href: string }[];
    topics: { label: string; href: string }[];
}

const Navigation: FC<NavigationProps> = ({fallingMenuPages, topics}) => {
  const { isAuthenticated } = useAuth();
    return (
         <nav className="flex gap-5 items-center flex-col sm:flex-row">
            <FallingMenu label="Navigation" items={fallingMenuPages} />
            <FallingMenu label="Topics" items={topics} />
            {isAuthenticated ? (
              <>
                <Link to="/me" className="text-white hover:text-white">
                  <CircleUser size={32} />
                </Link>
                <Button addStyles="text-sm" onClick={() => logout()}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button addStyles="text-sm">
                  <Link to="/login" className="text-white hover:text-white">
                    Sign In
                  </Link>
                </Button>
                <Button addStyles="text-sm">
                  <Link to="/register" className="text-white hover:text-white">
                    Sign Out
                  </Link>
                </Button>
              </>
            )}
          </nav>
    );
};

export default Navigation;