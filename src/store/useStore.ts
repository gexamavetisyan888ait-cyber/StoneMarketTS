import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Սահմանում ենք ապրանքի տիպը
interface Product {
  id: string;
  title: string;
  img: string;
  price: number | string;
  desc: string;
  code?: string;
}

// 2. Սահմանում ենք Store-ի կառուցվածքը (State և Actions)
interface StoreState {
  favorites: Product[];
  cart: Product[];
  getCart: () => Product[];
  getFavorites: () => Product[];
  toggleLike: (product: Product) => void;
  addToCart: (product: Product) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      favorites: [],
      cart: [],

      getCart: () => get().cart,
      getFavorites: () => get().favorites,

      toggleLike: (product) => set((state) => ({
        favorites: state.favorites.some((item) => item.id === product.id)
          ? state.favorites.filter((item) => item.id !== product.id)
          : [...state.favorites, product]
      })),

      addToCart: (product) => set((state) => ({
        cart: state.cart.some((item) => item.id === product.id)
          ? state.cart.filter((item) => item.id !== product.id)
          : [...state.cart, product]
      })),
    }),
    {
      name: 'shopping-storage',
    }
  )
);

// 3. Սահմանում ենք Favorite Store-ի տիպը (եթե առանձին ես պահում)
interface FavoriteState {
  likes: Product[];
  cart: Product[];
  getCart: () => Product[];
  getFavorites: () => Product[];
  addToCartL: (product: Product) => void;
}

export const useFavorite = create<FavoriteState>()(
  persist(
    (set, get) => ({
      likes: [],
      cart: [],

      getCart: () => get().cart,
      getFavorites: () => get().likes,

      addToCartL: (product) => set((state) => ({
        cart: state.cart.some((item) => item.id === product.id)
          ? state.cart.filter((item) => item.id !== product.id)
          : [...state.cart, product]
      })),
    }),
    {
      name: 'shopping-favorite',
    }
  )
);