import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Reply, Send, User, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getImage } from '@/utils/getImage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
  getCommentsForPost,
  addComment,
  likeComment,
} from '@/store/slices/commentsSlice';
import { getCurrentProfileData } from '@/store/slices/userSlice';
import AdminControls from '@/components/UI/AdminControls';

interface Author {
  _id: string;
  name: string;
  avatar?: string;
}

interface CommentType {
  _id: string;
  authorId: string;
  content: string;
  postId: string;
  createdAt: Date;
  likes: string[];
  replyTo: string | null;
  author?: Author;
}

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { comments, loading } = useSelector(
    (state: RootState) => state.comments
  );
  const { user: currentUser } = useSelector((state: RootState) => state.user);
  const [commentContent, setCommentContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    dispatch(getCommentsForPost(postId));
    dispatch(getCurrentProfileData());
  }, [dispatch, postId]);

  const parentComments = comments.filter((comment) => !comment.replyTo);
  const replyComments = comments.filter((comment) => comment.replyTo);

  const getRepliesForComment = (commentId: string) => {
    return replyComments.filter((reply) => reply.replyTo === commentId);
  };

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyContent('');
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Submit a new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      await dispatch(addComment({ postId, content: commentContent }));
      await dispatch(getCommentsForPost(postId));
      setCommentContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Submit a reply
  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      await dispatch(
        addComment({ postId, content: replyContent, replyTo: parentId })
      );

      await dispatch(getCommentsForPost(postId));
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  // Like a comment
  const handleLikeComment = async (commentId: string) => {
    try {
      await dispatch(likeComment(commentId));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  // Format date
  const formatCommentDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Determine how many comments to show
  const displayedComments = showAllComments
    ? parentComments
    : parentComments.slice(0, 3);

  const renderComment = (comment: CommentType) => {
    return (
      <div key={comment._id} className="mb-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {comment.author?.avatar ? (
              <img
                src={getImage(comment.author.avatar)}
                alt={comment.author.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={20} className="text-gray-500" />
              </div>
            )}
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">
                  {comment.author?.name || 'Anonymous'}
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  {formatCommentDate(comment.createdAt)}
                </span>
              </div>
              {currentUser?.role === 'admin' && (
                <AdminControls
                  itemType="comment"
                  itemId={comment._id}
                  onDelete={() => dispatch(getCommentsForPost(postId))}
                  isUserIncluded={true}
                  banUser={comment.authorId}
                  username={comment.author?.name}
                />
              )}
            </div>
            <p className="mt-1">{comment.content}</p>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => handleLikeComment(comment._id)}
                className="flex items-center gap-1 text-gray-500 hover:text-red-500"
              >
                <Heart
                  size={16}
                  className={comment.likes?.length > 0 ? 'fill-current' : ''}
                />
                <span>{comment.likes?.length}</span>
              </button>
              <button
                onClick={() => handleReplyClick(comment._id)}
                className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
              >
                <Reply size={16} />
                <span>Reply</span>
              </button>
            </div>

            {/* Reply Form */}
            <AnimatePresence>
              {replyingTo === comment._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4"
                >
                  <form
                    onSubmit={(e) => handleSubmitReply(e, comment._id)}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#32323E] flex items-center justify-center flex-shrink-0">
                      <img
                        src={getImage(currentUser?.avatar as string)}
                        alt=""
                      />
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Reply to ${comment?.author?.name || 'Anonymous'}...`}
                        className="w-full bg-[#32323E] rounded-lg p-3 text-white resize-none min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#4A4A5A]"
                      />
                      <div className="flex justify-end mt-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setReplyingTo(null)}
                          className="bg-[#32323E] hover:bg-[#3E3E4A] px-3 py-1 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!replyContent.trim()}
                          className="bg-[#32323E] hover:bg-[#3E3E4A] px-3 py-1 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send size={14} />
                          Reply
                        </button>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Replies */}
            {getRepliesForComment(comment._id).length > 0 && (
              <div className="mt-4 pl-4 border-l-2 border-[#3E3E4A]">
                <button
                  onClick={() => toggleReplies(comment._id)}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-3"
                >
                  {expandedReplies[comment._id] ? (
                    <>
                      <ChevronUp size={16} />
                      Hide replies ({getRepliesForComment(comment._id).length})
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} />
                      Show replies ({getRepliesForComment(comment._id).length})
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {expandedReplies[comment._id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {getRepliesForComment(comment._id).map((reply) => (
                        <div key={reply._id} className="mb-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              {reply.author?.avatar ? (
                                <img
                                  src={getImage(reply.author.avatar)}
                                  alt={reply.author.name}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User size={16} className="text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-semibold">
                                    {reply.author?.name || 'Anonymous'}
                                  </span>
                                  <span className="text-gray-500 text-sm ml-2">
                                    {formatCommentDate(reply.createdAt)}
                                  </span>
                                </div>
                                {currentUser?.role === 'admin' && (
                                  <AdminControls
                                    itemType="comment"
                                    itemId={reply._id}
                                    onDelete={() =>
                                      dispatch(getCommentsForPost(postId))
                                    }
                                    isUserIncluded={true}
                                    banUser={reply.authorId}
                                    username={reply.author?.name}
                                  />
                                )}
                              </div>
                              <p className="mt-1">{reply.content}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <button
                                  onClick={() => handleLikeComment(reply._id)}
                                  className="flex items-center gap-1 text-gray-500 hover:text-red-500"
                                >
                                  <Heart
                                    size={16}
                                    className={
                                      reply.likes?.length > 0
                                        ? 'fill-current'
                                        : ''
                                    }
                                  />
                                  <span>{reply.likes?.length}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-[#32323E] flex items-center justify-center flex-shrink-0">
            {currentUser?.avatar ? (
              <img
                src={getImage(currentUser.avatar)}
                alt={currentUser.name}
                className="w-full h-full rounded-full"
              />
            ) : (
              <User size={20} className="text-gray-500" />
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write a comment..."
              className="w-full bg-[#32323E] rounded-lg p-3 text-white resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#4A4A5A]"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!commentContent.trim()}
                className="bg-[#32323E] hover:bg-[#3E3E4A] px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-4">Loading comments...</div>
      ) : (
        <>
          {displayedComments.map(renderComment)}
          {parentComments.length > 3 && (
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="text-blue-500 hover:text-blue-600 mt-4"
            >
              {showAllComments ? 'Show less' : 'Show more comments'}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CommentsSection;
