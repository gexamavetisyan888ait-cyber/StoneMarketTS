import React from 'react';
import { useRealtimeCollection } from "../../lib/hook";
import PartnerCard from "./PartnerCards";

// Ենթադրենք Partner ինտերֆեյսը սահմանված է վերևում
interface Partner {
    id: string;
    name: string;
    logo: string;
}

export default function PartnersSection() {
    // TypeScript-ին ասում ենք, որ սպասում ենք Partner տիպի զանգված
    const { data: partners, loading, error } = useRealtimeCollection<Partner>("db/OurFriends");
    const bgUrl = "https://stonemarket.am/_next/image?url=%2Fimages%2Fproject1.jpeg&w=3840&q=75";

    return (
        <section
            className="relative w-full py-12 sm:py-24 px-4 sm:px-6 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${bgUrl}')` }}
        >
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
                <header className="text-center mb-10 sm:mb-16 max-w-4xl">
                    <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-4 sm:mb-8">
                        Մեր Գործընկերները 
                    </h2>
                    <p className="text-gray-200 text-xs sm:text-sm md:text-base leading-relaxed opacity-90 px-2">
                        Մեր գործընկերները ներկայացնում են բարձրորակ քարեր և կոպեր, որոնք առաջարկում են նորարարական լուծումներ։
                    </p>
                </header>

                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 w-full max-w-6xl">
                    {error && <div className="text-white">Սխալ տվյալների բեռնման ժամանակ</div>}
                    
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-32 sm:h-40 bg-white/10 animate-pulse rounded-md" />
                        ))
                    ) : (
                        partners.map((partner) => (
                            <PartnerCard 
                                key={partner.id} 
                                name={partner.name} 
                                logo={partner.logo} 
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}