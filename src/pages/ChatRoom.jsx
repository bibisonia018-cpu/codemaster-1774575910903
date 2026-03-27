import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Send, ArrowRight } from 'lucide-react';

export default function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef();
  const username = localStorage.getItem('chat_user');

  useEffect(() => {
    if (!username) navigate('/');

    // 1. تحديد المجموعة والشرط (الرسائل التي تنتمي لهذه الغرفة فقط)
    const q = query(
      collection(db, "messages"),
      where("roomId", "==", roomId),
      orderBy("createdAt", "asc")
    );

    // 2. الاستماع اللحظي (onSnapshot) لضمان ظهور الرسائل فوراً لجميع الأطراف
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let msgs = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
      // التمرير للأسفل تلقائياً
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, [roomId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: input,
      sender: username,
      roomId: roomId,
      createdAt: serverTimestamp()
    });
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-chatBg">
      {/* Header */}
      <div className="p-4 bg-chatSidebar flex items-center gap-4 border-b border-gray-800">
        <button onClick={() => navigate('/')}><ArrowRight /></button>
        <div>
          <h2 className="font-bold">غرفة: {roomId}</h2>
          <p className="text-xs text-chatPrimary">متصل الآن (تشفير تام)</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === username ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl ${msg.sender === username ? 'bg-chatPrimary text-black rounded-tr-none' : 'bg-gray-800 text-white rounded-tl-none'}`}>
              <p className="text-[10px] opacity-70">{msg.sender}</p>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 bg-chatSidebar flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب رسالتك السرية..."
          className="flex-1 bg-black border border-gray-700 rounded-full px-4 py-2 focus:outline-none"
        />
        <button type="submit" className="bg-chatPrimary p-3 rounded-full text-black hover:scale-105 transition-transform">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}