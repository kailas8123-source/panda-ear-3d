import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertTriangle, Heart, Droplets, Trash2, Thermometer } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ThreatItem {
  id: string;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  icon: React.ReactNode;
  color: string;
}

const threats: ThreatItem[] = [
  {
    id: 'pollution',
    title: 'Ocean Pollution',
    description: 'Millions of tons of plastic enter our oceans each year, threatening marine life and ecosystems.',
    stat: '8M',
    statLabel: 'Tons of plastic/year',
    icon: <Trash2 className="w-6 h-6" />,
    color: '#FF6B6B',
  },
  {
    id: 'warming',
    title: 'Ocean Warming',
    description: 'Rising temperatures cause coral bleaching and disrupt marine migration patterns.',
    stat: '+1.5°C',
    statLabel: 'Temperature rise',
    icon: <Thermometer className="w-6 h-6" />,
    color: '#FF9F43',
  },
  {
    id: 'acidification',
    title: 'Acidification',
    description: 'Absorbed CO2 changes ocean chemistry, affecting shell-forming organisms.',
    stat: '30%',
    statLabel: 'More acidic',
    icon: <Droplets className="w-6 h-6" />,
    color: '#54A0FF',
  },
];

const endangeredSpecies = [
  { name: 'Vaquita', count: '10', status: 'Critically Endangered' },
  { name: 'Hawksbill Turtle', count: '15,000', status: 'Critically Endangered' },
  { name: 'Blue Whale', count: '10,000', status: 'Endangered' },
  { name: 'Hammerhead Shark', count: 'Unknown', status: 'Endangered' },
];

interface EndangeredSectionProps {
  depthProgress: number;
}

export function EndangeredSection({ depthProgress: _depthProgress }: EndangeredSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    // Content animation
    gsap.fromTo(content.children,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="endangered"
      className="ocean-section relative py-32 px-4 sm:px-6 lg:px-8"
    >
      {/* Darker atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ocean-abyss/30 to-ocean-abyss/60 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={contentRef}>
          {/* Warning Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400 font-medium">Critical Warning</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6">
              Our Oceans Are{' '}
              <span className="text-red-400">At Risk</span>
            </h2>

            <p className="text-lg text-ocean-surface/60 max-w-2xl mx-auto">
              Human activities are pushing marine ecosystems to the brink. 
              The time to act is now, before we lose these incredible creatures forever.
            </p>
          </motion.div>

          {/* Threats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {threats.map((threat, index) => (
              <motion.div
                key={threat.id}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className="relative overflow-hidden rounded-2xl p-6 
                    bg-ocean-deep/40 backdrop-blur-xl 
                    border border-white/5 hover:border-white/10
                    transition-all duration-500 h-full"
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: `${threat.color}20`,
                      color: threat.color,
                    }}
                  >
                    {threat.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-serif font-bold text-white mb-2">
                    {threat.title}
                  </h3>

                  <p className="text-ocean-surface/60 text-sm mb-4">
                    {threat.description}
                  </p>

                  {/* Stat */}
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-3xl font-bold"
                      style={{ color: threat.color }}
                    >
                      {threat.stat}
                    </span>
                    <span className="text-xs text-ocean-surface/50">
                      {threat.statLabel}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Endangered Species */}
          <motion.div
            className="rounded-3xl overflow-hidden glass-ocean p-8 md:p-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Heart className="w-6 h-6 text-red-400" />
              <h3 className="text-2xl font-serif font-bold text-white">
                Endangered Species
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {endangeredSpecies.map((species, index) => (
                <motion.div
                  key={species.name}
                  className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {species.count}
                  </div>
                  <div className="text-sm text-ocean-surface/70 mb-2">
                    {species.name}
                  </div>
                  <div className="inline-block px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs">
                    {species.status}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-ocean-surface/60 mb-6">
              Every action counts. Together, we can protect our oceans for future generations.
            </p>
            <motion.button
              className="px-8 py-4 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold
                hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Take Action Now
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default EndangeredSection;
