import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Users as UsersIcon, AlertCircle, Clock } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Projects, Tasks } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TaskBoard from '@/components/TaskBoard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { format } from 'date-fns';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Projects | null>(null);
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const loadProjectData = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const [projectData, tasksResult] = await Promise.all([
        BaseCrudService.getById<Projects>('projects', id),
        BaseCrudService.getAll<Tasks>('tasks', undefined, undefined, { projectId: id })
      ]);

      setProject(projectData);
      setTasks(tasksResult.items);
    } catch (error) {
      console.error('Failed to load project data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

      <main className="pt-24 pb-16 min-h-[800px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <LoadingSpinner />
          </div>
        ) : !project ? (
          <div className="w-full max-w-[100rem] mx-auto px-8 py-32 text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Project Not Found</h2>
            <p className="font-paragraph text-foreground/60 mb-8">The project you're looking for doesn't exist.</p>
            <Link to="/projects">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded font-paragraph font-semibold transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]">
                Back to Projects
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Project Header */}
            <section className="w-full max-w-[100rem] mx-auto px-8 py-8">
              <Link to="/projects">
                <motion.button
                  whileHover={{ x: -5 }}
                  className="flex items-center gap-2 text-foreground/70 hover:text-electric-teal transition-colors mb-8 font-paragraph text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Projects
                </motion.button>
              </Link>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-charcoal/50 backdrop-blur-sm border border-electric-teal/20 rounded-lg p-8"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h1 className="font-heading text-5xl font-bold text-foreground">
                        {project.name || 'Untitled Project'}
                      </h1>
                      {project.priority && (
                        <div className={`flex items-center gap-1 ${getPriorityColor(project.priority)}`}>
                          <AlertCircle className="w-5 h-5" />
                          <span className="font-paragraph text-sm font-medium">{project.priority}</span>
                        </div>
                      )}
                    </div>
                    <p className="font-paragraph text-lg text-foreground/70 leading-relaxed">
                      {project.description || 'No description available'}
                    </p>
                  </div>

                  <div>
                    <span className={`inline-block px-4 py-2 rounded text-sm font-paragraph font-medium border ${getStatusColor(project.status)}`}>
                      {project.status || 'No Status'}
                    </span>
                  </div>
                </div>

                {/* Project Meta */}
                <div className="grid md:grid-cols-4 gap-6 pt-6 border-t border-electric-teal/10">
                  {project.team && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-deep-space-blue border border-electric-teal/20 rounded flex items-center justify-center">
                        <UsersIcon className="w-5 h-5 text-electric-teal" />
                      </div>
                      <div>
                        <div className="font-paragraph text-xs text-foreground/50 mb-1">Team</div>
                        <div className="font-paragraph text-sm text-foreground font-medium">{project.team}</div>
                      </div>
                    </div>
                  )}

                  {project.startDate && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-deep-space-blue border border-electric-teal/20 rounded flex items-center justify-center">
                        <Clock className="w-5 h-5 text-electric-magenta" />
                      </div>
                      <div>
                        <div className="font-paragraph text-xs text-foreground/50 mb-1">Start Date</div>
                        <div className="font-paragraph text-sm text-foreground font-medium">
                          {format(new Date(project.startDate), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                  )}

                  {project.dueDate && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-deep-space-blue border border-electric-teal/20 rounded flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-electric-teal" />
                      </div>
                      <div>
                        <div className="font-paragraph text-xs text-foreground/50 mb-1">Due Date</div>
                        <div className="font-paragraph text-sm text-foreground font-medium">
                          {format(new Date(project.dueDate), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-deep-space-blue border border-electric-teal/20 rounded flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-electric-magenta" />
                    </div>
                    <div>
                      <div className="font-paragraph text-xs text-foreground/50 mb-1">Tasks</div>
                      <div className="font-paragraph text-sm text-foreground font-medium">{tasks.length} Total</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Task Board */}
            <section className="w-full max-w-[100rem] mx-auto px-8 py-8">
              <TaskBoard tasks={tasks} projectId={id!} onTasksUpdate={setTasks} />
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
