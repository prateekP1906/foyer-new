import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Phone, Calendar, AlertTriangle, Shield, CheckCircle2,
    ArrowRight, Play, Server, Clock, Activity, Star,
    TrendingUp, Users, Lock, ChevronRight, Menu, X,
    PhoneCall, Building2, Stethoscope, Briefcase, Check
} from 'lucide-react';
import clsx from 'clsx';

// Constants & Data Placeholders
const LOGO_COMPANIES = [
    { name: "Pacific Dental Services", id: 1 },
    { name: "SmileBrands", id: 2 },
    { name: "Aspen Dental", id: 3 },
    { name: "Heartland Dental", id: 4 },
    { name: "Local Dental Groups", id: 5 }
];

const FEATURES = [
    {
        title: "Never Miss Patient Calls",
        desc: "24/7 AI receptionist answers every run-over or after-hours call within 1 ring. Zero hold time.",
        icon: <PhoneCall className="w-6 h-6 text-cyan-400" />
    },
    {
        title: "Auto-Book Appointments",
        desc: "Seamlessly parses intent and books directly into your practice management software.",
        icon: <Calendar className="w-6 h-6 text-dental-teal" />
    },
    {
        title: "Real-Time Urgent Escalation",
        desc: "Intelligently flags emergency cases and routes them immediately to your on-call staff.",
        icon: <AlertTriangle className="w-6 h-6 text-amber-400" />
    },
    {
        title: "EHR & PMS Integration",
        desc: "Native bi-directional sync with Dentrix, Open Dental, Eaglesoft, and more.",
        icon: <Server className="w-6 h-6 text-emerald-400" />
    }
];



const Header = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={clsx(
            "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
            scrolled ? "bg-slate-950/80 backdrop-blur-xl border-slate-800/80 shadow-2xl shadow-slate-900/50 py-3" : "bg-transparent border-transparent py-5"
        )}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-dental-teal to-cyan-500 flex items-center justify-center shadow-lg shadow-dental-teal/20">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Dental<span className="text-dental-teal">AI</span></span>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {["Product", "Solutions", "Security", "Resources"].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            {item}
                        </a>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <button onClick={() => navigate('/login')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                        Login
                    </button>
                    <button onClick={() => navigate('/signup')} className="bg-white text-slate-950 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-slate-200 transition-colors shadow-lg shadow-white/10">
                        Sign Up
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 shadow-xl flex flex-col p-4 md:hidden gap-4"
                    >
                        {["Product", "Solutions", "Security", "Resources"].map((item) => (
                            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-slate-300 p-2 rounded-lg hover:bg-slate-800">
                                {item}
                            </a>
                        ))}
                        <div className="h-px w-full bg-slate-800 my-2" />
                        <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="text-base font-medium text-slate-300 p-2 text-left flex items-center gap-2">
                            Login
                        </button>
                        <button onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }} className="bg-dental-teal text-white text-base font-semibold px-4 py-3 rounded-xl shadow-lg mt-2 font-center text-center">
                            Sign Up
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-slate-950 min-h-screen text-slate-300 font-sans selection:bg-dental-teal/30 overflow-x-hidden">
            <Header />

            {/* Background Ambient Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-dental-teal/10 rounded-full blur-[150px]" />
                <div className="absolute top-[30%] -right-[10%] w-[40%] h-[60%] bg-cyan-500/5 rounded-full blur-[150px]" />
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] bg-blue-600/10 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            {/* 2. Hero Section */}
            <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 z-10">
                <div className="flex-1 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-sm mb-8"
                    >
                        <span className="flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-dental-teal opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-dental-teal"></span>
                        </span>
                        <span className="text-xs font-semibold text-slate-300">DentalAI 2.0 is live</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
                    >
                        Turn Missed Calls Into <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-dental-teal to-emerald-400">Booked Patients.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-10"
                    >
                        The intelligent conversational AI receptionist built exclusively for dental practices. Auto-book appointments, triage emergencies, and sync perfectly with your PMS—24/7.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                    >
                        <button onClick={() => navigate('/signup')} className="w-full sm:w-auto bg-white text-slate-950 font-bold px-8 py-4 rounded-xl shadow-xl shadow-white/10 hover:shadow-white/20 hover:scale-105 transition-all outline-none">
                            Sign Up
                        </button>
                        <button onClick={() => navigate('/login')} className="w-full sm:w-auto bg-slate-900 border border-slate-800 text-white font-semibold px-8 py-4 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 outline-none group">
                            Login <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="flex-1 w-full max-w-lg lg:max-w-none relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-dental-teal/20 to-cyan-500/20 blur-[80px] rounded-full" />
                    <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
                        {/* Mockup Top Bar */}
                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Live AI Dashboard</p>
                                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Calls: 3
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Mockup Metrics */}
                        <div className="grid grid-cols-2 gap-3 pb-2">
                            <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Calls Today</p>
                                <p className="text-xl font-bold text-white">124</p>
                            </div>
                            <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50">
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Appointments</p>
                                <p className="text-xl font-bold text-dental-teal">+36</p>
                            </div>
                        </div>
                        {/* Mockup Call Logs */}
                        <div className="space-y-2">
                            {[
                                { name: "Mike Johnson", reason: "Severe Toothache", tag: "Urgent", color: "text-amber-400", time: "Just now" },
                                { name: "Sarah Chen", reason: "Reschedule Cleaning", tag: "Booked", color: "text-emerald-400", time: "2m ago" },
                                { name: "Unknown Caller", reason: "Insurance Inquiry", tag: "Answered", color: "text-cyan-400", time: "5m ago" }
                            ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between bg-slate-800/30 rounded-lg p-3 border border-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                            <Phone className={`w-3.5 h-3.5 ${log.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-white">{log.name}</p>
                                            <p className="text-[10px] text-slate-400">{log.reason}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-[10px] font-bold ${log.color}`}>{log.tag}</p>
                                        <p className="text-[10px] text-slate-500">{log.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* 3. Social Proof */}
            <section className="py-12 border-y border-slate-900 bg-slate-950/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-8">Trusted by thriving dental teams globally</p>
                    <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {LOGO_COMPANIES.map(logo => (
                            <div key={logo.id} className="text-lg md:text-xl font-bold text-slate-400 flex items-center gap-2 cursor-default">
                                <Building2 className="w-5 h-5" /> {logo.name}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto border-t border-slate-800 pt-12">
                        <div>
                            <p className="text-3xl font-extrabold text-white">1.2M+</p>
                            <p className="text-sm font-medium text-slate-500 mt-1">Calls Handled</p>
                        </div>
                        <div>
                            <p className="text-3xl font-extrabold text-white">84%</p>
                            <p className="text-sm font-medium text-slate-500 mt-1">Booking CVR</p>
                        </div>
                        <div>
                            <p className="text-3xl font-extrabold text-white">{"<"}1s</p>
                            <p className="text-sm font-medium text-slate-500 mt-1">Response Time</p>
                        </div>
                        <div>
                            <p className="text-3xl font-extrabold text-white">100%</p>
                            <p className="text-sm font-medium text-slate-500 mt-1">HIPAA Secure</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Core Benefits */}
            <section id="product" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">Your practice, supercharged.</h2>
                    <p className="text-lg text-slate-400">DentalAI doesn’t just answer phones—it actively manages your schedule, acts on patient intent, and protects your bottom line.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURES.map((feat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl hover:bg-slate-900 hover:border-slate-700 transition-all"
                        >
                            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                                {feat.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 5. Feature Deep Dive */}
            <section id="solutions" className="py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col gap-32">

                    {/* Feature 1: Live Triage */}
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 lg:order-1 order-2 w-full">
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative shadow-2xl overflow-hidden">
                                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-dental-teal/5 rounded-full blur-[100px]" />
                                <h4 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4">Urgent Triage Engine</h4>
                                <div className="space-y-4 relative z-10">
                                    <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/50 ml-8 relative before:absolute before:-left-[18px] before:top-4 before:contents-[''] before:border-[9px] before:border-transparent before:border-r-slate-800/80">
                                        <p className="text-slate-300 text-sm">"Hi, I woke up with severe swelling and throbbing pain in my lower left jaw..."</p>
                                    </div>
                                    <div className="bg-dental-teal/10 rounded-2xl p-4 border border-dental-teal/20 mr-8 relative before:absolute before:-right-[18px] before:top-4 before:contents-[''] before:border-[9px] before:border-transparent before:border-l-dental-teal/10">
                                        <p className="text-slate-200 text-sm">"I can help with that. Since you are experiencing swelling and severe pain, we consider this a dental emergency. Dr. Smith is on-call. I am flagging this to his priority line now and will send you a text with the details."</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 lg:order-2 order-1">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Flawless emergency triage, zero human error.</h2>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                Our AI is trained on thousands of clinical interactions. It instantly identifies keywords indicating infection, avulsed teeth, or severe trauma, bypassing standard booking to follow your custom emergency protocols.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {["Identifies pain scales & symptoms", "Immediate SMS dispatch to doctor on-call", "Detailed clinical summary logging"].map((li, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-dental-teal shrink-0 mt-0.5" /> {li}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Feature 2: Appointment Booking */}
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Books directly into your schedule.</h2>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                No more "we'll call you back to confirm." DentalAI has read and write access to your practice management system, finding real-time slots and parsing procedure lengths automatically.
                            </p>
                            <ul className="space-y-4">
                                {["Cross-references multiple provider schedules", "Auto-sends intake forms and confirmation texts", "Understands insurance network constraints"].map((li, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" /> {li}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative shadow-2xl">
                                <div className="absolute inset-0 bg-cyan-500/5 blur-[80px] rounded-full" />
                                <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative z-10">
                                    <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/50 flex justify-between">
                                        <span className="text-xs font-semibold text-slate-400">Next Available: Hygiene</span>
                                        <span className="text-xs font-bold text-emerald-400">Live Sync Active</span>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        {[
                                            { date: "Tomorrow, 9:00 AM", status: "Booked via AI", state: "confirmed" },
                                            { date: "Tomorrow, 11:30 AM", status: "Open Slot", state: "open" },
                                            { date: "Tomorrow, 2:00 PM", status: "Open Slot", state: "open" }
                                        ].map((slot, i) => (
                                            <div key={i} className={clsx(
                                                "p-3 rounded-lg border flex justify-between items-center",
                                                slot.state === 'confirmed' ? "bg-emerald-500/10 border-emerald-500/20" : "bg-slate-800/30 border-slate-700/50"
                                            )}>
                                                <span className={clsx("text-sm font-semibold", slot.state === 'confirmed' ? "text-emerald-400" : "text-slate-300")}>{slot.date}</span>
                                                <span className={clsx("text-xs", slot.state === 'confirmed' ? "text-emerald-500" : "text-slate-500")}>{slot.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* 6. ROI/Impact Section */}
            <section className="py-24 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto bg-gradient-to-br from-dental-teal/10 to-blue-600/10 border border-slate-800/80 rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <TrendingUp className="w-12 h-12 text-dental-teal mx-auto mb-6" />
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-8">The measurable impact of never missing a call.</h2>

                        <div className="grid md:grid-cols-3 gap-8 mt-12 bg-slate-950/40 rounded-3xl p-8 backdrop-blur-sm border border-slate-800/50">
                            <div>
                                <p className="text-slate-400 text-sm font-medium mb-2">Before DentalAI</p>
                                <p className="text-xl font-bold text-slate-500 line-through decoration-red-500/50">35% missed calls</p>
                                <div className="h-px bg-slate-800 my-4" />
                                <p className="text-slate-400 text-sm font-medium mb-2">After DentalAI</p>
                                <p className="text-2xl font-extrabold text-emerald-400">0% missed calls</p>
                            </div>
                            <div className="hidden md:block w-px bg-slate-800 h-full mx-auto" />
                            <div>
                                <p className="text-slate-400 text-sm font-medium mb-2">Avg. Front Desk Load</p>
                                <p className="text-xl font-bold text-slate-500 line-through decoration-red-500/50">4.5 hrs/day on phone</p>
                                <div className="h-px bg-slate-800 my-4" />
                                <p className="text-slate-400 text-sm font-medium mb-2">New Front Desk Load</p>
                                <p className="text-2xl font-extrabold text-emerald-400">1.2 hrs/day on phone</p>
                            </div>
                            <div className="hidden md:block w-px bg-slate-800 h-full mx-auto" />
                            <div>
                                <p className="text-slate-400 text-sm font-medium mb-2">Patient Satisfaction</p>
                                <p className="text-xl font-bold text-slate-500 line-through decoration-red-500/50">Aggravating hold times</p>
                                <div className="h-px bg-slate-800 my-4" />
                                <p className="text-slate-400 text-sm font-medium mb-2">New Experience</p>
                                <p className="text-2xl font-extrabold text-emerald-400">Instant answers 24/7</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. Security & Compliance */}
            <section id="security" className="py-20 border-t border-slate-900">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <Shield className="w-12 h-12 text-slate-600 mx-auto mb-6" />
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Bank-level security. HIPAA Compliant.</h2>
                    <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                        Your patient data is fully encrypted at rest and in transit. We sign standard Business Associate Agreements (BAAs) and maintain comprehensive audit logs.
                    </p>
                    <button className="text-dental-teal hover:text-cyan-400 font-semibold flex items-center justify-center gap-2 mx-auto transition-colors">
                        View Security Documentation <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </section>

            {/* 10. Final CTA */}
            <section className="py-24 px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
                <div className="bg-gradient-to-r from-dental-teal to-cyan-500 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                            Ready to upgrade your front desk?
                        </h2>
                        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium">
                            Join hundreds of modern practices using DentalAI to capture every lead and deliver a flawless patient experience.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button onClick={() => navigate('/signup')} className="bg-slate-950 text-white border border-transparent font-bold px-10 py-5 rounded-2xl hover:bg-slate-900 hover:scale-105 transition-all shadow-xl">
                                Sign Up Now
                            </button>
                            <button onClick={() => navigate('/login')} className="bg-transparent text-slate-950 border border-slate-950/20 font-bold px-10 py-5 rounded-2xl hover:bg-slate-950/5 transition-all">
                                Login to Dashboard
                            </button>
                        </div>
                        <p className="text-sm font-medium text-white/70 mt-6 flex items-center justify-center gap-2">
                            <Lock className="w-4 h-4" /> No credit card required to sign up.
                        </p>
                    </div>
                </div>
            </section>

            {/* 11. Footer */}
            <footer className="border-t border-slate-900 bg-slate-950 pt-20 pb-10 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                    <div className="col-span-2 lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-6 h-6 rounded-md bg-dental-teal flex items-center justify-center">
                                <Activity className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">Dental<span className="text-dental-teal">AI</span></span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                            The intelligent voice infrastructure for modern dental practices. Automate bookings, handle emergencies, and scale operations.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Product</h4>
                        <ul className="space-y-3">
                            {["Features", "Integrations", "Changelog"].map(link => (
                                <li key={link}><a href="#" className="text-sm text-slate-500 hover:text-dental-teal transition-colors">{link}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Company</h4>
                        <ul className="space-y-3">
                            {["About Us", "Careers", "Blog", "Contact Sales"].map(link => (
                                <li key={link}><a href="#" className="text-sm text-slate-500 hover:text-dental-teal transition-colors">{link}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Legal</h4>
                        <ul className="space-y-3">
                            {["Privacy Policy", "Terms of Service", "HIPAA Compliance", "Security"].map(link => (
                                <li key={link}><a href="#" className="text-sm text-slate-500 hover:text-dental-teal transition-colors">{link}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-600">© 2026 DentalAI Technologies Inc. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" className="text-slate-600 hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="text-slate-600 hover:text-white transition-colors">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
