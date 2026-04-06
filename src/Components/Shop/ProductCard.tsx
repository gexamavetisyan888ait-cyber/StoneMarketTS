import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { useRealtimeCollection } from "../../lib/hook";
import ProductCard from "./ProductCards";


export default function StoneMarketGrid() {
  const { data: products, loading } = useRealtimeCollection("db/shop");

  return (
    <div className="bg-[#f8f9fa] md:px-20 py-4 font-sans">
      <div className="mx-auto max-w-8xl">
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-800">Stone Market</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading 
            ? Array(8).fill(0).map((_, i) => <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl" />)
            : products.map(product => <ProductCard key={product.id} item={product} />)
          }
        </div>
      </div>
    </div>
  );
}