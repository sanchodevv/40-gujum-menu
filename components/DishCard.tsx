'use client';

import { useState } from 'react';
import type { Dish } from '@/lib/supabase';
import { useCartStore } from '@/store/cart';
import { useLangStore } from '@/store/lang';
import { useT, getDishName, getDishDesc } from '@/lib/i18n';
import { Plus, Check, Star, Sparkles, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import DishModal from './DishModal';

function formatPrice(p: number) {
  return new Intl.NumberFormat('uz-UZ').format(p);
}

export default function DishCard({ dish }: { dish: Dish }) {
  const { addItem } = useCartStore();
  const { lang } = useLangStore();
  const t = useT(lang);
  const [added, setAdded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const name = getDishName(dish, lang);
  const desc = getDishDesc(dish, lang);

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    if (!dish.is_available) return;
    addItem(dish);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <>
      <div
        className={cn(
          'group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 cursor-pointer flex flex-col',
          !dish.is_available && 'opacity-70'
        )}
        onClick={() => setShowModal(true)}
      >
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={dish.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {dish.is_popular && (
              <span className="flex items-center gap-1 bg-gold-400 text-green-900 text-xs font-bold px-2 py-0.5 rounded-full shadow">
                <Star className="w-3 h-3 fill-current" />
                {t('popular')}
              </span>
            )}
            {dish.is_recommended && (
              <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                <Sparkles className="w-3 h-3" />
                {t('recommended')}
              </span>
            )}
          </div>
          {!dish.is_available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                {t('notAvailable')}
              </span>
            </div>
          )}
          {/* Info hint */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/50 text-white p-1.5 rounded-full">
              <Info className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{name}</h3>
          {desc && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{desc}</p>
          )}
          <div className="flex items-center justify-between mt-auto gap-2">
            <span className="font-serif text-lg font-bold text-green-700">
              {formatPrice(dish.price)}
              <span className="text-xs font-normal text-gray-400 ml-1">so'm</span>
            </span>
            <button
              onClick={handleAdd}
              disabled={!dish.is_available}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex-shrink-0',
                dish.is_available
                  ? added
                    ? 'bg-green-100 text-green-700'
                    : 'bg-green-700 hover:bg-green-600 text-white active:scale-95'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
            >
              {added ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <DishModal dish={dish} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
