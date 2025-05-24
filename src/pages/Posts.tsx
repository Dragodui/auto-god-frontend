import React, { useEffect } from 'react';
import Wrapper from '../components/Wrapper';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPosts } from '@/services/postsService';
import { Loader } from 'lucide-react';

const Posts: React.FC = () => {
  const [posts, setPosts] = React.useState<any[] | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const getData = async () => {
    setPosts(await getPosts());
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
            <div className="flex justify-between items-center">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-5xl font-bold mb-8"
              >
                Posts
              </motion.h2>
              <div>
                <Link
                  to="/create-post"
                  className=" text-white px-4 py-2 rounded-md"
                >
                  Create post
                </Link>
              </div>
            </div>
            {posts && posts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sansation"
              >
                {posts.map((topic, index) => (
                  <motion.div
                    key={topic._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative rounded-lg overflow-hidden"
                  >
                    <Link
                      to={`/posts/${topic?._id}`}
                      className="bg-[#2A2A35] p-6 min-h-[200px] rounded-lg hover:bg-[#32323E] transition-colors h-full flex flex-col justify-between bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: topic.image
                          ? `url(${import.meta.env.VITE_SERVER_HOST}${topic.image})`
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
                No posts available.
              </motion.div>
            )}
          </section>
        </div>
      )}
    </Wrapper>
  );
};

export default Posts;
