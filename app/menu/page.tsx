'use client';

import { useEffect, useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Category, Dish } from '@/lib/supabase';
import { useLangStore } from '@/store/lang';
import { useT, getCategoryName } from '@/lib/i18n';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import DishCard from '@/components/DishCard';
import { cn } from '@/lib/utils';

export default function MenuPage() {
  const { lang } = useLangStore();
  const t = useT(lang);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    async function load() {
      const [{ data: cats }, { data: dishData }] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('dishes').select('*, categories(*)').order('sort_order'),
      ]);
      if (cats) setCategories(cats.filter((c) => c.name !== 'Barchasi'));
      if (dishData) setDishes(dishData as Dish[]);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return dishes.filter((d) => {
      const nameMatch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.name_uz.toLowerCase().includes(search.toLowerCase()) ||
        d.name_ru.toLowerCase().includes(search.toLowerCase()) ||
        d.name_en.toLowerCase().includes(search.toLowerCase());
      const catMatch = selectedCategory === 'all' || d.category_id === selectedCategory;
      return nameMatch && catMatch;
    });
  }, [dishes, search, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CartDrawer />

      {/* Page header */}
      <div className="bg-green-700 py-12 px-4">
        <div className="max -w-7xl mx-auto text-center">
          <p className="text-oltin-300 text-sm font-semibold uppercase tracking-widest mb-2">★ ★ ★</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">{t('menu')}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + filter row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 sm:hidden">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Filter</span>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
              selectedCategory === 'all'
                ? 'bg-green-700 text-white shadow-lg shadow-green-700/20'
                : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
            )}
          >
            {t('all')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap',
                selectedCategory === cat.id
                  ? 'bg-green-700 text-white shadow-lg shadow-green-700/20'
                  : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
              )}
            >
              {getCategoryName(cat, lang)}
            </button>
          ))}
        </div>

        {/* Dishes grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">{t('noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
