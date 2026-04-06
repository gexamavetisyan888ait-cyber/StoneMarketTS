import React from 'react';
import { useRealtimeCollection } from "../../lib/hook";
import ProductCard from "./ProductCard";

export default function StoneMarketGrid() {
  const { data: products, loading, error } = useRealtimeCollection<any>("db/shop");

  if (error) return <div className="py-20 text-center text-red-500">Սխալ տվյալների բեռնման ժամանակ: {error}</div>;

  return (
    <div className="bg-[#f8f9fa] md:px-20 py-4 font-sans">
      <div className="mx-auto max-w-8xl">
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-800">Stone Market</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
        </div>
        
        {!loading && products.length === 0 && (
          <p className="text-center py-20 text-gray-400">Ապրանքներ չեն գտնվել:</p>
        )}
      </div>
    </div>
  );
}