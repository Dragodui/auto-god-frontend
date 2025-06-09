import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '@/store/store';
import {
  fetchChats,
  fetchChatById,
  sendMessage,
} from '@/store/slices/chatsSlice';
import { getImage } from '@/utils/getImage';
import { formatDistanceToNow } from 'date-fns';
import { User, Send, LoaderIcon } from 'lucide-react';
import Wrapper from '@/components/Wrapper';
import { Link } from 'react-router-dom';
import { getCurrentProfileData } from '@/services/userService';

const ChatsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId?: string }>();
  const { chats, currentChat, loading } = useSelector(
    (state: RootState) => state.chats
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const getCurrentUser = async () => {
    try {
      const currentProfileData = await getCurrentProfileData();
      setCurrentUser(currentProfileData);
    } catch (error) {
      console.error(`Error while getting current user: ${error}`);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  // Handle URL parameter for specific chat
  useEffect(() => {
    if (chatId && chats.length > 0) {
      // Check if the chat exists in the fetched chats
      const chatExists = chats.find((chat) => chat._id === chatId);
      if (chatExists) {
        dispatch(fetchChatById(chatId));
      } else {
        // Chat doesn't exist, redirect to chats page
        navigate('/market/chats');
      }
    }
  }, [chatId, chats, dispatch, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  const handleChatSelect = (selectedChatId: string) => {
    // Update URL when selecting a chat
    navigate(`/market/chats/${selectedChatId}`);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentChat) return;

    try {
      await dispatch(
        sendMessage({ chatId: currentChat._id, content: message })
      );
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getOtherParticipant = (chat: typeof currentChat) => {
    if (!chat || !currentUser) return null;
    return chat.participants.find((p) => p._id !== currentUser._id);
  };

  const getLastMessage = (chat: typeof currentChat) => {
    if (!chat?.messages?.length) return 'No messages yet';
    const lastMessage = chat.messages[chat.messages.length - 1];
    return lastMessage.content;
  };

  if (loading && !chats.length) {
    return (
      <Wrapper>
        <div className="min-h-screen bg-[#222225] text-white flex items-center justify-center">
          <LoaderIcon className="w-8 h-8 animate-spin" />
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="min-h-screen w-full bg-[#222225] text-white">
        <div className="container mx-auto py-4 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chats List */}
            <div className="md:col-span-1 bg-[#32323E] rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Conversations</h2>
              <div className="space-y-4">
                {chats.map((chat) => {
                  const otherParticipant = getOtherParticipant(chat);
                  return (
                    <button
                      key={chat._id}
                      onClick={() => handleChatSelect(chat._id)}
                      className={`w-full text-left p-4 rounded-lg transition-colors ${
                        currentChat?._id === chat._id
                          ? 'bg-[#4A4A5A]'
                          : 'hover:bg-[#3E3E4A]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {otherParticipant?.avatar ? (
                            <img
                              src={getImage(otherParticipant.avatar)}
                              alt={otherParticipant.name}
                              className="w-12 h-12 rounded-full"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                              <User size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4">
                            <h3 className="font-medium truncate">
                              {otherParticipant?.name || 'Unknown User'}
                            </h3>
                            <span className="text-sm text-gray-400">
                              {formatDistanceToNow(new Date(chat.updatedAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 truncate">
                            {getLastMessage(chat)}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            <Link to={`/market/${chat.item._id}`}>
                              About:{' '}
                              <span className="text-secondary underline">
                                {chat.item.title}
                              </span>
                            </Link>
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat Window */}
            <div className="md:col-span-2 bg-[#32323E] rounded-lg flex flex-col h-[600px]">
              {currentChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-[#4A4A5A]">
                    <div className="flex items-center gap-3">
                      {getOtherParticipant(currentChat)?.avatar ? (
                        <img
                          src={getImage(
                            getOtherParticipant(currentChat)!.avatar!
                          )}
                          alt={getOtherParticipant(currentChat)!.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                          <User size={20} className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">
                          {getOtherParticipant(currentChat)?.name ||
                            'Unknown User'}
                        </h3>
                        <p className="text-sm text-gray-400">
                          <Link to={`/market/${currentChat.item._id}`}>
                            About:{' '}
                            <span className="text-secondary underline">
                              {currentChat.item.title}
                            </span>
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentChat.messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          msg.sender === currentUser?._id
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.sender === currentUser?._id
                              ? 'bg-[#4A4A5A]'
                              : 'bg-[#3E3E4A]'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <span className="text-xs text-gray-400">
                            {formatDistanceToNow(new Date(msg.timestamp), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-4 border-t border-[#4A4A5A]"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-[#3E3E4A] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A4A5A]"
                      />
                      <button
                        type="submit"
                        disabled={!message.trim()}
                        className="bg-[#4A4A5A] hover:bg-[#5A5A6A] px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  {chatId ? (
                    <div className="text-center">
                      <p>Chat not found</p>
                      <Link
                        to="/market/chats"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        Go back to chats
                      </Link>
                    </div>
                  ) : (
                    'Select a conversation to start chatting'
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ChatsPage;
