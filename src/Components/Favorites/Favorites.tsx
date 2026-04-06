import React from 'react';
import { useStore, } from "../../store/useStore"; // Ներմուծիր Product տիպը
// import ProductCards from '../Shop/ProductCards';

export default function Favorite() {
  // TypeScript-ը հիմա գիտի state-ի տիպը, քանի որ useStore-ը սահմանված է <CartState> Generic-ով
  // const myCart = useStore((state) => state.cart);

  return (
    <div className="bg-[#f8f9fa] md:px-20 py-4 font-sans">
      <div className="mx-auto max-w-8xl">
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-800">Իմ Զամբյուղը</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
        </div>
      </div>
    </div>
  );
}