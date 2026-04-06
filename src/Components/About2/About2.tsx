import React from "react";

const GroupInfoSection: React.FC = () => {
  return (
    <main className="min-h-screen font-sans selection:bg-[#00d691] selection:text-white overflow-x-hidden">
      {/* Առաջին բաժին - Stone Group & Sarsart Stone */}
      <section className="bg-[#f8f9fa] py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-24">
          
          {/* ՍԹՈՈՆ ԳՐՈՒՊ */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl font-bold mb-6 tracking-tight uppercase">
                ՍԹՈՈՆ ԳՐՈՒՊ
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                «Սթոուն Գրուպ»-ը տրավերտինի հանքարդյունահանմամբ զբաղվող առաջատար
                ընկերություն է: Ամսական 1200 խորանարդ մետրից ավել որակյալ
                հանույթ ունենալով, ընկերությունն ապահովում է բարձրորակ
                տրավերտինի կայուն մատակարարում քարերի մշակմամբ զբաղվող
                ընկերությունների ավելի քան 60%-ին: «Սթոուն Գրուպ»-ն առանձնանում
                է իր մասնագիտական փորձով, նորարարական տեխնոլոգիաներով և հուսալի
                ծառայություններով, որոնք բավարարում են հաճախորդների պահանջներն
                ու սպասելիքները: Դեռևս 2021 թվականից ընկերությունն արտահանում է
                տրավերտինե մեծաբեկորներ եվրոպական երկրներ։
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fproject1.jpeg&w=3840&q=75"
                alt="Stone Group Quarry"
                className="w-full h-80 object-cover rounded-4xl shadow-xl hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>

          {/* ՍԱՐՍԱՐՏ ՍԹՈՈՆ */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fproject2.webp&w=3840&q=75"
                alt="Basalt Quarry"
                className="w-full h-80 object-cover rounded-4xl shadow-xl hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6 tracking-tight uppercase">
                ՍԱՐՍԱՐՏ ՍԹՈՈՆ
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Հայաստանի հարստություններից ու սիմվոլներից մեկը՝ սև տուֆը, չէր
                կարող ներգրավված չլինել մեր գործունեության մեջ։ «Սարարտ
                Սթոուն»-ն՝ ընկերությունների խմբին պատկանող նորաբաց
                կազմակերպություն է, որը մասնագիտացած է սև տուֆի
                արդյունաբերության մեջ: Մեր մասնագետներն իրենց տարիների ձեռքբերած
                փորձն ու նորարական լուծումներն են ներդնում որակի և հուսալիության
                ապահովման համար։
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Երկրորդ բաժին - Stone Holding & Festival */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-24">
          
          {/* ՍԹՈՈՆ ՀՈԼԴԻՆԳ */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl font-bold mb-6 tracking-tight uppercase">
                ՍԹՈՈՆ ՀՈԼԴԻՆԳ
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                «Սթոուն Հոլդինգ» ընկերությունը մասնագիտացած է երեսպատման
                սալիկների, քիվերի, ճարտարապետական բարդ դետալների արտադրության և
                վերամշակման մեջ: Ընկերությունը ապահովում է որակի բարձր
                չափանիշներ և հուսալի ծառայություններ, ինչի շնորհիվ վստահելի
                գործընկեր է հանդիսանում ոչ միայն Հայաստանի, այլև մեր օտարերկրյա
                գործընկերների համար։
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fproject3.jpeg&w=3840&q=75"
                alt="Stone Processing"
                className="w-full h-80 object-cover rounded-4xl shadow-xl hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>

          {/* ՀԱՅԿԱԿԱՆ ՔԱՐԻ ՓԱՌԱՏՈՆ */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img
              src="https://www.stonemarket.am/_next/image?url=%2Fimages%2Fproject4.JPG&w=3840&q=75"
              alt="Armenian Stone Festival"
              className="w-full h-80 object-cover rounded-xl shadow-xl hover:scale-[1.02] transition-transform duration-300"
            />
            <div>
              <h2 className="text-2xl font-bold mb-6 tracking-tight uppercase">
                ՀԱՅԿԱԿԱՆ ՔԱՐԻ ՓԱՌԱՏՈՆ
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                Հայկական քարի փառատոնն ամենամյա միջոցառում է, որն անցկացվում է
                2021 թվականից սկսած: Այն նպատակ ունի ներկայացնել հայկական բնական
                քարերի առանձնահատկությունները, մշակման և կիրառման ոլորտները,
                ինչպես նաև ընդգծել դրանց մշակութային ժառանգությունը: Փառատոնին
                մասնակցում են ոլորտի առաջատար ընկերություններ,
                դիզայներներ,ճարտարապետներ և արտադրողներ աշխարհի տարբեր
                երկրներից, որոնք ցուցադրում են իրենց աշխատանքները, ներկայացնում
                նորարարական լուծումներ և փոխանակվում փորձով: Փառատոնի ընթացքում
                տեղի են ունենում նաև տարբեր միջոցառումներ, որոնք նվիրված են
                հայկական մշակույթին։
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default GroupInfoSection;