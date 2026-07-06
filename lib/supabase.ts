import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Category = {
  id: string;
  name: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  sort_order: number;
  created_at: string;
};

export type Dish = {
  id: string;
  name: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  description: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  price: number;
  image_url: string;
  category_id: string | null;
  is_available: boolean;
  is_popular: boolean;
  is_recommended: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  categories?: Category;
};

export type SiteSettings = {
  id: string;
  key: string;
  value: string;
};

export type Feedback = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};
