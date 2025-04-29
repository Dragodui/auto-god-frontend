import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Eye, Heart, Calendar, Tag, User, X, ZoomIn, MessageSquare, LoaderIcon } from "lucide-react"
import { Link } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import Wrapper from "@/components/Wrapper"
import { getImage } from "@/utils/getImage"
import CommentsSection from "@/components/CommentSection"
import { getCommentsForPost } from "@/services/commentsService"
import Loader from "@/components/UI/Loader"
import AdminControls from "@/components/UI/AdminControls"
import { getCurrentProfileData } from "@/services/userService"

interface SingleContentProps {
  id: string
  contentType: "post" | "news"
  fetchData: (id: string) => Promise<any>
  likeItem: (id: string) => Promise<void>
  viewItem: (id: string) => Promise<void>
  backLink: string
  backText: string
  moreLink: string
  moreText: string
  userId?: string
}

const SingleContent: React.FC<SingleContentProps> = ({
  id,
  contentType,
  fetchData,
  likeItem,
  viewItem,
  backLink,
  backText,
  moreLink,
  moreText,
  userId,
}) => {
  const [item, setItem] = useState<any | null>(null)
  const [author, setAuthor] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [fullscreenImage, setFullscreenImage] = useState<boolean>(false)
  const [comments, setComments] = useState<any[]>([])
  const [loadingComments, setLoadingComments] = useState<boolean>(true)
  const [currentUser, setCurrentUser] = useState<any | null>(null)

  const fetchItemData = useCallback(async () => {
    try {
      if (id) {
        const data = await fetchData(id)
        setItem(data)
        setAuthor(data.author)
      }
      setLoading(false)
    } catch (error) {
      console.error(`Error fetching ${contentType}:`, error)
      setLoading(false)
    }
  }, [id, fetchData, contentType])

  const fetchComments = useCallback(async () => {
    try {
      setLoadingComments(true)
      if (id) {
        const comments = await getCommentsForPost(id)
        setComments(comments)
      }
      setLoadingComments(false)
    } catch (error) {
      console.error("Error fetching comments:", error)
      setLoadingComments(false)
    }
  }, [id])

  useEffect(() => {
    fetchItemData()
    fetchComments()
    getCurrentUser()

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFullscreenImage(false)
      }
    }

    window.addEventListener("keydown", handleEscKey)

    return () => {
      window.removeEventListener("keydown", handleEscKey)
    }
  }, [fetchItemData, fetchComments])

  useEffect(() => {
    handleView()
  }, [])

  const handleLike = async () => {
    try {
      await likeItem(id)
      await fetchItemData()
    } catch (error) {
      console.error(`Error liking ${contentType}:`, error)
    }
  }

  const handleView = async () => {
    try {
      await viewItem(id)
      await fetchItemData()
    } catch (error) {
      console.error(`Error viewing ${contentType}:`, error)
    }
  }

  const toggleFullscreenImage = () => {
    setFullscreenImage(!fullscreenImage)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const isLiked = () => {
    if (!item || !userId) return false
    return item.likes.includes(userId);
  }

  const getViewCount = () => {
    if (!item) return 0
    return item.views.length
  }

  const getCurrentUser = async () => {
    const user = await getCurrentProfileData()
    setCurrentUser(user)
  }

  if (loading) {
    return (
      <Wrapper>
        <div className="min-h-screen bg-[#222225] text-white w-full flex items-center justify-center">
          {contentType === "post" ? <Loader /> : <LoaderIcon className="w-8 h-8 animate-spin" />}
        </div>
      </Wrapper>
    )
  }

  if (!item) {
    return (
      <Wrapper>
        <div className="min-h-screen bg-[#222225] text-white w-full">
          <div className="container mx-auto py-16">
            <Link to={backLink} className="flex items-center text-gray-400 hover:text-white mb-8">
              <ArrowLeft className="mr-2" size={20} />
              {backText}
            </Link>
            <div className="text-center py-16">
              <h2 className="text-3xl font-bold mb-4">{contentType === "post" ? "Post" : "News"} not found</h2>
              <p className="text-gray-400">
                The {contentType} article you're looking for doesn't exist or has been removed.
              </p>
            </div>
          </div>
        </div>
      </Wrapper>
    )
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
                  e.stopPropagation()
                  setFullscreenImage(false)
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
                  src={getImage(item.image) || "/placeholder.svg"}
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
              <AdminControls
                itemType={contentType}
                itemId={id}
                onDelete={() => window.location.href = backLink}
              />
            )}
          </div>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link to={backLink} className="flex items-center text-gray-400 hover:text-white mb-8">
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
                <div className="relative group cursor-pointer" onClick={toggleFullscreenImage}>
                  <img
                    src={getImage(item.image) || "/placeholder.svg"}
                    alt={item.title}
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
                  <h1 className="text-4xl md:text-5xl font-bold font-sansation">{item.title}</h1>
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
              <span>{author?.name || "Unknown Author"}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={18} className="mr-2" />
              <span>{formatDate(item.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Eye size={18} className="mr-2" />
              <span>{getViewCount()} views</span>
            </div>
            <div className="flex items-center">
              <Heart
                size={18}
                className={`mr-2 ${isLiked() ? "fill-red-500 text-red-500" : ""}`}
                onClick={handleLike}
              />
              <span>{item.likes.length} likes</span>
            </div>
            {contentType === "post" && (
              <div className="flex items-center">
                <MessageSquare size={18} className="mr-2" />
                <span>{comments.length} comments</span>
              </div>
            )}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#2A2A35] p-8 rounded-xl mb-8"
          >
            {item.isMarkDown ? (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{item.content}</ReactMarkdown>
              </div>
            ) : (
              <div className="leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: item.content }} />
            )}
          </motion.div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
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
                {item.tags.map((tag, index) => (
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
                isLiked() ? "bg-red-500/20 text-red-400" : "bg-[#32323E] hover:bg-[#3E3E4A]"
              }`}
            >
              <Heart size={18} className={isLiked() ? "fill-red-500" : ""} />
              {isLiked() ? "Liked" : "Like this article"}
            </button>

            <div className="flex gap-2">
             
              <Link to={moreLink} className="bg-[#32323E] hover:bg-[#3E3E4A] px-4 py-2 rounded-lg transition-colors">
                {moreText}
              </Link>
            </div>
          </motion.div>

          {/* Comments Section */}
          {loadingComments ? (
            <div className="flex justify-center py-8">
              {contentType === "post" ? <Loader /> : <LoaderIcon className="w-8 h-8 animate-spin" />}
            </div>
          ) : (
            <CommentsSection postId={id} comments={comments} onRefresh={fetchComments} />
          )}
        </div>
      </div>
    </Wrapper>
  )
}

export default SingleContent

