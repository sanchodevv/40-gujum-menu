'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLangStore } from '@/store/lang';
import { useT } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import { Phone, Clock, MapPin, Instagram, Send, Youtube } from 'lucide-react';

type Settings = Record<string, string>;

export default function ContactPage() {
  const { lang } = useLangStore();
  const t = useT(lang);
  const [settings, setSettings] = useState<Settings>({});

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CartDrawer />

      <div className="bg-green-700 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gold-300 text-sm font-semibold uppercase tracking-widest mb-2">☎ ☎ ☎</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">{t('contact')}</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Info cards */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <Phone className="w-7 h-7 text-green-700" />
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">{t('phone')}</p>
                <a href={`tel:${settings.phone}`} className="text-xl font-bold text-gray-900 hover:text-green-700 transition-colors">
                  {settings.phone || '+998 90 123 45 67'}
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <Clock className="w-7 h-7 text-green-700" />
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">{t('workingHours')}</p>
                <p className="text-xl font-bold text-gray-900">{settings.working_hours || '10:00 - 23:00'}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-7 h-7 text-green-700" />
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">{t('address')}</p>
                <p className="text-lg font-semibold text-gray-900">{settings.address || 'Toshkent shahar, Mirzo Ulugbek tumani'}</p>
              </div>
            </div>

            {/* Social */}
            <div className="bg-green-700 rounded-2xl p-6 shadow-sm">
              <p className="text-green-200 text-xs uppercase tracking-wide mb-4">Ijtimoiy tarmoqlar</p>
              <div className="flex gap-3">
                {[
                  { icon: Instagram, href: settings.instagram, label: 'Instagram' },
                  { icon: Send, href: settings.telegram, label: 'Telegram' },
                  { icon: Youtube, href: settings.youtube, label: 'YouTube' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-600 hover:bg-gold-400 text-white hover:text-green-900 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-[480px]">
            <iframe
              src={settings.map_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11986.494327742264!2d69.23958!3d41.29950!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent!5e0!3m2!1suz!2suz!4v1234567890'}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
