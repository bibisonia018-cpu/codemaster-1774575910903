import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    if (username && room) {
      localStorage.setItem('chat_user', username);
      navigate(`/chat/${room}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-chatBg p-4">
      <div className="bg-chatSidebar p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800">
        <h1 className="text-2xl font-bold text-center mb-8 text-chatPrimary">دخول الغرفة السرية</h1>
        <form onSubmit={handleJoin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="اسمك المستعار"
              className="w-full bg-black border border-gray-700 rounded-lg py-3 px-10 focus:border-chatPrimary outline-none"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="كود الغرفة (الرقم السري)"
              className="w-full bg-black border border-gray-700 rounded-lg py-3 px-10 focus:border-chatPrimary outline-none"
              onChange={(e) => setRoom(e.target.value)}
              required
            />
          </div>
          <button className="w-full bg-chatPrimary hover:bg-emerald-600 text-black font-bold py-3 rounded-lg transition-all">
            دخول الدردشة الآن
          </button>
        </form>
      </div>
    </div>
  );
}