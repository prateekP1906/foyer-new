import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Clock, Star, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { ContainerScroll } from '../components/ui/container-scroll-animation';

const LandingPage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-dental-teal/30">
            {/* Navbar */}
            <motion.nav
                layout={false}
                layoutScroll={false}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={clsx(
                    "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-4xl rounded-full border px-3 py-2 flex items-center gap-8 shadow-lg",
                    scrolled ? "bg-white/90 backdrop-blur-2xl border-slate-200 shadow-slate-200/50" : "bg-white/60 backdrop-blur-2xl border-slate-200/40 shadow-slate-200/20"
                )}
            >
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <motion.div
                        layout={false}
                        layoutScroll={false}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-2 h-2 rounded-full bg-dental-teal"
                    />
                    <span className="text-lg font-black tracking-tight text-slate-900">Dental<span className="text-dental-teal">AI</span></span>
                </div>

                <div className="hidden md:flex items-center gap-1">
                    <button onClick={() => navigate('/demo')} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-full hover:bg-slate-100/50">
                        Live Demo
                    </button>
                    <button onClick={() => navigate('/login')} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-full hover:bg-slate-100/50">
                        Login
                    </button>
                </div>

                <div className="flex items-center">
                    <button onClick={() => navigate('/signup')} className="bg-slate-900 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md shadow-slate-900/20 hover:shadow-slate-900/40 transition-shadow">
                        Sign Up
                    </button>
                </div>
            </motion.nav>

            <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-950 min-h-screen flex items-center">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-dental-teal/8" style={{ filter: 'blur(80px)', willChange: 'auto', contain: 'strict' }} />
                    <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] rounded-full bg-blue-500/8" style={{ filter: 'blur(80px)', willChange: 'auto', contain: 'strict' }} />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
                </div>

                <div className="w-full relative z-10" style={{ transform: 'translateZ(0)' }}>
                    <ContainerScroll
                        titleComponent={
                            <div className="flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto mb-12">
                                <motion.div
                                    layout={false}
                                    layoutScroll={false}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 shadow-sm mb-8"
                                >
                                    <motion.span
                                        layout={false}
                                        layoutScroll={false}
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="w-1.5 h-1.5 rounded-full bg-dental-teal"
                                    />
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">New: AI Voice Analysis</span>
                                </motion.div>

                                <div className="space-y-2 mb-8">
                                    <motion.h1
                                        layout={false}
                                        layoutScroll={false}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.15 }}
                                        className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05]"
                                    >
                                        Your Front Desk,
                                    </motion.h1>
                                    <motion.h1
                                        layout={false}
                                        layoutScroll={false}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.3 }}
                                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] bg-clip-text text-transparent bg-gradient-to-r from-dental-teal via-teal-300 to-cyan-300"
                                    >
                                        Reimagined.
                                    </motion.h1>
                                </div>

                                <motion.p
                                    layout={false}
                                    layoutScroll={false}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.45 }}
                                    className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
                                >
                                    Our AI handles calls, bookings, and inquiries with human-level AI, so you can focus on patient care.
                                </motion.p>

                                <motion.div
                                    layout={false}
                                    layoutScroll={false}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                                >
                                    <button onClick={() => navigate('/demo')} className="w-full sm:w-auto bg-gradient-to-r from-dental-teal to-teal-400 text-white font-bold px-8 py-4 rounded-full shadow-xl shadow-dental-teal/30 hover:shadow-dental-teal/50 transition-shadow flex items-center justify-center gap-2 group">
                                        Try Live Demo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button onClick={() => navigate('/signup')} className="w-full sm:w-auto bg-slate-800 text-white border border-slate-700 font-bold px-8 py-4 rounded-full shadow-sm hover:bg-slate-700 transition-colors">
                                        Start for Free
                                    </button>
                                </motion.div>
                            </div>
                        }
                    >
                        <div className="w-full h-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col font-sans">
                            <div className="bg-slate-900 border-b border-slate-800 p-3 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                </div>
                                <div className="mx-auto bg-slate-800 rounded-md px-24 py-1 text-[10px] text-slate-500 font-mono">dashboard.dentalai.com</div>
                            </div>

                            <div className="flex-1 bg-slate-950 p-6 flex flex-col gap-6">
                                <div className="grid grid-cols-3 gap-4">
                                    {[{ label: "AI Calls Handled", val: "412", col: "border-dental-teal" }, { label: "Appointments Booked", val: "89", col: "border-blue-500" }, { label: "Urgent Escalations", val: "14", col: "border-amber-500" }].map(s => (
                                        <div key={s.label} className={clsx("bg-slate-900 rounded-xl p-4 border-l-2 shadow-sm", s.col)}>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">{s.label}</p>
                                            <p className="text-2xl font-black text-white">{s.val}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recent Live Calls</h3>
                                        <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Sync
                                        </span>
                                    </div>
                                    <div className="divide-y divide-slate-800/50">
                                        {[
                                            { n: "Sarah Jenkins", r: "Emergency Root Canal", t: "2m ago", s: "Urgent", c: "bg-red-500/20 text-red-400 border-red-500/30" },
                                            { n: "Michael Ross", r: "Check-up Reschedule", t: "15m ago", s: "Booked", c: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
                                            { n: "Linda Wright", r: "Inquiry: Insurance", t: "1h ago", s: "Pending", c: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
                                            { n: "David Beckham", r: "Teeth Whitening", t: "3h ago", s: "General", c: "bg-slate-700/50 text-slate-400 border-slate-600" },
                                        ].map((r, i) => (
                                            <div key={i} className="px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm font-bold text-slate-200">{r.n}</span>
                                                    <span className="text-[10px] text-slate-500">{r.r}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] text-slate-500">{r.t}</span>
                                                    <span className={clsx("px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider w-16 text-center border-solid", r.c)}>{r.s}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ContainerScroll>
                </div>
            </section>

            <section className="bg-slate-50 py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Clock className="w-10 h-10 text-dental-teal mb-4" />,
                                title: "24/7 Availability",
                                desc: "Never miss a patient call properly, even after hours."
                            },
                            {
                                icon: <Shield className="w-10 h-10 text-emerald-500 mb-4" />,
                                title: "HIPAA Compliant",
                                desc: "Secure and private handling of all patient data."
                            },
                            {
                                icon: <Star className="w-10 h-10 text-amber-500 mb-4" />,
                                title: "Smart Triage",
                                desc: "Intelligently categorizes emergencies vs routine checkups."
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                layout={false} layoutScroll={false}
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col justify-between"
                            >
                                {feature.icon}
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
