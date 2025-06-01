import React, { useEffect } from 'react';
import Wrapper from '../components/Wrapper';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTopicItems } from '@/services/topicService';
import { Loader } from 'lucide-react';
import { getImage } from '@/utils/getImage';
import { useAuth } from '@/providers/AuthProvider';

const Topic: React.FC = () => {
  const { topicName } = useParams();
  const [type, setType] = React.useState<'posts' | 'news'>('posts');
  const [topicItems, setTopicItems] = React.useState<any[] | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const { isAuthenticated } = useAuth();

  const getData = async () => {
    setTopicItems(await getTopicItems(topicName as string, type));
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [type, topicName]);

  const handleChangeType = (type: 'posts' | 'news') => {
    setType(type);
  };

  return (
    <Wrapper>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-[#222225] text-white w-full">
          <section className="container mx-auto py-16">
            <div className="flex justify-between items-center">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-5xl font-bold mb-8"
              >
                {topicName?.slice(0, 1).toUpperCase() + topicName?.slice(1)}
              </motion.h2>
              {isAuthenticated && (
                <div className="flex gap-4 items-center">
                  <Link
                    className="bg-secondary px-3 py-2 rounded-lg"
                    to="/create-post"
                  >
                    create post
                  </Link>
                  <Link
                    className="bg-secondary px-3 py-2 rounded-lg"
                    to="/create-news"
                  >
                    create news
                  </Link>
                </div>
              )}
            </div>
            <div>
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => handleChangeType('posts')}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    type === 'posts'
                      ? 'bg-white text-[#222225]'
                      : 'bg-[#2A2A35] text-white hover:bg-[#32323E]'
                  }`}
                >
                  Posts
                </button>
                <button
                  onClick={() => handleChangeType('news')}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    type === 'news'
                      ? 'bg-white text-[#222225]'
                      : 'bg-[#2A2A35] text-white hover:bg-[#32323E]'
                  }`}
                >
                  News
                </button>
              </div>
            </div>
            {topicItems && topicItems.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 font-sansation"
              >
                {topicItems.map((topic, index) => (
                  <motion.div
                    key={topic._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative rounded-lg overflow-hidden"
                  >
                    <Link
                      to={`/${type}/${topic?._id}`}
                      className="bg-[#2A2A35] p-6 min-h-[200px] rounded-lg hover:bg-[#32323E] transition-colors h-full flex flex-col justify-between bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: topic.image
                          ? `url(${getImage(topic.image)})`
                          : 'none',
                      }}
                    >
                      <div className="absolute inset-0 bg-black/40"></div>
                      <div className="relative z-10 flex flex-col justify-end gap-3">
                        <h3 className="text-2xl font-semibold text-white">
                          {topic?.title}
                        </h3>
                        <h3 className="text-xl font-medium font-sansation text-white">
                          {topic?.content.slice(0, 30)}...
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="text-gray-400"
              >
                No posts/news available.
              </motion.div>
            )}
          </section>
        </div>
      )}
    </Wrapper>
  );
};

export default Topic;
