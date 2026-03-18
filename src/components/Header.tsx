import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, LogOut, LogIn } from 'lucide-react';
import { useMember } from '@/integrations';

export default function Header() {
  const location = useLocation();
  const { isAuthenticated, member, actions } = useMember();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-electric-teal/20">
      <div className="max-w-[120rem] mx-auto px-8 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-electric-teal to-electric-magenta rounded flex items-center justify-center transition-transform group-hover:scale-110">
              <Layers className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-heading text-2xl font-bold text-foreground">
              Nexus<span className="text-electric-teal">PM</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/">
              <motion.span whileHover={{ scale: 1.05 }}
                className={`font-paragraph text-sm font-medium transition-colors ${isActive('/') ? 'text-electric-teal' : 'text-foreground/70 hover:text-foreground'}`}>
                Home
              </motion.span>
            </Link>

            <Link to="/projects">
              <motion.span whileHover={{ scale: 1.05 }}
                className={`font-paragraph text-sm font-medium transition-colors ${isActive('/projects') ? 'text-electric-teal' : 'text-foreground/70 hover:text-foreground'}`}>
                Projects
              </motion.span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="font-paragraph text-sm text-foreground/70">
                  {member?.loginEmail ?? member?.profile?.nickname ?? 'User'}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => actions.logout()}
                  className="flex items-center gap-2 border border-electric-teal/30 text-foreground/70 hover:text-electric-teal hover:border-electric-teal px-4 py-2 rounded font-paragraph font-semibold text-sm transition-all"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </motion.button>
              </div>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded font-paragraph font-semibold text-sm flex items-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </motion.button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
