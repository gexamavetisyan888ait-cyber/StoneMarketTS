import React, { useState } from "react";
import { FiSearch, FiUser, FiHeart, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useStore, useFavorite } from "../../store/useStore";

// Նավիգացիայի տիպավորում
interface NavLink {
  id: number;
  title: string;
  href: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // TypeScript-ին ասում ենք, թե ինչ տիպի է state-ը
  // Եթե useStore-ը ճիշտ տիպավորված է create<T>()-ով, ապա (state) => ... ավտոմատ կաշխատի
  const myCart = useStore((state) => state.getCart());
  const myCartL = useFavorite((state) => state.getCart());

  const navLinks: NavLink[] = [
    { id: 1, title: "Գլխավոր", href: "/" },
    { id: 2, title: "Խանութ", href: "/shop" },
    { id: 3, title: "Բրենդներ", href: "/designers" },
    { id: 4, title: "Մեր մասին", href: "/about" },
    { id: 5, title: "Կապ", href: "/contact" },
  ];

  return (
    <div className="bg-gray-50 sticky top-0 z-[100]">
      <header className="w-full bg-white border-b border-gray-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">

          <div className="flex items-center">
            <a href="/">
              <img
                className="h-8 sm:h-10 w-auto cursor-pointer"
                src="https://stonemarket.am/icons/logo-primary.svg"
                alt="Logo"
              />
            </a>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="text-gray-700 hover:text-emerald-500 transition font-medium text-sm xl:text-base"
              >
                {item.title}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className="flex items-center gap-1 sm:gap-3">

              <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-gray-200 hover:border-emerald-500 hover:text-emerald-500 transition">
                <FiSearch size={16} />
              </button>

              <button className="hidden md:flex w-9 h-9 items-center justify-center rounded-full border border-gray-200 hover:border-emerald-500 hover:text-emerald-500 transition">
                <FiUser size={18} />
              </button>

              <a className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-gray-200 hover:border-emerald-500 hover:text-emerald-500 transition relative" href="/liking">
                <FiHeart size={16} />
                {myCartL.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {myCartL.length}
                  </span>
                )}
              </a>

              <a href="/favorites" className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-gray-200 hover:border-emerald-500 hover:text-emerald-500 transition relative">
                <FiShoppingCart size={16} />
                {myCart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {myCart.length}
                  </span>
                )}
              </a>

            </div>

            <div className="hidden sm:flex items-center cursor-pointer hover:opacity-80 transition">
              <img
                src="https://flagcdn.com/w40/am.png"
                alt="Armenia"
                className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
              />
            </div>

            <button
              className="lg:hidden p-2 text-gray-700 hover:text-emerald-500 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
          lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 transition-all duration-300 ease-in-out overflow-hidden
          ${isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}
        `}
        >
          <div className="px-6 py-6 flex flex-col gap-4">
            {navLinks.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="text-gray-800 text-lg font-semibold hover:text-emerald-500 transition border-b border-gray-50 pb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
}