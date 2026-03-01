
import React from "react";
import ReactMarkdown from "react-markdown";

const ChatUI = ({ messages,isLoading }) => {
  
  return (
    <div className={`pb-44 md:pb-3`}>
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-1 py-3 rounded-2xl max-w-full flex flex-col  text-sm leading-relaxed font-medium text-[var(--text-main)] ${
                msg.role === "user"
                  ? "px-4 bg-[var(--bg-second-muted)]"
                  : "rounded-bl-none"
              }`}
            >
              {msg.role === "ai" ? (
                <ReactMarkdown
                  components={{
                    // Headings
                    h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-bold mt-3 mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-semibold mt-3 mb-1">{children}</h3>,
                    
                    // Bold, italic
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    
                    // Lists
                    ul: ({ children }) => <ul className="list-disc pl-5 my-2 flex flex-col gap-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-5 my-2 flex flex-col gap-1">{children}</ol>,
                    li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
                    
                    // Code
                    code: ({ inline, children }) =>
                      inline ? (
                        <code className="bg-[var(--bg-muted)] px-1.5 py-0.5 rounded text-xs font-mono">
                          {children}
                        </code>
                      ) : (
                        <pre className="bg-[var(--bg-muted)] p-3 rounded-lg my-2 overflow-x-auto">
                          <code className="text-xs font-mono">{children}</code>
                        </pre>
                      ),
                    
                    // Paragraph
                    p: ({ children }) => <div className="mb-2 last:mb-0">{children}</div>,
                    
                    // Link
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" className="text-blue-400 underline hover:text-blue-300">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}

        {/* Loading bubble */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl rounded-bl-none text-sm flex gap-1 items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-yellow-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-yellow-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-yellow-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUI;
