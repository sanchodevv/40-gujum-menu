'use client';

import { useEffect } from 'react';
import type { Dish } from '@/lib/supabase';
import { useCartStore } from '@/store/cart';
import { useLangStore } from '@/store/lang';
import { useT, getDishName, getDishDesc } from '@/lib/i18n';
import { X, Plus, Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatPrice(p: number) {
  return new Intl.NumberFormat('uz-UZ').format(p);
}

export default function DishModal({ dish, onClose }: { dish: Dish; onClose: () => void }) {
  const { addItem } = useCartStore();
  const { lang } = useLangStore();
  const t = useT(lang);
  const name = getDishName(dish, lang);
  const desc = getDishDesc(dish, lang);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function handleAdd() {
    if (!dish.is_available) return;
    addItem(dish);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
        {/* Image */}
        <div className="relative aspect-video">
          <img
            src={dish.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
            alt={name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          {/* Badges */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            {dish.is_popular && (
              <span className="flex items-center gap-1 bg-gold-400 text-green-900 text-xs font-bold px-2.5 py-1 rounded-full">
                <Star className="w-3 h-3 fill-current" />
                {t('popular')}
              </span>
            )}
            {dish.is_recommended && (
              <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                <Sparkles className="w-3 h-3" />
                {t('recommended')}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">{name}</h2>
          {desc && <p className="text-gray-500 text-sm leading-relaxed mb-4">{desc}</p>}
          {!dish.is_available && (
            <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium px-3 py-2 rounded-lg">
              {t('notAvailable')}
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="font-serif text-3xl font-bold text-green-700">
              {formatPrice(dish.price)}
              <span className="text-base font-normal text-gray-400 ml-1.5">so'm</span>
            </span>
            <button
              onClick={handleAdd}
              disabled={!dish.is_available}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 text-sm',
                dish.is_available
                  ? 'bg-green-700 hover:bg-green-600 text-white active:scale-95'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              <Plus className="w-4 h-4" />
              {t('addToCart')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
