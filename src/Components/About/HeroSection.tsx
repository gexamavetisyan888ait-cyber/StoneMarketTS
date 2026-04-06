import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="bg-[#0f171e] text-white py-24 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-center">
          <img
            src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fpetro-stone-logo.png&w=3840&q=75"
            alt="Petro Stone Logo"
            className="w-16 h-16 flex items-center justify-center"
          />
        </div>
        <h2 className="text-xs uppercase mb-3 opacity-70 font-medium">
          PETRO STONE
        </h2>
        <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
          ՊԵՏՐՈ ՍԹՈՈՒՆ
        </h1>
        <p className="text-gray-400 leading-relaxed text-sm md:text-lg max-w-3xl mx-auto">
          «Պետրո Սթոուն» ընկերությունների խումբը զբաղվում է բնական քարերի
          արդյունահանմամբ, մշակմամբ և վաճառքով՝ ապահովելով ծառայությունների
          ամբողջական ցիկլ։ Այն իր մեջ ներառում է մի քանի ընկերություն, որոնք
          առաջարկում են որակյալ լուծումներ շինարարության, դիզայնի և լանդշաֆտային
          նախագծերի համար՝ ապահովելով հուսալիություն և երկարատև համագործակցություն
          գործընկերների հետ։
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
