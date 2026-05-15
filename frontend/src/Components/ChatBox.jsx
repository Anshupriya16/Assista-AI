import { useState } from "react";
import ChatContent from "./ChatContent";
import InputBox from "./Input";
import { sendMessageToBot } from "./services/api";

const starterPrompts = [
  "Plan my day in 3 steps",
  "Summarize this text",
  "Write a professional email",
  "Debug my React code",
];

const getMessageTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState("");

  const handleSendMessage = async (message) => {
    if (!message.trim() || loading) return;

    const token = localStorage.getItem("token");
    const userMsg = {
      id: crypto.randomUUID(),
      text: message.trim(),
      sender: "user",
      time: getMessageTime(),
    };

    setMessages((prev) => [...prev, userMsg]);

    if (!token) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: "Please log in to continue chatting.",
          sender: "bot",
          status: "warning",
          time: getMessageTime(),
        },
      ]);
      return;
    }

    setLoading(true);

    try {
      const res = await sendMessageToBot(userMsg.text, token, conversationId);
      if (res.conversationId) setConversationId(res.conversationId);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: res.reply,
          sender: "bot",
          time: getMessageTime(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: error.response?.data?.message || "I could not reach the server. Please try again in a moment.",
          sender: "bot",
          status: "error",
          time: getMessageTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mb-4 grid gap-4 rounded-2xl border border-cyan-200/10 bg-[#0b1220]/84 px-4 py-4 shadow-2xl shadow-black/25 backdrop-blur-xl sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            Assista AI
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
            Work smarter with your chat assistant
          </h2>
          <p className="mt-1 hidden max-w-2xl text-sm text-slate-300 sm:block">
            Ask questions, draft content, debug code, or turn a rough thought into a clear next step.
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 sm:justify-start">
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100">
            Online
          </span>
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setConversationId("");
            }}
            disabled={messages.length === 0 || loading}
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-violet-300/70 hover:bg-violet-400/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear chat
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-cyan-200/10 bg-[#0b1220]/80 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <ChatContent
          messages={messages}
          loading={loading}
          starterPrompts={starterPrompts}
          onPromptSelect={handleSendMessage}
        />
        <InputBox onSend={handleSendMessage} loading={loading} />
      </div>
    </div>
  );
}

export default ChatBox;
