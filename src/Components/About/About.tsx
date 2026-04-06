import React from "react";
import AboutSection from "./AboutSection";
import HeroSection from "./HeroSection";

const About: React.FC = () => {
  return (
    <div className="bg-white font-sans selection:bg-gray-900 selection:text-white">
      <HeroSection />
      <AboutSection />
    </div>
  );
};

export default About;