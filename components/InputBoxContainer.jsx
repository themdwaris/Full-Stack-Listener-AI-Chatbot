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

    
    const tempId = Date.now().toString();
    setIsChatStarted(true);
    router.push(`/${tempId}`); // instantly redirect

    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/chat/create", { prompt });
      if (data?.success) {
        setIsChatStarted(true);
        router?.replace(`/${data?.chatId}`);
        await loadChatHistory()
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
