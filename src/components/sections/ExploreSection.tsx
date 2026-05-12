import { motion } from 'framer-motion';
import { BarChart3, Clapperboard, Code2, MousePointer2, Sparkles, Zap } from 'lucide-react';

interface ExploreSectionProps {
  depthProgress: number;
}

const capabilities = [
  { title: 'Cinematic WebGL direction', icon: <Clapperboard className="w-5 h-5" /> },
  { title: 'Conversion landing systems', icon: <MousePointer2 className="w-5 h-5" /> },
  { title: 'Design systems in motion', icon: <Code2 className="w-5 h-5" /> },
  { title: 'Launch analytics loop', icon: <BarChart3 className="w-5 h-5" /> },
];

const metrics = [
  { label: 'Identity clarity', value: 93 },
  { label: 'Motion impact', value: 96 },
  { label: 'Launch speed', value: 88 },
  { label: 'Conversion readiness', value: 91 },
];

export function ExploreSection({ depthProgress: _depthProgress }: ExploreSectionProps) {
  return (
    <section id="explore" className="phoenix-section relative py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full google-glass-panel-soft mb-6 text-slate-700">
            <Sparkles className="w-4 h-4" />
            Phoenix operating system
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-6">
            Build the brand. Light the launch. Feed the flame.
          </h2>
          <p className="google-glass-panel max-w-3xl mx-auto rounded-[28px] px-6 py-5 text-lg text-slate-700">
            A digital agency experience with the phoenix as a live background theme: heat, ascent, clarity, and renewal, wrapped around practical product and growth work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
          <motion.div
            className="rounded-[32px] google-glass-panel p-6"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {capabilities.map((item) => (
                <div key={item.title} className="rounded-3xl google-glass-panel-soft p-5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-400/[0.16] text-amber-200 flex items-center justify-center mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rounded-[32px] google-glass-panel p-6"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between gap-4 mb-7">
              <div>
                <h3 className="text-2xl font-semibold text-slate-950">Transformation score</h3>
                <p className="text-sm text-slate-500">The model we use for every phoenix launch.</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-200 to-rose-500 text-zinc-950 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
            </div>
            <div className="space-y-5">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">{metric.label}</span>
                    <span className="text-amber-200 font-semibold">{metric.value}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-amber-200 via-orange-500 to-rose-600"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${metric.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ExploreSection;
