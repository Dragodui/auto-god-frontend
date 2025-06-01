import { FC, useEffect, useState } from 'react';
import Wrapper from './Wrapper';
import { Link } from 'react-router-dom';
import { getForumTopics } from '@/services/topicService';
import { Topic } from '@/types';
import Navigation from './UI/Navigation';

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

  return (
    <header className="font-sansation py-[20px] z-[55]">
      <Wrapper>
        <div className="w-full flex justify-between items-center">
          <Link
            to="/"
            className="text-4xl font-bold text-white hover:text-white"
          >
            AutoGOD
          </Link>
          <div className='hidden sm:block'>
            
         <Navigation fallingMenuPages={fallingMenuPages} topics={topics}/>
          </div>
          <button className='flex flex-col justify-between w-[40px] h-[40px] sm:hidden relative z-[60]' onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className='block w-full'></div>
          </button>
          <div className={`sm:hidden flex items-center justify-center absolute right-[${isMenuOpen ? '0' : '-100%'}] top-0 right-0 bg-[#222225] w-[200px] h-screen transition-all duration-300 ease-in-out z-[50]`}>
         <Navigation fallingMenuPages={fallingMenuPages} topics={topics}/>
          </div>
        </div>
      </Wrapper>
    </header>
  );
};

export default Header;
