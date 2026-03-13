import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, animate } from 'framer-motion';
import { Phone, Brain, Zap, Activity, RefreshCw, ShieldCheck, BellRing, Globe, BarChart3, Star, Check, ChevronDown, CheckCircle2, Play } from 'lucide-react';
import clsx from 'clsx';
import { ContainerScroll } from '../components/ui/container-scroll-animation';

const AnimatedNumber = ({ value, label, idx }) => {
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
    const suffix = typeof value === 'string' ? value.replace(/[0-9.]/g, '') : '';
    const rounded = useMotionValue(0);
    const display = useTransform(rounded, (latest) => `${latest.toFixed(value.toString().includes('.') ? 1 : 0)}${suffix}`);

    return (
        <motion.div
            layout={false}
            layoutScroll={false}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: idx ? idx * 0.1 : 0, ease: "easeOut" }}
            onViewportEnter={() => {
                const controls = animate(rounded, numericValue, { duration: 2, ease: "easeOut" });
                return () => controls.stop();
            }}
            className="flex flex-col items-center"
        >
            <motion.div layout={false} layoutScroll={false} className="text-5xl font-black text-slate-900 tracking-tight">{display}</motion.div>
            <div className="text-sm font-medium text-slate-500 mt-2">{label}</div>
        </motion.div>
    );
};

const LandingPage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const faqs = [
        { q: "How does DentalAI handle emergencies?", a: "AI detects urgency keywords and pain severity, immediately escalates to your emergency line or mobile." },
        { q: "Is it really HIPAA compliant?", a: "Yes. End-to-end encryption, signed BAA, SOC 2 Type II certified, data stored in US-only servers." },
        { q: "Does it work with my existing phone system?", a: "DentalAI integrates with any VoIP or traditional phone system. Setup takes under 15 minutes." },
        { q: "What if the AI can't handle a call?", a: "Seamless transfer to your staff with full context. The AI provides a real-time summary of the conversation." },
        { q: "Can I customize the AI's voice and personality?", a: "Yes. Choose from multiple voices, set your clinic's tone, add custom greetings and protocols." },
        { q: "Is there a contract?", a: "No contracts. Month-to-month billing. Cancel anytime with one click." }
    ];

    const testimonials = [
        { name: "Dr. Sarah Chen", role: "Orthodontist", quote: "DentalAI paid for itself in the first week. We stopped losing after-hours emergency calls." },
        { name: "Mark Johnson", role: "Office Manager", quote: "Our no-show rate dropped 40% with the automated follow-ups. Patients actually show up now." },
        { name: "Lisa Park", role: "Patient", quote: "I called at 11pm expecting voicemail. The AI booked my appointment in under 2 minutes. Incredible." },
        { name: "Dr. James Wright", role: "Pediatric Dentist", quote: "The emergency triage is phenomenal. It correctly identified a dental abscess case and escalated immediately." },
        { name: "Amanda Torres", role: "Dental Hygienist", quote: "I used to spend 2 hours daily on phone callbacks. Now I focus entirely on patients." }
    ];

    const testimonialsRow2 = [
        { name: "Dr. Michael Lee", role: "Prosthodontist", quote: "EHR sync with Dentrix is flawless. Appointments appear in our system instantly." },
        { name: "Rebecca Adams", role: "Patient", quote: "I genuinely thought I was speaking to a real receptionist. The voice is that natural." },
        { name: "Dr. Nina Patel", role: "Endodontist", quote: "Best investment for my solo practice. It's like having a full-time receptionist for a fraction of the cost." },
        { name: "Carlos Mendez", role: "Clinic Owner", quote: "We expanded to 3 locations. DentalAI scales with us — no extra hiring needed." },
        { name: "Dr. Priya Sharma", role: "General Dentist", quote: "The multilingual support is a game-changer. 30% of our patients speak Spanish." }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-dental-teal/30">

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
                    {["Features", "How it Works", "Demo"].map((item) => (
                        <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-full hover:bg-slate-100/50">
                            {item}
                        </a>
                    ))}
                </div>

                <div className="flex items-center">
                    <button onClick={() => navigate('/signup')} className="bg-dental-teal text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md shadow-dental-teal/20 hover:shadow-dental-teal/40 transition-shadow">
                        Get Started
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
                                        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                    />
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Now with GPT-4o Voice Intelligence</span>
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
                                        Never Miss Another
                                    </motion.h1>
                                    <motion.h1
                                        layout={false}
                                        layoutScroll={false}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.3 }}
                                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] bg-clip-text text-transparent bg-gradient-to-r from-dental-teal via-teal-300 to-cyan-300"
                                    >
                                        Patient Call Again
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
                                    Your AI receptionist answers every call, triages emergencies, books appointments, and syncs with your EHR. 24 hours. Zero hold time. 100% HIPAA compliant.
                                </motion.p>

                                <motion.div
                                    layout={false}
                                    layoutScroll={false}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                                >
                                    <button onClick={() => navigate('/signup')} className="w-full sm:w-auto bg-gradient-to-r from-dental-teal to-teal-400 text-white font-bold px-8 py-4 rounded-full shadow-xl shadow-dental-teal/30 hover:shadow-dental-teal/50 transition-shadow">
                                        Start Free Trial
                                    </button>
                                    <button onClick={() => navigate('/demo')} className="w-full sm:w-auto bg-slate-800 text-white border border-slate-700 font-bold px-8 py-4 rounded-full shadow-sm hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                                        <Play className="w-4 h-4 fill-white" /> Watch 2-min Demo
                                    </button>
                                </motion.div>
                                <motion.p
                                    layout={false}
                                    layoutScroll={false}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.75 }}
                                    className="text-xs text-slate-500 mt-6"
                                >
                                    No credit card required · Free 14-day trial · Cancel anytime
                                </motion.p>
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

            <section className="bg-white border-y border-slate-100 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center px-6">
                    <AnimatedNumber value="500+" label="Clinics Using DentalAI" idx={0} />
                    <AnimatedNumber value="1.2M" label="Patient Calls Handled" idx={1} />
                    <AnimatedNumber value="99.7%" label="Uptime SLA" idx={2} />
                    <AnimatedNumber value="4.9★" label="Average Rating" idx={3} />
                </div>
            </section>

            <section id="how-it-works" className="bg-slate-50 py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">How DentalAI Works</h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">Seamless integration into your current workflow. Zero friction.</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-start gap-12 md:gap-0 relative">
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-dental-teal/20 via-teal-400 to-dental-teal/20" />

                        {[
                            { i: Phone, t: "Patient Calls", d: "A patient calls your clinic number. DentalAI picks up instantly — no hold music, no IVR menus." },
                            { i: Brain, t: "AI Understands Intent", d: "Our voice AI understands context: emergency tooth pain vs. routine cleaning vs. insurance question. In real-time." },
                            { i: Zap, t: "Action Taken", d: "Appointments booked, emergencies escalated to your cell, follow-ups scheduled — all synced to your EHR automatically." }
                        ].map((step, idx) => (
                            <motion.div
                                layout={false}
                                layoutScroll={false}
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: idx * 0.08, duration: 0.5, ease: "easeOut" }}
                                className="flex-1 text-center px-4 relative w-full"
                            >
                                <div className="w-24 h-24 rounded-full bg-white border-4 border-slate-50 shadow-xl shadow-dental-teal/10 flex items-center justify-center mx-auto mb-8 relative z-10 text-dental-teal">
                                    <step.i className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3"><span className="text-dental-teal mr-2">{idx + 1}.</span>{step.t}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{step.d}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="features" className="bg-white py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight text-center mb-16">Built for Modern Dental Practices</h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[240px]">

                        <motion.div
                            layout={false} layoutScroll={false}
                            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} whileHover={{ y: -6 }} transition={{ duration: 0.5, delay: 0, ease: "easeOut" }}
                            className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2rem] p-10 relative overflow-hidden flex flex-col justify-between group"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-10 transform group-hover:scale-110 transition-transform duration-700">
                                <Activity className="w-48 h-48" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold mb-4">Smart Voice Triage</h3>
                                <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                                    DentalAI analyzes tone, symptoms, and urgency in real-time. It knows exactly when to schedule a routine cleaning and when to immediately page the on-call dentist for unbearable tooth pain.
                                </p>
                            </div>
                            <div className="mt-8 flex gap-2 items-end h-24 max-w-[200px]">
                                {[1.2, 0.8, 1.5, 0.6, 1.1].map((scale, i) => (
                                    <motion.div
                                        layout={false} layoutScroll={false}
                                        key={i}
                                        animate={{ scaleY: [1, scale, 1] }}
                                        transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                                        className="flex-1 bg-dental-teal rounded-t-full origin-bottom"
                                        style={{ height: '50%' }}
                                    />
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            layout={false} layoutScroll={false}
                            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} whileHover={{ y: -6 }} transition={{ duration: 0.5, delay: 0.06, ease: "easeOut" }}
                            className="md:col-span-2 bg-dental-mint/30 rounded-[2rem] p-8 border border-dental-mint/50 flex flex-col justify-between"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Instant EHR Sync</h3>
                                    <p className="text-slate-600 text-sm">Appointments write directly to your existing practice software.</p>
                                </div>
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-dental-teal">
                                    <RefreshCw className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="flex gap-2 mt-6 flex-wrap">
                                {["OpenDental", "Dentrix", "Eaglesoft", "Curve"].map(sw => (
                                    <span key={sw} className="px-3 py-1 bg-white rounded-full text-xs font-bold text-slate-700 shadow-sm border border-slate-100">{sw}</span>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            layout={false} layoutScroll={false}
                            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} whileHover={{ y: -6 }} transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
                            className="md:col-span-1 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col justify-between"
                        >
                            <ShieldCheck className="w-10 h-10 text-emerald-500 mb-4" />
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">HIPAA Compliant</h3>
                                <p className="text-slate-500 text-xs leading-relaxed">End-to-end encryption. BAA included. SOC 2 Type II certified infrastructure.</p>
                            </div>
                        </motion.div>

                        <motion.div
                            layout={false} layoutScroll={false}
                            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} whileHover={{ y: -6 }} transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
                            className="md:col-span-1 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col justify-between"
                        >
                            <BellRing className="w-10 h-10 text-amber-500 mb-4" />
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">40% Fewer No-Shows</h3>
                                <p className="text-slate-500 text-xs leading-relaxed">AI automatically follows up via SMS and voice call reminders.</p>
                            </div>
                        </motion.div>

                        <motion.div
                            layout={false} layoutScroll={false}
                            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} whileHover={{ y: -6 }} transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
                            className="md:col-span-2 bg-gradient-to-r from-dental-teal/5 to-blue-50 rounded-[2rem] p-8 border border-dental-teal/10 flex flex-col justify-between"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Speaks 30+ Languages</h3>
                                    <p className="text-slate-600 text-sm">Perfect pronunciation and cultural nuance in real-time.</p>
                                </div>
                                <Globe className="w-10 h-10 text-blue-500" />
                            </div>
                            <div className="flex gap-2 mt-6 flex-wrap">
                                {["English", "Spanish", "Mandarin", "Vietnamese", "Arabic", "Tagalog"].map(lang => (
                                    <span key={lang} className="px-3 py-1 bg-white rounded-full text-xs font-bold text-slate-700 shadow-sm">{lang}</span>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            layout={false} layoutScroll={false}
                            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} whileHover={{ y: -6 }} transition={{ duration: 0.5, delay: 0.30, ease: "easeOut" }}
                            className="md:col-span-2 bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex flex-col justify-between"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Real-Time Analytics</h3>
                                    <p className="text-slate-600 text-sm">Track call volume, intent, and ROI from a single dashboard.</p>
                                </div>
                                <BarChart3 className="w-10 h-10 text-slate-400" />
                            </div>
                            <div className="mt-6 flex items-end gap-2 h-16 w-full max-w-[200px] border-b border-slate-200 pb-1">
                                {[30, 70, 45, 90, 60, 100, 80].map((h, i) => (
                                    <div key={i} className="flex-1 bg-dental-teal/80 rounded-t-sm" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            <section id="demo" className="bg-slate-950 py-32 text-white px-6 border-t border-slate-800">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-block px-4 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold mb-6">See it in action</div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Watch DentalAI Handle a Real Call</h2>
                        <p className="text-lg text-slate-400 leading-relaxed mb-10">
                            Our AI receptionist handles everything from emergency triage to appointment scheduling — in a natural, human-like conversation.
                        </p>
                        <button onClick={() => navigate('/demo')} className="bg-white text-slate-950 font-bold px-8 py-4 rounded-full shadow-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                            <Play className="w-4 h-4" /> Try Live Interactive Demo
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-dental-teal/20 to-transparent blur-[80px]" />
                        <div className="relative bg-slate-900 shadow-xl border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg mx-auto">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                                <h3 className="font-bold text-slate-200 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Call Transcript
                                </h3>
                                <span className="text-xs font-mono text-slate-500">01:24</span>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { a: true, t: "Good morning! Thank you for calling Bright Smile Dental. How can I help you today?" },
                                    { a: false, t: "Hi, I've been having really bad tooth pain since yesterday..." },
                                    { a: true, t: "I'm sorry to hear that. Let me ask a few quick questions to help. On a scale of 1-10, how severe is the pain?" },
                                    { a: false, t: "It's about an 8. It's throbbing." },
                                    { a: true, t: "I understand. Based on what you're describing, I'm going to connect you with our emergency line right away. Dr. Patel has an opening at 2:30 PM today. Would that work?" }
                                ].map((msg, idx) => (
                                    <motion.div
                                        layout={false} layoutScroll={false}
                                        key={idx}
                                        initial={{ opacity: 0, x: msg.a ? -10 : 10, y: 10 }}
                                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                                        viewport={{ once: true, amount: 0.4 }}
                                        transition={{ duration: 0.4, delay: idx * 0.3, ease: "easeOut" }}
                                        className={clsx("flex flex-col max-w-[85%]", msg.a ? "items-start" : "items-end ml-auto")}
                                    >
                                        <div className={clsx(
                                            "p-3.5 text-sm leading-relaxed",
                                            msg.a ? "bg-dental-teal/20 text-slate-200 rounded-2xl rounded-bl-sm border border-dental-teal/30" : "bg-white/10 text-white rounded-2xl rounded-br-sm border border-white/5"
                                        )}>
                                            {msg.t}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            

            

            <section className="bg-white py-32 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 text-center mb-16 tracking-tight">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <motion.div
                                layout={false} layoutScroll={false}
                                key={idx}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.4, delay: idx * 0.05, ease: "easeOut" }}
                                className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm"
                            >
                                <button
                                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                >
                                    <span className="font-bold text-slate-900 pr-4">{faq.q}</span>
                                    <motion.div layout={false} layoutScroll={false} animate={{ rotate: openFaqIndex === idx ? 180 : 0 }} className="flex-shrink-0 text-slate-400">
                                        <ChevronDown className="w-5 h-5" />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {openFaqIndex === idx && (
                                        <motion.div
                                            layout={false} layoutScroll={false}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100 mx-6">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 px-4 md:px-8 lg:px-16">
                <div className="relative overflow-hidden bg-slate-950 rounded-[3rem] py-32 px-6 text-center border border-slate-800 shadow-2xl z-10" style={{ transform: 'translateZ(0)' }}>
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
                        <div className="absolute top-[0%] left-[30%] w-[400px] h-[400px] rounded-full bg-dental-teal/8" style={{ filter: 'blur(80px)', willChange: 'auto', contain: 'strict' }} />
                        <div className="absolute bottom-[0%] right-[20%] w-[500px] h-[500px] rounded-full bg-blue-500/8" style={{ filter: 'blur(80px)', willChange: 'auto', contain: 'strict' }} />
                    </div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
                            Ready to Transform<br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-dental-teal to-teal-300">Your Front Desk?</span>
                        </h2>
                        <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto">Join 500+ dental clinics saving 20+ hours per week with automated AI reception.</p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                            <button onClick={() => navigate('/signup')} className="w-full sm:w-auto bg-dental-teal text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                                Get Started Free
                            </button>
                            <button onClick={() => navigate('/demo')} className="w-full sm:w-auto bg-transparent text-white border-2 border-slate-700 font-bold px-8 py-4 rounded-full hover:bg-slate-800 transition-colors">
                                Book a Demo
                            </button>
                        </div>
                        <div className="flex items-center justify-center gap-6 text-sm font-medium text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> 14-day free trial</span>
                            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> No credit card</span>
                            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Cancel anytime</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white py-16 border-t border-slate-100 overflow-hidden relative">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-8">Integrates seamlessly with your tools</p>
                <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <div className="flex justify-center gap-12 md:gap-24 flex-wrap px-6 max-w-5xl mx-auto">
                    {["OpenDental", "Dentrix", "Eaglesoft", "Google Calendar", "Zoom", "Twilio"].map((tool) => (
                        <div key={tool} className="text-xl md:text-2xl font-black text-slate-200 hover:text-slate-400 transition-colors cursor-default tracking-tight">
                            {tool}
                        </div>
                    ))}
                </div>
            </section>

            <footer className="bg-white border-t border-slate-100 py-16 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-1">
                        <div className="text-xl font-black tracking-tight text-slate-900 mb-2">Dental<span className="text-dental-teal">AI</span></div>
                        <p className="text-sm text-slate-500 mb-6">The world's most advanced conversational AI designed exclusively for dental practices.</p>
                        <p className="text-xs text-slate-400">© 2026 DentalAI Inc.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Product</h4>
                        <ul className="space-y-3">
                            {["Features", "Demo", "Changelog", "API Documentation"].map(link => (
                                <li key={link}><a href="#" className="text-sm text-slate-500 hover:text-dental-teal transition-colors">{link}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Company</h4>
                        <ul className="space-y-3">
                            {["About Us", "Blog", "Careers", "Contact Sales", "Partners"].map(link => (
                                <li key={link}><a href="#" className="text-sm text-slate-500 hover:text-dental-teal transition-colors">{link}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {["Privacy Policy", "Terms of Service", "HIPAA Compliance", "Business Associate Agreement"].map(link => (
                                <li key={link}><a href="#" className="text-sm text-slate-500 hover:text-dental-teal transition-colors">{link}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
                    <p className="text-sm">Built with precision.</p>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 cursor-pointer transition-colors"><Globe className="w-4 h-4" /></div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 cursor-pointer transition-colors"><Star className="w-4 h-4" /></div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
