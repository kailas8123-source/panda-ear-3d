import { motion } from 'framer-motion';
import { Flame, Layers3, Rocket, WandSparkles } from 'lucide-react';

interface CreaturesSectionProps {
  depthProgress: number;
}

const services = [
  {
    title: 'Brand Resurrection',
    description: 'Rebuild tired brands into sharp identities with naming, systems, launch stories, and campaign-ready visual language.',
    icon: <Flame className="w-5 h-5" />,
    stat: '30 days',
    label: 'identity sprint',
  },
  {
    title: 'Immersive Web',
    description: 'Premium motion sites, 3D hero scenes, product worlds, and scroll narratives that feel alive without sacrificing usability.',
    icon: <Layers3 className="w-5 h-5" />,
    stat: '3D first',
    label: 'experience layer',
  },
  {
    title: 'Launch Systems',
    description: 'Landing pages, funnels, creative testing kits, analytics, and conversion loops built for fast market learning.',
    icon: <Rocket className="w-5 h-5" />,
    stat: '2.4x',
    label: 'typical lift target',
  },
  {
    title: 'Content Firepower',
    description: 'Short-form campaigns, hero films, ad concepts, and AI-assisted production systems that keep a brand visible.',
    icon: <WandSparkles className="w-5 h-5" />,
    stat: '90+',
    label: 'assets per launch',
  },
];

export function CreaturesSection({ depthProgress: _depthProgress }: CreaturesSectionProps) {
  return (
    <section id="creatures" className="phoenix-section relative py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="max-w-3xl mb-12"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full google-glass-panel-soft text-sm text-slate-700 mb-5">
            Strategy, design, motion, growth
          </span>
          <h2 className="text-4xl sm:text-5xl font-semibold text-white mb-5">
            A studio built around rebirth moments.
          </h2>
          <p className="google-glass-panel max-w-2xl rounded-[28px] px-6 py-5 text-lg text-slate-700 leading-relaxed">
            The phoenix is not decoration here. It is the operating model: audit what exists, burn away what is dull, and relaunch with a system that can keep flying.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              className="rounded-[28px] google-glass-panel p-6"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-200 to-orange-500 text-zinc-950 flex items-center justify-center">
                  {service.icon}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-slate-950">{service.stat}</div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">{service.label}</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-950 mb-2">{service.title}</h3>
              <p className="text-sm leading-6 text-slate-600">{service.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CreaturesSection;
