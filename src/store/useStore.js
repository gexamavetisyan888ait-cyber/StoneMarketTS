import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
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
export const useFavorite = create(
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