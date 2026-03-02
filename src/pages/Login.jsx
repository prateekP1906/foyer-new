
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/proxy-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'login', email, password })
            });

            const result = await response.json();

            if (!response.ok || result.error) {
                setError(result.error || 'Failed to sign in');
            } else {
                if (result.session) {
                    const originalFetch = globalThis.fetch;
                    globalThis.fetch = async (url, options) => {
                        if (typeof url === 'string' && url.includes('/auth/v1/user')) {
                            return new Response(JSON.stringify(result.user), {
                                status: 200,
                                headers: { 'Content-Type': 'application/json' }
                            });
                        }
                        return originalFetch(url, options);
                    };

                    try {
                        await supabase.auth.setSession({
                            access_token: result.session.access_token,
                            refresh_token: result.session.refresh_token
                        });
                    } finally {
                        globalThis.fetch = originalFetch;
                    }
                }
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dental-mint/30 font-sans text-slate-deep">
            <div className="bg-white p-10 rounded-2xl shadow-lg border border-white/50 w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-dental-teal/20 rounded-full flex items-center justify-center">
                        <Shield className="w-12 h-12 text-dental-teal" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">Login</h2>
                <p className="text-slate-500 text-center mb-6">Access your dashboard</p>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-dental-teal"
                            placeholder="doctor@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-dental-teal"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-dental-teal text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-dental-teal font-bold hover:underline">
                        Create Account
                    </Link>
                </div>
            </div>
        </div >
    );
};

export default Login;
