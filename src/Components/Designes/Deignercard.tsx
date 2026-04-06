import React from 'react';
import { Designer } from './types'; // ենթադրենք տիպը այստեղ է

interface DesignerCardProps {
  designer: Designer;
}

const DesignerCard: React.FC<DesignerCardProps> = ({ designer }) => (
  <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-4 flex flex-col cursor-pointer border border-gray-100 h-full">
    <div className="w-full aspect-[16/10] bg-gray-50 rounded-lg overflow-hidden mb-3 sm:mb-4 border border-gray-50">
      <img 
        src={designer.logo} 
        alt={designer.title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    
    <div className="flex flex-col gap-1.5 sm:gap-2">
      <h3 className="text-[12px] sm:text-[13px] font-bold text-gray-900 uppercase leading-tight tracking-tight line-clamp-1">
        {designer.title}
      </h3>
      <p className="text-[10px] sm:text-[11px] text-gray-500 leading-relaxed line-clamp-2 min-h-[32px]">
        {designer.description}
      </p>
    </div>
  </div>
);

export default DesignerCard;