"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const ChatbotContext = createContext();

export const ChatbotContextProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [subSidebar, setSubSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [chatHistory, setChatHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatListLoading,setChatListLoading]=useState(false)
  const [genImage,setGenImage]=useState('')
  const router = useRouter();

  

  // Fetching current user
  const getCurrentUser = async () => {
    try {
      const { data } = await axios.get("/api/auth/user");
      if (data?.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("Failed to fetch user detail:", error);
    }
  };

  // Load chat history
  const loadChatHistory = async () => {
    setChatListLoading(true)
    try {
      const { data } = await axios.get("/api/chat/history");
      if (data?.success) {
        setChatHistory(data?.chats);
        setChatListLoading(false)
      }
    } catch (error) {
      setChatListLoading(false)
      console.log("Failed to load chat history");
    }
  };
  
  useEffect(() => {
    if (user) {
      loadChatHistory();
    } else {
      setChatHistory([]);
    }
  }, [user]);

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <ChatbotContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        subSidebar,
        setSubSidebar,
        user,
        setUser,
        isChatStarted,
        setIsChatStarted,
        router,
        isLoading,
        setIsLoading,
        isModalOpen,
        setIsModalOpen,
        authMode,
        setAuthMode,
        loadChatHistory,
        chatHistory,
        chatListLoading,
        genImage,setGenImage
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbotContext = () => useContext(ChatbotContext);
