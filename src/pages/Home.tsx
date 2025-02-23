import React, { useEffect } from 'react';
import Wrapper from '../components/Wrapper';
import { Link } from 'react-router-dom';
import { Bell, Loader, MessageCircle, Users, Wrench } from 'lucide-react';
import { getForumStats } from '@/services/statsService';
import { getForumTopics } from '@/services/topicService';
import { Topic } from '@/types';
import { Stats } from '@/types';

const Home: React.FC = () => {
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [topics, setTopics] = React.useState<Topic[] | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    getForumStats().then((data) => {
      if (data !== null) {
        setStats(data);
      }
    });
    getForumTopics().then((data) => {
      if (Array.isArray(data)) {
        setTopics(data);
      }
    });
    setLoading(false);
  }, []);

  return (
    <Wrapper>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-[#222225] text-white w-full">
          <section className="container mx-auto py-16 md:py-24">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Welcome to AutoGOD!
                </h1>
                <p className="text-xl font-sansation text-gray-400">
                  The best forum about the German Car Industry
                </p>
              </div>
              <div className="w-full max-w-[300px]">
                <img
                  src={`${import.meta.env.VITE_SERVER_HOST}/uploads/germany.png`}
                  alt="German Map"
                  width={300}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </section>

          <section className="container mx-auto py-16">
            <h2 className="text-5xl font-bold mb-8">Topics</h2>

            {topics && topics.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-sansation">
                <div className="col-span-2 row-span-2 relative rounded-lg overflow-hidden">
                  <Link
                    to={`/topics/${topics[0]?.title}`}
                    className="p-6 rounded-lg hover:bg-[#32323E] transition-colors h-full flex flex-col justify-between bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: topics[0]?.cover
                        ? `url(${import.meta.env.VITE_SERVER_HOST}${topics[0].cover})`
                        : 'none',
                    }}
                  >
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative z-10 flex items-center gap-3 p-3">
                      <h3 className="text-2xl font-semibold text-white">
                        {topics[0]?.title}
                      </h3>
                    </div>
                  </Link>
                </div>

                {topics.slice(1).map((topic) => (
                  <div
                    key={topic.id}
                    className="relative rounded-lg overflow-hidden"
                  >
                    <Link
                      to={`/topics/${topic?.title}`}
                      className="bg-[#2A2A35] p-6 min-h-[200px] rounded-lg hover:bg-[#32323E] transition-colors h-full flex flex-col justify-between bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: topic.cover
                          ? `url(${import.meta.env.VITE_SERVER_HOST}${topic.cover})`
                          : 'none',
                      }}
                    >
                      <div className="absolute inset-0 bg-black/40"></div>
                      <div className="relative z-10 flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-white">
                          {topic?.title}
                        </h3>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400">No topics available.</div>
            )}

            <Link
              to="/topics"
              className="mt-8 mx-auto block text-center text-white  px-4 py-2 rounded-lg transition"
            >
              Show More
            </Link>
          </section>

          <section className="container mx-auto py-16">
            <h2 className="text-5xl font-bold mb-8">Forum Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-[#2A2A35] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-secondary" />
                  <div className="text-sm text-gray-400">Users</div>
                </div>
                <div className="text-2xl font-bold">{stats?.users || 0}</div>
              </div>

              <div className="bg-[#2A2A35] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-6 h-6 text-secondary" />
                  <div className="text-sm text-gray-400">Topics</div>
                </div>
                <div className="text-2xl font-bold">{stats?.topics || 0}</div>
              </div>

              <div className="bg-[#2A2A35] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Wrench className="w-6 h-6 text-secondary" />
                  <div className="text-sm text-gray-400">Posts</div>
                </div>
                <div className="text-2xl font-bold">{stats?.posts || 0}</div>
              </div>
              <div className="bg-[#2A2A35] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="w-6 h-6 text-secondary" />
                  <div className="text-sm text-gray-400">News</div>
                </div>
                <div className="text-2xl font-bold">{stats?.news || 0}</div>
              </div>
            </div>
          </section>
        </div>
      )}
    </Wrapper>
  );
};

export default Home;
