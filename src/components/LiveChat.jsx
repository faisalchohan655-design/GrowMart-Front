import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../App';
import * as Lucide from 'lucide-react';

const LiveChat = () => {
  const { socket } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleChatReply = (data) => {
      setMessages(prev => [...prev, data]);
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    };

    const handleTyping = (data) => {
      setIsTyping(data.isTyping);
    };

    socket.on('chat-reply', handleChatReply);
    socket.on('typing-indicator', handleTyping);

    return () => {
      socket.off('chat-reply', handleChatReply);
      socket.off('typing-indicator', handleTyping);
    };
  }, [socket, isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;
    socket.emit('chat-message', { message: input.trim() });
    setInput('');
    setUnreadCount(0);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const handleTypingStart = () => {
    if (socket) {
      socket.emit('typing-start');
      clearTimeout(window.typingTimeout);
      window.typingTimeout = setTimeout(() => {
        socket.emit('typing-end');
      }, 2000);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-bg text-white shadow-xl hover:opacity-90 transition flex items-center justify-center"
      >
        {isOpen ? (
          <Lucide.X size={24} />
        ) : (
          <>
            <Lucide.MessageCircle size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] glass rounded-2xl border border-white/10 flex flex-col shadow-2xl animate-slide-in">
          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="font-bold">Live Chat</span>
              <span className="text-xs text-gray-500">• Online</span>
            </div>
            <button onClick={toggleChat} className="text-gray-400 hover:text-white transition">
              <Lucide.X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 text-sm mt-8">
                <Lucide.MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                No messages yet.<br />
                Start a conversation!
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl max-w-[80%] ${
                    msg.type === 'system' || msg.userId === 'system'
                      ? 'bg-purple-500/20 text-purple-300 ml-auto'
                      : 'bg-white/5 text-white'
                  }`}
                >
                  <p className="text-sm break-words">{msg.message}</p>
                  <span className="text-[10px] text-gray-500 block mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
            {isTyping && (
              <div className="text-xs text-gray-400 animate-pulse">
                Someone is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                handleTypingStart();
              }}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="px-4 py-2 rounded-xl gradient-bg text-white hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center"
            >
              <Lucide.Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveChat;
