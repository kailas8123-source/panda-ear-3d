import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compass, ArrowRight, Waves } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CTASectionProps {
  depthProgress: number;
}

export function CTASection({ depthProgress: _depthProgress }: CTASectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    // Content reveal animation
    gsap.fromTo(content.children,
      { opacity: 0, y: 50 },
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

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="ocean-section relative py-32 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center"
    >
      {/* Deep ocean background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Bioluminescent particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-bio-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Large glow orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-bio-glow/10 blur-3xl"
          style={{ left: '10%', top: '20%' }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-bio-cyan/10 blur-3xl"
          style={{ right: '15%', bottom: '30%' }}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div ref={contentRef} className="text-center">
          {/* Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full 
              bg-gradient-to-br from-bio-glow/20 to-bio-cyan/20 
              border border-bio-glow/30 mb-8"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Compass className="w-10 h-10 text-bio-glow" />
          </motion.div>

          {/* Title */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6">
            Protect the{' '}
            <span className="text-gradient-glow glow-bio">Unknown</span>
          </h2>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-ocean-surface/60 max-w-2xl mx-auto mb-12 leading-relaxed">
            The ocean covers 71% of our planet, yet we've explored less than 5% of it. 
            Every dive reveals new wonders. Every action shapes the future of our blue planet.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <motion.button
              className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-bio-glow to-bio-cyan 
                text-ocean-abyss font-semibold text-lg overflow-hidden transition-all duration-300
                hover:shadow-glow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Exploring
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.button>

            <motion.button
              className="px-8 py-4 rounded-full glass-ocean text-white font-medium text-lg
                border border-ocean-surface/20 hover:border-ocean-surface/40 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn More
            </motion.button>
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {[
              { value: '5%', label: 'Explored' },
              { value: '2M+', label: 'Species' },
              { value: '∞', label: 'Wonders' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gradient-glow mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-ocean-surface/50">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Bottom decoration */}
          <motion.div
            className="mt-20 flex items-center justify-center gap-4"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Waves className="w-6 h-6 text-ocean-surface/30" />
            <Waves className="w-8 h-8 text-ocean-surface/40" />
            <Waves className="w-6 h-6 text-ocean-surface/30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
