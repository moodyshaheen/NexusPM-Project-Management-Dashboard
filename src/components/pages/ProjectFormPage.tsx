import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Projects } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const STATUSES = ['Planning', 'In Progress', 'On Hold', 'Completed'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export default function ProjectFormPage() {
    const { id } = useParams<{ id?: string }>();
    const isEdit = !!id;
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '', description: '', status: 'Planning',
        team: '', startDate: '', dueDate: '', priority: 'Medium',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isEdit) return;
        BaseCrudService.getById<Projects>('projects', id!).then((p) => {
            if (!p) return;
            setForm({
                name: p.name ?? '',
                description: p.description ?? '',
                status: p.status ?? 'Planning',
                team: p.team ?? '',
                startDate: p.startDate ? String(p.startDate).slice(0, 10) : '',
                dueDate: p.dueDate ? String(p.dueDate).slice(0, 10) : '',
                priority: p.priority ?? 'Medium',
            });
        });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isEdit) {
                await BaseCrudService.update<Projects>('projects', { _id: id!, ...form });
            } else {
                await BaseCrudService.create<Projects>('projects', form);
            }
            navigate('/projects');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save');
        } finally {
            setLoading(false);
        }
    };

    const field = (label: string, key: keyof typeof form, type = 'text') => (
        <div>
            <label className="block text-xs text-foreground/60 mb-1 font-paragraph">{label}</label>
            <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full bg-deep-space-blue border border-electric-teal/20 rounded px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-electric-teal"
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="pt-24 pb-16 max-w-2xl mx-auto px-8">
                <Link to="/projects">
                    <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 text-foreground/70 hover:text-electric-teal transition-colors mb-8 font-paragraph text-sm">
                        <ArrowLeft className="w-4 h-4" /> Back to Projects
                    </motion.button>
                </Link>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-charcoal/50 border border-electric-teal/20 rounded-lg p-8">
                    <h1 className="font-heading text-3xl font-bold text-foreground mb-6">
                        {isEdit ? 'Edit Project' : 'New Project'}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {field('Project Name', 'name')}
                        <div>
                            <label className="block text-xs text-foreground/60 mb-1 font-paragraph">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                rows={3}
                                className="w-full bg-deep-space-blue border border-electric-teal/20 rounded px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-electric-teal resize-none"
                            />
                        </div>
                        {field('Team', 'team')}
                        <div className="grid grid-cols-2 gap-4">
                            {field('Start Date', 'startDate', 'date')}
                            {field('Due Date', 'dueDate', 'date')}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-foreground/60 mb-1 font-paragraph">Status</label>
                                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                                    className="w-full bg-deep-space-blue border border-electric-teal/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-electric-teal">
                                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-foreground/60 mb-1 font-paragraph">Priority</label>
                                <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                                    className="w-full bg-deep-space-blue border border-electric-teal/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-electric-teal">
                                    {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                                </select>
                            </div>
                        </div>

                        {error && <p className="text-destructive text-xs font-paragraph">{error}</p>}

                        <button type="submit" disabled={loading}
                            className="w-full bg-primary text-primary-foreground py-2.5 rounded font-paragraph font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all disabled:opacity-50">
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Project'}
                        </button>
                    </form>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
