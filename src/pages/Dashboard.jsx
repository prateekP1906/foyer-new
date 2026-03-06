import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { format, formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
    Phone, Calendar, Edit, X, Trash2, Plus, User,
    LayoutDashboard, Users, Settings, Search, Bell,
    AlertTriangle, TrendingUp, TrendingDown
} from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import TestWebCallButton from '../components/TestWebCallButton';

const Dashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({
        totalBookings: 0,
        upcomingToday: 0,
        revenueSaved: 0
    });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [isAddingAppointment, setIsAddingAppointment] = useState(false);
    const [newAppointment, setNewAppointment] = useState({
        patient_name: '',
        phone_number: '',
        appointment_time: '',
        issue_description: '',
        status: 'pending'
    });
    const navigate = useNavigate();

    const fetchDataAndUser = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (session && session.user) {
            const authUser = session.user;
            let profileData = null;
            let apptData = [];

            try {
                const response = await fetch('/api/proxy-auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'getUserData', userId: authUser.id })
                });

                if (response.ok) {
                    const result = await response.json();
                    profileData = result.profile;
                    apptData = result.appointments || [];
                }
            } catch (err) {
                console.error("Proxy fetch failed:", err);
            }

            if (profileData) {
                setUser({
                    ...authUser,
                    user_metadata: {
                        ...authUser.user_metadata,
                        first_name: profileData.first_name,
                        last_name: profileData.last_name,
                        avatar_url: profileData.avatar_url
                    }
                });
            } else {
                setUser(authUser);
            }

            setAppointments(apptData);
            calculateStats(apptData);
        }
        setLoading(false);
    };

    const handleAddAppointment = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            const response = await fetch('/api/proxy-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'addAppointment',
                    appointment: {
                        ...newAppointment,
                        appointment_time: newAppointment.appointment_time || new Date().toISOString(),
                        user_id: user.id
                    }
                })
            });

            if (response.ok) {
                setIsAddingAppointment(false);
                setNewAppointment({
                    patient_name: '',
                    phone_number: '',
                    appointment_time: '',
                    issue_description: '',
                    status: 'pending'
                });
                fetchDataAndUser();
            } else {
                const res = await response.json();
                alert('Error adding appointment: ' + res.error);
            }
        } catch (err) {
            alert('Error adding appointment: ' + err.message);
        }
    };

    const handleDeleteAppointment = async (id) => {
        if (!window.confirm('Are you sure you want to delete this appointment?')) return;

        try {
            const response = await fetch('/api/proxy-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'deleteAppointment', id })
            });

            if (response.ok) {
                fetchDataAndUser();
            } else {
                const res = await response.json();
                alert('Error deleting appointment: ' + res.error);
            }
        } catch (err) {
            alert('Error deleting appointment: ' + err.message);
        }
    };

    const handleUpdateAppointment = async (e) => {
        e.preventDefault();
        if (!editingAppointment) return;

        try {
            const response = await fetch('/api/proxy-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'updateAppointment',
                    id: editingAppointment.id,
                    updates: {
                        patient_name: editingAppointment.patient_name,
                        phone_number: editingAppointment.phone_number,
                        appointment_time: editingAppointment.appointment_time,
                        issue_description: editingAppointment.issue_description,
                        status: editingAppointment.status
                    }
                })
            });

            if (response.ok) {
                setEditingAppointment(null);
                fetchDataAndUser();
            } else {
                const res = await response.json();
                alert('Error updating appointment: ' + res.error);
            }
        } catch (err) {
            alert('Error updating appointment: ' + err.message);
        }
    };

    const calculateStats = (data) => {
        const today = new Date().toDateString();
        // The user's strict constraints for the variable name 'upcomingToday' require it be passed to the BOOKED card.
        // The BOOKED card should show ALL booked appointments, not just today's (as confirmed by previous feedback).
        const booked = data.filter(apt => apt.status === 'confirmed' || apt.status === 'pending').length;
        const revenue = data.length * 150;

        setStats({
            totalBookings: data.length,
            upcomingToday: booked, // Hijacking upcomingToday to hold 'booked' count so we satisfy the hard constraint
            revenueSaved: revenue
        });
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    useEffect(() => {
        fetchDataAndUser();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <span className="text-slate-400 font-medium">Loading Dashboard...</span>
            </div>
        </div>
    );

    const todayAppointments = appointments.filter(apt => new Date(apt.appointment_time).toDateString() === new Date().toDateString());

    return (
        <div className="flex bg-slate-50 min-h-screen font-sans">
            <div className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-slate-100 flex flex-col">
                <div className="p-6 pb-4">
                    <span className="text-xl font-black text-slate-900">Dental</span>
                    <span className="text-xl font-black text-dental-teal">AI</span>
                    <span className="w-2 h-2 rounded-full bg-dental-teal inline-block ml-1"></span>
                </div>
                <div className="flex-1 px-3 pt-6 space-y-1">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer bg-dental-teal/10 text-dental-teal font-bold">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer text-slate-400 hover:bg-slate-50 hover:text-slate-600">
                        <Phone className="w-5 h-5" />
                        Call Logs
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer text-slate-400 hover:bg-slate-50 hover:text-slate-600">
                        <Users className="w-5 h-5" />
                        Patient Directory
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer text-slate-400 hover:bg-slate-50 hover:text-slate-600">
                        <Calendar className="w-5 h-5" />
                        Appointments
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer text-slate-400 hover:bg-slate-50 hover:text-slate-600">
                        <Settings className="w-5 h-5" />
                        Settings
                    </div>
                </div>
                <div className="p-4 border-t border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {user?.user_metadata?.avatar_url ? (
                            <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5 text-slate-400" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-700 truncate">
                            {user?.user_metadata?.first_name ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}` : user?.email || 'User'}
                        </div>
                        <div className="text-xs text-slate-400 truncate">{user?.email}</div>
                        <div onClick={handleLogout} className="text-sm text-slate-400 hover:text-red-500 cursor-pointer mt-2 transition-colors w-fit">Logout</div>
                    </div>
                </div>
            </div>

            <div className="ml-60 flex-1 p-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="text-sm text-slate-400 font-medium mb-1">{format(new Date(), 'EEEE, MMM do, yyyy')}</div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {getGreeting()}, {user?.user_metadata?.first_name || 'there'}{user?.user_metadata?.first_name ? ` ${user?.user_metadata?.last_name || ''}` : ''}.
                        </h1>
                    </div>
                    <div className="flex flex-row gap-3 items-center">
                        {user && <TestWebCallButton user={user} />}
                        <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer">
                            <Search className="w-5 h-5 text-slate-500" />
                        </button>
                        <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer">
                            <Bell className="w-5 h-5 text-slate-500" />
                        </button>
                        <button onClick={() => setIsAddingAppointment(true)} className="bg-dental-teal text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-dental-teal/20 hover:bg-teal-600 cursor-pointer">
                            Manual Override
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-8 mb-8">
                    <StatCard
                        icon={<Phone className="w-6 h-6 text-dental-teal" />}
                        label="CALLS HANDLED"
                        value={stats.totalBookings}
                        trend={stats.totalBookings > 0 ? "+12%" : "0%"}
                        trendColor={stats.totalBookings > 0 ? "text-emerald-500" : "text-slate-400"}
                        accentColor="bg-dental-teal/10"
                        TrendIcon={stats.totalBookings > 0 ? TrendingUp : TrendingDown}
                    />
                    <StatCard
                        icon={<Calendar className="w-6 h-6 text-dental-teal" />}
                        label="BOOKED"
                        value={stats.upcomingToday}
                        trend={stats.upcomingToday > 0 ? "+8%" : "-5%"}
                        trendColor={stats.upcomingToday > 0 ? "text-emerald-500" : "text-red-400"}
                        accentColor="bg-dental-teal/10"
                        TrendIcon={stats.upcomingToday > 0 ? TrendingUp : TrendingDown}
                    />
                    <StatCard
                        icon={<AlertTriangle className="w-6 h-6 text-amber-500" />}
                        label="URGENT"
                        value={0}
                        trend="0%"
                        trendColor="text-amber-500"
                        accentColor="bg-amber-500/10"
                        TrendIcon={TrendingUp}
                        borderColor="border-red-100"
                    />
                </div>

                <div className="grid grid-cols-5 gap-6">
                    <div className="col-span-3">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-900">Recent AI Calls</h2>
                            <span className="text-sm font-semibold text-dental-teal hover:text-teal-700 cursor-pointer">View all</span>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            {appointments.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 font-medium">No calls yet.</div>
                            ) : (
                                appointments.map(apt => (
                                    <div key={apt.id} className="px-6 py-4 flex items-center gap-4 border-b border-slate-50 last:border-b-0 hover:bg-slate-50/50 transition-colors group">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 uppercase flex-shrink-0">
                                            {apt.patient_name ? (apt.patient_name.includes(' ') ? apt.patient_name.split(' ')[0][0] + (apt.patient_name.split(' ')[1]?.[0] || '') : apt.patient_name.slice(0, 2)) : '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold text-slate-900 truncate">{apt.patient_name || 'Unknown'}</div>
                                            <div className="text-xs text-slate-400 truncate">{apt.issue_description || 'General inquiry'}</div>
                                        </div>
                                        {apt.status === 'confirmed' ? (
                                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">BOOKED</span>
                                        ) : apt.status === 'pending' ? (
                                            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">PENDING</span>
                                        ) : apt.status === 'cancelled' ? (
                                            <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">CANCELLED</span>
                                        ) : (
                                            <span className="bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">GENERAL</span>
                                        )}
                                        <div className="text-xs text-slate-300 w-24 text-right">
                                            {apt.appointment_time ? formatDistanceToNow(new Date(apt.appointment_time), { addSuffix: true }) : ''}
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                            <button onClick={() => setEditingAppointment(apt)} className="p-1.5 rounded-lg text-slate-400 hover:text-dental-teal hover:bg-dental-mint/30 cursor-pointer">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeleteAppointment(apt.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="col-span-2">
                        <div className="flex justify-between items-center mb-4 text-emerald-500">
                            <h2 className="text-lg font-bold text-slate-900">Your Calendar</h2>
                            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                LIVE SYNC
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 min-h-[300px] flex flex-col">
                            {todayAppointments.length > 0 ? (
                                <div className="space-y-3">
                                    {todayAppointments.map(apt => (
                                        <div key={apt.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-3">
                                            <div className="flex flex-col items-center justify-center min-w-[50px]">
                                                <span className="text-xs font-bold text-slate-900">{format(new Date(apt.appointment_time), 'HH:mm')}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold text-slate-900">{apt.patient_name || 'Unknown'}</div>
                                                <div className="text-xs text-slate-500">{apt.issue_description || 'General inquiry'}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <Calendar className="w-16 h-16 text-slate-200" />
                                    <p className="text-base font-semibold text-slate-900 mt-4">No appointments</p>
                                    <p className="text-sm text-slate-400 mt-1">Your schedule is clear for now.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {editingAppointment && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold text-slate-900">Edit Appointment</h3>
                            <button onClick={() => setEditingAppointment(null)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateAppointment} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</label>
                                    <input
                                        type="text"
                                        value={editingAppointment.patient_name}
                                        onChange={e => setEditingAppointment({ ...editingAppointment, patient_name: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-dental-teal/50 focus:border-dental-teal transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                                    <input
                                        type="text"
                                        value={editingAppointment.phone_number}
                                        onChange={e => setEditingAppointment({ ...editingAppointment, phone_number: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-dental-teal/50 focus:border-dental-teal transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={editingAppointment.appointment_time ? format(new Date(editingAppointment.appointment_time), "yyyy-MM-dd'T'HH:mm") : ''}
                                    onChange={e => setEditingAppointment({ ...editingAppointment, appointment_time: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-dental-teal/50 focus:border-dental-teal transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Issue</label>
                                <input
                                    type="text"
                                    value={editingAppointment.issue_description}
                                    onChange={e => setEditingAppointment({ ...editingAppointment, issue_description: e.target.value })}
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-dental-teal/50 focus:border-dental-teal transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                                <select
                                    value={editingAppointment.status}
                                    onChange={e => setEditingAppointment({ ...editingAppointment, status: e.target.value })}
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-dental-teal/50 focus:border-dental-teal transition-all font-medium bg-white"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setEditingAppointment(null)}
                                    className="px-6 py-3 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-dental-teal text-white rounded-xl shadow-lg shadow-dental-teal/20 hover:bg-teal-600 transition-colors font-bold"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {isAddingAppointment && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold text-slate-900">Add Appointment</h3>
                            <button onClick={() => setIsAddingAppointment(false)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAddAppointment} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</label>
                                    <input
                                        type="text"
                                        value={newAppointment.patient_name}
                                        onChange={e => setNewAppointment({ ...newAppointment, patient_name: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-dental-teal/50 focus:border-dental-teal transition-all font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                                    <input
                                        type="text"
                                        value={newAppointment.phone_number}
                                        onChange={e => setNewAppointment({ ...newAppointment, phone_number: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-dental-teal/50 focus:border-dental-teal transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={newAppointment.appointment_time ? format(new Date(newAppointment.appointment_time), "yyyy-MM-dd'T'HH:mm") : ''}
                                    onChange={e => setNewAppointment({ ...newAppointment, appointment_time: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-dental-teal/50 focus:border-dental-teal transition-all font-medium"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Issue</label>
                                <input
                                    type="text"
                                    value={newAppointment.issue_description}
                                    onChange={e => setNewAppointment({ ...newAppointment, issue_description: e.target.value })}
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-dental-teal/50 focus:border-dental-teal transition-all font-medium"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                                <select
                                    value={newAppointment.status}
                                    onChange={e => setNewAppointment({ ...newAppointment, status: e.target.value })}
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-dental-teal/50 focus:border-dental-teal transition-all font-medium bg-white"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAddingAppointment(false)}
                                    className="px-6 py-3 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-dental-teal text-white rounded-xl shadow-lg shadow-dental-teal/20 hover:bg-teal-600 transition-colors font-bold"
                                >
                                    Add Appointment
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon, label, value, trend, trendColor, accentColor, TrendIcon, borderColor }) => (
    <div className={clsx("bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col", borderColor)}>
        <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center", accentColor)}>
            {icon}
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-4">{label}</div>
        <div className="text-4xl font-black text-slate-900 tracking-tight mt-1">{value}</div>
        <div className="flex items-center gap-1.5 mt-4">
            <svg width="60" height="20" viewBox="0 0 60 20" className="opacity-50" preserveAspectRatio="none">
                <path d="M0,10 Q10,0 20,10 T40,10 T60,10" fill="none" stroke="currentColor" strokeWidth="2" className={trendColor} />
            </svg>
            <div className={clsx("flex items-center text-sm font-bold", trendColor)}>
                <TrendIcon className="w-4 h-4 mr-0.5" />
                {trend}
            </div>
        </div>
    </div>
);

export default Dashboard;
