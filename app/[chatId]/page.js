"use client";
import React, { useEffect, useRef, useState } from "react";
import ChatUI from "@/components/ChatUI";
import InputBoxContainer from "@/components/InputBoxContainer";
import { useChatbotContext } from "@/context/ChatbotContext";
import { useParams } from "next/navigation";
import axios from "axios";
import Loader from "@/components/Loader";

const ChatPage = () => {
  const { chatId } = useParams();
  const { setIsChatStarted, setIsLoading, isLoading } = useChatbotContext();
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const [chatThreadLoading, setChatThreadLoading] = useState(false);

  useEffect(() => {
    setIsChatStarted(true);

    const loadChatHistory = async () => {
      setChatThreadLoading(true);
      try {
        const { data } = await axios.get(`/api/chat/${chatId}`);
        if (data?.success) {
          setMessages(data?.messages);
          setChatThreadLoading(false);
        }
      } catch (error) {
        setChatThreadLoading(false);
        console.log("Failed to load chat thread history:", error);
      }
    };

    loadChatHistory();
  }, [chatId]);

  
  const handleSend = async (prompt) => {
    if (!prompt.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: prompt }]);
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "ai", text: "" }]);
    setIsLoading(false);

    try {
      setIsLoading(true);
      const response = await fetch(`/api/chat/${chatId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("API failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(Boolean);

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.replace("data: ", "").trim();
            if (jsonStr === "[DONE]") break;

            try {
              const { token } = JSON.parse(jsonStr);
              // Last AI message mein token append
              setMessages((prev) => {
                const updated = [...prev];
                const lastMsg = updated[updated.length - 1];
                if (lastMsg.role === "ai") {
                  updated[updated.length - 1] = {
                    ...lastMsg,
                    text: lastMsg.text + token,
                  };
                }
                return updated;
              });
              setIsLoading(false);
            } catch {
              setIsLoading(false);
            }
          }
        }
      }
    } catch (error) {
      console.error("Stream error:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // if ( !isLoading||!chatThreadLoading) {
    //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading,chatThreadLoading]);

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col w-full mt-2">
      <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto px-4">
        <div className="flex-1 overflow-y-auto">
          {chatThreadLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader className={"w-10 h-10"} />
            </div>
          ) : (
            <ChatUI messages={messages} isLoading={isLoading} />
          )}
          <div ref={bottomRef} />
        </div>

        <div className="fixed left-0 right-0 px-4 md:px-0 md:sticky bottom-0 bg-[var(--bg-main)]">
          <div className=" md:pb-3 max-w-3xl mx-auto">
            <InputBoxContainer onSend={handleSend} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
