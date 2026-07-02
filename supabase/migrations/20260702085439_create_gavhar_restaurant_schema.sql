/*
# Gavhar Restaurant Schema

## Overview
Complete schema for Gavhar Restaurant online menu website.

## Tables

### 1. categories
Stores dish categories (Salatlar, Milliy taomlar, etc.)
- id: uuid primary key
- name: category name
- name_uz, name_ru, name_en: multilingual names
- sort_order: display order
- created_at: timestamp

### 2. dishes
Stores all menu items with full details
- id: uuid primary key
- name, name_uz, name_ru, name_en: multilingual names
- description, description_uz, description_ru, description_en: multilingual descriptions
- price: decimal price
- image_url: photo URL
- category_id: FK to categories
- is_available: availability status
- is_popular: featured as popular dish
- is_recommended: featured as recommended
- sort_order: display order
- created_at, updated_at: timestamps

### 3. site_settings
Key-value store for site configuration (phone, address, social links, etc.)
- id: uuid primary key
- key: setting key
- value: setting value
- created_at, updated_at: timestamps

### 4. feedback
Customer feedback/suggestions
- id: uuid primary key
- name: sender name
- message: feedback message
- created_at: timestamp

## Security
RLS enabled on all tables. Anon + authenticated access for public-facing tables.
Admin write operations via authenticated role (simple approach: all authenticated users are admins).
*/

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_uz text NOT NULL DEFAULT '',
  name_ru text NOT NULL DEFAULT '',
  name_en text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_categories" ON categories;
CREATE POLICY "auth_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_categories" ON categories;
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_categories" ON categories;
CREATE POLICY "auth_delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

-- DISHES
CREATE TABLE IF NOT EXISTS dishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_uz text NOT NULL DEFAULT '',
  name_ru text NOT NULL DEFAULT '',
  name_en text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  description_uz text NOT NULL DEFAULT '',
  description_ru text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  price decimal(10,2) NOT NULL DEFAULT 0,
  image_url text NOT NULL DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  is_available boolean NOT NULL DEFAULT true,
  is_popular boolean NOT NULL DEFAULT false,
  is_recommended boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS dishes_category_id_idx ON dishes(category_id);
CREATE INDEX IF NOT EXISTS dishes_is_available_idx ON dishes(is_available);

ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_dishes" ON dishes;
CREATE POLICY "anon_select_dishes" ON dishes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_dishes" ON dishes;
CREATE POLICY "auth_insert_dishes" ON dishes FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_dishes" ON dishes;
CREATE POLICY "auth_update_dishes" ON dishes FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_dishes" ON dishes;
CREATE POLICY "auth_delete_dishes" ON dishes FOR DELETE
  TO authenticated USING (true);

-- SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_settings" ON site_settings;
CREATE POLICY "anon_select_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_settings" ON site_settings;
CREATE POLICY "auth_insert_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_settings" ON site_settings;
CREATE POLICY "auth_update_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_settings" ON site_settings;
CREATE POLICY "auth_delete_settings" ON site_settings FOR DELETE
  TO authenticated USING (true);

-- FEEDBACK
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_feedback" ON feedback;
CREATE POLICY "anon_insert_feedback" ON feedback FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_feedback" ON feedback;
CREATE POLICY "auth_select_feedback" ON feedback FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_delete_feedback" ON feedback;
CREATE POLICY "auth_delete_feedback" ON feedback FOR DELETE
  TO authenticated USING (true);

-- SEED DEFAULT SITE SETTINGS
INSERT INTO site_settings (key, value) VALUES
  ('phone', '+998 90 123 45 67'),
  ('address', 'Urganch shahar, Mustaqillik kochasi'),
  ('working_hours', '10:00 - 23:00'),
  ('instagram', 'https://www.instagram.com/40_gujum/'),
  ('telegram', 'https://t.me/sanjarkomiIov'),
  ('youtube', 'https://youtube.com/@40-gujum_restaurant'),
  ('map_url', 'https://www.google.com/maps/place/40+Guzhum+%D0%A3%D1%80%D0%B3%D0%B5%D0%BD%D1%87+%D0%97%D0%B0%D0%BF%D1%87%D0%B0%D1%81%D1%82+%D0%B1%D0%BE%D0%B7%D0%BE%D1%80/@41.5750634,60.6065743,729m/data=!3m1!1e3!4m6!3m5!1s0x41dfc9d0c963ae9f:0xf4c738475489c252!8m2!3d41.5750695!4d60.6042481!16s%2Fg%2F11pcpxswly?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D'),
  ('banner_title', '40-gujum Restaurant'),
  ('banner_subtitle', 'Milliy va xalqaro taomlar dunyosiga xush kelibsiz')
ON CONFLICT (key) DO NOTHING;

-- SEED CATEGORIES
INSERT INTO categories (name, name_uz, name_ru, name_en, sort_order) VALUES
  ('Barchasi', 'Barchasi', 'Все', 'All', 0),
  ('Salatlar', 'Salatlar', 'Салаты', 'Salads', 1),
  ('Milliy taomlar', 'Milliy taomlar', 'Национальные блюда', 'National dishes', 2),
  ('Kaboblar', 'Kaboblar', 'Кебабы', 'Kebabs', 3),
  ('Fast Food', 'Fast Food', 'Фаст-фуд', 'Fast Food', 4),
  ('Ichimliklar', 'Ichimliklar', 'Напитки', 'Drinks', 5),
  ('Shirinliklar', 'Shirinliklar', 'Десерты', 'Desserts', 6)
ON CONFLICT DO NOTHING;

-- SEED SAMPLE DISHES
DO $$
DECLARE
  cat_salatlar uuid;
  cat_milliy uuid;
  cat_kaboblar uuid;
  cat_fastfood uuid;
  cat_ichimlik uuid;
  cat_shirin uuid;
BEGIN
  SELECT id INTO cat_salatlar FROM categories WHERE name = 'Salatlar' LIMIT 1;
  SELECT id INTO cat_milliy FROM categories WHERE name = 'Milliy taomlar' LIMIT 1;
  SELECT id INTO cat_kaboblar FROM categories WHERE name = 'Kaboblar' LIMIT 1;
  SELECT id INTO cat_fastfood FROM categories WHERE name = 'Fast Food' LIMIT 1;
  SELECT id INTO cat_ichimlik FROM categories WHERE name = 'Ichimliklar' LIMIT 1;
  SELECT id INTO cat_shirin FROM categories WHERE name = 'Shirinliklar' LIMIT 1;

  INSERT INTO dishes (name, name_uz, name_ru, name_en, description, description_uz, description_ru, description_en, price, image_url, category_id, is_popular, is_recommended) VALUES
    ('Toshkent salati', 'Toshkent salati', 'Ташкентский салат', 'Tashkent Salad', 'Yangi sabzavotlar va go''sht bilan tayyorlangan milliy salat', 'Yangi sabzavotlar va go''sht bilan tayyorlangan milliy salat', 'Национальный салат из свежих овощей и мяса', 'Traditional salad with fresh vegetables and meat', 35000, 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg', cat_salatlar, true, false),
    ('Gruziya salati', 'Gruziya salati', 'Грузинский салат', 'Georgian Salad', 'Pomidor, bodring va yong''oq bilan tayyorlangan salat', 'Pomidor, bodring va yong''oq bilan tayyorlangan salat', 'Салат с томатами, огурцами и грецкими орехами', 'Salad with tomatoes, cucumbers and walnuts', 28000, 'https://images.pexels.com/photos/2116094/pexels-photo-2116094.jpeg', cat_salatlar, false, true),
    ('Osh (Plov)', 'Osh (Plov)', 'Плов', 'Uzbek Plov', 'An''anaviy o''zbek oshi - guruch, go''sht va sabzavotlar bilan', 'An''anaviy o''zbek oshi - guruch, go''sht va sabzavotlar bilan', 'Традиционный узбекский плов с мясом и овощами', 'Traditional Uzbek rice dish with meat and vegetables', 45000, 'https://images.pexels.com/photos/7353380/pexels-photo-7353380.jpeg', cat_milliy, true, true),
    ('Lagʻmon', 'Lagʻmon', 'Лагман', 'Lagman', 'El qo''li bilan tortilgan noodle va go''sht bilan', 'El qo''li bilan tortilgan noodle va go''sht bilan', 'Лапша ручной вытяжки с мясом и овощами', 'Hand-pulled noodles with meat and vegetables', 38000, 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg', cat_milliy, true, false),
    ('Shurva', 'Shurva', 'Шурпа', 'Shorva', 'Qo''zi go''shti va sabzavotlardan tayyorlangan milliy sho''rva', 'Qo''zi go''shti va sabzavotlardan tayyorlangan milliy sho''rva', 'Национальный суп из баранины с овощами', 'Traditional lamb soup with vegetables', 32000, 'https://images.pexels.com/photos/6287447/pexels-photo-6287447.jpeg', cat_milliy, false, true),
    ('Qozon kabob', 'Qozon kabob', 'Казан-кебаб', 'Kazan Kebab', 'Qozonda pishirilgan mol go''shti kabob', 'Qozonda pishirilgan mol go''shti kabob', 'Говяжий кебаб, приготовленный в казане', 'Beef kebab cooked in a cauldron', 55000, 'https://images.pexels.com/photos/5765839/pexels-photo-5765839.jpeg', cat_kaboblar, true, true),
    ('Tandır kabob', 'Tandır kabob', 'Тандырный кебаб', 'Tandoor Kebab', 'Tandırda pishirilgan qo''zi kabob', 'Tandırda pishirilgan qo''zi kabob', 'Ягненок, запечённый в тандыре', 'Lamb baked in a tandoor oven', 62000, 'https://images.pexels-photo-1640774.jpeg', cat_kaboblar, false, false),
    ('Burger', 'Burger', 'Бургер', 'Burger', 'Mol go''shti kotlet, toza sabzavotlar va maxsus sous bilan', 'Mol go''shti kotlet, toza sabzavotlar va maxsus sous bilan', 'Котлета из говядины со свежими овощами и соусом', 'Beef patty with fresh vegetables and special sauce', 42000, 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg', cat_fastfood, true, false),
    ('Pizza Margarita', 'Pizza Margarita', 'Пицца Маргарита', 'Pizza Margherita', 'Klassik italyan pizzasi - pomidor sousi va mozzarella bilan', 'Klassik italyan pizzasi - pomidor sousi va mozzarella bilan', 'Классическая итальянская пицца с томатным соусом и моцареллой', 'Classic Italian pizza with tomato sauce and mozzarella', 58000, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', cat_fastfood, false, true),
    ('Limonad', 'Limonad', 'Лимонад', 'Lemonade', 'Yangi limon, na''na va shakar siropidan tayyorlangan ichimlik', 'Yangi limon, na''na va shakar siropidan tayyorlangan ichimlik', 'Напиток из свежих лимонов, мяты и сахарного сиропа', 'Fresh lemon, mint and sugar syrup drink', 18000, 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg', cat_ichimlik, true, false),
    ('Ko''k choy', 'Ko''k choy', 'Зелёный чай', 'Green Tea', 'Yashil choy - an''anaviy o''zbek uslubida', 'Yashil choy - an''anaviy o''zbek uslubida', 'Зелёный чай по-узбекски', 'Green tea in traditional Uzbek style', 8000, 'https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg', cat_ichimlik, false, false),
    ('Tiramisu', 'Tiramisu', 'Тирамису', 'Tiramisu', 'Klassik italyan desserti - mascarpone va espresso bilan', 'Klassik italyan desserti - mascarpone va espresso bilan', 'Классический итальянский десерт с маскарпоне и эспрессо', 'Classic Italian dessert with mascarpone and espresso', 35000, 'https://images.pexels.com/photos/5663882/pexels-photo-5663882.jpeg', cat_shirin, true, true),
    ('Halva', 'Halva', 'Халва', 'Halva', 'An''anaviy o''zbek halvasi - yong''oq va asaldan tayyorlangan', 'An''anaviy o''zbek halvasi - yong''oq va asaldan tayyorlangan', 'Традиционная узбекская халва с орехами и мёдом', 'Traditional Uzbek halva with nuts and honey', 22000, 'https://images.pexels.com/photos/5718025/pexels-photo-5718025.jpeg', cat_shirin, false, true)
  ON CONFLICT DO NOTHING;
END $$;
