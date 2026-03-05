import React from "react";
import InputBoxContainer from "@/components/InputBoxContainer";
import HeroHeading from "@/components/HeroHeading";
import Suggestions from "@/components/Suggestions";

const Home = () => {
  return (
    <div className="h-[calc(100vh-56px)] flex flex-col w-full mt-10 md:mt-0">
      <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto px-4">
        <div className="flex flex-col items-baseline md:items-center md:justify-center md:pt-24">
          <HeroHeading />

          <h1 className="text-2xl md:text-3xl font-medium mt-2 mb-8">
            Where should we start?
          </h1>
          <Suggestions />
        </div>

        {/* Input Box */}
        <div className="fixed left-0 right-0 px-4 md:px-0 md:sticky bottom-0 bg-[var(--bg-main)] md:mt-14">
          <div className="max-w-3xl mx-auto">
            <InputBoxContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
