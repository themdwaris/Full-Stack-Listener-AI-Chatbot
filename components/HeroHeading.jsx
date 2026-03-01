"use client";
import { useChatbotContext } from "@/context/ChatbotContext";
import React from "react";
import { SiGooglegemini } from "react-icons/si";

const HeroHeading = () => {
  const { user } = useChatbotContext();
  return (
    <div className="flex items-center gap-2.5">
      <SiGooglegemini size={28} />
      <span className="text-xl md:text-2xl">
        {user && user?.name ? `Hey` : <span className="bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent">Listener</span>}&nbsp;
        <span className="text-xl font-medium md:text-2xl">
          {user && user?.name ? <span className="bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent">{user?.name}</span> : "Ai"}
        </span>
      </span>
    </div>
  );
};

export default HeroHeading;
