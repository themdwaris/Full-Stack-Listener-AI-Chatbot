import React from "react";
import InputBoxContainer from "@/components/InputBoxContainer";
import HeroHeading from "@/components/HeroHeading";

const Home = () => {
  const suggestions = [
    { title: "Create image", icon: "🍌" },
    { title: "Explore cricket", icon: "🏏" },
    { title: "Travel", icon: "✈️" },
    { title: "History", icon: "🏔️" },
    { title: "Technology", icon: "🤖" },
  ];

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col w-full mt-10 md:mt-0">
      <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto px-4">
        <div className="flex flex-col items-baseline md:items-center md:justify-center md:pt-24">
          <HeroHeading />

          <h1 className="text-2xl md:text-3xl font-medium mt-2 mb-8">
            Where should we start?
          </h1>

          <div className="max-w-xl md:mx-auto flex flex-col items-baseline md:flex-row md:items-center justify-center flex-wrap gap-x-2.5 gap-y-3">
            {suggestions.map((item) => (
              <div
                key={item.title}
                className="border border-gray-400 flex items-center justify-center gap-1.5 px-4 py-2 shrink-0 rounded-full bg-[var(--bg-second-muted)] cursor-pointer transition transform active:scale-90"
              >
                <span>{item.icon}</span> <span>{item.title}</span>
              </div>
            ))}
          </div>
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
