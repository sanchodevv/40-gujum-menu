export type Lang = 'uz' | 'ru' | 'en';

type Translations = {
  [key: string]: { uz: string; ru: string; en: string };
};

const t: Translations = {
  // Nav
  home: { uz: 'Bosh sahifa', ru: 'Главная', en: 'Home' },
  menu: { uz: 'Menyu', ru: 'Меню', en: 'Menu' },
  menu2: { uz: 'Menyu 2', ru: 'Меню 2', en: 'Menu 2' },
  feedback: { uz: 'Fikr va takliflar', ru: 'Отзывы', en: 'Feedback' },
  contact: { uz: "Biz bilan bog'lanish", ru: 'Контакты', en: 'Contact' },
  admin: { uz: 'Admin panel', ru: 'Панель администратора', en: 'Admin Panel' },

  // Home
  welcome: { uz: 'Xush kelibsiz', ru: 'Добро пожаловать', en: 'Welcome' },
  popularDishes: { uz: 'Mashhur taomlar', ru: 'Популярные блюда', en: 'Popular dishes' },
  recommendedDishes: { uz: 'Tavsiya etilgan taomlar', ru: 'Рекомендуемые блюда', en: 'Recommended' },
  seeAllMenu: { uz: "To'liq menyuni ko'rish", ru: 'Полное меню', en: 'See full menu' },
  phone: { uz: 'Telefon', ru: 'Телефон', en: 'Phone' },
  address: { uz: 'Manzil', ru: 'Адрес', en: 'Address' },
  workingHours: { uz: 'Ish vaqti', ru: 'Режим работы', en: 'Working hours' },

  // Menu
  searchPlaceholder: { uz: "Taom nomini kiriting...", ru: 'Введите название блюда...', en: 'Search dishes...' },
  all: { uz: 'Barchasi', ru: 'Все', en: 'All' },
  notAvailable: { uz: 'Mavjud emas', ru: 'Недоступно', en: 'Not available' },
  addToCart: { uz: 'Savatchaga qo\'shish', ru: 'В корзину', en: 'Add to cart' },
  noResults: { uz: 'Taom topilmadi', ru: 'Блюда не найдены', en: 'No dishes found' },
  popular: { uz: 'Mashhur', ru: 'Популярное', en: 'Popular' },
  recommended: { uz: 'Tavsiya', ru: 'Рекомендуем', en: 'Recommended' },

  // Cart
  cart: { uz: 'Savatcha', ru: 'Корзина', en: 'Cart' },
  emptyCart: { uz: 'Savatcha bo\'sh', ru: 'Корзина пуста', en: 'Cart is empty' },
  emptyCartDesc: { uz: 'Menyudan taomlarni tanlang', ru: 'Выберите блюда из меню', en: 'Select dishes from the menu' },
  total: { uz: 'Jami', ru: 'Итого', en: 'Total' },
  clearCart: { uz: 'Tozalash', ru: 'Очистить', en: 'Clear' },
  items: { uz: 'ta mahsulot', ru: 'товаров', en: 'items' },
  sum: { uz: "so'm", ru: 'сум', en: 'sum' },

  // Feedback
  feedbackTitle: { uz: 'Fikr va takliflar', ru: 'Отзывы и предложения', en: 'Feedback' },
  feedbackDesc: { uz: "Fikr va takliflaringizni yuboring, biz ularni inobatga olamiz!", ru: 'Отправьте ваши отзывы и предложения, мы их учтём!', en: 'Send your feedback, we will take it into account!' },
  yourName: { uz: 'Ismingiz', ru: 'Ваше имя', en: 'Your name' },
  yourMessage: { uz: 'Xabaringiz', ru: 'Ваше сообщение', en: 'Your message' },
  send: { uz: 'Yuborish', ru: 'Отправить', en: 'Send' },
  sending: { uz: 'Yuborilmoqda...', ru: 'Отправляется...', en: 'Sending...' },
  feedbackSuccess: { uz: 'Xabaringiz yuborildi!', ru: 'Ваше сообщение отправлено!', en: 'Your message was sent!' },
  feedbackError: { uz: 'Xatolik yuz berdi', ru: 'Произошла ошибка', en: 'An error occurred' },

  // Common
  loading: { uz: 'Yuklanmoqda...', ru: 'Загрузка...', en: 'Loading...' },
  piece: { uz: 'dona', ru: 'шт', en: 'pcs' },
  close: { uz: 'Yopish', ru: 'Закрыть', en: 'Close' },
  save: { uz: 'Saqlash', ru: 'Сохранить', en: 'Save' },
  cancel: { uz: 'Bekor qilish', ru: 'Отмена', en: 'Cancel' },
  delete: { uz: "O'chirish", ru: 'Удалить', en: 'Delete' },
  edit: { uz: 'Tahrirlash', ru: 'Редактировать', en: 'Edit' },
  add: { uz: "Qo'shish", ru: 'Добавить', en: 'Add' },
  name: { uz: 'Nomi', ru: 'Название', en: 'Name' },
  description: { uz: 'Tavsif', ru: 'Описание', en: 'Description' },
  price: { uz: 'Narxi', ru: 'Цена', en: 'Price' },
  image: { uz: 'Rasm', ru: 'Фото', en: 'Image' },
  category: { uz: 'Kategoriya', ru: 'Категория', en: 'Category' },
  available: { uz: 'Mavjud', ru: 'Доступно', en: 'Available' },
  scanQR: { uz: 'QR kodni skanlang', ru: 'Сканируйте QR-код', en: 'Scan QR code' },
  goToMenu: { uz: 'Menyuga o\'tish', ru: 'Перейти в меню', en: 'Go to menu' },

  // Admin
  adminTitle: { uz: 'Admin Panel', ru: 'Панель администратора', en: 'Admin Panel' },
  categories: { uz: 'Kategoriyalar', ru: 'Категории', en: 'Categories' },
  dishes: { uz: 'Taomlar', ru: 'Блюда', en: 'Dishes' },
  siteSettings: { uz: 'Sayt sozlamalari', ru: 'Настройки сайта', en: 'Site settings' },
  feedbackList: { uz: 'Fikrlar', ru: 'Отзывы', en: 'Feedback list' },
  login: { uz: 'Kirish', ru: 'Войти', en: 'Login' },
  logout: { uz: 'Chiqish', ru: 'Выйти', en: 'Logout' },
  email: { uz: 'Email', ru: 'Email', en: 'Email' },
  password: { uz: 'Parol', ru: 'Пароль', en: 'Password' },
  loginError: { uz: 'Login yoki parol xato', ru: 'Неверный логин или пароль', en: 'Invalid email or password' },
};

export function useT(lang: Lang) {
  return (key: keyof typeof t): string => {
    return t[key]?.[lang] ?? t[key]?.uz ?? key;
  };
}

export function getDishName(dish: { name: string; name_uz: string; name_ru: string; name_en: string }, lang: Lang): string {
  if (lang === 'ru') return dish.name_ru || dish.name;
  if (lang === 'en') return dish.name_en || dish.name;
  return dish.name_uz || dish.name;
}

export function getDishDesc(dish: { description: string; description_uz: string; description_ru: string; description_en: string }, lang: Lang): string {
  if (lang === 'ru') return dish.description_ru || dish.description;
  if (lang === 'en') return dish.description_en || dish.description;
  return dish.description_uz || dish.description;
}

export function getCategoryName(cat: { name: string; name_uz: string; name_ru: string; name_en: string }, lang: Lang): string {
  if (lang === 'ru') return cat.name_ru || cat.name;
  if (lang === 'en') return cat.name_en || cat.name;
  return cat.name_uz || cat.name;
}
