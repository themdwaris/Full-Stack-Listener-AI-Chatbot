"use client";
import React, { useState } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdAdd,
  MdOutlineMic,
} from "react-icons/md";
import { RiEqualizer2Line } from "react-icons/ri";
import { IoSend } from "react-icons/io5";

const InputBox = ({ onSend }) => {
  const [prompt, setPrompt] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    onSend(prompt);
    setPrompt(""); // clear input after send
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
    >
      <textarea
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
        <div className="flex items-center gap-3.5">
          <MdAdd size={20} />
          <span className="flex items-center gap-2">
            <RiEqualizer2Line size={20} /> <span>Tools</span>
          </span>
        </div>
        <div className="flex items-center gap-3.5">
          <span className="flex items-center gap-2">
            <span className="text-sm">Fast</span>
            <MdOutlineKeyboardArrowDown size={20} />
          </span>
          <button
            type="submit"
            className="cursor-pointer transition transform active:scale-90"
          >
            {!prompt.trim() || prompt.trim().length === 0 ? (
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
