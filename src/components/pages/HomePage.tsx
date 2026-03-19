// HPI 1.7-G
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Rocket, Zap, Users, BarChart3, ArrowRight, Terminal, Activity, Cpu, Network, Crosshair } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';

// --- Canonical Data Sources (Expanded for Narrative, Preserving Core Themes) ---
const CORE_STATS = [
  { value: "99.9%", label: "Uptime", detail: "High-availability infrastructure" },
  { value: "<50ms", label: "Latency", detail: "Global edge network" },
  { value: "Real-time", label: "Sync", detail: "Redis-backed message broker" },
  { value: "CRDT", label: "Conflict Res", detail: "Zero-data-loss concurrency" }
];

const FEATURES = [
  {
    id: "f1",
    icon: Zap,
    title: 'Real-time Canvas Sync',
    description: 'Instant updates across all team members. See changes as they happen with sub-50ms latency powered by WebSockets and Redis.',
    color: 'electric-teal',
    imageSrc: "https://static.wixstatic.com/media/e7b9d6_72ec968556ec4ecaba6774e3f6e65e90~mv2.png?originWidth=1152&originHeight=896",
    tech: ["Socket.io", "WebRTC", "Redis"]
  },
  {
    id: "f2",
    icon: Users,
    title: 'Multi-player Kanban',
    description: 'Work together seamlessly with live cursors, presence indicators, and optimistic UI updates for drag-and-drop operations.',
    color: 'electric-magenta',
    imageSrc: "https://static.wixstatic.com/media/e7b9d6_4fb0983b8d64455c8481f35f7cdcf6c5~mv2.png?originWidth=1152&originHeight=896",
    tech: ["Optimistic UI", "CRDTs", "React"]
  },
  {
    id: "f3",
    icon: Cpu,
    title: 'AI Ticket Generator',
    description: 'Input project concepts and let our AI instantly break them down into actionable tasks, user stories, and acceptance criteria.',
    color: 'electric-teal',
    imageSrc: "https://static.wixstatic.com/media/e7b9d6_0ac343708eee4f86a9d3345bd01b3354~mv2.png?originWidth=1152&originHeight=896",
    tech: ["OpenAI API", "NLP", "Auto-tagging"]
  },
  {
    id: "f4",
    icon: Network,
    title: 'Causal Consistency',
    description: 'Advanced data structures ensure that even when multiple users edit the same task simultaneously, the system never breaks.',
    color: 'electric-magenta',
    imageSrc: "https://static.wixstatic.com/media/e7b9d6_f4a32a752ae24442a03e6c8c9faad0d8~mv2.png?originWidth=1152&originHeight=896",
    tech: ["Vector Clocks", "Event Sourcing"]
  }
];

const TECH_STACK_MARQUEE = [
  "WEBSOCKETS", "REDIS BROKER", "CRDT CONCURRENCY", "OPTIMISTIC UI", "AI GENERATION", "CAUSAL CONSISTENCY", "REAL-TIME CANVAS", "SUB-50MS LATENCY"
];

// --- Helper Components ---

const Scanlines = () => (
  <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 mix-blend-overlay"></div>
  </div>
);

const TechBracket = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-electric-teal/50"></div>
    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-electric-teal/50"></div>
    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-electric-teal/50"></div>
    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-electric-teal/50"></div>
    {children}
  </div>
);

// --- Main Page Component ---

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground selection:bg-electric-teal/30 selection:text-electric-teal overflow-x-hidden font-paragraph">
      <style>{`
        .nexus-grid {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
        }
        .nexus-glow-text {
          text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }
        .nexus-glow-box {
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.1), inset 0 0 20px rgba(0, 255, 255, 0.05);
        }
        .clip-diagonal {
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
        }
        .clip-diagonal-reverse {
          clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px);
        }
      `}</style>

      <Scanlines />
      <Header />

      <main className="relative z-10">
        <HeroSection scrollYProgress={scrollYProgress} />
        <MarqueeSection />
        <ArchitectureSection />
        <StickyFeaturesSection />
        <DataCoreSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

// --- Sections ---

function HeroSection({ scrollYProgress }: { scrollYProgress: any }) {
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section className="relative min-h-[100vh] w-full flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 nexus-grid opacity-40" />
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-electric-teal/10 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-electric-magenta/10 rounded-full blur-[100px] mix-blend-screen" />

      {/* Parallax Floating Elements */}
      <motion.div style={{ y: y2, opacity }} className="absolute top-32 right-[10%] w-64 hidden lg:block">
        <TechBracket className="p-4 bg-charcoal/40 backdrop-blur-md border border-electric-teal/20">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-4 h-4 text-electric-teal" />
            <span className="text-xs text-electric-teal tracking-widest uppercase">System Status</span>
          </div>
          <div className="space-y-2">
            <div className="h-1 w-full bg-deep-space-blue rounded overflow-hidden">
              <motion.div 
                className="h-full bg-electric-teal" 
                initial={{ width: "0%" }} 
                animate={{ width: "98%" }} 
                transition={{ duration: 2, ease: "easeOut" }} 
              />
            </div>
            <div className="flex justify-between text-[10px] text-foreground/50">
              <span>Sync Rate</span>
              <span className="text-electric-teal">Optimal</span>
            </div>
          </div>
        </TechBracket>
      </motion.div>

      <motion.div style={{ y: y1, opacity }} className="absolute bottom-32 left-[5%] w-72 hidden lg:block z-20">
        <div className="bg-deep-space-blue/80 backdrop-blur-xl border-l-2 border-electric-magenta p-5 clip-diagonal">
          <div className="flex items-center gap-3 mb-3">
            <Terminal className="w-4 h-4 text-electric-magenta" />
            <span className="text-xs text-electric-magenta tracking-widest uppercase">Latest Event</span>
          </div>
          <p className="text-xs text-foreground/70 font-paragraph leading-relaxed">
            <span className="text-electric-teal">User_042</span> initiated CRDT merge sequence on Canvas_Alpha. Conflict resolved automatically.
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 bg-electric-teal/5 border border-electric-teal/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-electric-teal animate-pulse" />
            <span className="text-xs text-electric-teal tracking-widest uppercase font-semibold">Nexus Protocol Active</span>
          </div>

          <h1 className="font-heading text-4xlsm: text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-[0.9] tracking-tighter">
            <span className="text-foreground">AGILE </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-teal to-electric-magenta nexus-glow-text">
              SYNCHRONIZED
            </span>
          </h1>

          <p className="font-paragraph text-base md:text-xl text-foreground/60 mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            The ultimate collaborative command center. Real-time canvas, AI-driven workflows, and conflict-free data replication for high-velocity teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/projects" className="group relative">
              <div className="absolute inset-0 bg-electric-teal blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <button className="relative bg-background border border-electric-teal text-electric-teal px-8 py-4 font-heading font-bold text-lg tracking-wider uppercase flex items-center gap-3 transition-all group-hover:bg-electric-teal group-hover:text-background clip-diagonal">
                Initialize Workspace
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>

            <button className="px-8 py-4 font-heading font-bold text-lg tracking-wider uppercase text-foreground/70 hover:text-electric-magenta transition-colors flex items-center gap-3 border border-transparent hover:border-electric-magenta/30 clip-diagonal-reverse bg-charcoal/30">
              <Crosshair className="w-5 h-5" />
              View Architecture
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <span className="text-[10px] text-foreground/40 tracking-widest uppercase">Scroll to connect</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-electric-teal/50 to-transparent" />
      </motion.div>
    </section>
  );
}

function MarqueeSection() {
  return (
    <section className="w-full py-6 border-y border-electric-teal/10 bg-charcoal/50 overflow-hidden relative z-20">
      <div className="flex whitespace-nowrap">
        <motion.div
          className="flex gap-12 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
        >
          {[...TECH_STACK_MARQUEE, ...TECH_STACK_MARQUEE].map((tech, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-sm font-heading font-bold text-foreground/30 tracking-widest">{tech}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-electric-magenta/50" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section className="w-full max-w-[120rem] mx-auto px-6 md:px-12 py-32 relative z-20">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Network className="w-6 h-6 text-electric-teal" />
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
              The <span className="text-electric-teal">Concurrency</span> Engine
            </h2>
          </div>
          <p className="text-foreground/60 text-lg mb-8 leading-relaxed">
            Built on a foundation of Redis message brokering and Conflict-free Replicated Data Types (CRDTs). We guarantee that when multiple users manipulate the same canvas or Kanban board simultaneously, the system resolves state without locking or data loss.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            {CORE_STATS.map((stat, i) => (
              <div key={i} className="border-l-2 border-electric-teal/30 pl-4 py-2">
                <div className="font-heading text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-xs text-electric-teal tracking-widest uppercase mb-1">{stat.label}</div>
                <div className="text-[10px] text-foreground/50">{stat.detail}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative aspect-square md:aspect-video lg:aspect-square w-full"
        >
          <TechBracket className="w-full h-full p-2 bg-deep-space-blue/50 backdrop-blur-sm">
            <div className="w-full h-full relative overflow-hidden bg-charcoal/80 flex items-center justify-center group">
              <div className="absolute inset-0 nexus-grid opacity-20" />
              {/* Abstract representation of architecture */}
              <div className="relative w-3/4 h-3/4 border border-electric-teal/20 rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
                <div className="absolute w-4 h-4 bg-electric-teal rounded-full top-0 -translate-y-1/2 shadow-[0_0_15px_#00FFFF]" />
                <div className="absolute w-4 h-4 bg-electric-magenta rounded-full bottom-0 translate-y-1/2 shadow-[0_0_15px_#FF00FF]" />
                <div className="w-2/3 h-2/3 border border-electric-magenta/20 rounded-full flex items-center justify-center animate-[spin_40s_linear_infinite_reverse]">
                   <div className="absolute w-3 h-3 bg-electric-teal rounded-full left-0 -translate-x-1/2" />
                   <div className="w-1/2 h-1/2 border border-foreground/10 rounded-full flex items-center justify-center">
                      <Cpu className="w-8 h-8 text-foreground/50 animate-pulse" />
                   </div>
                </div>
              </div>
              
              {/* Overlay Image for texture */}
              <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none">
                <Image 
                  src="https://static.wixstatic.com/media/e7b9d6_1c208cfaf9994982b446fca4779690bc~mv2.png?originWidth=768&originHeight=768" 
                  alt="Architecture Texture" 
                  className="w-full h-full object-cover grayscale"
                />
              </div>
            </div>
          </TechBracket>
        </motion.div>
      </div>
    </section>
  );
}

function StickyFeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={containerRef} className="relative w-full bg-background z-20">
      <div className="max-w-[120rem] mx-auto px-6 md:px-12 flex flex-col lg:flex-row relative">
        
        {/* Left: Sticky Content */}
        <div className="lg:w-1/3 lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center py-20 lg:py-0 z-30">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-[1px] bg-electric-magenta" />
              <span className="text-xs text-electric-magenta tracking-widest uppercase">Core Modules</span>
            </div>
            <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Operational <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/40">Capabilities</span>
            </h2>
          </div>

          <div className="space-y-8 relative">
            <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-charcoal" />
            <motion.div 
              className="absolute left-[11px] top-4 w-[2px] bg-electric-teal origin-top"
              style={{ scaleY: scrollYProgress, height: 'calc(100% - 32px)' }}
            />

            {FEATURES.map((feature, index) => (
              <div key={feature.id} className="relative pl-10 group">
                <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full bg-background border-2 border-charcoal flex items-center justify-center group-hover:border-${feature.color} transition-colors z-10`}>
                  <div className={`w-2 h-2 rounded-full bg-${feature.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-2 group-hover:text-electric-teal transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {feature.tech.map((t, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 bg-charcoal/50 border border-foreground/10 text-foreground/70 uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Scrolling Visuals */}
        <div className="lg:w-2/3 relative">
          {FEATURES.map((feature, index) => (
            <div key={feature.id} className="min-h-screen flex items-center justify-center py-20 lg:py-0 sticky top-0">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, margin: "-20%" }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-3xl aspect-[4/3] relative"
              >
                <TechBracket className="w-full h-full p-1 bg-charcoal/30 backdrop-blur-sm">
                  <div className="w-full h-full relative overflow-hidden bg-deep-space-blue group">
                    {/* Image with tech styling */}
                    <Image 
                      src={feature.imageSrc} 
                      alt={feature.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 mix-blend-luminosity"
                    />
                    
                    {/* Overlays to make it look like a UI */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                    <div className="absolute inset-0 nexus-grid opacity-30" />
                    
                    {/* UI Mockup Elements */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center border-b border-foreground/10 pb-4">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive/50" />
                        <div className="w-3 h-3 rounded-full bg-electric-teal/50" />
                        <div className="w-3 h-3 rounded-full bg-electric-magenta/50" />
                      </div>
                      <div className="text-[10px] font-paragraph text-foreground/40 uppercase tracking-widest">
                        Module: {feature.title}
                      </div>
                    </div>

                    {/* Dynamic overlay based on feature */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <feature.icon className={`w-32 h-32 text-${feature.color} opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700`} />
                    </div>
                  </div>
                </TechBracket>
              </motion.div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function DataCoreSection() {
  return (
    <section className="w-full py-32 bg-deep-space-blue relative overflow-hidden z-20">
      <div className="absolute inset-0 nexus-grid opacity-10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-electric-teal/50 to-transparent" />
      
      <div className="max-w-[120rem] mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6">
            The <span className="text-electric-magenta">Data</span> Core
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
            Visualizing the flow of information. Our architecture ensures that every node in the network maintains a consistent state, regardless of concurrent operations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <motion.div 
              key={item}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: item * 0.1 }}
              className="relative aspect-square"
            >
              <TechBracket className="w-full h-full p-4 bg-charcoal/40 border border-foreground/5 hover:border-electric-teal/30 transition-colors group">
                <div className="w-full h-full relative overflow-hidden flex flex-col">
                  <div className="flex justify-between items-start mb-auto">
                    <span className="text-xs text-foreground/40 font-paragraph uppercase tracking-widest">Node_{item}</span>
                    <Activity className="w-4 h-4 text-electric-teal opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="relative h-1/2 w-full mt-auto">
                    <Image 
                      src="https://static.wixstatic.com/media/e7b9d6_7bab47424131418194e9b0c075fdfb36~mv2.png?originWidth=576&originHeight=576"
                      alt="Data Visualization"
                      className="w-full h-full object-cover opacity-30 mix-blend-screen filter hue-rotate-90 contrast-150"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent" />
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="h-1 w-full bg-background rounded overflow-hidden">
                      <motion.div 
                        className="h-full bg-electric-magenta"
                        initial={{ width: "20%" }}
                        whileInView={{ width: `${Math.random() * 60 + 40}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </TechBracket>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="w-full py-32 relative overflow-hidden z-20 bg-background">
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <div className="w-[80vw] h-[80vw] border-[1px] border-electric-teal rounded-full" />
        <div className="absolute w-[60vw] h-[60vw] border-[1px] border-electric-magenta rounded-full" />
        <div className="absolute w-[40vw] h-[40vw] border-[1px] border-foreground rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="nexus-glow-box bg-charcoal/80 backdrop-blur-xl border border-electric-teal/30 p-12 md:p-20 clip-diagonal"
        >
          <Terminal className="w-12 h-12 text-electric-teal mx-auto mb-6" />
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to <span className="text-electric-teal">Execute?</span>
          </h2>
          <p className="font-paragraph text-foreground/70 mb-10 text-lg">
            Deploy the most advanced collaborative workspace for your team. Experience zero-latency synchronization today.
          </p>
          
          <Link to="/projects" className="inline-block group">
            <div className="relative">
              <div className="absolute inset-0 bg-electric-teal blur-lg opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
              <button className="relative bg-electric-teal text-background px-10 py-5 font-heading font-bold text-xl tracking-wider uppercase flex items-center gap-3 transition-transform group-hover:scale-105 clip-diagonal">
                Launch Dashboard
                <Rocket className="w-6 h-6" />
              </button>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}