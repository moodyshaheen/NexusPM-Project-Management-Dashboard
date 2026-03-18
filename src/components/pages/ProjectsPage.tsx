import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Users as UsersIcon, AlertCircle, Plus, Pencil, Trash2 } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Projects } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Projects[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const result = await BaseCrudService.getAll<Projects>('projects');
      setProjects(result.items);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this project?')) return;
    try {
      await BaseCrudService.delete('projects', id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'in progress':
        return 'text-electric-teal border-electric-teal/30 bg-electric-teal/10';
      case 'completed':
        return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'on hold':
      case 'planning':
        return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      default:
        return 'text-foreground/60 border-foreground/20 bg-foreground/5';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'text-destructive';
      case 'medium':
        return 'text-electric-magenta';
      case 'low':
        return 'text-electric-teal';
      default:
        return 'text-foreground/60';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="w-full max-w-[100rem] mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-6xl font-bold mb-4">
              <span className="text-foreground">Project </span>
              <span className="text-electric-teal">Dashboard</span>
            </h1>
            <p className="font-paragraph text-lg text-foreground/70 max-w-3xl">
              Monitor and manage all your projects in real-time. Track progress, collaborate with teams, and deliver results.
            </p>
            <div className="mt-6">
              <Link to="/projects/new">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-primary-foreground px-6 py-2.5 rounded font-paragraph font-semibold text-sm flex items-center gap-2 hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all"
                >
                  <Plus className="w-4 h-4" /> New Project
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Filters Section */}
        <section className="w-full max-w-[100rem] mx-auto px-8 mb-12">
          <div className="bg-charcoal/50 backdrop-blur-sm border border-electric-teal/20 rounded-lg p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-deep-space-blue border border-electric-teal/20 rounded pl-12 pr-4 py-3 font-paragraph text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-electric-teal transition-colors"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-deep-space-blue border border-electric-teal/20 rounded pl-12 pr-4 py-3 font-paragraph text-sm text-foreground focus:outline-none focus:border-electric-teal transition-colors appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Planning">Planning</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="relative">
                <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full bg-deep-space-blue border border-electric-teal/20 rounded pl-12 pr-4 py-3 font-paragraph text-sm text-foreground focus:outline-none focus:border-electric-teal transition-colors appearance-none cursor-pointer"
                >
                  <option value="all">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="w-full max-w-[100rem] mx-auto px-8 min-h-[600px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-2 border-electric-teal border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group/card"
                >
                  <Link to={`/projects/${project._id}`}>
                    <div className="bg-charcoal/50 backdrop-blur-sm border border-deep-space-blue rounded-lg p-6 hover:border-electric-teal/50 transition-all group h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 pr-16">
                          <h3 className="font-heading text-2xl font-semibold text-foreground mb-2 group-hover:text-electric-teal transition-colors">
                            {project.name || 'Untitled Project'}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={`inline-block px-3 py-1 rounded text-xs font-paragraph font-medium border ${getStatusColor(project.status)}`}>
                              {project.status || 'No Status'}
                            </span>
                          </div>
                        </div>
                        {project.priority && (
                          <div className={`flex items-center gap-1 ${getPriorityColor(project.priority)}`}>
                            <AlertCircle className="w-4 h-4" />
                            <span className="font-paragraph text-xs font-medium">{project.priority}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="font-paragraph text-sm text-foreground/70 mb-6 line-clamp-3 flex-1">
                        {project.description || 'No description available'}
                      </p>

                      {/* Footer */}
                      <div className="space-y-3 pt-4 border-t border-electric-teal/10">
                        {project.team && (
                          <div className="flex items-center gap-2 text-foreground/60">
                            <UsersIcon className="w-4 h-4" />
                            <span className="font-paragraph text-xs">{project.team}</span>
                          </div>
                        )}
                        {project.dueDate && (
                          <div className="flex items-center gap-2 text-foreground/60">
                            <Calendar className="w-4 h-4" />
                            <span className="font-paragraph text-xs">
                              Due: {format(new Date(project.dueDate), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                  {/* Edit / Delete */}
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity z-10">
                    <button
                      onClick={(e) => { e.preventDefault(); navigate(`/projects/${project._id}/edit`); }}
                      className="p-1.5 bg-deep-space-blue border border-electric-teal/20 rounded hover:border-electric-teal/60 text-foreground/60 hover:text-electric-teal transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, project._id)}
                      className="p-1.5 bg-deep-space-blue border border-destructive/20 rounded hover:border-destructive/60 text-foreground/60 hover:text-destructive transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-charcoal border border-electric-teal/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-foreground/40" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-foreground mb-3">No Projects Found</h3>
              <p className="font-paragraph text-sm text-foreground/60">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No projects available at the moment'}
              </p>
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
