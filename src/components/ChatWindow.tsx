import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChat, sendMessage } from '../store/actions/chatActions';
import { RootState, AppDispatch } from '../store';
import type { Message } from '../types/index.ts';
import { io, Socket } from 'socket.io-client';
import Button from './UI/Button.tsx';
import { useAuth } from '@/providers/AuthProvider.tsx';

interface ChatWindowProps {
  itemId: string;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ itemId, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { currentChat, loading, error } = useSelector(
    (state: RootState) => state.chat
  );
  const { userId } = useAuth();

  useEffect(() => {
    dispatch(fetchChat(itemId));

    const newSocket = io(
      import.meta.env.VITE_SERVER_HOST || 'http://localhost:8000'
    );
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [dispatch, itemId]);

  useEffect(() => {
    if (socket && currentChat) {
      socket.emit('join-chat', currentChat._id);

      socket.on('receive-message', (message: Message) => {
        dispatch({ type: 'ADD_MESSAGE', payload: message });
      });
    }
  }, [socket, currentChat, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentChat || !userId) return;
    const newMessage = {
      content: message,
      sender: userId,
      timestamp: new Date().toISOString(),
    };

    dispatch(sendMessage(currentChat._id, newMessage));
    setMessage('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  if (error || !currentChat) {
    return (
      <div className="text-red-500 text-center p-4">
        {error || 'Chat not found'}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-bg text-white p-4 flex justify-between items-center">
        <h3 className="font-semibold">Chat with Seller</h3>
        <button onClick={onClose} className="text-white hover:text-gray-300">
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg">
        {currentChat.messages?.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.sender === userId
                  ? 'bg-secondary text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p>{msg.content}</p>
              <span className="text-xs opacity-75">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => handleSendMessage(e)}
        className="p-4 border-t bg-bg"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-secondary"
          />
          <Button
            type="submit"
            addStyles="px-4 py-2 text-xl rounded-lg transition-colors"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
