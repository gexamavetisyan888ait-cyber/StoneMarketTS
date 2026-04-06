import React, { useEffect, useState, useRef } from "react";
import type { ChangeEvent, KeyboardEvent, MouseEvent, TouchEvent } from "react";
import {
  ref as databaseRef,
  onValue,
  push,
  serverTimestamp,
  remove,
  onDisconnect,
  set,
  update,
  onChildAdded,
  off,
  DataSnapshot
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { db, auth, googleProvider, storage } from "../../lib/firebase";
import {
  LogOut, ChevronLeft, Send, Trash2,
  Phone, PhoneOff, Mic, MicOff, Plus, X, Video, Users, Image as ImageIcon, Play, Pause, UserMinus
} from "lucide-react";

// --- Interfaces ---

interface Message {
  id: string;
  text?: string | null;
  file?: string | null;
  fileType?: "image" | "video" | "voice" | "file" | "text";
  senderId: string;
  senderName: string;
  timestamp: any;
}

interface ChatUser {
  uid: string;
  displayName: string;
  photo: string;
  state?: "online" | "offline";
  last_changed?: any;
  isGroup?: boolean;
  id?: string;
  members?: Record<string, boolean>;
}

interface StoryItem {
  id: string;
  uid: string;
  displayName: string;
  photo: string;
  url: string;
  type: "image" | "video";
  timestamp: number;
}

interface StoryGroup {
  uid: string;
  displayName: string;
  photo: string;
  items: StoryItem[];
}

interface CallData {
  callId: string;
  callerId: string;
  callerName: string;
  callerPhoto: string;
  targetId: string;
  targetName: string;
  targetPhoto: string;
  status: "offer" | "active" | "ended";
  type: "audio" | "video";
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
}

const servers: RTCConfiguration = {
  iceServers: [
    { urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"] },
    { urls: ["stun:stun3.l.google.com:19302", "stun:stun4.l.google.com:19302"] },
  ],
  iceCandidatePoolSize: 10,
};

export default function Chat() {
  // --- States ---
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [allUsers, setAllUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [stories, setStories] = useState<StoryGroup[]>([]);
  const [activeStoryGroup, setActiveStoryGroup] = useState<StoryGroup | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
  const [storyReply, setStoryReply] = useState<string>("");
  const [storyProgress, setStoryProgress] = useState<number>(0);

  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [incomingCall, setIncomingCall] = useState<CallData | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isVideoCall, setIsVideoCall] = useState<boolean>(false);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // --- Refs ---
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const pc = useRef<RTCPeerConnection | null>(null);
  const timerRef = useRef<number | null>(null);
  const currentCallIdRef = useRef<string | null>(null);
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);
  const storyInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storyTimerRef = useRef<number | null>(null);

  // --- Call Cleanup ---
  const cleanupCall = () => {
    if (localStream) localStream.getTracks().forEach(track => track.stop());
    if (pc.current) { pc.current.close(); pc.current = null; }
    if (currentCallIdRef.current) {
      off(databaseRef(db, `calls/${currentCallIdRef.current}/callerCandidates`));
      off(databaseRef(db, `calls/${currentCallIdRef.current}/targetCandidates`));
      off(databaseRef(db, `calls/${currentCallIdRef.current}/answer`));
    }
    setLocalStream(null);
    setRemoteStream(null);
    setIsCalling(false);
    setIncomingCall(null);
    setIsMuted(false);
    setIsVideoOff(false);
    setCallDuration(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    ringtoneRef.current?.pause();
    currentCallIdRef.current = null;
  };

  // --- WebRTC Setup ---
  const setupWebRTC = async (stream: MediaStream, callId: string, isCaller: boolean) => {
    pc.current = new RTCPeerConnection(servers);
    stream.getTracks().forEach(track => pc.current?.addTrack(track, stream));

    pc.current.ontrack = (e) => {
      if (e.streams && e.streams[0]) setRemoteStream(e.streams[0]);
    };

    const icePath = isCaller ? "callerCandidates" : "targetCandidates";
    pc.current.onicecandidate = (e) => {
      if (e.candidate) push(databaseRef(db, `calls/${callId}/${icePath}`), e.candidate.toJSON());
    };

    onChildAdded(databaseRef(db, `calls/${callId}/${isCaller ? "targetCandidates" : "callerCandidates"}`), (s: DataSnapshot) => {
      if (s.exists() && pc.current) pc.current.addIceCandidate(new RTCIceCandidate(s.val())).catch(() => { });
    });
  };

  // --- Effects ---
  useEffect(() => {
    ringtoneRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/1358/1358-preview.mp3");
    if (ringtoneRef.current) ringtoneRef.current.loop = true;
    const unsubscribe = onAuthStateChanged(auth, (u) => { 
        setUser(u); 
        setLoading(false); 
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    return onValue(databaseRef(db, 'calls'), (snap: DataSnapshot) => {
      const data = snap.val();
      if (!data) { if (isCalling || incomingCall) cleanupCall(); return; }
      const myCallId = Object.keys(data).find(id => id.includes(user.uid));
      if (!myCallId) { if (isCalling || incomingCall) cleanupCall(); return; }
      const callData: CallData = { ...data[myCallId], callId: myCallId };
      currentCallIdRef.current = myCallId;

      if (callData.targetId === user.uid && callData.status === "offer" && !isCalling && !incomingCall) {
        setIncomingCall(callData);
        setIsVideoCall(callData.type === "video");
        ringtoneRef.current?.play().catch(() => { });
      }
      if (callData.status === "active") {
        ringtoneRef.current?.pause();
        setIncomingCall(null);
        setIsCalling(true);
        if (!timerRef.current) {
          timerRef.current = window.setInterval(() => setCallDuration(p => p + 1), 1000);
        }
      }
      if (callData.status === "ended") cleanupCall();
    });
  }, [user, isCalling, incomingCall]);

  // --- Handlers ---
  const startCall = async (type: "audio" | "video" = "audio") => {
    if (!selectedUser || selectedUser.isGroup || !user) return;
    const callId = [user.uid, selectedUser.uid].sort().join("_");
    setIsCalling(true); setIsVideoCall(type === "video");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: type === "video" });
      setLocalStream(stream); await setupWebRTC(stream, callId, true);
      const offer = await pc.current!.createOffer();
      await pc.current!.setLocalDescription(offer);
      await set(databaseRef(db, `calls/${callId}`), {
        offer: { type: offer.type, sdp: offer.sdp },
        callerId: user.uid, callerName: user.displayName, callerPhoto: user.photoURL,
        targetId: selectedUser.uid, targetName: selectedUser.displayName, targetPhoto: selectedUser.photo,
        status: "offer", type, timestamp: serverTimestamp()
      });
      onValue(databaseRef(db, `calls/${callId}/answer`), (s) => {
        const answer = s.val();
        if (answer && pc.current && !pc.current.remoteDescription) pc.current.setRemoteDescription(new RTCSessionDescription(answer));
      });
    } catch (err) { cleanupCall(); }
  };

  const answerCall = async () => {
    if (!incomingCall) return;
    const callId = incomingCall.callId;
    ringtoneRef.current?.pause();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: incomingCall.type === "video" });
      setLocalStream(stream); setIsCalling(true); setIsVideoCall(incomingCall.type === "video");
      await setupWebRTC(stream, callId, false);
      await pc.current!.setRemoteDescription(new RTCSessionDescription(incomingCall.offer!));
      const answer = await pc.current!.createAnswer();
      await pc.current!.setLocalDescription(answer);
      await update(databaseRef(db, `calls/${callId}`), { answer: { type: answer.type, sdp: answer.sdp }, status: "active" });
    } catch (err) { cleanupCall(); }
  };

  const endCall = async () => {
    if (currentCallIdRef.current) {
      await update(databaseRef(db, `calls/${currentCallIdRef.current}`), { status: "ended" });
      setTimeout(() => remove(databaseRef(db, `calls/${currentCallIdRef.current!}`)), 1000);
    }
    cleanupCall();
  };

  const sendMsg = async (text: string | null = null, fileUrl: string | null = null, fileType: Message["fileType"] = "text", targetUser: ChatUser | null = null) => {
    const partner = targetUser || selectedUser;
    if (!user || !partner) return;
    const cid = partner.isGroup ? `group_${partner.id}` : [user.uid, partner.uid].sort().join("_");
    await push(databaseRef(db, `db/chats/${cid}`), {
      text, file: fileUrl, fileType, senderId: user.uid, senderName: user.displayName || "User", timestamp: serverTimestamp()
    });
    setMessage("");
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type: Message["fileType"] = file.type.startsWith("image") ? "image" : file.type.startsWith("video") ? "video" : "file";
    const sRef = storageRef(storage, `chat_files/${Date.now()}_${file.name}`);
    await uploadBytes(sRef, file);
    const url = await getDownloadURL(sRef);
    sendMsg(null, url, type);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp4' });
        const sRef = storageRef(storage, `voice/${user?.uid}/${Date.now()}.mp4`);
        await uploadBytes(sRef, audioBlob);
        const url = await getDownloadURL(sRef);
        sendMsg(null, url, "voice");
      };
      mediaRecorder.current.start(); setIsRecording(true);
    } catch (e) { alert("Microphone error"); }
  };

  const stopRecording = () => { if (mediaRecorder.current && isRecording) { mediaRecorder.current.stop(); setIsRecording(false); } };

  const toggleAudio = (id: string) => {
    const audio = document.getElementById(`audio-${id}`) as HTMLAudioElement;
    if (playingAudioId === id) {
      audio.pause();
      setPlayingAudioId(null);
    } else {
      if (playingAudioId) (document.getElementById(`audio-${playingAudioId}`) as HTMLAudioElement)?.pause();
      audio.play();
      setPlayingAudioId(id);
      audio.onended = () => setPlayingAudioId(null);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const createGroup = async () => {
    const name = prompt("Group Name:");
    if (!name || !user) return;
    const id = Date.now();
    await set(databaseRef(db, `db/groups/${id}`), { id, name, admin: user.uid, members: { [user.uid]: true }, photo: `https://ui-avatars.com/api/?name=${name}&background=random` });
  };

  const leaveGroup = async () => {
    if (!selectedUser?.isGroup || !user) return;
    await remove(databaseRef(db, `db/groups/${selectedUser.id}/members/${user.uid}`));
    setSelectedUser(null);
  };

  const uploadStory = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const sRef = storageRef(storage, `stories/${user.uid}/${Date.now()}`);
    await uploadBytes(sRef, file);
    const url = await getDownloadURL(sRef);
    await push(databaseRef(db, "stories"), { uid: user.uid, displayName: user.displayName, photo: user.photoURL, url, type: file.type.startsWith("video") ? "video" : "image", timestamp: Date.now() });
  };

  const handleStoryClick = (e: MouseEvent<HTMLDivElement>) => {
    const x = e.clientX;
    const width = window.innerWidth;
    if (!activeStoryGroup) return;
    if (x > width / 2) {
      if (currentStoryIndex < activeStoryGroup.items.length - 1) {
        setCurrentStoryIndex(p => p + 1);
        setStoryProgress(0);
      } else setActiveStoryGroup(null);
    } else {
      if (currentStoryIndex > 0) {
        setCurrentStoryIndex(p => p - 1);
        setStoryProgress(0);
      }
    }
  };

  // --- Story Progress Effect ---
  useEffect(() => {
    if (!activeStoryGroup) { setStoryProgress(0); return; }
    storyTimerRef.current = window.setInterval(() => {
      setStoryProgress(p => {
        if (p >= 100) {
          if (currentStoryIndex < activeStoryGroup.items.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
            return 0;
          } else {
            setActiveStoryGroup(null);
            return 0;
          }
        }
        return p + 0.5;
      });
    }, 50);
    return () => { if (storyTimerRef.current) clearInterval(storyTimerRef.current); };
  }, [activeStoryGroup, currentStoryIndex]);

  // --- Data Listeners ---
  useEffect(() => {
    if (!user) return;
    const sRef = databaseRef(db, `db/status/${user.uid}`);
    set(sRef, { uid: user.uid, state: "online", last_changed: serverTimestamp(), displayName: user.displayName, photo: user.photoURL });
    onDisconnect(sRef).update({ state: "offline", last_changed: serverTimestamp() });

    return onValue(databaseRef(db, "db/status"), (snap) => {
      const data = snap.val() || {};
      const uniqueUsers = new Map<string, ChatUser>();
      Object.values(data).forEach((u: any) => uniqueUsers.set(u.uid, u));
      onValue(databaseRef(db, "db/groups"), (gSnap) => {
        const groups = gSnap.exists() ? Object.values(gSnap.val() as Record<string, any>).filter(g => g.members?.[user.uid]).map(g => ({ ...g, isGroup: true, displayName: g.name })) : [];
        setAllUsers([...groups, ...Array.from(uniqueUsers.values())]);
      });
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const dayAgo = Date.now() - 86400000;
    return onValue(databaseRef(db, "stories"), (snap) => {
      const data = snap.val(); if (!data) { setStories([]); return; }
      const active = Object.keys(data).map(id => ({ id, ...data[id] })).filter(s => s.timestamp > dayAgo);
      const grouped = active.reduce((acc: Record<string, StoryGroup>, s: any) => {
        if (!acc[s.uid]) acc[s.uid] = { uid: s.uid, displayName: s.displayName, photo: s.photo, items: [] };
        acc[s.uid].items.push(s); return acc;
      }, {});
      setStories(Object.values(grouped));
    });
  }, [user]);

  useEffect(() => {
    if (!user || !selectedUser) return;
    const cid = selectedUser.isGroup ? `group_${selectedUser.id}` : [user.uid, selectedUser.uid].sort().join("_");
    return onValue(databaseRef(db, `db/chats/${cid}`), (snap) => {
      const d = snap.val(); setMessages(d ? Object.keys(d).map(k => ({ id: k, ...d[k] })) : []);
    });
  }, [user, selectedUser]);

  if (loading) return <div className="h-screen flex items-center justify-center font-black italic text-gray-400">STONECHAT...</div>;

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F6] font-sans overflow-hidden">
      
      {/* STORY VIEWER */}
      {activeStoryGroup && (
        <div className="fixed inset-0 z-[6000] bg-black flex flex-col items-center justify-center">
          <div className="relative w-full max-w-lg h-full bg-zinc-900 md:h-[95vh] md:rounded-xl overflow-hidden shadow-2xl flex flex-col">
            <div className="absolute inset-0 z-40 flex" onClick={handleStoryClick}>
              <div className="w-1/2 h-full cursor-w-resize"></div>
              <div className="w-1/2 h-full cursor-e-resize"></div>
            </div>

            <div className="absolute top-4 left-4 right-4 flex gap-1 z-50">
              {activeStoryGroup.items.map((_, i) => (
                <div key={i} className="h-[2px] flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: i === currentStoryIndex ? `${storyProgress}%` : i < currentStoryIndex ? '100%' : '0%' }} />
                </div>
              ))}
            </div>

            <div className="absolute top-8 left-4 right-4 flex justify-between items-center z-50">
              <div className="flex items-center gap-3">
                <img src={activeStoryGroup.photo} className="w-10 h-10 rounded-full border border-white/20" alt="" />
                <span className="text-white font-bold text-sm drop-shadow-md">{activeStoryGroup.displayName}</span>
              </div>
              <button onClick={() => setActiveStoryGroup(null)} className="text-white drop-shadow-md hover:scale-110 relative z-50"><X size={28} /></button>
            </div>

            <div className="flex-1 flex items-center justify-center bg-black">
              {activeStoryGroup.items[currentStoryIndex].type === "video" ? (
                <video src={activeStoryGroup.items[currentStoryIndex].url} autoPlay playsInline className="w-full h-full object-contain" />
              ) : (
                <img src={activeStoryGroup.items[currentStoryIndex].url} className="w-full h-full object-contain" alt="" />
              )}
            </div>

            <div className="p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-3 relative z-50">
              <input type="text" value={storyReply} onChange={(e) => setStoryReply(e.target.value)} placeholder="Send message..." className="flex-1 bg-transparent border border-white/40 rounded-full px-5 py-2 text-white text-sm outline-none placeholder:text-white/60 focus:border-white" />
              <button onClick={async () => {
                if (!storyReply.trim()) return;
                const target: ChatUser = { uid: activeStoryGroup.uid, displayName: activeStoryGroup.displayName, photo: activeStoryGroup.photo };
                await sendMsg(`Story reply: ${storyReply}\n${activeStoryGroup.items[currentStoryIndex].url}`, null, "text", target);
                setStoryReply(""); setActiveStoryGroup(null);
              }} className="text-white"><Send size={24} /></button>
            </div>
          </div>
        </div>
      )}

      {/* CALL UI */}
      {isCalling && (
        <div className="fixed inset-0 z-[5000] bg-slate-950 flex flex-col items-center justify-center animate-in fade-in duration-500 overflow-hidden">
          <div className="relative w-full h-full max-w-[100vw] max-h-[100vh] md:w-[95%] md:h-[90%] md:rounded-[3rem] bg-black/60 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col items-center justify-center">
            {isVideoCall ? (
              <div className="relative w-full h-full">
                {remoteStream ? <video autoPlay playsInline ref={v => v && (v.srcObject = remoteStream)} className="w-full h-full object-cover" /> : 
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900/50"><img src={selectedUser?.photo || incomingCall?.callerPhoto} className="w-32 h-32 rounded-full border-2 border-emerald-500/50 p-1 mb-4 object-cover animate-pulse" /><p className="text-white/50 font-bold tracking-widest animate-bounce uppercase text-xs">Connecting...</p></div>}
                {localStream && !isVideoOff && <div className="absolute top-6 right-6 md:top-10 md:right-10 w-32 h-44 md:w-56 md:h-80 rounded-3xl border-2 border-white/20 shadow-2xl overflow-hidden z-20 transition-all hover:scale-105"><video autoPlay muted playsInline ref={v => v && (v.srcObject = localStream)} className="w-full h-full object-cover" /></div>}
              </div>
            ) : (
              <div className="flex flex-col items-center z-10">
                <div className="relative mb-12"><img src={selectedUser?.photo || incomingCall?.callerPhoto} className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-[6px] border-white/10 p-2 object-cover shadow-[0_0_50px_rgba(0,0,0,0.5)]" alt="User" /><div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-6 py-2 bg-emerald-500 rounded-full text-white text-xs font-black tracking-widest shadow-lg">ON CALL</div></div>
                <h2 className="text-white text-4xl md:text-6xl font-black tracking-tighter mb-2 italic">{selectedUser?.displayName || incomingCall?.callerName}</h2>
                <div className="flex items-center gap-3 text-emerald-400 font-mono text-xl tracking-[0.3em] bg-white/5 px-6 py-2 rounded-full border border-white/5">{formatTime(callDuration)}</div>
              </div>
            )}
            {!isVideoCall && remoteStream && <audio autoPlay ref={a => a && (a.srcObject = remoteStream)} />}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 md:gap-8 bg-white/5 backdrop-blur-2xl px-8 py-6 rounded-[3rem] border border-white/10 z-30 shadow-2xl">
              <button onClick={() => { if (localStream) { localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled; setIsMuted(!localStream.getAudioTracks()[0].enabled); } }} className={`group p-5 md:p-6 rounded-full transition-all duration-500 ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>{isMuted ? <MicOff size={28} /> : <Mic size={28} />}</button>
              {isVideoCall && <button onClick={() => { if (localStream) { localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled; setIsVideoOff(!localStream.getVideoTracks()[0].enabled); } }} className={`group p-5 md:p-6 rounded-full transition-all duration-500 ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>{isVideoOff ? <Video size={28} /> : <Video size={28} />}</button>}
              <button onClick={endCall} className="group p-6 md:p-8 bg-red-600 text-white rounded-full hover:bg-red-500 hover:scale-110 active:scale-95 transition-all shadow-[0_0_40px_rgba(220,38,38,0.4)]"><PhoneOff size={32} /></button>
            </div>
          </div>
        </div>
      )}

      {/* INCOMING CALL BANNER */}
      {incomingCall && !isCalling && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[3100] bg-white p-6 rounded-[2.5rem] shadow-2xl flex items-center gap-6 border border-emerald-500 w-[90%] max-w-md animate-bounce">
          <img src={incomingCall.callerPhoto} className="w-16 h-16 rounded-full object-cover" alt="" />
          <div className="flex-1"><p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{incomingCall.type} CALL</p><h3 className="font-black text-gray-800">{incomingCall.callerName}</h3></div>
          <div className="flex gap-3"><button onClick={answerCall} className="p-4 bg-emerald-500 text-white rounded-full"><Phone size={24} /></button><button onClick={endCall} className="p-4 bg-red-500 text-white rounded-full"><PhoneOff size={24} /></button></div>
        </div>
      )}

      <main className="flex-1 flex overflow-hidden p-4 md:p-8">
        {!user ? (
          <div className="flex-1 flex items-center justify-center"><button onClick={() => signInWithPopup(auth, googleProvider)} className="py-4 px-10 bg-gray-900 text-white rounded-[2rem] font-black shadow-2xl hover:scale-105 transition-all">Մուտք Google-ով</button></div>
        ) : (
          <div className="flex w-full h-full bg-white md:rounded-[3rem] shadow-2xl overflow-hidden">
            <aside className={`${selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-[380px] flex-col border-r border-gray-50`}>
              <div className="p-8 flex justify-between items-center"><h2 className="font-black text-2xl text-gray-900 italic">StoneChat</h2><div className="flex gap-3"><button onClick={createGroup} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-full transition-all"><Users size={22} /></button><button onClick={() => signOut(auth)} className="p-2 text-gray-300 hover:text-red-500 transition-all"><LogOut size={22} /></button></div></div>
              
              <div className="px-6 py-2 flex gap-4 overflow-x-auto no-scrollbar mb-4">
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <button onClick={() => storyInputRef.current?.click()} className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-500 flex items-center justify-center text-emerald-500 bg-emerald-50/50 transition-all hover:bg-emerald-50"><Plus size={28} /></button>
                  <span className="text-[10px] font-black text-emerald-500 uppercase">Story</span>
                  <input type="file" ref={storyInputRef} onChange={uploadStory} hidden accept="image/*,video/*" />
                </div>
                {stories.map(s => (
                  <button key={s.uid} onClick={() => { setActiveStoryGroup(s); setCurrentStoryIndex(0); }} className="shrink-0 flex flex-col items-center gap-1">
                    <div className="w-16 h-16 p-[3px] border-2 border-emerald-500 rounded-full"><img src={s.photo} className="w-full h-full rounded-full object-cover" alt="" /></div>
                    <span className="text-[10px] font-bold text-gray-500 truncate w-16 text-center">{s.displayName.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto px-4 space-y-1">
                {allUsers.filter(u => u.uid !== user.uid).map((u, i) => (
                  <div key={u.uid || u.id || i} className="group flex items-center gap-2 pr-4">
                    <button onClick={() => setSelectedUser(u)} className={`flex-1 flex items-center gap-4 p-4 rounded-[2rem] transition-all ${selectedUser?.uid === u.uid || selectedUser?.id === u.id ? "bg-emerald-50" : "hover:bg-gray-50"}`}>
                      <div className="relative"><img src={u.photo} className="w-14 h-14 rounded-full object-cover shadow-sm" alt="" />{!u.isGroup && <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-4 border-white ${u.state === 'online' ? 'bg-green-500' : 'bg-gray-300'}`}></div>}</div>
                      <div className="text-left flex-1"><p className="font-black text-gray-800 text-sm">{u.displayName}</p><p className={`text-[10px] font-black uppercase ${u.state === 'online' ? 'text-green-500' : 'text-gray-400'}`}>{u.isGroup ? "Խմբային չաթ" : u.state}</p></div>
                    </button>
                    {!u.isGroup && <button onClick={() => remove(databaseRef(db, `db/status/${u.uid}`))} className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all"><UserMinus size={18} /></button>}
                  </div>
                ))}
              </div>
            </aside>

            <section className={`${!selectedUser ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-[#FDFDFD]`}>
              {selectedUser ? (
                <>
                  <header className="px-8 py-6 flex items-center justify-between bg-white border-b border-gray-50">
                    <div className="flex items-center gap-4">
                      <button onClick={() => setSelectedUser(null)} className="md:hidden text-gray-400"><ChevronLeft size={28} /></button>
                      <div className="relative"><img src={selectedUser.photo} className="w-12 h-12 rounded-full object-cover shadow-md" alt="" />{!selectedUser.isGroup && <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-white ${selectedUser.state === 'online' ? 'bg-green-500' : 'bg-gray-300'}`}></div>}</div>
                      <div><h3 className="font-black text-gray-900 text-base">{selectedUser.displayName}</h3>{!selectedUser.isGroup ? <p className={`text-[10px] font-black uppercase tracking-widest ${selectedUser.state === 'online' ? 'text-green-500' : 'text-gray-400'}`}>{selectedUser.state}</p> : <button onClick={leaveGroup} className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase">Լքել խումբը</button>}</div>
                    </div>
                    <div className="flex gap-3">
                      {!selectedUser.isGroup && (
                        <><button onClick={() => startCall("audio")} className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"><Phone size={20} /></button><button onClick={() => startCall("video")} className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"><Video size={20} /></button></>
                      )}
                      <button onClick={async () => { if (window.confirm("Ջնջե՞լ նամակագրությունը")) { const cid = selectedUser.isGroup ? `group_${selectedUser.id}` : [user.uid, selectedUser.uid].sort().join("_"); await remove(databaseRef(db, `db/chats/${cid}`)); } }} className="p-4 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={20} /></button>
                    </div>
                  </header>

                  <main className="flex-1 overflow-y-auto p-8 space-y-6">
                    {messages.map(msg => (
                      <div key={msg.id} className={`flex flex-col ${msg.senderId === user.uid ? "items-end" : "items-start"}`}>
                        <div className={`group relative max-w-[85%]`}>
                          {msg.fileType === "voice" ? (
                            <div className={`flex items-center gap-3 p-2 pr-4 rounded-[2rem] min-w-[240px] shadow-sm transition-all ${msg.senderId === user.uid ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white" : "bg-white border border-emerald-100 text-emerald-900"}`}>
                              <button onClick={() => toggleAudio(msg.id)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-md ${msg.senderId === user.uid ? "bg-white text-emerald-600 hover:bg-emerald-50" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}>
                                {playingAudioId === msg.id ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
                              </button>
                              <audio src={msg.file!} id={`audio-${msg.id}`} className="hidden" />
                            </div>
                          ) : msg.fileType === "image" ? (
                            <div className="rounded-[2rem] overflow-hidden shadow-md"><img src={msg.file!} className="max-w-xs cursor-pointer" alt="" onClick={() => window.open(msg.file!)} /></div>
                          ) : msg.fileType === "video" ? (
                            <video src={msg.file!} controls className="max-w-xs rounded-2xl" />
                          ) : (
                            <div className={`px-6 py-3 rounded-[2rem] shadow-sm ${msg.senderId === user.uid ? "bg-gray-900 text-white rounded-tr-none" : "bg-white text-gray-800 shadow-md rounded-tl-none border border-gray-50"}`}>
                              <p className="text-sm font-medium whitespace-pre-wrap">{msg.text}</p>
                            </div>
                          )}
                          <span className="text-[9px] block mt-1 px-2 opacity-40 uppercase font-black">{msg.senderName && msg.senderId !== user.uid ? `${msg.senderName} • ` : ""}{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</span>
                        </div>
                      </div>
                    ))}
                  </main>

                  <footer className="p-8 bg-white border-t border-gray-50">
                    <div className="flex items-center gap-4 bg-gray-100 rounded-[2.5rem] px-6 py-2">
                      <div className="flex gap-2">
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-emerald-500"><ImageIcon size={22} /></button>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} hidden />
                        <button onMouseDown={startRecording} onMouseUp={stopRecording} onTouchStart={(e: TouchEvent) => { e.preventDefault(); startRecording(); }} onTouchEnd={(e: TouchEvent) => { e.preventDefault(); stopRecording(); }} className={`p-2 transition-all ${isRecording ? 'text-red-500 scale-150 animate-pulse' : 'text-gray-400 hover:text-emerald-500'}`}><Mic size={22} /></button>
                      </div>
                      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e: KeyboardEvent) => e.key === "Enter" && message.trim() && sendMsg(message)} className="flex-1 bg-transparent py-4 outline-none text-sm font-medium" placeholder="Գրեք հաղորդագրություն..." />
                      <button onClick={() => message.trim() && sendMsg(message)} className="p-4 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-all shadow-lg active:scale-90"><Send size={20} /></button>
                    </div>
                  </footer>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center"><div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-4 animate-pulse"><Users size={40} /></div><p className="text-gray-300 font-black uppercase text-xs tracking-[0.3em]">Ընտրեք զրուցակից</p></div>
              )}
            </section>
          </div>
        )}
      </main>
      <style dangerouslySetInnerHTML={{ __html: `.no-scrollbar::-webkit-scrollbar { display: none; } * { -webkit-tap-highlight-color: transparent; }` }} />
    </div>
  );
}