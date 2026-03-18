import { Link } from 'react-router-dom';
import { Layers, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-charcoal border-t border-electric-teal/20">
      <div className="max-w-[100rem] mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-electric-teal to-electric-magenta rounded flex items-center justify-center">
                <Layers className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-heading text-2xl font-bold text-foreground">
                Nexus<span className="text-electric-teal">PM</span>
              </span>
            </Link>
            <p className="font-paragraph text-sm text-foreground/60 leading-relaxed">
              Real-time collaborative project management for agile teams
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/projects" className="font-paragraph text-sm text-foreground/70 hover:text-electric-teal transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <span className="font-paragraph text-sm text-foreground/70 hover:text-electric-teal transition-colors cursor-pointer">
                  Features
                </span>
              </li>
              <li>
                <span className="font-paragraph text-sm text-foreground/70 hover:text-electric-teal transition-colors cursor-pointer">
                  Pricing
                </span>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <span className="font-paragraph text-sm text-foreground/70 hover:text-electric-teal transition-colors cursor-pointer">
                  About
                </span>
              </li>
              <li>
                <span className="font-paragraph text-sm text-foreground/70 hover:text-electric-teal transition-colors cursor-pointer">
                  Blog
                </span>
              </li>
              <li>
                <span className="font-paragraph text-sm text-foreground/70 hover:text-electric-teal transition-colors cursor-pointer">
                  Careers
                </span>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Connect</h3>
            <div className="flex gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-deep-space-blue border border-electric-teal/30 rounded flex items-center justify-center hover:border-electric-teal transition-colors"
              >
                <Github className="w-5 h-5 text-foreground/70" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-deep-space-blue border border-electric-teal/30 rounded flex items-center justify-center hover:border-electric-teal transition-colors"
              >
                <Twitter className="w-5 h-5 text-foreground/70" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-deep-space-blue border border-electric-teal/30 rounded flex items-center justify-center hover:border-electric-teal transition-colors"
              >
                <Linkedin className="w-5 h-5 text-foreground/70" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-electric-teal/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-sm text-foreground/50">
              © {new Date().getFullYear()} NexusPM. All rights reserved.
            </p>
            <div className="flex gap-6">
              <span className="font-paragraph text-sm text-foreground/50 hover:text-electric-teal transition-colors cursor-pointer">
                Privacy Policy
              </span>
              <span className="font-paragraph text-sm text-foreground/50 hover:text-electric-teal transition-colors cursor-pointer">
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
