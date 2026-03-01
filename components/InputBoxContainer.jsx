"use client";
import InputBox from "@/components/InputBox";
import { useChatbotContext } from "@/context/ChatbotContext";
import axios from "axios";

const InputBoxContainer = ({onSend}) => {
  const { loadChatHistory,setIsChatStarted, router, user, setIsModalOpen, setIsLoading } =
    useChatbotContext();

  const handleSend = async (prompt) => {
    if (!prompt.trim()) return;

    if (onSend) {
      onSend(prompt);
      return;
    }

    if (!user) {
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/chat/create", { prompt });
      if (data?.success) {
        setIsChatStarted(true);
        await loadChatHistory()
        router.push(`/${data?.chatId}`);
        setIsLoading(false)
      }
    } catch (error) {
      console.log("Failed to create new chat:", error);
      setIsLoading(false);
    }
  };
  return (
    <>
      <InputBox onSend={handleSend} />
    </>
  );
};

export default InputBoxContainer;
