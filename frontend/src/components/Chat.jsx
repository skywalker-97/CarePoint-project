import React, { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets_frontend/assets';
import { 
    Send, X, FileText, Paperclip, Check, CheckCheck, 
    MoreHorizontal, Download, Image as ImageIcon, File
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Chat = ({ roomId, receiverName, onClose, senderId, senderModel }) => {
    const { socket, backendUrl, token } = useContext(AppContext);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [showTypingIndicator, setShowTypingIndicator] = useState(false);
    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [showDoctorCta, setShowDoctorCta] = useState(false);

    const fetchMessages = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/chat/get', { roomId }, { headers: { token } });
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        socket.emit('join_room', roomId);
        fetchMessages();

        socket.on('receive_message', (data) => {
            if (data.roomId === roomId) {
                setMessages((prev) => [...prev, { ...data, createdAt: new Date().toISOString() }]);
            }
        });

        socket.on('user_typing', (data) => {
            if (data.roomId === roomId && data.senderId !== senderId) {
                setShowTypingIndicator(true);
            }
        });

        socket.on('user_stop_typing', (data) => {
            if (data.roomId === roomId) {
                setShowTypingIndicator(false);
            }
        });

        return () => {
            socket.off('receive_message');
            socket.off('user_typing');
            socket.off('user_stop_typing');
        };
    }, [roomId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, showTypingIndicator]);

    const handleTyping = (e) => {
        setMessage(e.target.value);
        if (!isTyping) {
            setIsTyping(true);
            socket.emit('typing', { roomId, senderId });
        }
        
        // Timeout to stop typing indicator
        const lastTypingTime = new Date().getTime();
        const timerLength = 3000;
        setTimeout(() => {
            const timeNow = new Date().getTime();
            const timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && isTyping) {
                socket.emit('stop_typing', { roomId, senderId });
                setIsTyping(false);
            }
        }, timerLength);
    };

    const handleSendMessage = async (e, fileData = null) => {
        if (e) e.preventDefault();
        if (!fileData && message.trim() === '') return;

        const messageData = {
            roomId,
            senderId,
            senderModel,
            message: fileData ? `Sent a file: ${fileData.name}` : message,
            fileUrl: fileData?.url || null,
            fileName: fileData?.name || null,
            fileType: fileData?.type || null,
            createdAt: new Date().toISOString()
        };

        // Optimistic UI Update: Show message immediately
        setMessages((prev) => [...prev, messageData]);
        setMessage('');
        
        // Show AI typing indicator if chatting in support room
        if (roomId === 'carepoint_support') {
            setShowTypingIndicator(true);
        }

        try {
            const { data } = await axios.post(backendUrl + '/api/chat/send', messageData, { headers: { token } });
            if (data.success) {
                socket.emit('send_message', messageData);
                
                if (data.aiResponse) {
                    setMessages((prev) => [...prev, data.aiResponse]);
                }
                
                if (data.severity === 'PRIORITY' || data.severity === 'EMERGENCY') {
                    setShowDoctorCta(true);
                } else {
                    setShowDoctorCta(false);
                }

                socket.emit('stop_typing', { roomId, senderId });
                setIsTyping(false);
            } else {
                toast.error(data.message);
                // Optionally remove the optimistically added message here if it fails
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            if (roomId === 'carepoint_support') {
                setShowTypingIndicator(false);
            }
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            return toast.error("File size must be less than 5MB");
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const fileData = {
                url: reader.result,
                name: file.name,
                type: file.type
            };
            handleSendMessage(null, fileData);
        };
    };

    const renderFilePreview = (msg) => {
        const isImage = msg.fileType?.startsWith('image/');
        return (
            <div className={`mt-2 p-2 rounded-xl bg-black/5 flex items-center gap-3 border border-white/20`}>
                {isImage ? (
                    <img src={msg.fileUrl} alt="attachment" className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <FileText size={20} />
                    </div>
                )}
                <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold truncate">{msg.fileName}</p>
                    <p className="text-[10px] opacity-60">Attachment</p>
                </div>
                <a href={msg.fileUrl} download={msg.fileName} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                    <Download size={16} />
                </a>
            </div>
        );
    };

    return (
        <div className="fixed bottom-10 right-10 w-96 h-[600px] bg-white/80 backdrop-blur-2xl shadow-elevated rounded-[40px] flex flex-col z-[2000] border border-white overflow-hidden font-inter">
            {/* Header */}
            <div className="p-6 bg-primary text-white flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-black text-xl backdrop-blur-md">
                        {receiverName[0]}
                    </div>
                    <div>
                        <p className="font-black tracking-tight">{receiverName}</p>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Live Consultation</p>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-2xl transition-all active:scale-95">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                {messages.map((msg, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        key={index} 
                        className={`flex ${msg.senderId === senderId ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] space-y-1`}>
                            <div className={`p-4 rounded-[28px] text-sm shadow-sm ${
                                msg.senderId === senderId 
                                ? 'bg-primary text-white rounded-tr-none' 
                                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                            }`}>
                                {!msg.fileUrl && <p className="font-medium leading-relaxed">{msg.message}</p>}
                                {msg.fileUrl && renderFilePreview(msg)}
                            </div>
                            <div className={`flex items-center gap-1.5 px-2 ${msg.senderId === senderId ? 'justify-end' : 'justify-start'}`}>
                                <p className={`text-[9px] font-bold uppercase tracking-widest ${msg.senderId === senderId ? 'text-slate-400' : 'text-slate-400'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                {msg.senderId === senderId && (
                                    <CheckCheck size={12} className="text-primary opacity-50" />
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
                
                {showTypingIndicator && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 flex items-center gap-1">
                            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 h-1 bg-slate-400 rounded-full" />
                            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1 h-1 bg-slate-400 rounded-full" />
                            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1 h-1 bg-slate-400 rounded-full" />
                        </div>
                    </motion.div>
                )}

                {/* Emergency / Doctor CTA */}
                {showDoctorCta && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 mb-2 flex justify-center w-full"
                    >
                        <button 
                            onClick={() => {
                                onClose();
                                navigate('/doctors');
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest text-[10px] py-4 px-8 rounded-full shadow-xl shadow-red-500/30 flex items-center gap-2 transition-all active:scale-95"
                        >
                            Consult Live Specialist Now
                        </button>
                    </motion.div>
                )}

                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        accept="image/*,.pdf,.doc,.docx"
                    />
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-2xl transition-all active:scale-95"
                    >
                        <Paperclip size={20} />
                    </button>
                    
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={message}
                            onChange={handleTyping}
                            placeholder="Type a message..."
                            className="w-full bg-slate-100 border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={!message.trim()}
                        className="p-4 bg-primary text-white rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
