import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, LogIn, UserPlus } from 'lucide-react';
import { loginUser, registerUser } from '@/integrations';
import { useMember } from '@/integrations';

export default function AuthPage() {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { actions } = useMember();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (mode === 'login') {
                await loginUser(email, password);
            } else {
                await registerUser(email, password, name);
            }
            await actions.loadCurrentMember();
            navigate('/projects');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-electric-teal to-electric-magenta rounded flex items-center justify-center">
                        <Layers className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="font-heading text-2xl font-bold text-foreground">
                        Nexus<span className="text-electric-teal">PM</span>
                    </span>
                </div>

                <div className="bg-charcoal/50 border border-electric-teal/20 rounded-lg p-8">
                    {/* Tabs */}
                    <div className="flex mb-6 bg-deep-space-blue rounded overflow-hidden">
                        {(['login', 'register'] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => { setMode(m); setError(''); }}
                                className={`flex-1 py-2 text-sm font-paragraph font-medium transition-colors ${mode === m ? 'bg-electric-teal text-background' : 'text-foreground/60 hover:text-foreground'
                                    }`}
                            >
                                {m === 'login' ? 'Sign In' : 'Register'}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <div>
                                <label className="block text-xs text-foreground/60 mb-1 font-paragraph">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    className="w-full bg-deep-space-blue border border-electric-teal/20 rounded px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-electric-teal"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs text-foreground/60 mb-1 font-paragraph">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full bg-deep-space-blue border border-electric-teal/20 rounded px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-electric-teal"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-foreground/60 mb-1 font-paragraph">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full bg-deep-space-blue border border-electric-teal/20 rounded px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-electric-teal"
                            />
                        </div>

                        {error && (
                            <p className="text-destructive text-xs font-paragraph">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-primary-foreground py-2.5 rounded font-paragraph font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all disabled:opacity-50"
                        >
                            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
