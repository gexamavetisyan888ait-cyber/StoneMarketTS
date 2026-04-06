import React from "react";
import Sidebar from "./SideBar";
import Hero from "./Hero";
import Banner from "./Banner"; // Ներմուծում ենք առանձնացված Banner-ը

const Catalog: React.FC = () => {
  return (
    <div className="bg-[#f8f9fa] py-6 px-4 md:px-12">
      <div className="w-full mx-auto">
        {/* Վերևի հատված՝ Կատեգորիաներ և Վիդեո */}
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar />
          <Hero />
        </div>

        {/* Ներքևի հատված՝ Գովազդային վահանակ */}
        <div className="w-full">
          <Banner />
        </div>
      </div>
    </div>
  );
};

export default Catalog;