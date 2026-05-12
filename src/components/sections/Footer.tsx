import { motion } from 'framer-motion';
import { ExternalLink, Flame, Github, Instagram, Mail, Twitter } from 'lucide-react';

const footerLinks = {
  studio: [
    { label: 'Studio', href: '#creatures' },
    { label: 'Capabilities', href: '#explore' },
  ],
  services: [
    { label: 'Brand rebirth', href: '#creatures' },
    { label: 'Motion web', href: '#explore' },
    { label: 'Launch systems', href: '#explore' },
  ],
  contact: [
    { label: 'Start project', href: '#' },
    { label: 'Book call', href: '#' },
  ],
};

const socialLinks = [
  { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
  { icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
  { icon: <Github className="w-5 h-5" />, href: '#', label: 'GitHub' },
  { icon: <Mail className="w-5 h-5" />, href: '#', label: 'Email' },
];

export function Footer() {
  return (
    <footer className="relative bg-zinc-950 border-t border-orange-100/10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-200 via-orange-500 to-rose-600 flex items-center justify-center">
                <Flame className="w-6 h-6 text-zinc-950" />
              </div>
              <span className="text-xl font-bold text-white">Phoenix Digital</span>
            </motion.div>

            <p className="text-orange-50/58 mb-6 max-w-sm leading-relaxed">
              A digital agency for brand rebirth, cinematic web experiences, and launches that keep moving after day one.
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-orange-50/60 hover:text-amber-200 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4 capitalize">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-orange-50/58 hover:text-amber-200 transition-colors duration-300 flex items-center gap-1 group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-orange-50/40">© 2026 Phoenix Digital. All rights reserved.</p>
          <p className="text-sm text-orange-50/40">Phoenix model by NORBERTO-3D, CC BY.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
