import type React from 'react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Eye,
  Heart,
  Calendar,
  Tag,
  User,
  X,
  ZoomIn,
  MessageSquare,
  LoaderIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Wrapper from '@/components/Wrapper';
import { getImage } from '@/utils/getImage';
import CommentsSection from '@/components/CommentSection';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { getCommentsForPost } from '@/store/slices/commentsSlice';
import { getCurrentProfileData } from '@/store/slices/userSlice';
import { getPost, likePost, viewPost } from '@/store/slices/postsSlice';
import Loader from '@/components/UI/Loader';
import AdminControls from '@/components/UI/AdminControls';
import { useAuth } from '@/providers/AuthProvider';
import { getOneNews, likeNews, viewNews } from '@/store/slices/newsSlice';

interface SingleContentProps {
  id: string;
  contentType: 'post' | 'news';
  backLink: string;
  backText: string;
  moreLink: string;
  moreText: string;
}

const SingleContent: React.FC<SingleContentProps> = ({
  id,
  contentType,
  backLink,
  backText,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const item = useSelector((state: RootState) =>
    contentType === 'post' ? state.posts.currentPost : state.news.currentNews
  );
  console.log(item);
  const loading = useSelector((state: RootState) =>
    contentType === 'post' ? state.posts.loading : state.news.loading
  );
  const { user: currentUser } = useSelector((state: RootState) => state.user);

  const { userId } = useAuth();
  const [fullscreenImage, setFullscreenImage] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      switch (contentType) {
        case 'post':
          dispatch(getPost(id));
          break;
        case 'news':
          dispatch(getOneNews(id));
          break;
      }
      dispatch(getCommentsForPost(id));
      dispatch(getCurrentProfileData());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      switch (contentType) {
        case 'post':
          dispatch(viewPost(id));
          break;
        case 'news':
          dispatch(viewNews(id));
          break;
      }
    }
  }, []);

  const handleLike = async () => {
    try {
      switch (contentType) {
        case 'post':
          await dispatch(likePost(id));
          await dispatch(getPost(id));
          break;
        case 'news':
          await dispatch(likeNews(id));
          await dispatch(getOneNews(id));
          break;
      }
    } catch (error) {
      console.error(`Error liking ${contentType}:`, error);
    }
  };

  const toggleFullscreenImage = () => {
    setFullscreenImage(!fullscreenImage);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isLiked = () => {
    if (!item || !userId) return false;
    return item.likes?.includes(userId);
  };

  const getViewCount = () => {
    if (!item || item.views === undefined) return 0;
    return item.views.length;
  };

  if (loading) {
    return (
      <Wrapper>
        <div className="min-h-screen bg-[#222225] text-white w-full flex items-center justify-center">
          {contentType === 'post' ? (
            <Loader />
          ) : (
            <LoaderIcon className="w-8 h-8 animate-spin" />
          )}
        </div>
      </Wrapper>
    );
  }

  if (!item) {
    return (
      <Wrapper>
        <div className="min-h-screen bg-[#222225] text-white w-full">
          <div className="container mx-auto py-16">
            <Link
              to={backLink}
              className="flex items-center text-gray-400 hover:text-white mb-8"
            >
              <ArrowLeft className="mr-2" size={20} />
              {backText}
            </Link>
            <div className="text-center py-16">
              <h2 className="text-3xl font-bold mb-4">
                {contentType === 'post' ? 'Post' : 'News'} not found
              </h2>
              <p className="text-gray-400">
                The {contentType} article you're looking for doesn't exist or
                has been removed.
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
        {/* Fullscreen Image Overlay */}
        <AnimatePresence>
          {fullscreenImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={toggleFullscreenImage}
            >
              <button
                className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-black/80 transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreenImage(false);
                }}
              >
                <X size={24} />
              </button>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={getImage(item.image) || '/placeholder.svg'}
                  alt={item.title}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container mx-auto py-16 px-4 md:px-0">
          <div className="flex items-center justify-between mb-4">
            {currentUser?.role === 'admin' && (
              <AdminControls itemType={contentType} itemId={id} />
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to={backLink}
              className="flex items-center text-gray-400 hover:text-white mb-8"
            >
              <ArrowLeft className="mr-2" size={20} />
              {backText}
            </Link>
          </motion.div>

          {/* Hero Section with Clickable Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <div className="w-full rounded-xl overflow-hidden relative mb-8">
              <div className="relative">
                {/* Main Image Container */}
                {item.image && item.image !== 'undefined' && (
                  <div
                    className="relative group cursor-pointer"
                    onClick={toggleFullscreenImage}
                  >
                    <img
                      src={getImage(item.image) || '/placeholder.svg'}
                      alt={item.title}
                      className="w-full h-[300px] md:h-[400px] object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ZoomIn size={32} className="text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-4">{item.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{item.author?.name || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(item.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={16} />
                <span>{getViewCount()} views</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span>{item.comments?.length || 0} comments</span>
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag size={16} />
                  <div className="flex gap-2">
                    {item.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-[#32323E] px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{item.content}</ReactMarkdown>
            </div>

            {currentUser && (
              <div className="mt-8 flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked()
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-[#32323E] hover:bg-[#3E3E4A]'
                  }`}
                >
                  <Heart
                    size={20}
                    className={isLiked() ? 'fill-current' : ''}
                  />
                  <span>{item.likes?.length || 0}</span>
                </button>
              </div>
            )}
          </motion.div>

          {/* Comments Section */}
          <CommentsSection postId={id} />
        </div>
      </div>
    </Wrapper>
  );
};

export default SingleContent;
