'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLangStore } from '@/store/lang';
import { useT } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import { Send, MessageCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FeedbackPage() {
  const { lang } = useLangStore();
  const t = useT(lang);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setStatus('sending');
    setError('');

    try {
      const { error: dbErr } = await supabase.from('feedback').insert({ name: name.trim(), message: message.trim() });
      if (dbErr) throw dbErr;

      // Send to Telegram edge function (best-effort)
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ name: name.trim(), message: message.trim() }),
        });
      } catch {}

      setStatus('success');
      setName('');
      setMessage('');
    } catch (err: any) {
      setStatus('error');
      setError(t('feedbackError'));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CartDrawer />

      <div className="bg-green-700 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gold-300 text-sm font-semibold uppercase tracking-widest mb-2">✉ ✉ ✉</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">{t('feedbackTitle')}</h1>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
        {status === 'success' ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">{t('feedbackSuccess')}</h2>
            <p className="text-gray-500 text-sm mb-8">Xabaringiz adminga yuborildi.</p>
            <button
              onClick={() => setStatus('idle')}
              className="bg-green-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
            >
              Yangi xabar yozish
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900">{t('feedbackTitle')}</h2>
                <p className="text-gray-400 text-sm">{t('feedbackDesc')}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('yourName')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ism Familiya"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('yourMessage')}</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="Fikr yoki taklifingizni yozing..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all focus:bg-white resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending' || !name.trim() || !message.trim()}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200',
                  status === 'sending' || !name.trim() || !message.trim()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-700 hover:bg-green-600 text-white active:scale-[0.98] shadow-lg shadow-green-700/20'
                )}
              >
                <Send className="w-4 h-4" />
                {status === 'sending' ? t('sending') : t('send')}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
