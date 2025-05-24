import { FC, useEffect, useState } from 'react';
import Wrapper from './Wrapper';
import Button from './UI/Button';
import { useAuth } from '@/providers/AuthProvider';
import { logout } from '@/services/authService';
import { Link } from 'react-router-dom';
import { CircleUser } from 'lucide-react';
import { FallingMenu } from './UI/FallingMenu';
import { getForumTopics } from '@/services/topicService';
import { Topic } from '@/types';

const Header: FC = (): JSX.Element => {
  const { isAuthenticated } = useAuth();
  const [topics, setTopics] = useState<{ label: string; href: string }[]>([]);
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

  return (
    <header className="font-sansation py-[20px]">
      <Wrapper>
        <div className="w-full flex justify-between items-center">
          <Link
            to="/"
            className="text-4xl font-bold text-white hover:text-white"
          >
            AutoGOD
          </Link>
          <nav className="flex gap-5 items-center">
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
        </div>
      </Wrapper>
    </header>
  );
};

export default Header;
