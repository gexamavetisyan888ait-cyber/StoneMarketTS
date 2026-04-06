import React from 'react';
import { useRealtimeCollection } from "../../lib/hook";
import DesignerCard from "./Deignercard";

export default function DesignersSection() {
  // Հուկին փոխանցում ենք Designer տիպը
  const { data: designers, loading, error } = useRealtimeCollection<any>("db/designes");

  return (
    <div className="bg-[#f3f4f6] py-8 sm:py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">
            Դիզայներներ
          </h2>
        </div>

        {error && <p className="text-center text-red-500">Սխալ տվյալների բեռնման ժամանակ</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-xl" />
              ))
            : designers.map((designer) => (
                <DesignerCard key={designer.id} designer={designer} />
              ))
          }
        </div>

        <div className="flex justify-center">
          <a className="w-full sm:w-auto bg-[#00d084] hover:bg-[#00b070] text-white font-bold py-3 sm:py-2.5 px-10 rounded-md transition-colors text-xs sm:text-sm uppercase tracking-wide" href="/shop">
            Ավելին
          </a>
        </div>
      </div>
    </div>
  );
}