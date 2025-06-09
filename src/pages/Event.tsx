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
  MapPin,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Wrapper from '@/components/Wrapper';
import { getImage } from '@/utils/getImage';
import CommentsSection from '@/components/CommentSection';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';

import Loader from '@/components/UI/Loader';
import AdminControls from '@/components/UI/AdminControls';
import { useAuth } from '@/providers/AuthProvider';
import { getEvent, likeEvent, viewEvent } from '@/services/eventsService';
import { generateMapsLink } from '@/utils/generateMapsLinks';

const Event: React.FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const { user: currentUser } = useSelector((state: RootState) => state.user);
  const [event, setEvent] = useState<any | null>(null);
  const { userId } = useAuth();
  const [fullscreenImage, setFullscreenImage] = useState<boolean>(false);

  const fetchEvent = async () => {
    const parsedEvent = await getEvent(id);
    setEvent(parsedEvent);
  };
  const fetchView = async () => await viewEvent(id);
  useEffect(() => {
    if (id) {
      fetchEvent();
      fetchView();
      setLoading(false);
    }
  }, [id]);

  const handleLike = async () => {
    try {
      await likeEvent(id);
      await fetchEvent();
    } catch (error) {
      console.error(`Error liking Event:`, error);
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
    if (!event || !userId) return false;
    return event.likes?.includes(userId);
  };

  const getViewCount = () => {
    if (!event || event.views === undefined) return 0;
    return event.views.length;
  };

  if (loading) {
    return (
      <Wrapper>
        <div className="min-h-screen bg-[#222225] text-white w-full flex items-center justify-center">
          <Loader />
        </div>
      </Wrapper>
    );
  }

  if (!event) {
    return (
      <Wrapper>
        <div className="min-h-screen bg-[#222225] text-white w-full">
          <div className="container mx-auto py-16">
            <Link
              to="/events"
              className="flex items-center text-gray-400 hover:text-white mb-8"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to events
            </Link>
            <div className="text-center py-16">
              <h2 className="text-3xl font-bold mb-4">Event not found</h2>
              <p className="text-gray-400">
                The Event you're looking for doesn't exist or has been removed.
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
                  src={getImage(event.image) || '/placeholder.svg'}
                  alt={event.title}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container mx-auto py-16 px-4 md:px-0">
          <div className="flex items-center justify-between mb-4">
            {currentUser?.role === 'admin' && (
              <AdminControls
                itemType="event"
                itemId={id}
                onDelete={() => (window.location.href = '/events')}
              />
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/events"
              className="flex items-center text-gray-400 hover:text-white mb-8"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to events
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
                {event.image && event.image !== 'undefined' && (
                  <div
                    className="relative group cursor-pointer"
                    onClick={toggleFullscreenImage}
                  >
                    <img
                      src={getImage(event.image) || '/placeholder.svg'}
                      alt={event.title}
                      className="w-full h-[300px] md:h-[400px] object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ZoomIn size={32} className="text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mb-4 items-center">
              <h1 className="text-4xl font-bold">{event.title}</h1>
              <div className="p-2 bg-[#32323e] rounded-lg flex items-center gap-1">
                <MapPin />
                <a
                  href={generateMapsLink(event.place)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300"
                >
                  Click to see place
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{event.author?.name || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(event.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={16} />
                <span>{getViewCount()} views</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span>{event.comments?.length || 0} comments</span>
              </div>
              {event.tags && event.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag size={16} />
                  <div className="flex gap-2">
                    {event.tags.map((tag: { _id: string; title: string }) => (
                      <span
                        key={tag._id}
                        className="bg-[#32323E] px-2 py-1 rounded"
                      >
                        {tag.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{event.content}</ReactMarkdown>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked()
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-[#32323E] hover:bg-[#3E3E4A]'
                }`}
              >
                <Heart size={20} className={isLiked() ? 'fill-current' : ''} />
                <span>{event.likes?.length || 0}</span>
              </button>
            </div>
          </motion.div>

          {/* Comments Section */}
          <CommentsSection postId={id} />
        </div>
      </div>
    </Wrapper>
  );
};

export default Event;
