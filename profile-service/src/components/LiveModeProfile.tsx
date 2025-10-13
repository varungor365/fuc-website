'use client';

import { useEffect, useState } from 'react';

interface LiveModeProfileProps {
  username: string;
  location?: string;
}

export default function LiveModeProfile({ username, location }: LiveModeProfileProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [viewers, setViewers] = useState(1);
  const [messages, setMessages] = useState([
    { id: 1, user: 'Alex', text: 'Love your style!', time: '2 min ago' },
    { id: 2, user: 'Sam', text: 'Where did you get that hoodie?', time: '5 min ago' },
  ]);

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 2));
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white">
      {/* Live Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 bg-black/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-bold">LIVE</span>
            </div>
            <div className="text-sm text-purple-300">
              {viewers} viewers
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm">
              @{username} {location && `• ${location}`}
            </div>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
              Follow
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 h-screen flex">
        {/* Video Feed (Placeholder) */}
        <div className="flex-1 flex items-center justify-center bg-black/20">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">👤</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">@{username}</h2>
            <p className="text-purple-300 mb-6">Live fashion showcase</p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 rounded-lg">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span>Streaming now</span>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-96 bg-black/40 backdrop-blur-md border-l border-white/20 flex flex-col">
          <div className="p-4 border-b border-white/20">
            <h3 className="font-bold">Live Chat</h3>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{message.user}</span>
                  <span className="text-xs text-purple-300">{message.time}</span>
                </div>
                <p className="text-sm">{message.text}</p>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-white/20">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Send a message..."
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}