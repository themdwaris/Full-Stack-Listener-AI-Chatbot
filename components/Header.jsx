import React, { useEffect } from "react";
import { FaMoon } from "react-icons/fa6";
import { IoIosSunny } from "react-icons/io";
import { useTheme } from "next-themes";
import { HiOutlineBars3 } from "react-icons/hi2";
import { useChatbotContext } from "@/context/ChatbotContext";
import AuthForm from "./AuthForm";
import Link from "next/link";
import Modal from "./Modal";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    isModalOpen,
    setIsModalOpen,
    authMode,
    setAuthMode,
    user,
    setUser,
  } = useChatbotContext();

  //Prevent scroll when sidebar menu is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen, isModalOpen]);

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div
        className={`fixed top-0 right-0 w-full z-50 md:z-40 h-14 px-4 sm:px-8 md:px-10
        flex grow items-center justify-between 
         text-[var(--text-main)]
         bg-[var(--bg-main)]
      `}
      >
        <div className="flex items-center gap-1">
          <span
            className="cursor-pointer inline-block md:hidden transition transform active:scale-90"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <HiOutlineBars3 size={22} />
          </span>
          <Link href={'/'}><h1 className="font-medium text-[18px] md:ml-10 select-none">Listner</h1></Link>
        </div>

        <div className="flex items-center gap-3.5">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="cursor-pointer transition active:scale-90"
          >
            {theme === "light" ? (
              <FaMoon size={22} />
            ) : (
              <IoIosSunny size={22} />
            )}
          </button>

          {user && user?.name ? (
            <p className="w-7 h-7 select-none cursor-pointer transition transform active:scale-90 flex items-center justify-center rounded-full font-semibold bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-yellow-400 text-white">
              {user?.name[0]}
            </p>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="
               px-2.5 py-1 text-sm font-medium rounded-full text-white
              bg-[var(--primary)]
              hover:bg-[var(--primary-hover)]
              cursor-pointer transition transform active:scale-90
            "
            >
              Login
            </button>
          )}
        </div>
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <AuthForm
            authMode={authMode}
            setAuthMode={setAuthMode}
            isModalOpen={isModalOpen}
            setUser={setUser}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Header;
