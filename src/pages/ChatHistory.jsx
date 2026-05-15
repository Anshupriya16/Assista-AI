import { useEffect, useState } from "react";
import BrandLogo from "../Components/BrandLogo";
import PageTemplate from "../Components/PageTemplate";
import { clearHistory, getHistory } from "../Components/services/api";

function ChatHistory() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("token")));
  const [message, setMessage] = useState(() =>
    localStorage.getItem("token") ? "" : "Please log in to view your chat history."
  );
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getHistory(token)
      .then((data) => {
        setChats(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setMessage("Unable to load chat history. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleClearHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token || chats.length === 0 || clearing) return;

    setClearing(true);
    setMessage("");

    try {
      await clearHistory(token);
      setChats([]);
      setMessage("Chat history cleared.");
    } catch {
      setMessage("Unable to clear chat history. Please try again.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <PageTemplate
      eyebrow="History"
      title="Chat history"
      description="Review recent conversations and pick up useful answers without starting from zero."
      stats={[{ label: "Saved chats", value: chats.length }]}
      action={
        <button
          type="button"
          onClick={handleClearHistory}
          disabled={chats.length === 0 || clearing}
          className="rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-100 transition hover:border-red-300/50 hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {clearing ? "Clearing..." : "Clear history"}
        </button>
      }
    >

      {message && (
        <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          {message}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-cyan-200/10 bg-[#0b1220]/84 p-6 text-center text-slate-300 backdrop-blur-xl sm:p-8">
          Loading your conversations...
        </div>
      ) : chats.length > 0 ? (
        <div className="grid gap-3 sm:gap-4">
          {chats.map((chat, index) => (
            <article
              key={chat._id || index}
              className="rounded-2xl border border-cyan-200/10 bg-[#0b1220]/84 p-4 shadow-xl shadow-black/25 backdrop-blur-xl transition hover:border-cyan-200/40 hover:bg-cyan-300/[0.08] sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                    Prompt
                  </p>
                  <h2 className="mt-2 break-words text-base font-semibold leading-7 text-white sm:text-lg">
                    {chat.message}
                  </h2>
                </div>
                {chat.createdAt && (
                  <time className="w-fit rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                    {new Date(chat.createdAt).toLocaleString()}
                  </time>
                )}
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  AI Reply
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-200">
                  {chat.reply}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        !message && (
          <div className="rounded-2xl border border-cyan-200/10 bg-[#0b1220]/84 p-6 text-center shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-10">
            <BrandLogo className="mx-auto h-14 w-14 rounded-2xl" />
            <h2 className="mt-5 text-2xl font-semibold">No history yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Start a chat and your saved conversations will appear here.
            </p>
          </div>
        )
      )}
    </PageTemplate>
  );
}

export default ChatHistory;
