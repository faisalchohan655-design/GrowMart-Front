import React, { useState, useEffect } from 'react';
import { useStore } from '../App';
import * as Lucide from 'lucide-react';

const VisitorsCounter = () => {
  const { socket, isConnected } = useStore();
  const [visitors, setVisitors] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!socket) return;

    const handleVisitors = (count) => {
      setVisitors(count);
    };

    socket.on('visitors', handleVisitors);

    return () => {
      socket.off('visitors', handleVisitors);
    };
  }, [socket]);

  // Hide if 0 visitors
  useEffect(() => {
    if (visitors === 0) {
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShow(true);
    }
  }, [visitors]);

  if (!show || visitors === 0) return null;

  return (
    <div className="fixed bottom-24 left-6 z-40 glass px-4 py-2 rounded-xl text-sm flex items-center gap-2 border border-white/5">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
      <span className="text-gray-400">
        {visitors} {visitors === 1 ? 'visitor' : 'visitors'} online
      </span>
    </div>
  );
};

export default VisitorsCounter;
