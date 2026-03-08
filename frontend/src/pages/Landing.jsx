import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

// ── Animated counter hook ──────────────────────────────────────────────────
function useCounter(end, duration = 2000, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [end, duration, start]);
    return count;
}

// ── Intersection observer hook ─────────────────────────────────────────────
function useInView(threshold = 0.1) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);
    return [ref, inView];
}

// ── Data ───────────────────────────────────────────────────────────────────
const FEATURES = [
    {
        icon: '🧠',
        title: 'AI-Powered Diagnosis',
        desc: 'Deep-learning models trained on millions of medical records deliver accurate, real-time predictions for common conditions.',
        gradient: 'from-violet-500 to-purple-600',
    },
    {
        icon: '🔗',
        title: 'Blockchain Security',
        desc: 'Every record is hashed and stored on an immutable ledger — tamper-proof, auditable, and fully HIPAA-compliant.',
        gradient: 'from-cyan-500 to-blue-600',
    },
    {
        icon: '📋',
        title: 'Smart Verification',
        desc: 'Instantly verify the authenticity of medical documents and prescriptions via QR code or record ID.',
        gradient: 'from-emerald-500 to-teal-600',
    },
    {
        icon: '📊',
        title: 'Health Analytics',
        desc: 'Longitudinal dashboards surface trends in your health data so you and your care team can act proactively.',
        gradient: 'from-amber-500 to-orange-600',
    },
    {
        icon: '🔐',
        title: 'Zero-Knowledge Privacy',
        desc: 'Your data stays yours. Role-based access control means only the people you trust can view sensitive records.',
        gradient: 'from-rose-500 to-pink-600',
    },
    {
        icon: '⚡',
        title: 'Real-Time Sync',
        desc: 'Cross-device, cross-provider synchronisation ensures your latest results are always a tap away.',
        gradient: 'from-sky-500 to-indigo-600',
    },
];

const STEPS = [
    { num: '01', title: 'Create Your Account', desc: 'Sign up securely with email and get your personal health vault in seconds.' },
    { num: '02', title: 'Upload & Manage Records', desc: 'Add lab results, imaging, and prescriptions — all encrypted end-to-end.' },
    { num: '03', title: 'Run AI Predictions', desc: 'Select your symptoms or upload a file and our AI returns a ranked differential.' },
    { num: '04', title: 'Verify & Share', desc: 'Generate a cryptographic proof link and share with any provider, anywhere.' },
];

const TESTIMONIALS = [
    {
        name: 'Dr. Priya Sharma',
        role: 'Cardiologist, Apollo Hospitals',
        avatar: '👩‍⚕️',
        quote: 'MedBlock has completely transformed how I access patient history. The AI predictions save me hours every week.',
    },
    {
        name: 'Rahul Verma',
        role: 'Patient, Mumbai',
        avatar: '🧑',
        quote: 'I finally have control over my health records. Sharing with a new specialist took 30 seconds, not 30 days.',
    },
    {
        name: 'Dr. Anil Mehta',
        role: 'Family Physician, Delhi',
        avatar: '👨‍⚕️',
        quote: 'The blockchain verification gives both me and my patients confidence that records haven\'t been altered.',
    },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg shadow-black/20 py-3' : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                        M
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight">
                        Med<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Block</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {['Features', 'How It Works', 'About'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                            className="text-slate-300 hover:text-white text-sm font-medium transition-colors duration-200 hover:underline underline-offset-4 decoration-violet-400"
                        >
                            {item}
                        </a>
                    ))}
                </nav>

                {/* CTA Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        to="/login"
                        className="text-slate-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-500 transition-all duration-200"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="text-sm font-semibold px-5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:from-violet-500 hover:to-cyan-500 transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105"
                    >
                        Get Started Free
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-white p-2"
                    aria-label="Toggle menu"
                >
                    <div className={`w-5 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                    <div className={`w-5 h-0.5 bg-white my-1 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                    <div className={`w-5 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden bg-slate-900/98 backdrop-blur-md border-t border-slate-800 px-6 py-6 flex flex-col gap-4">
                    {['Features', 'How It Works', 'About'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                            onClick={() => setMenuOpen(false)}
                            className="text-slate-300 hover:text-white text-base font-medium"
                        >
                            {item}
                        </a>
                    ))}
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="text-slate-300 hover:text-white font-medium">Login</Link>
                    <Link
                        to="/register"
                        onClick={() => setMenuOpen(false)}
                        className="text-center font-semibold py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white"
                    >
                        Get Started Free
                    </Link>
                </div>
            )}
        </header>
    );
}

function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 pt-16">
            {/* Background gradient orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
                <div className="absolute -bottom-40 -right-20 w-[600px] h-[600px] rounded-full bg-cyan-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[80px]" />
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/40 bg-violet-500/10 text-violet-300 text-sm font-medium mb-8 animate-fadeIn">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Now with AI-Powered Diagnostics v2.0
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] mb-6 tracking-tight">
                    Your Health Records,{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-blue-400">
                        Secured by AI
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                    MedBlock combines <strong className="text-slate-200">blockchain immutability</strong> with{' '}
                    <strong className="text-slate-200">machine-learning predictions</strong> to give patients and providers a
                    unified, tamper-proof health platform.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Link
                        to="/register"
                        className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-lg shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300"
                    >
                        Get Started — It's Free
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-500 font-semibold text-lg transition-all duration-300 backdrop-blur-sm"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Login to Dashboard
                    </Link>
                </div>

                {/* Social proof */}
                <p className="text-slate-500 text-sm">
                    Trusted by <span className="text-slate-300 font-semibold">10,000+</span> patients &{' '}
                    <span className="text-slate-300 font-semibold">500+</span> healthcare providers
                </p>

                {/* Scroll indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                    <span className="text-slate-600 text-xs">Scroll to explore</span>
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </section>
    );
}

function StatsSection() {
    const [ref, inView] = useInView();
    const patients = useCounter(10000, 2000, inView);
    const providers = useCounter(500, 2000, inView);
    const accuracy = useCounter(97, 2000, inView);
    const records = useCounter(2500000, 2500, inView);

    const stats = [
        { value: patients.toLocaleString() + '+', label: 'Active Patients' },
        { value: providers.toLocaleString() + '+', label: 'Healthcare Providers' },
        { value: accuracy + '%', label: 'AI Accuracy Rate' },
        { value: (records / 1000000).toFixed(1) + 'M+', label: 'Records Secured' },
    ];

    return (
        <section ref={ref} className="bg-slate-900 py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((s, i) => (
                        <div key={i} className="text-center">
                            <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 mb-2">
                                {s.value}
                            </div>
                            <div className="text-slate-400 text-sm font-medium">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeaturesSection() {
    return (
        <section id="features" className="bg-slate-950 py-28">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-3">Features</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Everything you need to{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">own your health</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        A complete platform built at the intersection of AI, blockchain, and modern healthcare.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map((f, i) => (
                        <div
                            key={i}
                            className="group relative p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 overflow-hidden"
                        >
                            {/* Glow on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                            <div
                                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} text-2xl mb-4 shadow-lg`}
                            >
                                {f.icon}
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HowItWorksSection() {
    return (
        <section id="how-it-works" className="bg-slate-900 py-28">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-cyan-400 font-semibold text-sm uppercase tracking-widest mb-3">How It Works</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Up and running in{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">4 simple steps</span>
                    </h2>
                </div>

                <div className="relative">
                    {/* Connector line */}
                    <div className="hidden lg:block absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-violet-500/30 via-cyan-500/30 to-blue-500/30" />

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {STEPS.map((s, i) => (
                            <div key={i} className="relative text-center group">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 text-white font-black text-2xl mb-6 shadow-xl shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300 relative z-10">
                                    {s.num}
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function TestimonialsSection() {
    return (
        <section className="bg-slate-950 py-28">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-emerald-400 font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</p>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Loved by doctors &{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">patients alike</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: 5 }).map((_, j) => (
                                    <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            <blockquote className="text-slate-300 text-sm leading-relaxed mb-6">"{t.quote}"</blockquote>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl">
                                    {t.avatar}
                                </div>
                                <div>
                                    <div className="text-white font-semibold text-sm">{t.name}</div>
                                    <div className="text-slate-500 text-xs">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTASection() {
    return (
        <section className="bg-slate-900 py-28">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <div className="relative rounded-3xl overflow-hidden p-12 md:p-20">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-slate-900 to-cyan-900/80" />
                    <div className="absolute inset-0 border border-violet-500/20 rounded-3xl" />
                    <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-violet-600/20 blur-[60px]" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-cyan-600/20 blur-[60px]" />

                    <div className="relative">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                            Ready to take control of{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                                your health data?
                            </span>
                        </h2>
                        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                            Join thousands who already trust MedBlock to keep their medical records safe, accessible, and AI-enhanced.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-lg shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300"
                            >
                                Create Free Account
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-slate-600 bg-slate-800/60 text-slate-200 hover:bg-slate-700/60 font-semibold text-lg transition-all duration-300"
                            >
                                I already have an account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer id="about" className="bg-slate-950 border-t border-slate-900 py-14">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-10 mb-10">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-black text-sm">
                                M
                            </div>
                            <span className="text-white font-bold text-lg">
                                Med<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Block</span>
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                            Securing your medical future with AI intelligence and blockchain immutability. Your health, your control.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            {['Dashboard', 'AI Predictions', 'Record Verification', 'Health History'].map((l) => (
                                <li key={l}><a href="#" className="hover:text-slate-300 transition-colors">{l}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            {['About Us', 'Privacy Policy', 'Terms of Service', 'Contact'].map((l) => (
                                <li key={l}><a href="#" className="hover:text-slate-300 transition-colors">{l}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-900 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-600 text-sm">© {new Date().getFullYear()} MedBlock. All rights reserved.</p>
                    <p className="text-slate-600 text-xs">Built with ❤️ for better healthcare</p>
                </div>
            </div>
        </footer>
    );
}

// ── Main Landing Page ──────────────────────────────────────────────────────
export function Landing() {
    return (
        <div className="font-sans">
            <Navbar />
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <CTASection />
            <Footer />
        </div>
    );
}
