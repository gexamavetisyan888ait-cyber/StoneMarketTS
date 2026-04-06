import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRealtimeCollection } from "../../lib/hook.ts";
import { Heart, ShoppingCart, ChevronLeft, ShieldCheck, Truck } from 'lucide-react';
import { useStore, useFavorite } from "../../store/useStore.ts";

// Սահմանում ենք ապրանքի տիպը (interface)
interface Product {
  id: string;
  title: string;
  img: string;
  price: number | string;
  desc: string;
  code?: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Ենթադրվում է, որ useRealtimeCollection-ը վերադարձնում է Product[] տիպի զանգված
  const { data: products, loading } = useRealtimeCollection<Product>("db/shop");
  
  const [activeImg, setActiveImg] = useState<string | null>(null);

  const product = products?.find((p) => p.id === id);
const cart = useStore((state: any) => state.cart)
const cartL = useFavorite((state: any) => state.cart); 
const addToCart = useStore((state: any) => state.addToCart);
const toggleLike = useFavorite((state: any) => state.addToCartL);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center animate-pulse text-gray-400">
        Բեռնվում է...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center font-sans">
        Ապրանքը չի գտնվել
      </div>
    );
  }

  const isInCart = cart.some((c: Product) => c.id === product.id);
  const isLiked = cartL.some((c: Product) => c.id === product.id);

  return (
    <div className="bg-[#fcfcfc] pb-20 font-sans selection:bg-emerald-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-medium"
        >
          <ChevronLeft size={20} /> Հետ դեպի խանութ
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Պատկերների բաժին */}
          <div className="w-full lg:w-[55%] flex gap-4">
            <div className="hidden md:flex flex-col gap-3">
              {[product.img, product.img].map((image, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImg(image)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImg === image || (!activeImg && idx === 0) 
                      ? 'border-emerald-500' 
                      : 'border-transparent'
                  }`}
                >
                  <img src={image} className="w-full h-full object-cover" alt="thumbnail" />
                </button>
              ))}
            </div>

            <div className="flex-1 aspect-square rounded-[2.5rem] overflow-hidden bg-white shadow-sm border border-gray-100">
              <img 
                src={activeImg || product.img} 
                className="w-full h-full object-contain p-8 hover:scale-105 transition-transform duration-500" 
                alt={product.title} 
              />
            </div>
          </div>

          {/* Ինֆորմացիայի բաժին */}
          <div className="w-full lg:w-[45%] space-y-8">
            <div className="space-y-2">
              <span className="text-emerald-500 font-bold tracking-widest text-sm uppercase">
                Կոդ: {product.code || "N/A"}
              </span>
              <h1 className="text-4xl font-black text-gray-900 leading-tight">
                {product.title}
              </h1>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-gray-900 tracking-tighter">
                {product.price}
              </span>
              <span className="text-xl font-bold text-gray-500 italic">ԴՐ.</span>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wider border-b pb-2 text-emerald-600">
                Նկարագրություն
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.desc}
              </p>
            </div>

            {/* Գործողությունների կոճակներ */}
            <div className="pt-6 space-y-4">
              <div className="flex gap-4">
                <button 
                  onClick={() => addToCart(product)}
                  className={`flex-[4] py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 ${
                    isInCart 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-[#00d285] hover:bg-[#00bc77] text-white shadow-emerald-100'
                  }`}
                >
                  <ShoppingCart size={24} />
                  {isInCart ? "ԱՎԵԼԱՑՎԱԾ Է" : "ԱՎԵԼԱՑՆԵԼ ԶԱՄԲՅՈՒՂ"}
                </button>

                <button 
                  onClick={() => toggleLike(product)}
                  className={`flex-1 flex items-center justify-center rounded-2xl border-2 transition-all ${
                    isLiked 
                      ? 'border-red-500 bg-red-50 text-red-500' 
                      : 'border-gray-200 text-gray-400 hover:border-red-400 hover:text-red-400'
                  }`}
                >
                  <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* Առավելություններ */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Truck size={20}/></div>
                <span className="text-xs font-bold text-gray-500 uppercase">Արագ <br/> Առաքում</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ShieldCheck size={20}/></div>
                <span className="text-xs font-bold text-gray-500 uppercase">Որակի <br/> Երաշխիք</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;