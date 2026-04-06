import React from "react";
import { useRealtimeCollection } from "../../lib/hook";

// Սահմանում ենք կատեգորիայի տիպը
interface Category {
  id: string;
  name: string;
  icon: string;
}

export default function Sidebar() {
  const {
    data: menuItems,
    loading,
    error,
  } = useRealtimeCollection<Category>("db/categories");

  if (loading) return <div className="p-6 text-gray-400 animate-pulse">Բեռնվում է...</div>;
  if (error) return <div className="p-6 text-red-400">Սխալ տեղի ունեցավ</div>;

  return (
    <div className="bg-white w-full lg:w-80 rounded-2xl shadow-sm p-6 space-y-4 h-fit">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
        Կատեգորիաներ
      </h3>
      {menuItems?.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 text-gray-700 hover:text-emerald-500 transition-all cursor-pointer p-3 hover:bg-gray-50 rounded-xl"
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="font-semibold text-sm md:text-base">
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}