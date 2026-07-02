'use client';

import { useCartStore } from '@/store/cart';
import { useLangStore } from '@/store/lang';
import { useT } from '@/lib/i18n';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function formatPrice(p: number) {
  return new Intl.NumberFormat('uz-UZ').format(p);
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, addItem, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();
  const { lang } = useLangStore();
  const t = useT(lang);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-green-700">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold-300" />
            <h2 className="font-serif text-lg font-bold text-white">{t('cart')}</h2>
            {items.length > 0 && (
              <span className="bg-gold-400 text-green-900 text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-300 hover:text-red-200 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {t('clearCart')}
              </button>
            )}
            <button
              onClick={closeCart}
              className="p-1.5 text-green-200 hover:text-white rounded-lg hover:bg-green-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-green-300" />
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-lg">{t('emptyCart')}</p>
                <p className="text-gray-400 text-sm mt-1">{t('emptyCartDesc')}</p>
              </div>
              <Link
                href="/menu"
                onClick={closeCart}
                className="bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-green-600 transition-colors"
              >
                {t('menu')}
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const name =
                lang === 'ru' ? item.dish.name_ru || item.dish.name
                : lang === 'en' ? item.dish.name_en || item.dish.name
                : item.dish.name_uz || item.dish.name;
              return (
                <div key={item.dish.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.dish.image_url}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm leading-tight truncate">{name}</p>
                    <p className="text-green-700 font-semibold text-sm mt-0.5">
                      {formatPrice(item.dish.price * item.quantity)} {t('sum')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-green-100 hover:bg-green-200 text-green-800 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-semibold text-gray-800 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => addItem(item.dish)}
                      className="w-7 h-7 rounded-full bg-green-700 hover:bg-green-600 text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.dish.id)}
                      className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-colors ml-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer total */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 bg-gray-50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-500 text-sm">{t('total')}</span>
              <span className="font-serif text-2xl font-bold text-green-700">
                {formatPrice(totalPrice())} <span className="text-base font-normal text-gray-500">{t('sum')}</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 text-right">{items.reduce((s, i) => s + i.quantity, 0)} {t('items')}</p>
          </div>
        )}
      </div>
    </>
  );
}
