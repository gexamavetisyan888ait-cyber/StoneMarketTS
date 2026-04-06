import React from 'react';
import { useFavorite } from "../../store/useStore";
import ProductCards from '../Shop/ProductCards';
import { Product } from '../../store/useStore'; // Ներմուծում ենք տիպը

export default function Favorite() {
  // Եթե useFavorite-ը ճիշտ տիպավորված է create<FavoriteState>()-ով,
  // ապա state-ն արդեն ավտոմատ կճանաչվի: 
  // Եթե ոչ, կարող ես գրել այսպես. (state: any) => state.cart (բայց սա լավ չէ)
  const myCart = useFavorite((state) => state.cart);

  return (
    <div className="bg-[#f8f9fa] md:px-20 py-4 font-sans">
      <div className="mx-auto max-w-8xl">
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-800">
            Իմ Զամբյուղը
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {myCart && myCart.length > 0 ? (
            myCart.map((product: Product) => (
              <ProductCards key={product.id} item={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
               <p className="text-gray-500 text-lg">Զամբյուղը դատարկ է</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}