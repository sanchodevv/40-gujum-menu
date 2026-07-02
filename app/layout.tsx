import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Gavhar Restaurant – Onlayn Menyu',
  description: 'Gavhar Restaurant – Milliy va xalqaro taomlar. Onlayn menyu, narxlar va buyurtma.',
  keywords: ['restoran', 'menyu', 'gavhar', 'uzbek food', 'toshkent'],
  openGraph: {
    title: 'Gavhar Restaurant',
    description: 'Milliy va xalqaro taomlar dunyosiga xush kelibsiz',
    images: [{ url: 'https://images.pexels.com/photos/7353380/pexels-photo-7353380.jpeg' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-background text-foreground">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
