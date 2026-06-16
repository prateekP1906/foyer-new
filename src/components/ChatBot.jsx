import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { X, Send } from 'lucide-react';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [systemContext, setSystemContext] = useState('');
    const [hasGreeted, setHasGreeted] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Fetch user profile and appointments on mount
    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return;

            const userId = session.user.id;

            // Fetch profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            // Fetch appointments
            const { data: apptData } = await supabase
                .from('appointments')
                .select('*')
                .eq('user_id', userId)
                .order('appointment_time', { ascending: true });

            const userProfile = profileData || {
                first_name: session.user.user_metadata?.first_name || '',
                last_name: session.user.user_metadata?.last_name || '',
                email: session.user.email,
            };
            const userAppointments = apptData || [];

            setProfile(userProfile);
            setAppointments(userAppointments);

            // Build system context string
            const contextStr = `
User Profile:
- Name: ${userProfile.first_name || 'N/A'} ${userProfile.last_name || ''}
- Email: ${userProfile.email || session.user.email || 'N/A'}
- Avatar: ${userProfile.avatar_url ? 'Yes' : 'No'}

User Appointments (${userAppointments.length} total):
${userAppointments.length > 0
    ? userAppointments.map((apt, i) =>
        `${i + 1}. Patient: ${apt.patient_name || 'N/A'} | Date: ${apt.appointment_time || 'N/A'} | Issue: ${apt.issue_description || 'N/A'} | Status: ${apt.status || 'N/A'} | Phone: ${apt.phone_number || 'N/A'}`
    ).join('\n')
    : 'No appointments found.'
}

Clinic Info:
- Business Hours: Monday-Friday, 9:00 AM - 5:00 PM
- Services: General Dentistry, Cosmetic Dentistry, Orthodontics, Teeth Whitening, Root Canal, Dental Implants, Emergency Care
- Location: DentistAI Clinic
            `.trim();

            setSystemContext(contextStr);
        };

        fetchUserData();
    }, []);

    // Show greeting when chat opens for the first time
    useEffect(() => {
        if (isOpen && !hasGreeted && profile) {
            const firstName = profile.first_name || 'there';
            setMessages([{
                role: 'assistant',
                content: `Hi ${firstName}! 👋 I'm DentAI, your clinic assistant. I can see your profile and appointments. How can I help you today?`
            }]);
            setHasGreeted(true);
        }
    }, [isOpen, hasGreeted, profile]);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMessage = { role: 'user', content: trimmed };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages,
                    systemContext,
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to get response');
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again in a moment.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: '#1E3A5F' }}
                aria-label="Open chat assistant"
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <span className="text-2xl">🦷</span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 z-[9999] w-[400px] h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
                    style={{ animation: 'chatSlideUp 0.3s ease-out' }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-5 py-4 flex-shrink-0"
                        style={{ backgroundColor: '#1E3A5F' }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🦷</span>
                            <h3 className="text-white font-bold text-base tracking-tight">DentAI Assistant</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 cursor-pointer"
                            aria-label="Close chat"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/50">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role === 'assistant' && (
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1 text-xs"
                                        style={{ backgroundColor: '#1E3A5F' }}
                                    >
                                        <span>🦷</span>
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                        msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-md'
                                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md shadow-sm'
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {loading && (
                            <div className="flex justify-start">
                                <div
                                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1 text-xs"
                                    style={{ backgroundColor: '#1E3A5F' }}
                                >
                                    <span>🦷</span>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                                    <div className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Bar */}
                    <div className="flex items-center gap-2 px-4 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything..."
                            className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all bg-slate-50"
                            disabled={loading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40 cursor-pointer hover:opacity-90"
                            style={{ backgroundColor: '#1E3A5F' }}
                            aria-label="Send message"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Slide-up animation */}
            <style>{`
                @keyframes chatSlideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </>
    );
};

export default ChatBot;
