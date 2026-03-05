"use client";
import React, { useRef, useState } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdAdd,
  MdOutlineMic,
} from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { RiEqualizer2Line } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import { useChatbotContext } from "@/context/ChatbotContext";


const InputBox = ({ onSend }) => {
  const { setGenImage, genImage } = useChatbotContext();
  const [prompt, setPrompt] = useState("");
  const [tools, setTools] = useState(false); 
  const textareaRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSend(prompt, genImage === "generateImage"); 
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setPrompt("");
  };

  // To adjust height of input box
  const handleInputBoxHeight = (e) => {
    const textarea = e.target;

    textarea.style.height = "auto"; // reset height
    textarea.style.height = Math.min(textarea.scrollHeight, 400) + "px"; // max 400px
  };

  return (
    <form
      onSubmit={submitHandler}
      className="w-full py-4 px-8 rounded-4xl bg-[var(--bg-second-muted)] mb-5"
      onClick={() => setTools(false)} 
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask anything"
        onInput={handleInputBoxHeight}
        onKeyDown={(e) => {
          // Enter press = submit, Shift+Enter = new line
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submitHandler(e);
          }
        }}
        className="w-full resize-none overflow-y-auto bg-transparent outline-none max-h-[400px]"
      />
      <div className="flex items-center justify-between mt-6 text-[var(--text-muted)] select-none">
        <div className="relative">
          {/* Tools dropdown */}
          {tools && (
            <div
              className="w-44 p-4 rounded-2xl bg-[var(--bg-muted)] z-50 absolute bottom-10 shadow-lg border border-white/10"
              onClick={(e) => e.stopPropagation()} 
            >
              <p
                className="text-sm cursor-pointer bg-[var(--bg-second-muted)] hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => {
                  setGenImage("generateImage");
                  setTools(false);
                }}
              >
                🎨 Create image
              </p>
            </div>
          )}

          {/* Image mode badge */}
          {genImage ? (
            <div
              className="cursor-pointer flex items-center justify-center px-2 py-1.5 gap-1 rounded-full bg-blue-500/40"
              onClick={() => setGenImage("")}
            >
              <span>🎨 Image</span>
              <IoIosClose size={24} />
            </div>
          ) : (
            // Normal tools button
            <div className="flex items-center gap-3.5">
              <MdAdd size={20} />
              <button
                type="button" // type=button — form submit na ho
                className="cursor-pointer flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setTools((prev) => !prev); // toggle
                }}
              >
                <RiEqualizer2Line size={20} />
                <span>Tools</span>
              </button>
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3.5">
          <span className="flex items-center gap-2">
            <span className="text-sm">Fast</span>
            <MdOutlineKeyboardArrowDown size={20} />
          </span>
          <button
            type="submit"
            className="cursor-pointer transition transform active:scale-90"
          >
            {!prompt.trim() ? (
              <MdOutlineMic size={20} />
            ) : (
              <span className="text-[var(--text-main)]">
                <IoSend size={20} />
              </span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default InputBox;
