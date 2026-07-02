'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLangStore } from '@/store/lang';
import { useT } from '@/lib/i18n';
import {
  Send, MessageCircle, CheckCircle, X,
  Phone, Clock, MapPin, Instagram, Youtube
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Settings = Record<string, string>;

// ── Feedback Modal ─────────────────────────────────────────────────────────
export function FeedbackModal({ onClose }: { onClose: () => void }) {
  const { lang } = useLangStore();
  const t = useT(lang);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setStatus('sending');
    setError('');
    try {
      const { error: dbErr } = await supabase
        .from('feedback')
        .insert({ name: name.trim(), message: message.trim() });
      if (dbErr) throw dbErr;
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-feedback`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ name: name.trim(), message: message.trim() }),
          }
        );
      } catch {}
      setStatus('success');
      setName('');
      setMessage('');
    } catch {
      setStatus('error');
      setError(t('feedbackError'));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-green-900 border border-green-700 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-green-700/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-800 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-gold-400" />
            </div>
            <h2 className="font-serif text-lg font-bold text-white">{t('feedbackTitle')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-green-400 hover:text-white hover:bg-green-800 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {status === 'success' ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-800 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-gold-400" />
              </div>
              <p className="text-white font-semibold text-lg mb-1">{t('feedbackSuccess')}</p>
              <p className="text-green-400 text-sm mb-6">Xabaringiz adminga yuborildi.</p>
              <button
                onClick={() => setStatus('idle')}
                className="bg-gold-400 hover:bg-gold-300 text-green-900 font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
              >
                Yangi xabar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-300 mb-1.5">
                  {t('yourName')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ism Familiya"
                  className="w-full px-4 py-3 bg-green-800/70 border border-green-700 rounded-xl text-sm text-white placeholder:text-green-600 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-300 mb-1.5">
                  {t('yourMessage')}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="Fikr yoki taklifingizni yozing..."
                  className="w-full px-4 py-3 bg-green-800/70 border border-green-700 rounded-xl text-sm text-white placeholder:text-green-600 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400/50 transition-all resize-none"
                />
              </div>
              {error && (
                <div className="bg-red-900/40 border border-red-700/50 text-red-300 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={status === 'sending' || !name.trim() || !message.trim()}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200',
                  status === 'sending' || !name.trim() || !message.trim()
                    ? 'bg-green-800 text-green-600 cursor-not-allowed'
                    : 'bg-gold-400 hover:bg-gold-300 text-green-900 active:scale-[0.98]'
                )}
              >
                <Send className="w-4 h-4" />
                {status === 'sending' ? t('sending') : t('send')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Contact Modal ──────────────────────────────────────────────────────────
export function ContactModal({ onClose, settings }: { onClose: () => void; settings: Settings }) {
  const { lang } = useLangStore();
  const t = useT(lang);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-green-900 border border-green-700 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-green-700/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-800 flex items-center justify-center">
              <Phone className="w-5 h-5 text-gold-400" />
            </div>
            <h2 className="font-serif text-lg font-bold text-white">{t('contact')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-green-400 hover:text-white hover:bg-green-800 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Phone */}
          <a
            href={`tel:${settings.phone || ''}`}
            className="flex items-center gap-4 bg-green-800/50 hover:bg-green-800 border border-green-700/50 rounded-xl px-4 py-3.5 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-green-700/60 flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <p className="text-green-500 text-xs uppercase tracking-wide">{t('phone')}</p>
              <p className="text-white font-bold text-base">{settings.phone || '+998 90 123 45 67'}</p>
            </div>
          </a>

          {/* Working hours */}
          <div className="flex items-center gap-4 bg-green-800/50 border border-green-700/50 rounded-xl px-4 py-3.5">
            <div className="w-9 h-9 rounded-lg bg-green-700/60 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <p className="text-green-500 text-xs uppercase tracking-wide">{t('workingHours')}</p>
              <p className="text-white font-bold text-base">{settings.working_hours || '10:00 - 23:00'}</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-4 bg-green-800/50 border border-green-700/50 rounded-xl px-4 py-3.5">
            <div className="w-9 h-9 rounded-lg bg-green-700/60 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <p className="text-green-500 text-xs uppercase tracking-wide">{t('address')}</p>
              <p className="text-white font-semibold text-sm leading-snug">
                {settings.address || 'Toshkent shahar'}
              </p>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-xl overflow-hidden border border-green-700/50 h-40">
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

          {/* Social */}
          <div className="flex gap-2 pb-1">
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
                className="flex-1 flex items-center justify-center gap-2 bg-green-800/60 hover:bg-gold-400 border border-green-700/50 hover:border-gold-400 text-green-300 hover:text-green-900 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
