import React, { useState, useEffect, useContext } from 'react';
import { Bell, X, ExternalLink, Calendar, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { AppContext } from "../context/AppContext";
import { useNavigate } from 'react-router-dom';

const NotificationBell = ({ token, type = 'user' }) => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const endpoint = type === 'user' ? '/api/notifications/user' : '/api/notifications/doctor';
            const headerKey = type === 'user' ? 'token' : 'dToken';
            const { data } = await axios.get(backendUrl + endpoint, { headers: { [headerKey]: token } });
            if (data.success) {
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const markAsRead = async () => {
        try {
            const endpoint = type === 'user' ? '/api/notifications/mark-read-user' : '/api/notifications/mark-read-doctor';
            const headerKey = type === 'user' ? 'token' : 'dToken';
            await axios.post(backendUrl + endpoint, {}, { headers: { [headerKey]: token } });
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
            return () => clearInterval(interval);
        }
    }, [token]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const getIcon = (type) => {
        switch (type) {
            case 'appointment': return <Calendar size={14} className="text-blue-500" />;
            case 'prescription': return <FileText size={14} className="text-emerald-500" />;
            case 'alert': return <AlertCircle size={14} className="text-rose-500" />;
            default: return <CheckCircle size={14} className="text-primary" />;
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={() => { setIsOpen(!isOpen); if (!isOpen) markAsRead(); }}
                className="relative p-3 bg-slate-50 text-slate-400 hover:text-primary hover:bg-white rounded-2xl transition-all border border-slate-100 shadow-sm group"
            >
                <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-4 w-80 bg-white rounded-[32px] shadow-premium border border-slate-100 z-50 overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Activity Feed</h3>
                                <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-slate-600">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notif, index) => (
                                        <div 
                                            key={notif._id} 
                                            onClick={() => { if (notif.link) navigate(notif.link); setIsOpen(false); }}
                                            className={`p-5 flex gap-4 hover:bg-slate-50 transition-all cursor-pointer border-b border-slate-50 last:border-0 ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                                                {getIcon(notif.type)}
                                            </div>
                                            <div className="space-y-1">
                                                <p className={`text-xs leading-relaxed ${!notif.isRead ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'}`}>
                                                    {notif.message}
                                                </p>
                                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-tight">
                                                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Quiet for now</p>
                                    </div>
                                )}
                            </div>

                            {notifications.length > 0 && (
                                <div className="p-4 bg-slate-50 text-center">
                                    <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                                        Clear History
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
