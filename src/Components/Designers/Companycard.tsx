import React from 'react';



const CompanyCard: React.FC<any> = ({ company }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                    src={company.img}
                    alt={company.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="p-5 flex flex-col grow">
                <h3 className="font-bold text-gray-800 mb-2 text-lg line-clamp-1">{company.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed grow">
                    {company.desc}
                </p>
            </div>
        </div>
    );
};

export default CompanyCard;