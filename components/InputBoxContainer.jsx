"use client";
import InputBox from "@/components/InputBox";
import { useChatbotContext } from "@/context/ChatbotContext";
import axios from "axios";

const InputBoxContainer = ({ onSend }) => {
  const {
    loadChatHistory,
    setIsChatStarted,
    router,
    user,
    setIsModalOpen,
    setIsLoading,
  } = useChatbotContext();

  const handleSend = async (prompt, isImage = false) => {
    if (!prompt.trim()) return;

    if (onSend) {
      onSend(prompt, isImage);
      return;
    }

    if (!user) {
      setIsModalOpen(true);
      return;
    }

    const tempId = Date.now().toString();
    setIsChatStarted(true);
    router.push(`/${tempId}`);

    try {
      if (isImage) {
        const { data } = await axios.post("/api/chat/create", { prompt,isImage:true });
        if (data?.success) {
          router?.replace(`/${data?.chatId}`);
          await loadChatHistory();
          
        }
      } else {
        setIsLoading(true);
        const { data } = await axios.post("/api/chat/create", { prompt });
        if (data?.success) {
          router.replace(`/${data?.chatId}`);
          await loadChatHistory();
          setIsLoading(false);
        }
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
