import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Reply, Send, User, ChevronDown, ChevronUp } from 'lucide-react';
import { addComment, likeComment } from '@/services/commentsService';
import { formatDistanceToNow } from 'date-fns';
import { getImage } from '@/utils/getImage';
import { getCurrentProfileData } from '@/services/userService';
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
  comments: CommentType[];
  onRefresh: () => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  postId,
  comments,
  onRefresh,
}) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<
    Record<string, boolean>
  >({});
  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const user = await getCurrentProfileData();
    setCurrentUser(user);
  }

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
      await addComment(postId, commentContent);
      setCommentContent('');
      onRefresh();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Submit a reply
  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      await addComment(postId, replyContent, parentId);
      setReplyContent('');
      setReplyingTo(null);
      onRefresh();
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  // Like a comment (mock implementation)
  const handleLikeComment = async (commentId: string) => {
    try {
      await likeComment(commentId);
      onRefresh();
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
                <span className="font-semibold">{comment.author?.name || 'Anonymous'}</span>
                <span className="text-gray-500 text-sm ml-2">
                  {formatCommentDate(comment.createdAt)}
                </span>
              </div>
              {currentUser?.role === 'admin' && (
                <AdminControls
                  itemType="comment"
                  itemId={comment._id}
                  onDelete={onRefresh}
                  isUserIncluded={true} 
                  userId={comment.authorId} 
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
                <Heart size={16} className={comment.likes?.length > 0 ? 'fill-current' : ''} />
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
                      <img src={getImage(comment?.author?.avatar as string)} alt="" />
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
                      Hide replies (
                      {getRepliesForComment(comment._id).length})
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} />
                      Show replies (
                      {getRepliesForComment(comment._id).length})
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
                      className="space-y-4"
                    >
                      {getRepliesForComment(comment._id).map((reply) => (
                        <div key={reply._id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#32323E] flex items-center justify-center flex-shrink-0">
                            {reply?.author?.avatar ? (
                              <img
                                src={
                                  getImage(reply?.author?.avatar as string)
                                }
                                alt={reply.author.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User size={16} />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">
                                {reply.author?.name || 'Anonymous'}
                              </span>
                              <span className="text-sm text-gray-400">
                                {formatCommentDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-200 mb-2">
                              {reply.content}
                            </p>
                            <div className="flex gap-4 text-sm text-gray-400">
                              <button
                                onClick={() =>
                                  handleLikeComment(reply._id)
                                }
                                className="flex items-center gap-1 hover:text-white transition-colors"
                              >
                                <Heart size={14} />
                                {reply.likes > 0 && (
                                  <span>{reply.likes}</span>
                                )}
                              </button>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#2A2A35] p-6 rounded-xl"
    >
      <h2 className="text-2xl font-bold mb-6 font-sansation">
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-[#32323E] flex items-center justify-center flex-shrink-0">
            <img className='w-full h-full rounded-full' src={getImage(currentUser?.avatar as  string)} alt="User" />
          </div>
          <div className="flex-1">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-[#32323E] rounded-lg p-3 text-white resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#4A4A5A]"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!commentContent.trim()}
                className="bg-[#32323E] hover:bg-[#3E3E4A] px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                Comment
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {displayedComments.length > 0 ? (
        <div className="space-y-6">
          {displayedComments.map((comment) => renderComment(comment))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          No comments yet. Be the first to comment!
        </div>
      )}

      {/* Show More Comments Button */}
      {parentComments.length > 3 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAllComments(!showAllComments)}
            className="bg-[#32323E] hover:bg-[#3E3E4A] px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            {showAllComments ? (
              <>
                <ChevronUp size={18} />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown size={18} />
                Show All Comments ({parentComments.length})
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CommentsSection;
