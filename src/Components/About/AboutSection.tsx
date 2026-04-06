import React from "react";

const AboutSection: React.FC = () => {
  return (
    <section className="bg-white py-24 px-6 text-center text-gray-900">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-wider">
          STONE MARKET
        </h2>
        <h3 className="text-xl md:text-2xl font-semibold mb-8 text-gray-800">
          Բնական քարի համաշխարհային շուկայի հայկական հարթակը
        </h3>
        <p className="text-gray-600 mb-16 leading-relaxed text-base md:text-lg max-w-4xl mx-auto">
          Stonemarket-ն առաջին հայկական օնլայն հարթակն է, որը միավորում է բնական քարի արդյունահանմամբ,
          մշակմամբ և վաճառքով զբաղվող ընկերություններին մեկ տեղում՝ ապահովելով նրանց համար տեսանելիություն,
          ճանաչելիություն և վստահելի գործընկերային կապեր։ Մենք միավորում ենք արտադրողներին, դիզայներներին,
          ճարտարապետներին և մատակարարներին՝ ստեղծելով բաց, թափանցիկ և առաջադեմ միջավայր։
        </p>

        <div className="space-y-6 border-t pt-12">
          <h4 className="font-bold text-lg uppercase tracking-widest">ՄԵՐ ԱՌԱՔԵԼՈՒԹՅՈՒՆԸ</h4>
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
            Արտադրողներին և դիզայներներին տալ իրական հարթակ, որտեղ քարը դառնում է բրենդ, իսկ արտադրանքը՝ պատմություն։
            Stonemarket-ը կառուցված է գաղափարի շուրջ՝
          </p>
          <p className="text-xl font-medium italic text-gray-800 mt-6">
            «Հայկական բնական քարը պետք է խոսի ինքն իր անունից՝ որակով, դիզայնով և վստահությամբ»։
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;