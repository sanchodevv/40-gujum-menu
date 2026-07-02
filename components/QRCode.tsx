'use client';

import { useEffect, useRef } from 'react';
import { X, QrCode } from 'lucide-react';
import { useLangStore } from '@/store/lang';
import { useT } from '@/lib/i18n';

export default function QRCode({ onClose }: { onClose: () => void }) {
  const { lang } = useLangStore();
  const t = useT(lang);
  const menuUrl = typeof window !== 'undefined' ? `${window.location.origin}/menu` : '/menu';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(menuUrl)}&bgcolor=ffffff&color=1a4a2e&qzone=2`;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-8 shadow-2xl animate-scale-in max-w-xs w-full text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center justify-center gap-2 mb-4">
          <QrCode className="w-5 h-5 text-green-700" />
          <h3 className="font-serif text-lg font-bold text-gray-900">{t('scanQR')}</h3>
        </div>
        <div className="bg-green-50 rounded-xl p-4 mb-4 inline-block">
          <img
            src={qrUrl}
            alt="QR Code"
            className="w-52 h-52 mx-auto"
            width={208}
            height={208}
          />
        </div>
        <p className="text-gray-500 text-sm">{t('goToMenu')}</p>
        <p className="text-green-700 text-xs mt-1 font-medium">{menuUrl}</p>
      </div>
    </div>
  );
}
