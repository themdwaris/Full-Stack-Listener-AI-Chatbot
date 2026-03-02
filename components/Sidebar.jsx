"use client";
import React, { useEffect, useRef, useState } from "react";
import { MdMenuOpen } from "react-icons/md";
import { useChatbotContext } from "@/context/ChatbotContext";
import { FaRegEdit } from "react-icons/fa";
import { FiLogOut, FiSearch } from "react-icons/fi";
import { IoIosMore } from "react-icons/io";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, usePathname } from "next/navigation";
import Modal from "./Modal";
import Loader from "./Loader";

const Sidebar = () => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    subSidebar,
    setSubSidebar,
    user,
    setUser,
    router,
    setIsChatStarted,
    chatHistory,
    loadChatHistory,
    setIsModalOpen,
    chatListLoading,
  } = useChatbotContext();

  const pathname = usePathname();
  const [newTitle, setNewTitle] = useState("");
  const [renameChatId, setRenameChatId] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [renameLoading, setRenameLoading] = useState(false);
  const renameInputRef = useRef(null);
  const cId = pathname.split("/");

  // Rename chat name
  const renameChatName = async (chatId) => {
    try {
      if (!newTitle.trim()) return;
      setRenameLoading(true);
      const { data } = await axios.patch(`/api/chat`, {
        chatId,
        title: newTitle,
      });
      if (data?.success) {
        await loadChatHistory();
        toast.success("Rename successful");
        setRenameLoading(false);
        setNewTitle("");
        setRenameChatId(null);
      }
    } catch (error) {
      setRenameLoading(false);
      console.log("Failed to rename title:", error);
    }
  };

  // Delete chat history
  const removeChatHistory = async (chatId) => {
    try {
      const { data } = await axios.delete(`/api/chat`, { data: { chatId } });
      if (data?.success) {
        if (cId[1] == chatId) {
          router.push("/");
        }
        await loadChatHistory();
        toast.success("Deletion successful");
      }
    } catch (error) {
      console.log("Failed to delete chat:", error);
    }
  };

  // Logout
  const logout = async () => {
    const { data } = await axios.post("/api/auth/logout");
    if (data?.success) {
      setUser(null);
      setIsSidebarOpen(false);
      toast.success("Logout successful");
      router.push("/");
    }
  };

  // Rename input pe focus
  useEffect(() => {
    if (renameChatId) {
      renameInputRef.current?.focus();
    }
  }, [renameChatId]);

  return (
    <>
      <aside
        className={`
        fixed left-0 top-0 h-screen
        ${isSidebarOpen && "z-50"}
        bg-[var(--bg-muted)] px-3 flex flex-col justify-between
        overflow-y-auto transition-all duration-300 ease-in-out

        /* Mobile */
        ${isSidebarOpen ? "translate-x-0 w-60 " : "-translate-x-full w-60"}

        /* Desktop */
        md:translate-x-0
        ${subSidebar ? "md:w-60 z-50" : "md:w-16 z-50"}
      `}
        onClick={(e) => {
          e.stopPropagation();
          setActiveChatId(null);
        }}
      >
        <div>
          {/* Sidebar toggle button */}
          <div className="hidden py-4 md:flex justify-between">
            <button
              className="cursor-pointer px-2 transition transform active:scale-95"
              onClick={() => setSubSidebar(!subSidebar)}
            >
              <MdMenuOpen size={22} />
            </button>
            <span
              className={`cursor-pointer px-2 transition transform active:scale-95 ${subSidebar ? "inline-block" : "hidden"}`}
            >
              <FiSearch size={20} />
            </span>
          </div>

          <div className="pt-20 md:pt-14">
            {/* New chat creation button */}
            <button
              className="w-full py-2 px-3 flex items-center gap-2.5 rounded-lg bg-[var(--bg-second-muted)] cursor-pointer transition transform active:scale-95"
              onClick={() => {
                setIsChatStarted(false);
                setIsSidebarOpen(false);
                if(pathname==='/') return;
                router.push("/");
              }}
            >
              <span title="New Chat">
                <FaRegEdit size={19} />
              </span>
              <span
                className={`text-sm font-medium inline-block ${subSidebar ? "md:inline-block" : "md:hidden"}`}
              >
                New chat
              </span>
            </button>

            <div
              className={`mt-10 flex flex-col ${subSidebar ? "md:flex" : "md:hidden"}`}
            >
              <p className="text-sm pl-2.5 mb-4 font-normal text-[var(--text-muted)]">
                Recent chats
              </p>

              {chatListLoading ? (
                <div className=" flex items-center justify-center mt-6">
                  <Loader className={"w-6 h-6"} />
                </div>
              ) : (
                <div className="flex flex-col gap-y-1">
                  {chatHistory?.map((chat) => (
                    <div
                      key={chat?._id}
                      className={`w-full relative py-1 px-1 flex items-center justify-between rounded-lg text-[var(--text-second-muted)] cursor-pointer group ${
                        pathname === `/${chat?._id}`
                          ? "bg-[var(--bg-second-muted)] px-2 py-1.5"
                          : ""
                      }`}
                    >
                      <p
                        className="text-sm font-normal truncate px-2 flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/${chat?._id}`);
                          setIsSidebarOpen(false);
                        }}
                      >
                        {chat?.title}
                      </p>

                      {/* More button */}
                      {renameChatId !== chat?._id && (
                        <div className="relative">
                          <span
                            title="More"
                            className={`py-2 cursor-pointer transition transform active:scale-95 ${
                              pathname === `/${chat?._id}`
                                ? "opacity-100"
                                : "md:opacity-0"
                            } md:group-hover:opacity-100 opacity-100`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveChatId(
                                activeChatId === chat?._id ? null : chat?._id,
                              );
                            }}
                          >
                            <IoIosMore size={18} />
                          </span>

                          {/* Dropdown menu */}
                          {activeChatId === chat?._id && (
                            <div
                              className="absolute right-0 top-7 z-50 w-36 rounded-lg bg-[var(--bg-muted)] border border-white/10 shadow-lg overflow-hidden"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Rename */}
                              <button
                                className="w-full cursor-pointer text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRenameChatId(chat?._id);
                                  setNewTitle(chat?.title);
                                  setActiveChatId(null);
                                }}
                              >
                                ✏️ Rename
                              </button>

                              {/* Delete */}
                              <button
                                className="w-full cursor-pointer text-left px-3 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors flex items-center gap-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeChatHistory(chat?._id);
                                  setActiveChatId(null);
                                }}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Logout button */}
        {user && (
          <button
            title="Logout"
            className="mr-auto w-full py-2 px-3 mb-20 md:mb-8 flex items-center gap-2.5 rounded-lg bg-[var(--bg-second-muted)] cursor-pointer transition transform active:scale-95 hover:rounded-lg hover:bg-white/10"
            onClick={() => logout()}
          >
            <span title="New Chat">
              <FiLogOut size={19} />
            </span>
            <span
              className={`text-sm font-medium inline-block ${subSidebar ? "md:inline-block" : "md:hidden"}`}
            >
              Logout
            </span>
          </button>
        )}
      </aside>

      {/* Rename Modal window */}
      {renameChatId && (
        <Modal
          onClose={(e) => {
            setRenameChatId(null);
            setActiveChatId(null);
            setIsModalOpen(false);
          }}
        >
          <div
            className="w-full max-w-xl px-4 py-10 rounded-lg bg-[var(--bg-muted)] flex flex-col gap-2.5"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="py-3 font-semibold">Rename this chat</h1>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              value={newTitle}
              className="p-2 w-full border-b-2 outline-none bg-[var(--bg-main)] rounded-lg border-b-[var(--primary)]"
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div className="flex w-full items-center justify-end">
              <button
                className="p-3 mt-6 rounded-lg bg-[var(--bg-muted)] font-medium text-sm cursor-pointer transition transform active:scale-90"
                onClick={(e) => {
                  e.stopPropagation();
                  setRenameChatId(null);
                  setActiveChatId(null);
                  setIsModalOpen(false);
                }}
              >
                Cancel
              </button>

              <button
              disabled={renameLoading}
                className="px-3 py-2 mt-6 flex items-center justify-center text-white rounded-lg bg-[var(--primary)] font-medium text-sm cursor-pointer transition transform active:scale-90"
                onClick={(e) => {
                  e.stopPropagation();
                  renameChatName(renameChatId);
                }}
              >
                {renameLoading ? <Loader className={"w-5 h-5"} /> : "Rename"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Sidebar;
