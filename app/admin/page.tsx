'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Category, Dish, Feedback, SiteSettings } from '@/lib/supabase';
import {
  ChefHat, LogOut, LayoutGrid, UtensilsCrossed, Settings, MessageSquare,
  Plus, Pencil, Trash2, Check, X, Search, ToggleLeft, ToggleRight, Star, Sparkles, Save,
  Eye, EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';

function formatPrice(p: number) {
  return new Intl.NumberFormat('uz-UZ').format(p);
}

type Tab = 'categories' | 'dishes' | 'settings' | 'feedback';

// ── Category form ──────────────────────────────────────────────────────────
function CategoryForm({ cat, onSave, onCancel }: {
  cat?: Category | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [nameUz, setNameUz] = useState(cat?.name_uz || '');
  const [nameRu, setNameRu] = useState(cat?.name_ru || '');
  const [nameEn, setNameEn] = useState(cat?.name_en || '');
  const [order, setOrder] = useState(String(cat?.sort_order ?? 0));
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!nameUz.trim()) return;
    setSaving(true);
    const payload = { name: nameUz, name_uz: nameUz, name_ru: nameRu, name_en: nameEn, sort_order: Number(order) };
    if (cat) {
      await supabase.from('categories').update(payload).eq('id', cat.id);
    } else {
      await supabase.from('categories').insert(payload);
    }
    setSaving(false);
    onSave();
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
      <h3 className="font-semibold text-gray-900">{cat ? 'Kategoriyani tahrirlash' : "Yangi kategoriya qo'shish"}</h3>
      <div className="grid sm:grid-cols-3 gap-3">
        {[['O\'zbek nomi', nameUz, setNameUz], ['Rus nomi', nameRu, setNameRu], ['Ingliz nomi', nameEn, setNameEn]].map(([label, val, setter]) => (
          <div key={label as string}>
            <label className="block text-xs font-medium text-gray-500 mb-1">{label as string}</label>
            <input
              type="text"
              value={val as string}
              onChange={(e) => (setter as any)(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        ))}
      </div>
      <div className="w-24">
        <label className="block text-xs font-medium text-gray-500 mb-1">Tartib</label>
        <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
      </div>
      <div className="flex gap-2">
        <button onClick={save} disabled={saving || !nameUz.trim()} className="flex items-center gap-1.5 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors">
          <Save className="w-4 h-4" />{saving ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
        <button onClick={onCancel} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors">Bekor</button>
      </div>
    </div>
  );
}

// ── Dish form ──────────────────────────────────────────────────────────────
function DishForm({ dish, categories, onSave, onCancel }: {
  dish?: Dish | null;
  categories: Category[];
  onSave: () => void;
  onCancel: () => void;
}) {
  const [f, setF] = useState({
    name_uz: dish?.name_uz || '',
    name_ru: dish?.name_ru || '',
    name_en: dish?.name_en || '',
    description_uz: dish?.description_uz || '',
    description_ru: dish?.description_ru || '',
    description_en: dish?.description_en || '',
    price: String(dish?.price || ''),
    image_url: dish?.image_url || '',
    category_id: dish?.category_id || '',
    is_available: dish?.is_available ?? true,
    is_popular: dish?.is_popular ?? false,
    is_recommended: dish?.is_recommended ?? false,
    sort_order: String(dish?.sort_order ?? 0),
  });
  const [saving, setSaving] = useState(false);

  const set = (key: string, val: any) => setF((p) => ({ ...p, [key]: val }));

  async function save() {
    if (!f.name_uz.trim() || !f.price) return;
    setSaving(true);
    const payload = {
      name: f.name_uz,
      name_uz: f.name_uz,
      name_ru: f.name_ru,
      name_en: f.name_en,
      description: f.description_uz,
      description_uz: f.description_uz,
      description_ru: f.description_ru,
      description_en: f.description_en,
      price: parseFloat(f.price),
      image_url: f.image_url,
      category_id: f.category_id || null,
      is_available: f.is_available,
      is_popular: f.is_popular,
      is_recommended: f.is_recommended,
      sort_order: Number(f.sort_order),
      updated_at: new Date().toISOString(),
    };
    if (dish) {
      await supabase.from('dishes').update(payload).eq('id', dish.id);
    } else {
      await supabase.from('dishes').insert(payload);
    }
    setSaving(false);
    onSave();
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
      <h3 className="font-semibold text-gray-900">{dish ? 'Taomni tahrirlash' : "Yangi taom qo'shish"}</h3>

      <div className="grid sm:grid-cols-3 gap-3">
        {[["O'zbek nomi *", 'name_uz'], ['Rus nomi', 'name_ru'], ['Ingliz nomi', 'name_en']].map(([label, key]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
            <input type="text" value={(f as any)[key]} onChange={(e) => set(key, e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {[["O'zbek tavsifi", 'description_uz'], ['Rus tavsifi', 'description_ru'], ['Ingliz tavsifi', 'description_en']].map(([label, key]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
            <textarea value={(f as any)[key]} onChange={(e) => set(key, e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 resize-none" />
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Narxi (so'm) *</label>
          <input type="number" value={f.price} onChange={(e) => set('price', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Kategoriya</label>
          <select value={f.category_id} onChange={(e) => set('category_id', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white">
            <option value="">— tanlang —</option>
            {categories.filter(c => c.name !== 'Barchasi').map((c) => (
              <option key={c.id} value={c.id}>{c.name_uz}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tartib</label>
          <input type="number" value={f.sort_order} onChange={(e) => set('sort_order', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Rasm URL</label>
        <input type="url" value={f.image_url} onChange={(e) => set('image_url', e.target.value)} placeholder="https://images.pexels.com/..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
        {f.image_url && (
          <img src={f.image_url} alt="" className="mt-2 h-20 w-32 object-cover rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {[
          ['is_available', 'Mavjud', ToggleRight],
          ['is_popular', 'Mashhur', Star],
          ['is_recommended', 'Tavsiya', Sparkles],
        ].map(([key, label, Icon]) => (
          <label key={key as string} className="flex items-center gap-2 cursor-pointer">
            <button
              type="button"
              onClick={() => set(key as string, !(f as any)[key as string])}
              className={cn(
                'w-10 h-6 rounded-full transition-all duration-200 relative flex-shrink-0',
                (f as any)[key as string] ? 'bg-green-600' : 'bg-gray-200'
              )}
            >
              <span className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200', (f as any)[key as string] ? 'translate-x-4' : 'translate-x-0.5')} />
            </button>
            <span className="text-sm text-gray-700">{label as string}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={save} disabled={saving || !f.name_uz.trim() || !f.price} className="flex items-center gap-1.5 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors">
          <Save className="w-4 h-4" />{saving ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
        <button onClick={onCancel} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors">Bekor</button>
      </div>
    </div>
  );
}

// ── Main Admin ─────────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('dishes');

  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings[]>([]);
  const [settingsEdits, setSettingsEdits] = useState<Record<string, string>>({});

  const [dishSearch, setDishSearch] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null | 'new'>(null);
  const [editingDish, setEditingDish] = useState<Dish | null | 'new'>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.push('/admin/login'); return; }
      setUser(data.session.user);
      setLoading(false);
    });
  }, []);

  const loadData = useCallback(async () => {
    const [{ data: cats }, { data: d }, { data: fb }, { data: ss }] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('dishes').select('*').order('sort_order'),
      supabase.from('feedback').select('*').order('created_at', { ascending: false }),
      supabase.from('site_settings').select('*').order('key'),
    ]);
    if (cats) setCategories(cats);
    if (d) setDishes(d);
    if (fb) setFeedbacks(fb);
    if (ss) {
      setSiteSettings(ss);
      const map: Record<string, string> = {};
      ss.forEach((s) => { map[s.key] = s.value; });
      setSettingsEdits(map);
    }
  }, []);

  useEffect(() => { if (!loading) loadData(); }, [loading]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  async function deleteCategory(id: string) {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    await supabase.from('categories').delete().eq('id', id);
    loadData();
  }

  async function deleteDish(id: string) {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    await supabase.from('dishes').delete().eq('id', id);
    loadData();
  }

  async function toggleDishAvailability(dish: Dish) {
    await supabase.from('dishes').update({ is_available: !dish.is_available }).eq('id', dish.id);
    loadData();
  }

  async function saveSettings() {
    setSavingSettings(true);
    const updates = Object.entries(settingsEdits).map(([key, value]) =>
      supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' })
    );
    await Promise.all(updates);
    setSavingSettings(false);
  }

  async function deleteFeedback(id: string) {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    await supabase.from('feedback').delete().eq('id', id);
    loadData();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filteredDishes = dishes.filter((d) =>
    d.name.toLowerCase().includes(dishSearch.toLowerCase()) ||
    d.name_uz.toLowerCase().includes(dishSearch.toLowerCase())
  );

  const tabs: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: 'dishes', label: 'Taomlar', icon: UtensilsCrossed, count: dishes.length },
    { id: 'categories', label: 'Kategoriyalar', icon: LayoutGrid, count: categories.length },
    { id: 'settings', label: 'Sozlamalar', icon: Settings },
    { id: 'feedback', label: 'Fikrlar', icon: MessageSquare, count: feedbacks.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-700 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold-400 flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-green-900" />
              </div>
              <span className="font-serif text-lg font-bold text-white">Admin Panel</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-200 text-sm hidden sm:block">{user?.email}</span>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-green-200 hover:text-white text-sm transition-colors">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Chiqish</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                  tab === t.id ? 'bg-green-700 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <Icon className="w-4 h-4" />
                {t.label}
                {t.count !== undefined && (
                  <span className={cn('text-xs px-1.5 py-0.5 rounded-full', tab === t.id ? 'bg-green-600 text-green-100' : 'bg-gray-100 text-gray-500')}>
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── DISHES ── */}
        {tab === 'dishes' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={dishSearch} onChange={(e) => setDishSearch(e.target.value)} placeholder="Taom qidirish..." className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-600" />
              </div>
              <button onClick={() => setEditingDish('new')} className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />Yangi taom
              </button>
            </div>

            {editingDish && (
              <DishForm
                dish={editingDish === 'new' ? null : editingDish}
                categories={categories}
                onSave={() => { setEditingDish(null); loadData(); }}
                onCancel={() => setEditingDish(null)}
              />
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Taom</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Kategoriya</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Narxi</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Holati</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredDishes.map((dish) => {
                    const cat = categories.find((c) => c.id === dish.category_id);
                    return (
                      <tr key={dish.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={dish.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'; }} />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{dish.name_uz}</p>
                              <div className="flex gap-1 mt-0.5">
                                {dish.is_popular && <span className="text-xs text-gold-500">★</span>}
                                {dish.is_recommended && <span className="text-xs text-green-600">✦</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-sm text-gray-500">{cat?.name_uz || '—'}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-medium text-green-700 text-sm">{formatPrice(dish.price)}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => toggleDishAvailability(dish)} className="transition-colors">
                            {dish.is_available
                              ? <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full"><Check className="w-3 h-3" />Mavjud</span>
                              : <span className="inline-flex items-center gap-1 bg-red-50 text-red-500 text-xs font-medium px-2 py-1 rounded-full"><X className="w-3 h-3" />Yo'q</span>
                            }
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 justify-end">
                            <button onClick={() => setEditingDish(dish)} className="p-1.5 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteDish(dish.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredDishes.length === 0 && (
                <div className="text-center py-12 text-gray-400">Taom topilmadi</div>
              )}
            </div>
          </div>
        )}

        {/* ── CATEGORIES ── */}
        {tab === 'categories' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={() => setEditingCategory('new')} className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />Yangi kategoriya
              </button>
            </div>

            {editingCategory && (
              <CategoryForm
                cat={editingCategory === 'new' ? null : editingCategory}
                onSave={() => { setEditingCategory(null); loadData(); }}
                onCancel={() => setEditingCategory(null)}
              />
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{cat.name_uz}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{cat.name_ru} / {cat.name_en}</p>
                    <p className="text-xs text-gray-300 mt-0.5">Tartib: {cat.sort_order}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => setEditingCategory(cat)} className="p-2 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteCategory(cat.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {tab === 'settings' && (
          <div className="max-w-2xl space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-semibold text-gray-900">Sayt ma'lumotlari</h3>
              {[
                ['phone', 'Telefon raqami'],
                ['address', 'Manzil'],
                ['working_hours', 'Ish vaqti'],
                ['instagram', 'Instagram havolasi'],
                ['telegram', 'Telegram havolasi'],
                ['youtube', 'YouTube havolasi'],
                ['banner_title', 'Banner sarlavha'],
                ['banner_subtitle', 'Banner tavsif'],
                ['map_url', 'Xarita embed URL'],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  {key === 'map_url' ? (
                    <textarea
                      rows={3}
                      value={settingsEdits[key] || ''}
                      onChange={(e) => setSettingsEdits((p) => ({ ...p, [key]: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={settingsEdits[key] || ''}
                      onChange={(e) => setSettingsEdits((p) => ({ ...p, [key]: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  )}
                </div>
              ))}
              <button
                onClick={saveSettings}
                disabled={savingSettings}
                className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {savingSettings ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </div>
          </div>
        )}

        {/* ── FEEDBACK ── */}
        {tab === 'feedback' && (
          <div className="space-y-3">
            {feedbacks.length === 0 ? (
              <div className="text-center py-16 text-gray-400">Hozircha fikrlar yo'q</div>
            ) : (
              feedbacks.map((fb) => (
                <div key={fb.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm">
                          {fb.name[0]?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">{fb.name}</span>
                        <span className="text-xs text-gray-400">{new Date(fb.created_at).toLocaleDateString('uz-UZ')}</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{fb.message}</p>
                    </div>
                    <button onClick={() => deleteFeedback(fb.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
