import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState('Guest');
  const messagesEndRef = useRef(null);
  const SOCKET_URL = 'https://growmart-back-production.up.railway.app';

  // ============ INITIALIZE SOCKET ============
  useEffect(() => {
    // Get username
    const savedUsername = localStorage.getItem('chatUsername');
    if (savedUsername) {
      setUsername(savedUsername);
    } else {
      const name = prompt('Enter your name for chat:', 'Guest');
      if (name) {
        setUsername(name);
        localStorage.setItem('chatUsername', name);
      }
    }

    // Create socket connection
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('✅ Chat socket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Chat socket disconnected');
      setIsConnected(false);
    });

    // 🔥 FIX: Receive chat history
    newSocket.on('chat-history', (history) => {
      console.log('📜 Chat history received:', history);
      setMessages(history || []);
    });

    // 🔥 FIX: Receive new message
    newSocket.on('chat-message', (message) => {
      console.log('💬 New message:', message);
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // ============ AUTO SCROLL ============
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ============ SEND MESSAGE ============
  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket || !isConnected) return;

    const messageData = {
      username: username,
      message: inputMessage.trim(),
    };

    console.log('📤 Sending message:', messageData);
    socket.emit('chat-message', messageData);
    setInputMessage('');
  };

  // ============ TYPING INDICATOR ============
  const handleTyping = () => {
    if (socket && isConnected) {
      socket.emit('typing', { username });
    }
  };

  // ============ TOGGLE FUNCTIONS ============
  const toggleChat = () => setIsOpen(!isOpen);
  const toggleMinimize = () => setIsMinimized(!isMinimized);

  // ============ CHAT BUTTON ============
  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl shadow-purple-500/30 hover:scale-110 transition-all duration-300"
      >
        <MessageCircle size={24} />
        {isConnected && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        )}
      </button>
    );
  }

  // ============ CHAT WINDOW ============
  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96 bg-black/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-purple-500/20 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} className="text-purple-400" />
          <span className="font-semibold text-white">Live Chat</span>
          {isConnected ? (
            <span className="text-xs text-green-400">● Online</span>
          ) : (
            <span className="text-xs text-red-400">● Offline</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleMinimize}
            className="p-1 hover:bg-white/10 rounded-lg transition"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={toggleChat}
            className="p-1 hover:bg-white/10 rounded-lg transition"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                <MessageCircle className="w-12 h-12 mx-auto opacity-30 mb-2" />
                <p className="text-sm">No messages yet.</p>
                <p className="text-xs text-gray-600">Start a conversation!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className={`flex flex-col ${
                    msg.username === username ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      msg.username === username
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none'
                        : 'bg-white/10 text-white rounded-bl-none'
                    }`}
                  >
                    <p className="text-xs font-medium opacity-70">
                      {msg.username || 'User'}
                    </p>
                    <p className="text-sm break-words">{msg.message}</p>
                    <p className="text-[10px] opacity-50 mt-1">
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="p-3 border-t border-white/10 bg-white/5"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyUp={handleTyping}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none text-white placeholder-gray-500 text-sm"
                disabled={!isConnected}
              />
              <button
                type="submit"
                disabled={!isConnected || !inputMessage.trim()}
                className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white disabled:opacity-50 hover:opacity-90 transition"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default LiveChat;
