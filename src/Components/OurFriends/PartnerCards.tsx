import React from 'react';

interface PartnerCardProps {
    logo: string;
    name: string;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ logo, name }) => (
    <div className="group bg-white rounded-md shadow-md p-4 sm:p-6 flex flex-col items-center justify-between transition-all duration-300 hover:shadow-2xl h-32 sm:h-40 cursor-pointer">
        <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
            <img
                src={logo}
                alt={name}
                className="max-h-10 sm:max-h-12 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
            />
        </div>
        <p className="text-gray-800 font-semibold text-[9px] sm:text-[10px] md:text-xs text-center mt-2 sm:mt-3 tracking-wider uppercase line-clamp-1">
            {name}
        </p>
    </div>
);

export default PartnerCard;