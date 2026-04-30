export type ShopItemType = "AVATAR" | "BORDER" | "TITLE";

export interface ShopItem {
  id: string;
  name: string;
  type: ShopItemType;
  price: number;
  src?: string;
  cssClass?: string;
  text?: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  // AVATARS
  { id: "avatar_lion", name: "Арыстан", type: "AVATAR", price: 100, src: "https://api.dicebear.com/7.x/bottts/svg?seed=lion" },
  { id: "avatar_unicorn", name: "Жалғызмүйіз", type: "AVATAR", price: 200, src: "https://api.dicebear.com/7.x/bottts/svg?seed=unicorn" },
  { id: "avatar_robot", name: "Ақылды Робот", type: "AVATAR", price: 300, src: "https://api.dicebear.com/7.x/bottts/svg?seed=robot" },
  { id: "avatar_ninja", name: "Жылдам Ниндзя", type: "AVATAR", price: 500, src: "https://api.dicebear.com/7.x/bottts/svg?seed=ninja" },
  
  // BORDERS
  { id: "border_silver", name: "Күміс шеңбер", type: "BORDER", price: 150, cssClass: "ring-4 ring-slate-300 ring-offset-2" },
  { id: "border_gold", name: "Алтын шеңбер", type: "BORDER", price: 400, cssClass: "ring-4 ring-yellow-400 ring-offset-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" },
  { id: "border_fire", name: "Жалын шеңбері", type: "BORDER", price: 800, cssClass: "ring-4 ring-red-500 ring-offset-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.9)]" },

  // TITLES
  { id: "title_starter", name: "Жас Зерттеуші", type: "TITLE", price: 50, text: "Жас Зерттеуші 🔍" },
  { id: "title_scholar", name: "Оқымысты Ғалым", type: "TITLE", price: 300, text: "Оқымысты Ғалым 🎓" },
  { id: "title_champion", name: "Абсолют Чемпион", type: "TITLE", price: 1000, text: "Абсолют Чемпион 🏆" },
];
