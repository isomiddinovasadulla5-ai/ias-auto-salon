import React from 'react';
import { useSalon } from '../../context/SalonContext';
import { ShieldCheck, Plane, Award, Wrench, Sparkles, CheckCircle2 } from 'lucide-react';

export const WhyUs: React.FC = () => {
  const { t } = useSalon();

  const benefits = [
    {
      icon: ShieldCheck,
      title: t.whyUs.item1Title,
      desc: t.whyUs.item1Desc,
      tag: '100% Legal',
    },
    {
      icon: Plane,
      title: t.whyUs.item2Title,
      desc: t.whyUs.item2Desc,
      tag: '14-25 Days',
    },
    {
      icon: Award,
      title: t.whyUs.item3Title,
      desc: t.whyUs.item3Desc,
      tag: 'VIP Concierge',
    },
    {
      icon: Wrench,
      title: t.whyUs.item4Title,
      desc: t.whyUs.item4Desc,
      tag: '8 Years Warranty',
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>IAS Exclusive</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight mb-4">
            {t.whyUs.title}
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            {t.whyUs.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center gap-1 text-[11px] font-bold text-amber-400/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kafolatlangan xizmat</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
