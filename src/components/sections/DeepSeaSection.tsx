import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Eye, Zap, Moon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface DeepSeaCreature {
  id: string;
  name: string;
  description: string;
  depth: string;
  feature: string;
  glowColor: string;
}

const deepSeaCreatures: DeepSeaCreature[] = [
  {
    id: 'anglerfish',
    name: 'Anglerfish',
    description: 'Uses a bioluminescent lure to attract prey in the eternal darkness of the deep.',
    depth: '200-2000m',
    feature: 'Bioluminescent Lure',
    glowColor: '#00FF88',
  },
  {
    id: 'jellyfish',
    name: 'Giant Jellyfish',
    description: 'Drifting through the depths, these ethereal creatures pulse with otherworldly light.',
    depth: '1000-4000m',
    feature: 'Pulsing Glow',
    glowColor: '#00D4FF',
  },
  {
    id: 'viperfish',
    name: 'Viperfish',
    description: 'With needle-like teeth and a hinged skull, this predator is built for the deep.',
    depth: '250-5000m',
    feature: 'Bioluminescent Spots',
    glowColor: '#FF6B35',
  },
  {
    id: 'giant-squid',
    name: 'Giant Squid',
    description: 'Elusive and enormous, these cephalopods can grow up to 13 meters in length.',
    depth: '300-1000m',
    feature: 'Large Eyes',
    glowColor: '#9D4EDD',
  },
];

interface DeepSeaSectionProps {
  depthProgress: number;
}

export function DeepSeaSection({ depthProgress: _depthProgress }: DeepSeaSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const creaturesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const creatures = creaturesRef.current;

    if (!section || !content || !creatures) return;

    // Content reveal animation
    gsap.fromTo(content.children,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Creatures cards animation
    const creatureCards = creatures.querySelectorAll('.deep-creature-card');
    gsap.fromTo(creatureCards,
      { opacity: 0, x: -50, scale: 0.95 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: creatures,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === section || st.vars.trigger === creatures) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="deep-sea"
      className="ocean-section relative py-32 px-4 sm:px-6 lg:px-8"
    >
      {/* Bioluminescent background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating glow orbs */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${deepSeaCreatures[i % 4].glowColor}20, transparent)`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div ref={contentRef} className="mb-20">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-ocean mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-4 h-4 text-bio-glow" />
            <span className="text-sm text-bio-glow font-medium">Bioluminescent Zone</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6">
            Creatures of the{' '}
            <span className="text-gradient-glow glow-bio">Deep</span>
          </h2>

          <p className="text-lg text-ocean-surface/60 max-w-2xl">
            Beyond the reach of sunlight, life has evolved extraordinary adaptations. 
            Bioluminescence becomes the language of survival in the eternal darkness.
          </p>
        </div>

        {/* Deep Sea Creatures Grid */}
        <div
          ref={creaturesRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {deepSeaCreatures.map((creature, index) => (
            <motion.div
              key={creature.id}
              className="deep-creature-card group relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className="relative overflow-hidden rounded-2xl p-8 
                  bg-ocean-deep/60 backdrop-blur-xl 
                  border border-white/5 hover:border-white/20
                  transition-all duration-500"
                style={{
                  boxShadow: `0 0 40px ${creature.glowColor}10`,
                }}
              >
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${creature.glowColor}15, transparent 70%)`,
                  }}
                />

                {/* Creature visualization placeholder */}
                <div className="relative mb-6">
                  <div
                    className="w-24 h-24 rounded-full mx-auto flex items-center justify-center
                      bg-gradient-to-br from-white/5 to-white/10
                      border border-white/10"
                    style={{
                      boxShadow: `0 0 30px ${creature.glowColor}30`,
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2 + index * 0.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <Moon
                        className="w-10 h-10"
                        style={{ color: creature.glowColor }}
                      />
                    </motion.div>
                  </div>

                  {/* Pulsing rings */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  >
                    <div
                      className="w-24 h-24 rounded-full border-2"
                      style={{ borderColor: `${creature.glowColor}40` }}
                    />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">
                    {creature.name}
                  </h3>

                  <p className="text-ocean-surface/60 mb-4 text-sm leading-relaxed">
                    {creature.description}
                  </p>

                  {/* Meta info */}
                  <div className="flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-ocean-surface/40" />
                      <span className="text-ocean-surface/60">{creature.depth}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap
                        className="w-4 h-4"
                        style={{ color: creature.glowColor }}
                      />
                      <span style={{ color: creature.glowColor }}>
                        {creature.feature}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Depth fact */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full glass-ocean">
            <div className="w-3 h-3 rounded-full bg-bio-glow animate-pulse" />
            <span className="text-ocean-surface/70">
              Sunlight can only penetrate approximately <strong className="text-white">1,000 meters</strong> into the ocean
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default DeepSeaSection;
