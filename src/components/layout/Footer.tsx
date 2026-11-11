import React from 'react';
import { useSalon } from '../../context/SalonContext';
import {
  Send,
  Instagram,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, settings, language } = useSalon();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 pt-16 pb-24 lg:pb-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center font-heading font-extrabold text-amber-400 text-base">
                  IAS
                </div>
              </div>
              <span className="font-heading font-black text-xl text-zinc-100 tracking-wider">
                IAS AUTO SALON
              </span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">
              {language === 'uz' ? settings.taglineUz : settings.taglineRu}
            </p>

            {/* Social Media Links with Exact Required URLs */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-3">
                {t.footer.socials}
              </p>
              <div className="flex items-center gap-3">
                {/* Telegram */}
                <a
                  href={settings.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white transition-all group shadow-sm"
                  aria-label="Telegram"
                >
                  <Send className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold">Telegram</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                {/* Instagram */}
                <a
                  href={settings.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all group shadow-sm"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold">Instagram</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-200 mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  {t.nav.catalog}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('test-drive')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  {t.nav.testDrive}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('why-us')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Showroom Contacts */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-200 mb-4">
              {t.contact.addressTitle}
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{language === 'uz' ? settings.addressUz : settings.addressRu}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${settings.phonePrimary}`} className="hover:text-amber-400 font-semibold text-zinc-200">
                  {settings.phonePrimary}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Trust & Guarantee */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-200 mb-4">
              IAS Quality Standards
            </h4>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-zinc-200">100% Legal Guarantee</div>
                  <div className="text-zinc-400 text-[11px]">Barcha bojxona hujjatlari bilan</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3">
                <Award className="w-6 h-6 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-zinc-200">VIP Concierge Service</div>
                  <div className="text-zinc-400 text-[11px]">Avto yetkazish va ro‘yxatdan o‘tkazish</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} IAS AUTO SALON. {t.footer.rights}
          </div>
          <div className="text-center sm:text-right text-[11px] max-w-md">
            {t.footer.disclaimer}
          </div>
        </div>
      </div>
    </footer>
  );
};
