'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Instagram, Send, Youtube, MapPin, Clock,
  UtensilsCrossed, MessageSquare, PhoneCall, Code, ChevronRight, QrCode, Phone
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLangStore } from '@/store/lang';
import { useT } from '@/lib/i18n';
import CartDrawer from '@/components/CartDrawer';
import QRCode from '@/components/QRCode';
import { FeedbackModal, ContactModal } from '@/components/HomeModals';
import { cn } from '@/lib/utils';
import type { Lang } from '@/lib/i18n';

type Settings = Record<string, string>;

const langs: { code: Lang; label: string }[] = [
  { code: 'uz', label: "O'z" },
  { code: 'ru', label: 'Ru' },
  { code: 'en', label: 'En' },
];

export default function HomePage() {
  const { lang, setLang } = useLangStore();
  const t = useT(lang);
  const [settings, setSettings] = useState<Settings>({});
  const [showQR, setShowQR] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    supabase.from('site_settings').select('*').then(({ data }) => {
      if (data) {
        const map: Settings = {};
        data.forEach((s) => { map[s.key] = s.value; });
        setSettings(map);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-green-900 flex flex-col items-center">
      <CartDrawer />

      <div className="w-full max-w-sm mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Lang switcher */}
        {/* <div className="flex justify-end">
          <div className="flex items-center gap-0.5 bg-green-800/60 rounded-lg p-0.5">
            {langs.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={cn(
                  'px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200',
                  lang === l.code ? 'bg-gold-400 text-green-900' : 'text-green-400 hover:text-white'
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div> */}

        {/* Logo + Title */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <img
            src="/logo.png  "
            alt="Gavhar Restaurant Logo"
            className="w-100 h-50 object-contain drop-shadow-lg"
          />
          <div className="text-center">
            <h1 className="font-serif text-4xl font-bold text-white tracking-wide">
              40-Gujum Restaurant
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-oltin-500" />
              <p className="text-green-300 text-sm">
                {settings.banner_subtitle || 'Mualliflik yondashuvi bilan noyob oshxona'}
              </p>
              <div className="w-2 h-2 rounded-full bg-oltin-500" />
            </div>
          </div>
        </div>

        {/* Social icons */}
        <div className="flex items-center justify-center gap-6">
          <a
            href={settings.instagram || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full border border-green-600 flex items-center justify-center text-green-300 hover:text-gold-400 hover:border-gold-400 transition-all duration-200"
          >
            <Instagram className="w-5 h-5" style={{color: "#EAB67D"}} />
          </a>
          <a
            href={settings.telegram || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full border border-green-600 flex items-center justify-center text-green-300 hover:text-gold-400 hover:border-gold-400 transition-all duration-200"
          >
            <Send className="w-5 h-5" style={{color: "#EAB67D"}} />
          </a>
          <a
            href={settings.youtube || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full border border-green-600 flex items-center justify-center text-green-300 hover:text-gold-400 hover:border-gold-400 transition-all duration-200"
          >
            <Youtube className="w-5 h-5" style={{color: "#EAB67D"}} />
          </a>
        </div>

        {/* Phone */}
        <div className="text-center">
          <p className="text-green-500 text-xs uppercase tracking-widest mb-1">ALOQA</p>
          <a
            href={`tel:${settings.phone || '+998781333000'}`}
            className="text-oltin-300 text-xl font-bold tracking-wide hover:text-oltin-400 transition-colors"
          >
            {settings.phone || '+99878-333-30-00'}
          </a>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2">
          {/* Menu — sahifaga o'tadi */}
          <Link
            href="/menu"
            className="flex items-center gap-4 bg-green-800/50 hover:bg-green-800 border border-green-700/50 hover:border-green-600 rounded-xl px-5 py-4 transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-lg bg-green-700/60 group-hover:bg-green-700 flex items-center justify-center flex-shrink-0 transition-colors">
              <UtensilsCrossed className="w-4 h-4 text-oltin-400" />
            </div>
            <span className="flex-1 text-white font-semibold text-sm tracking-wide">MENU</span>
            <ChevronRight className="w-4 h-4 text-green-500 group-hover:text-oltin-400 transition-colors" />
          </Link>

          {/* Menu 2 — sahifaga o'tadi */}
          {/* <Link
            href="/menu2"
            className="flex items-center gap-4 bg-green-800/50 hover:bg-green-800 border border-green-700/50 hover:border-green-600 rounded-xl px-5 py-4 transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-lg bg-green-700/60 group-hover:bg-green-700 flex items-center justify-center flex-shrink-0 transition-colors">
              <UtensilsCrossed className="w-4 h-4 text-oltin-400" />
            </div>
            <span className="flex-1 text-white font-semibold text-sm tracking-wide">GAVHAR 2 MENU</span>
            <ChevronRight className="w-4 h-4 text-green-500 group-hover:text-oltin-400 transition-colors" />
          </Link> */}

          {/* Feedback — modal */}
          <button
            onClick={() => setShowFeedback(true)}
            className="flex items-center gap-4 bg-green-800/50 hover:bg-green-800 border border-green-700/50 hover:border-green-600 rounded-xl px-5 py-4 transition-all duration-200 group w-full text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-green-700/60 group-hover:bg-green-700 flex items-center justify-center flex-shrink-0 transition-colors">
              <MessageSquare className="w-4 h-4 text-oltin-400" />
            </div>
            <span className="flex-1 text-white font-semibold text-sm tracking-wide">
              {lang === 'ru' ? 'ОТЗЫВЫ И ПРЕДЛОЖЕНИЯ' : lang === 'en' ? 'FEEDBACK' : 'FIKR VA TAKLIFLAR'}
            </span>
            <ChevronRight className="w-4 h-4 text-green-500 group-hover:text-gold-400 transition-colors" />
          </button>

          {/* Contact — modal */}
          <button
            onClick={() => setShowContact(true)}
            className="flex items-center gap-4 bg-green-800/50 hover:bg-green-800 border border-green-700/50 hover:border-green-600 rounded-xl px-5 py-4 transition-all duration-200 group w-full text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-green-700/60 group-hover:bg-green-700 flex items-center justify-center flex-shrink-0 transition-colors">
              <PhoneCall className="w-4 h-4 text-oltin-400" />
            </div>
            <span className="flex-1 text-white font-semibold text-sm tracking-wide">
              {lang === 'ru' ? "СВЯЗАТЬСЯ С НАМИ" : lang === 'en' ? 'CONTACT US' : "BIZ BILAN BOG'LANISH"}
            </span>
            <ChevronRight className="w-4 h-4 text-green-500 group-hover:text-gold-400 transition-colors" />
          </button>

          {/* QR Code */}
          <button
            onClick={() => setShowQR(true)}
            className="flex items-center gap-4 bg-green-800/50 hover:bg-green-800 border border-green-700/50 hover:border-green-600 rounded-xl px-5 py-4 transition-all duration-200 group w-full text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-green-700/60 group-hover:bg-green-700 flex items-center justify-center flex-shrink-0 transition-colors">
              <QrCode className="w-4 h-4 text-oltin-400" />
            </div>
            <span className="flex-1 text-white font-semibold text-sm tracking-wide">QR KOD</span>
            <ChevronRight className="w-4 h-4 text-green-500 group-hover:text-gold-400 transition-colors" />
          </button>
        </div>

        {/* Map card */}
        <div className="bg-green-800/50 border border-green-700/50 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-green-700/50">
            <MapPin className="w-4 h-4 text-oltin-400" />
            <span className="text-white font-semibold text-sm">
              {lang === 'ru' ? 'Наше местоположение' : lang === 'en' ? 'Our location' : 'Bizning joylashuv'}
            </span>
          </div>
          <div className="h-44 w-full">
            <iframe
              src={
                settings.map_url ||
                'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11986.494327742264!2d69.23958!3d41.29950!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent!5e0!3m2!1suz!2suz!4v1234567890'
              }
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="px-4 py-3 space-y-2 border-t border-green-700/50">
            <div className="flex items-center gap-2 text-green-200 text-sm">
              <MapPin className="w-4 h-4 text-oltin-400 flex-shrink-0" />
              <span>{settings.address || 'Urganch Shahar, Mustaqillik kochasi'}</span>
            </div>
            <div className="flex items-center gap-2 text-green-200 text-sm">
              <Clock className="w-4 h-4 text-oltin-400 flex-shrink-0" />
              <span>
                {lang === 'ru' ? 'Ежедневно: ' : lang === 'en' ? 'Daily: ' : 'Har kuni: '}
                {settings.working_hours || '10:00 - 23:00'}
              </span>
            </div>
          </div>
        </div>

        {/* Admin link */}
        <div className="bg-green-800/30 border border-green-700/30 rounded-xl">
          <Link href="/admin" className="flex items-center gap-4 px-5 py-4 group">
            <div className="w-9 h-9 rounded-lg bg-green-700/40 flex items-center justify-center flex-shrink-0">
              <Code className="w-4 h-4 text-oltin-500" />
            </div>
            <div className="flex-1">
              <p className="text-green-500 text-xs uppercase tracking-widest">SAYT YARATISH</p>
              <p className="text-green-300 font-semibold text-sm">
                {lang === 'ru' ? 'Войти' : lang === 'en' ? 'Sign in' : "Bog'lanish"}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-green-600 group-hover:text-green-400 transition-colors" />
          </Link>
        </div>

        <p className="text-center text-green-700 text-xs pb-4">
          &copy; {new Date().getFullYear()} 40-Gujum Restaurant
        </p>
      </div>

      {showQR && <QRCode onClose={() => setShowQR(false)} />}
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
      {showContact && <ContactModal onClose={() => setShowContact(false)} settings={settings} />}
    </div>
  );
}
