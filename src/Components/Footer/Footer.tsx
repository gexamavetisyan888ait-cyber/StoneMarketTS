import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
    FiPhone,
    FiMessageCircle,
    FiInstagram,
    FiFacebook,
} from "react-icons/fi";
import { FaApple, FaGooglePlay } from "react-icons/fa";

export default function ContactFooter() {
    // Ֆորմայի վիճակի տիպավորում (ըստ ցանկության)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
        agreed: false
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log("Submitting:", formData);
    };

    return (
        <div className="bg-[#061922] text-white">

            <section className="w-full px-6 py-5 flex gap-10 flex-col sm:flex-row">
                {/* CONTACT FORM */}
                <form 
                    onSubmit={handleSubmit}
                    className="bg-[#0c2430] border border-white/10 rounded-2xl px-5 py-6 shadow-xl w-full sm:w-[50%]"
                >
                    <h2 className="text-2xl font-semibold mb-2">Կապվեք մեզ հետ</h2>
                    <p className="text-gray-400 text-sm mb-4">
                        Լրացրեք տվյալները և մեր մասնագետը Ձեզ հետ կհաստատի կապ։
                    </p>

                    <div className="space-y-5">
                        <input
                            type="text"
                            placeholder="Անուն"
                            className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                        />

                        <input
                            type="email"
                            placeholder="Էլ. հասցե"
                            className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                        />

                        <div className="flex border border-white/20 rounded-lg overflow-hidden focus-within:border-emerald-400 transition-colors">
                            <div className="px-4 py-2 bg-white/5 text-sm border-r border-white/10">
                                🇦🇲 +374
                            </div>
                            <input
                                type="text"
                                placeholder="Հեռախոսահամար"
                                className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none"
                            />
                        </div>

                        <textarea
                            placeholder="Հաղորդագրություն"
                            rows={4} // TypeScript-ում rows-ը թիվ պետք է լինի
                            className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                        />

                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <input type="checkbox" id="terms" className="accent-emerald-500" />
                            <label htmlFor="terms" className="cursor-pointer">Համաձայն եմ պայմաններին</label>
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] transition rounded-lg py-2 font-medium"
                        >
                            Ուղարկել
                        </button>
                    </div>
                </form>

                {/* IMAGE SECTION */}
                <div className="rounded-2xl overflow-hidden shadow-xl w-full h-[460px]">
                    <img
                        src="https://stonemarket.am/_next/image?url=%2Fimages%2Ffeedback.webp&w=3840&q=75"
                        alt="Stone Market Office"
                        className="w-full h-full object-cover"
                    />
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-gradient-to-b from-[#071f2b] to-[#05161f]">
                <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                    
                    <div className="space-y-4">
                        <img src="https://stonemarket.am/icons/logo-light.svg" alt="Logo" className="h-10" />
                        <div className="space-y-1">
                            <p className="text-gray-300 text-sm">+374 (33) 76 - 73 - 77</p>
                            <p className="text-gray-300 text-sm">sstonemarket@yandex.ru</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-6">Գլխավոր</h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            {["Խանութ", "Բրենդներ", "Մեր մասին", "Կապ", "Գործընկերություն", "Հաճախ տրվող հարցեր"].map((item) => (
                                <li key={item} className="hover:text-emerald-400 cursor-pointer transition-colors">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-6">Ծառայություններ</h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            {["Արտադրական գծի աջակցում", "Համագործակցության պայմաններ", "Փորագրման ծառայություն", "Export-ի կազմակերպում", "Բեռնափոխադրում"].map((item) => (
                                <li key={item} className="hover:text-emerald-400 cursor-pointer transition-colors">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-6">Հետևեք մեզ</h3>
                        <div className="space-y-4 mb-8 text-sm">
                            <div className="flex items-center gap-3 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors">
                                <FiInstagram size={18} />
                                <span>stonemarket.am</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors">
                                <FiFacebook size={18} />
                                <span>Stone Market</span>
                            </div>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                            <AppBadge icon={<FaApple />} label="Download on the" store="App Store" />
                            <AppBadge icon={<FaGooglePlay />} label="Get it on" store="Google Play" />
                        </div>
                    </div>
                </div>
                <div className="h-10" />
            </footer>

            {/* FLOATING ACTIONS */}
            <div className="fixed right-6 bottom-6 flex flex-col gap-4 z-50">
                <button className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-90">
                    <FiPhone size={20} />
                </button>
                <a 
                    href="/chat"
                    className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-90"
                >
                    <FiMessageCircle size={20} />
                </a>
            </div>
        </div>
    );
}

// Օգնող կոմպոնենտ կոճակների համար
function AppBadge({ icon, label, store }: { icon: React.ReactNode, label: string, store: string }) {
    return (
        <button className="flex items-center gap-3 bg-[#0d2a36] border border-white/10 px-4 py-2 rounded-xl text-sm hover:border-emerald-400 transition-all">
            <span className="text-xl">{icon}</span>
            <div className="text-left">
                <div className="text-[9px] text-gray-400 uppercase leading-none mb-1">{label}</div>
                <div className="font-semibold leading-none">{store}</div>
            </div>
        </button>
    );
}