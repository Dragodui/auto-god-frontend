import { FC, useEffect, useState } from 'react';
import Wrapper from './Wrapper';
import { Link } from 'react-router-dom';
import { getForumTopics } from '@/services/topicService';
import { Topic } from '@/types';
import Navigation from './UI/Navigation';
import { X, Menu } from 'lucide-react';

const Header: FC = (): JSX.Element => {
  const [topics, setTopics] = useState<{ label: string; href: string }[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  
  const fallingMenuPages = [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Topics',
      href: '/topics',
    },
    {
      label: 'News',
      href: '/news',
    },
    {
      label: 'Posts',
      href: '/posts',
    },
    {
      label: 'Market',
      href: '/market',
    },
    {
      label: 'Events',
      href: '/events',
    },
  ];

  const fetchTopics = async () => {
    try {
      const fetchedTopics = await getForumTopics();
      setTopics(
        (fetchedTopics as Topic[]).map((topic) => ({
          label: topic.title,
          href: `/topics/${topic.title}`,
        }))
      );
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // Close menu when clicking outside or on navigation items
  const closeMenu = () => setIsMenuOpen(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header className="font-sansation py-[20px] z-[55] relative">
      <Wrapper>
        <div className="w-full flex justify-between items-center">
          <Link
            to="/"
            className="text-4xl font-bold text-white hover:text-white z-[40] relative"
          >
            AutoGOD
          </Link>
          
          {/* Desktop Navigation */}
          <div className='hidden sm:block'>
            <Navigation fallingMenuPages={fallingMenuPages} topics={topics} />
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className='sm:hidden relative z-[60] p-2 text-white hover:text-gray-300 transition-colors'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          
          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div 
              className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-[45]"
              onClick={closeMenu}
            />
          )}
          
          {/* Mobile Menu */}
          <div className={`
            sm:hidden fixed top-0 right-0 h-screen w-[280px] max-w-[80vw]
            bg-gradient-to-b from-[#222225] to-[#1a1a1d]
            transform transition-transform duration-300 ease-in-out z-[50]
            shadow-2xl flex flex-col
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}>
            {/* Menu Header - Fixed */}
            <div className="flex-shrink-0 p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Menu</h2>
            </div>
            
            {/* Menu Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 pt-8" style={{ maxHeight: 'calc(100vh - 80px)' }}>
              <div onClick={closeMenu}>
                <Navigation 
                  fallingMenuPages={fallingMenuPages} 
                  topics={topics}
                  isMobile={true}
                />
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </header>
  );
};

export default Header;