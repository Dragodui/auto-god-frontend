'use client';

import type React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Eye,
  Heart,
  Loader,
  Calendar,
  Tag,
  User,
  X,
  ZoomIn,
  MessageSquare,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Wrapper from '@/components/Wrapper';
import { likeNews, viewNews } from '@/services/newsService';
import { getImage } from '@/utils/getImage';
import { getPost } from '@/services/postsService';
import CommentsSection from '@/components/CommentSection';
import { getCommentsForPost } from '@/services/commentsService';

const SinglePost: React.FC = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<any | null>(null);
  const [author, setAuthor] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [liked, setLiked] = useState<boolean>(false);
  const [fullscreenImage, setFullscreenImage] = useState<boolean>(false);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState<boolean>(true);

  const fetchNewsData = useCallback(async () => {
    try {
      if (postId) {
        const postData = await getPost(postId);
        console.log(postData);
        setPost(postData);
        setAuthor(postData.author);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post:', error);
      setLoading(false);
    }
  }, [postId]);

  const fetchComments = useCallback(async () => {
    try {
      setLoadingComments(true);
      if (postId) {
        const comments = await getCommentsForPost(postId as string);
        setComments(comments);
      }
      setLoadingComments(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoadingComments(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchNewsData();
    fetchComments();

    // Add event listener for ESC key to close fullscreen image
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFullscreenImage(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [fetchNewsData, fetchComments]);

  useEffect(() => {
    handleView();
  }, []);

  const handleLike = async () => {
    try {
      await likeNews(postId as string);
      await fetchNewsData();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleView = async () => {
    try {
      await viewNews(postId as string);
      await fetchNewsData();
    } catch (error) {
      console.error('Error viewing post:', error);
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

  if (loading) {
    return (
      <Wrapper>
        <div className="min-h-screen bg-[#222225] text-white w-full flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin" />
        </div>
      </Wrapper>
    );
  }

  if (!post) {
    return (
      <Wrapper>
        <div className="min-h-screen bg-[#222225] text-white w-full">
          <div className="container mx-auto py-16">
            <Link
              to="/post"
              className="flex items-center text-gray-400 hover:text-white mb-8"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to Post
            </Link>
            <div className="text-center py-16">
              <h2 className="text-3xl font-bold mb-4">Post not found</h2>
              <p className="text-gray-400">
                The post article you're looking for doesn't exist or has been
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
                  src={getImage(post.image) || '/placeholder.svg'}
                  alt={post.title}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container mx-auto py-16 px-4 md:px-0">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/post"
              className="flex items-center text-gray-400 hover:text-white mb-8"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to Post
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
                <div
                  className="relative group cursor-pointer"
                  onClick={toggleFullscreenImage}
                >
                  <img
                    src={getImage(post.image) || '/placeholder.svg'}
                    alt={post.title}
                    className="w-full h-[300px] md:h-[400px] object-cover rounded-xl"
                  />

                  {/* Overlay with zoom icon */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-black/50 p-3 rounded-full">
                      <ZoomIn size={24} />
                    </div>
                  </div>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                  <h1 className="text-4xl md:text-5xl font-bold font-sansation">
                    {post.title}
                  </h1>
                </div>
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
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Eye size={18} className="mr-2" />
              <span>{post.views} views</span>
            </div>
            <div className="flex items-center">
              <Heart
                size={18}
                className={`mr-2 ${liked ? 'fill-red-500 text-red-500' : ''}`}
                onClick={handleLike}
              />
              <span>{post.likes} likes</span>
            </div>
            <div className="flex items-center">
              <MessageSquare size={18} className="mr-2" />
              <span>{comments.length} comments</span>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#2A2A35] p-8 rounded-xl mb-8"
          >
            {post.isMarkDown ? (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            ) : (
              <div
                className="leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}
          </motion.div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
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
                {post.tags.map((tag, index) => (
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
            className="flex justify-between items-center mt-12 pt-8 border-t border-[#32323E] mb-12"
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
                to="/post"
                className="bg-[#32323E] hover:bg-[#3E3E4A] px-4 py-2 rounded-lg transition-colors"
              >
                More Posts
              </Link>
            </div>
          </motion.div>

          {/* Comments Section */}
          {loadingComments ? (
            <div className="flex justify-center py-8">
              <Loader className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <CommentsSection
              postId={postId as string}
              comments={comments}
              onRefresh={fetchComments}
            />
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default SinglePost;
