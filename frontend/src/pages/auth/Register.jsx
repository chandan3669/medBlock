import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

// Google "G" SVG icon — official brand colours
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        <path fill="none" d="M0 0h48v48H0z" />
    </svg>
);

export const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ── Email / Password ───────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match.');
        }
        if (formData.password.length < 8) {
            return setError('Password must be at least 8 characters.');
        }

        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            login(data.user, data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Google ─────────────────────────────────────────────────────────────
    const handleGoogleRegister = async () => {
        setError('');
        setGoogleLoading(true);
        const result = await loginWithGoogle();
        setGoogleLoading(false);
        if (result.success) {
            navigate('/dashboard');
        } else if (!result.cancelled) {
            setError(result.error || 'Google sign-up failed. Try again.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background orbs */}
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full bg-cyan-600/15 blur-[100px] pointer-events-none" />

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 mb-8 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                    M
                </div>
                <span className="text-white font-bold text-xl tracking-tight">
                    Med<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Block</span>
                </span>
            </Link>

            {/* Card */}
            <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-black/40">
                <h1 className="text-2xl font-black text-white mb-1">Create your account</h1>
                <p className="text-slate-400 text-sm mb-8">Join MedBlock — your health, secured</p>

                {/* Error */}
                {error && (
                    <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm mb-6">
                        <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Google Sign-Up Button */}
                <button
                    id="btn-google-register"
                    type="button"
                    onClick={handleGoogleRegister}
                    disabled={googleLoading || loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-gray-50 text-slate-800 font-semibold text-sm transition-all duration-200 shadow-lg shadow-black/20 hover:shadow-black/30 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed mb-6"
                >
                    {googleLoading ? (
                        <svg className="w-5 h-5 animate-spin text-slate-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                    ) : (
                        <GoogleIcon />
                    )}
                    {googleLoading ? 'Creating account...' : 'Sign up with Google'}
                </button>

                {/* Divider */}
                <div className="relative flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-slate-800" />
                    <span className="text-slate-600 text-xs font-medium">or register with email</span>
                    <div className="flex-1 h-px bg-slate-800" />
                </div>

                {/* Email / Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Dr. Jane Smith"
                            className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Min. 8 characters"
                            className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all duration-200"
                        />
                    </div>

                    <button
                        id="btn-email-register"
                        type="submit"
                        disabled={loading || googleLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.01] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {loading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Creating account...
                            </>
                        ) : 'Create account'}
                    </button>
                </form>

                {/* Login link */}
                <p className="text-center text-slate-500 text-sm mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>

            {/* Fine print */}
            <p className="text-slate-700 text-xs mt-6 text-center max-w-xs">
                By creating an account, you agree to our{' '}
                <a href="#" className="hover:text-slate-500 transition-colors">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="hover:text-slate-500 transition-colors">Privacy Policy</a>.
            </p>
        </div>
    );
};
