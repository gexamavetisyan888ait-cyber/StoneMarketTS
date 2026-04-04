import { useState, useEffect, useRef } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./lib/firebase.js";
import { X } from "lucide-react";

import Home from './pages/Home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import Designers from './pages/Designers';
import About from './pages/About';
import Chat from './pages/Chat';
import Favorites from './pages/Favorites'
import Liking from './pages/Liking'
import CardInfo from './pages/CardInfo1';

function NotificationWrapper() {
  const [user, setUser] = useState(null);
  const [activeNotification, setActiveNotification] = useState(null);
  const location = useLocation();
  const lastPlayedMsgId = useRef(null);
  const audioRef = useRef(new Audio("https://raw.githubusercontent.com/YushSanjay/Sound-Effects/master/iPhone%20Notification%20Sound.mp3"));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || location.pathname === "/chat") {
      setActiveNotification(null);
      return;
    }

    const chatsRef = ref(db, `db/chats`);
    return onValue(chatsRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const allChats = snapshot.val();
      let newestMsgData = null;

      Object.keys(allChats).forEach(chatId => {
        if (chatId.includes(user.uid)) {
          const chatMessages = allChats[chatId];
          const msgIds = Object.keys(chatMessages);
          const lastId = msgIds[msgIds.length - 1];
          const lastMsg = chatMessages[lastId];
          const lastReadId = localStorage.getItem(`lastRead_${chatId}`);

          if (lastMsg.senderId !== user.uid && lastId !== lastReadId) {
            newestMsgData = { ...lastMsg, id: lastId };
          }
        }
      });

      if (newestMsgData && newestMsgData.id !== lastPlayedMsgId.current) {
        audioRef.current.play().catch(() => {});
        setActiveNotification({
          text: newestMsgData.text,
          sender: newestMsgData.displayName
        });
        setTimeout(() => setActiveNotification(null), 5000);
        lastPlayedMsgId.current = newestMsgData.id;
      }
    });
  }, [user, location.pathname]);

  return (
    <>
      {activeNotification && (
        <div className="fixed top-6 right-8 z-[1000] animate-in fade-in slide-in-from-right-10 duration-500">
          <div className="relative">
            <div className="bg-emerald-500 text-white px-6 py-4 rounded-[2.5rem] rounded-tr-none shadow-2xl min-w-[250px] max-w-[320px] border-2 border-white/20">
              <div className="flex justify-between items-start mb-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Նոր հաղորդագրություն</p>
                <X size={14} className="cursor-pointer opacity-50 hover:opacity-100" onClick={() => setActiveNotification(null)} />
              </div>
              <p className="font-bold text-sm mb-1">{activeNotification.sender}</p>
              <p className="text-sm opacity-90 italic font-medium">"{activeNotification.text}"</p>
              <div className="absolute -top-[2px] -right-[12px] w-6 h-6 bg-emerald-500" style={{ clipPath: 'polygon(0 0, 0% 100%, 100% 0)' }}></div>
            </div>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/designers" element={<Designers />} />
        <Route path="/about" element={<About />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/liking" element={<Liking />} />
        <Route path="/product/:id" element={<CardInfo />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NotificationWrapper />
    </BrowserRouter>
  );
}

export default App;