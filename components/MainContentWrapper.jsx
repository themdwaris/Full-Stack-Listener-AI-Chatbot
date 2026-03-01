"use client";
import React from "react";
import { useChatbotContext } from "@/context/ChatbotContext";
import Header from "./Header";

const MainContentWrapper = ({ children }) => {
  const { subSidebar, isSidebarOpen, setIsSidebarOpen } = useChatbotContext();
  return (
    <>
      <main
        className={`
    min-h-screen
    transition-all duration-300
    pt-16
    ml-0
    ${subSidebar ? "md:ml-60" : "md:ml-16"}
  `}
      >
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        <Header />
        {children}
      </main>
    </>
  );
};

export default MainContentWrapper;
