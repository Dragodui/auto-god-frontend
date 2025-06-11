import React, { FC, useEffect, useState } from 'react';
import { FallingMenu } from './FallingMenu';
import { Link } from 'react-router-dom';
import { CircleUser, LogOut, LogIn, UserPlus } from 'lucide-react';
import Button from './Button';
import { useAuth } from '@/providers/AuthProvider';
import { logout } from '@/services/authService';
import { RootState } from '@/store/store';
import { getImage } from '@/utils/getImage';
import { useSelector } from 'react-redux';
import { getCurrentProfileData } from '@/services/userService';
import NotificationBell from './NotificationBell';

interface NavigationProps {
  fallingMenuPages: { label: string; href: string }[];
  topics: { label: string; href: string }[];
  isMobile?: boolean;
}

const Navigation: FC<NavigationProps> = ({
  fallingMenuPages,
  topics,
  isMobile = false,
}) => {
  const { isAuthenticated } = useAuth();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setIsLoading] = useState(true);

  const getCurrentUser = async () => {
    setIsLoading(true);
    const data = await getCurrentProfileData();
    if (!("message" in data)) {
      setCurrentUser(data);
    }
    setIsLoading(false);
    
  }
  useEffect(() => {
    getCurrentUser();
  }, []);

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
                className="block py-3 px-4 text-white hover:text-link hover:bg-gray-800 rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-link"
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
                  className="block py-3 px-4 text-white hover:text-link hover:bg-gray-800 rounded-lg transition-all duration-200 border-l-2 border-transparent hover:border-link"
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
              <div className="flex items-center gap-4 px-4">
                <Link
                  to="/me"
                  className={`flex items-center gap-3 py-3 text-white hover:text-link hover:bg-gray-800 rounded-lg transition-all duration-200 flex-1`}
                >
                  {loading ? (
                    <div className="w-[30px] h-[30px] rounded-full bg-gray-500 animate-pulse" />
                  ) : currentUser && currentUser.avatar ? (
                    <img
                      className="w-[30px] h-[30px] rounded-full"
                      src={getImage(currentUser.avatar)}
                      alt=""
                    />
                  ) : (
                    <CircleUser size={20} />
                  )}
                  <span>Profile</span>
                </Link>
                <NotificationBell />
              </div>
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
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-secondary hover:bg-secondary text-white rounded-lg transition-all duration-200 font-medium"
              >
                <LogIn size={18} />
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-secondary text-link hover:bg-secondary hover:text-white rounded-lg transition-all duration-200 font-medium"
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
          <div className="flex items-center gap-4">
            <NotificationBell />
            <Link to="/me" className="text-white hover:text-white">
              {loading ? (
                <div className="w-[40px] h-[40px] rounded-full bg-gray-500 animate-pulse" />
              ) : currentUser && currentUser.avatar ? (
                <img
                  className="w-[40px] h-[40px] rounded-full"
                  src={getImage(currentUser.avatar)}
                  alt=""
                />
              ) : (
                <CircleUser size={32} />
              )}
            </Link>
          </div>
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
