'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ShoppingCart, Menu, X, Globe, ChefHat } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useLangStore } from '@/store/lang';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { Lang } from '@/lib/i18n';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang } = useLangStore();
  const t = useT(lang);
  const { totalItems, openCart } = useCartStore();
  const itemCount = totalItems();

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/menu', label: t('menu') },
    // { href: '/menu2', label: t('menu2') },
  ];

  const langs: { code: Lang; label: string }[] = [
    { code: 'uz', label: "O'z" },
    { code: 'ru', label: 'Ru' },
    { code: 'en', label: 'En' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-green-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-20 h-20  flex items-center justify-center   transition-all">
              <img src="/logo.png" alt="" />
            </div>
            <span className="font-serif text-xl font-bold text-white tracking-wide">Gavhar</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'bg-green-600 text-oltin-400'
                    : 'text-green-100 hover:text-white hover:bg-green-600'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <div className="hidden sm:flex items-center gap-0.5 bg-green-800 rounded-lg p-0.5">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={cn(
                    'px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-200',
                    lang === l.code
                      ? 'bg-oltin-500 text-green-900'
                      : 'text-green-300 hover:text-white'
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Cart button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-1.5 bg-oltin-500 hover:bg-gold-300 text-green-900 font-semibold px-3 py-2 rounded-lg transition-all duration-200 text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">{t('cart')}</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-scale-in">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-green-100 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-green-800 border-t border-green-600 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  pathname === link.href
                    ? 'bg-green-700 text-gold-300'
                    : 'text-green-100 hover:text-white hover:bg-green-700'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-1 pt-2">
              <Globe className="w-4 h-4 text-green-400 mr-1" />
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={cn(
                    'px-3 py-1 text-xs font-semibold rounded-md transition-all',
                    lang === l.code
                      ? 'bg-gold-400 text-green-900'
                      : 'text-green-300 hover:text-white'
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
