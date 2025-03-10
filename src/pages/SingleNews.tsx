import type React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Eye,
  Heart,
  Loader,
  Calendar,
  Tag,
  User,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Wrapper from '@/components/Wrapper';
import { getOneNews, likeNews, viewNews } from '@/services/newsService';
import { getImage } from '@/utils/getImage';

const SingleNews: React.FC = () => {
  const { newsId } = useParams();
  const [news, setNews] = useState<any | null>(null);
  const [author, setAuthor] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [liked, setLiked] = useState<boolean>(false);

  const fetchNewsData = useCallback(async () => {
    try {
      console.log(newsId);
      if (newsId) {
        const newsData = await getOneNews(newsId);
        console.log(newsData);
        setNews(newsData);

        setAuthor(newsData.author);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  }, [newsId]);

  useEffect(() => {
    fetchNewsData();
  }, [fetchNewsData]);

  useEffect(() => {
    handleView();
  }, []);

  const handleLike = async () => {
    try {
      await likeNews(newsId as string);
      await fetchNewsData();
    } catch (error) {
      console.error('Error liking news:', error);
    }
  };

  const handleView = async () => {
    try {
      await viewNews(newsId as string);
      await fetchNewsData();
    } catch (error) {
      console.error('Error viewing news:', error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Wrapper>
        <div className="min-h-screen bg-[#222225] text-white w-full flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin" />
        </div>
      </Wrapper>
    );
  }

  if (!news) {
    return (
      <Wrapper>
        <div className="min-h-screen bg-[#222225] text-white w-full">
          <div className="container mx-auto py-16">
            <Link
              to="/news"
              className="flex items-center text-gray-400 hover:text-white mb-8"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to News
            </Link>
            <div className="text-center py-16">
              <h2 className="text-3xl font-bold mb-4">News not found</h2>
              <p className="text-gray-400">
                The news article you're looking for doesn't exist or has been
                removed.
              </p>
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="min-h-screen bg-[#222225] text-white w-full">
        <div className="container mx-auto py-16 px-4 md:px-0">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/news"
              className="flex items-center text-gray-400 hover:text-white mb-8"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to News
            </Link>
          </motion.div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden relative mb-8">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${getImage(news.image)})`,
                }}
              >
                <div className="absolute inset-0 bg-black/50"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-4xl md:text-5xl font-bold font-sansation">
                  {news.title}
                </h1>
              </div>
            </div>
          </motion.div>

          {/* Meta Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-4 mb-8 text-gray-300 font-sansation"
          >
            <div className="flex items-center">
              <User size={18} className="mr-2" />
              <span>{author?.name || 'Unknown Author'}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={18} className="mr-2" />
              <span>{formatDate(news.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Eye size={18} className="mr-2" />
              <span>{news.views} views</span>
            </div>
            <div className="flex items-center">
              <Heart
                size={18}
                className={`mr-2 ${liked ? 'fill-red-500 text-red-500' : ''}`}
                onClick={handleLike}
              />
              <span>{news.likes} likes</span>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#2A2A35] p-8 rounded-xl mb-8"
          >
            {news.isMarkDown ? (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{news.content}</ReactMarkdown>
              </div>
            ) : (
              <div
                className="leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            )}
          </motion.div>

          {/* Tags */}
          {news.tags && news.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-8"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Tag size={20} className="mr-2" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[#32323E] px-3 py-1 rounded-full text-sm hover:bg-[#3E3E4A] transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex justify-between items-center mt-12 pt-8 border-t border-[#32323E]"
          >
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                liked
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-[#32323E] hover:bg-[#3E3E4A]'
              }`}
            >
              <Heart size={18} className={liked ? 'fill-red-500' : ''} />
              {liked ? 'Liked' : 'Like this article'}
            </button>

            <div className="flex gap-2">
              <button className="bg-[#32323E] hover:bg-[#3E3E4A] px-4 py-2 rounded-lg transition-colors">
                Share
              </button>
              <Link
                to="/news"
                className="bg-[#32323E] hover:bg-[#3E3E4A] px-4 py-2 rounded-lg transition-colors"
              >
                More News
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Wrapper>
  );
};

export default SingleNews;
