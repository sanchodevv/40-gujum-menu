'use client';

import { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Category, Dish } from '@/lib/supabase';
import { useLangStore } from '@/store/lang';
import { useT, getCategoryName, getDishName } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { Plus, Check } from 'lucide-react';

function formatPrice(p: number) {
  return new Intl.NumberFormat('uz-UZ').format(p);
}

function ListDishCard({ dish }: { dish: Dish }) {
  const { addItem } = useCartStore();
  const { lang } = useLangStore();
  const t = useT(lang);
  const [added, setAdded] = useState(false);
  const name = getDishName(dish, lang);

  function handleAdd() {
    if (!dish.is_available) return;
    addItem(dish);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex items-center gap-4 bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={dish.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{name}</h3>
        <p className="text-green-700 font-bold mt-1">{formatPrice(dish.price)} <span className="text-xs font-normal text-gray-400">so'm</span></p>
        {!dish.is_available && (
          <span className="text-xs text-red-500 font-medium">{t('notAvailable')}</span>
        )}
      </div>
      <button
        onClick={handleAdd}
        disabled={!dish.is_available}
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
          dish.is_available
            ? added ? 'bg-green-100 text-green-700' : 'bg-green-700 hover:bg-green-600 text-white active:scale-95'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        )}
      >
        {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function Menu2Page() {
  const { lang } = useLangStore();
  const t = useT(lang);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const [{ data: cats }, { data: dishData }] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('dishes').select('*').order('sort_order'),
      ]);
      if (cats) setCategories(cats.filter((c) => c.name !== 'Barchasi'));
      if (dishData) setDishes(dishData as Dish[]);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return dishes;
    const q = search.toLowerCase();
    return dishes.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.name_uz.toLowerCase().includes(q) ||
        d.name_ru.toLowerCase().includes(q) ||
        d.name_en.toLowerCase().includes(q)
    );
  }, [dishes, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, Dish[]>();
    categories.forEach((c) => {
      const catDishes = filtered.filter((d) => d.category_id === c.id);
      if (catDishes.length > 0) map.set(c.id, catDishes);
    });
    return map;
  }, [filtered, categories]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CartDrawer />

      <div className="bg-green-700 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gold-300 text-sm font-semibold uppercase tracking-widest mb-2">✦ ✦ ✦</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">{t('menu2')}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="relative mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent shadow-sm"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {categories.map((cat) => {
              const catDishes = grouped.get(cat.id);
              if (!catDishes) return null;
              return (
                <div key={cat.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="font-serif text-xl font-bold text-green-800">{getCategoryName(cat, lang)}</h2>
                    <div className="flex-1 h-px bg-green-100" />
                    <span className="text-xs text-gray-400">{catDishes.length} ta</span>
                  </div>
                  <div className="space-y-2.5">
                    {catDishes.map((dish) => (
                      <ListDishCard key={dish.id} dish={dish} />
                    ))}
                  </div>
                </div>
              );
            })}
            {grouped.size === 0 && (
              <div className="text-center py-16 text-gray-400">{t('noResults')}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
