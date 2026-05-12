import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  depthProgress: number;
}

export function HeroSection({ depthProgress: _depthProgress }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="phoenix-section relative min-h-screen flex items-center px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
        <motion.div
          className="relative z-10 pt-24 lg:pt-0"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 rounded-full google-glass-panel-soft px-4 py-2 text-sm text-slate-700 mb-7">
            <Sparkles className="w-4 h-4 text-amber-200" />
            Digital agency for brands ready to rise
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[0.95] text-white mb-7 max-w-4xl drop-shadow-[0_12px_40px_rgba(0,0,0,0.38)]">
            Phoenix Digital
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-400 to-rose-500">
              campaigns reborn in motion.
            </span>
          </h1>

          <p className="google-glass-panel max-w-2xl rounded-[28px] px-6 py-5 text-lg sm:text-xl text-slate-700 leading-8 mb-9">
            We build cinematic websites, launch systems, and brand experiences with the speed of performance marketing and the polish of a motion studio.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-slate-950 px-7 py-4 font-semibold shadow-[0_18px_70px_rgba(251,146,60,0.28)] hover:bg-amber-100 transition-colors"
              onClick={() => document.getElementById('creatures')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start a transformation
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              className="inline-flex items-center justify-center rounded-full google-glass-panel-soft px-7 py-4 font-semibold text-slate-800 hover:bg-white/90 transition-colors"
              onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View capabilities
            </button>
          </div>
        </motion.div>

        <div className="hidden lg:block min-h-[640px]" aria-hidden="true" />
      </div>
    </section>
  );
}

export default HeroSection;
