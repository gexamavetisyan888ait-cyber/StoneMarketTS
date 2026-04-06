import React from "react";

const Hero: React.FC = () => {
  return (
    <div className="flex-1 w-full">
      <video
        src="/bg.mp4"
        className="w-full h-[300px] md:h-[600px] object-cover rounded-3xl shadow-md transition-transform duration-500 hover:brightness-95"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
};

export default Hero;