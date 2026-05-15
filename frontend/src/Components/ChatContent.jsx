import { useEffect, useRef } from "react";
import Message from "./Message.jsx";
import Loader from "./Loader.jsx";
import BrandLogo from "./BrandLogo.jsx";

function ChatContent({
  messages = [],
  loading = false,
  starterPrompts = [],
  onPromptSelect,
}) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-5">
      {messages.length === 0 && !loading ? (
        <div className="flex min-h-full flex-col items-center justify-center text-center">
          <BrandLogo className="mb-4 h-14 w-14 rounded-2xl shadow-lg shadow-cyan-950/40 sm:mb-5 sm:h-16 sm:w-16" />
          <h3 className="text-xl font-semibold text-white sm:text-2xl">
            What can we work on?
          </h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
            Choose a starter prompt or type your own message below. The conversation will stay tidy and readable as it grows.
          </p>

          <div className="mt-5 grid w-full max-w-2xl grid-cols-1 gap-2 sm:mt-6 sm:grid-cols-2 sm:gap-3">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onPromptSelect(prompt)}
                className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-left text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-200/60 hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-200/60"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {messages.map((msg) => (
            <Message
              key={msg.id}
              text={msg.text}
              sender={msg.sender}
              time={msg.time}
              status={msg.status}
            />
          ))}
          {loading && <Loader />}
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}

export default ChatContent;
