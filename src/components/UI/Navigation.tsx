import React, { FC } from 'react';
import { FallingMenu } from './FallingMenu';
import { Link } from 'react-router-dom';
import { CircleUser, LogOut, LogIn, UserPlus } from 'lucide-react';
import Button from './Button';
import { useAuth } from '@/providers/AuthProvider';
import { logout } from '@/services/authService';

interface NavigationProps {
    fallingMenuPages: { label: string; href: string }[];
    topics: { label: string; href: string }[];
    isMobile?: boolean;
}

const Navigation: FC<NavigationProps> = ({fallingMenuPages, topics, isMobile = false}) => {
  const { isAuthenticated } = useAuth();
  
  if (isMobile) {
    return (
      <nav className="flex flex-col gap-6 w-full">
        {/* Navigation Menu */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Navigation
          </h3>
          <div className="space-y-2">
            {fallingMenuPages.map((page) => (
              <Link
                key={page.href}
                to={page.href}
                className="block py-3 px-4 text-white hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-blue-400"
              >
                {page.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Topics Menu */}
        {topics.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Topics
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {topics.map((topic) => (
                <Link
                  key={topic.href}
                  to={topic.href}
                  className="block py-3 px-4 text-white hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-blue-400"
                >
                  {topic.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Auth Section */}
        <div className="pt-6 border-t border-gray-700 space-y-4">
          {isAuthenticated ? (
            <>
              <Link 
                to="/me" 
                className="flex items-center gap-3 py-3 px-4 text-white hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-all duration-200"
              >
                <CircleUser size={20} />
                <span>Profile</span>
              </Link>
              <button
                onClick={() => logout()}
                className="flex items-center gap-3 w-full py-3 px-4 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-200"
              >
                <LogOut size={20} />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
              >
                <LogIn size={18} />
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all duration-200 font-medium"
              >
                <UserPlus size={18} />
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // Desktop version (unchanged)
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
              Sign Up
            </Link>
          </Button>
        </>
      )}
    </nav>
  );
};

export default Navigation;