import React, { useEffect } from 'react';
import Wrapper from '../components/Wrapper';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Topic } from '@/types';
import { Loader } from 'lucide-react';
import { getForumTopics } from '@/services/topicService';

const Topics: React.FC = () => {
  const [topics, setTopics] = React.useState<Topic[] | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const getData = async () => {
    setTopics((await getForumTopics()) as Topic[]);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Wrapper>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-[#222225] text-white w-full">
          <section className="container mx-auto py-16">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl font-bold mb-8"
            >
              Topics
            </motion.h2>
            {topics && topics.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 font-sansation"
              >
                {topics.slice(0, 6).map((topic, index) => (
                  <motion.div
                    key={topic.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative rounded-lg overflow-hidden"
                  >
                    <Link
                      to={`/topics/${topic.title}`}
                      className="bg-[#2A2A35] p-6 min-h-[200px] rounded-lg hover:bg-[#32323E] transition-colors h-full flex flex-col justify-between bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: topic.cover
                          ? `url(${import.meta.env.VITE_SERVER_HOST}${topic.cover})`
                          : 'none',
                      }}
                    >
                      <div className="absolute inset-0 bg-black/40"></div>
                      <div className="relative z-10 flex items-center gap-3">
                        <h3 className="text-2xl font-semibold text-white">
                          {topic?.title}
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
                No topics available.
              </motion.div>
            )}
          </section>
        </div>
      )}
    </Wrapper>
  );
};

export default Topics;
