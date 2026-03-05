"use client";
import { useChatbotContext } from "@/context/ChatbotContext";
import React from "react";

const Suggestions = () => {
  const { genImage, setGenImage } = useChatbotContext();
  const suggestions = [
    { title: "Create image", icon: "🎨" },
    { title: "Explore cricket", icon: "🏏" },
    { title: "Travel", icon: "✈️" },
    { title: "History", icon: "🏔️" },
    { title: "Technology", icon: "🤖" },
  ];
//   console.log(genImage);
  
  return (
    <>
      <div className="max-w-xl md:mx-auto flex flex-col items-baseline md:flex-row md:items-center justify-center flex-wrap gap-x-2.5 gap-y-3">
        {suggestions.map((item) => (
          <div
            key={item.title}
            className="border border-gray-400 flex items-center justify-center gap-1.5 px-4 py-2 shrink-0 rounded-full bg-[var(--bg-second-muted)] cursor-pointer transition transform active:scale-90"
            onClick={()=>{
                if(item.title==='Create image') setGenImage('generateImage')
            }}
          >
            <span>{item.icon}</span> <span>{item.title}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default Suggestions;
