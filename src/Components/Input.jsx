import { useState } from "react";

function Input({ onSend, loading = false }) {
  const [input, setInput] = useState("");
  const remainingChars = 500 - input.length;
  const canSend = input.trim().length > 0 && !loading && remainingChars >= 0;

  const handleSend = () => {
    if (!canSend) return;

    onSend(input);
    setInput("");
  };

  return (
    <div className="border-t border-cyan-200/10 bg-[#0b1220]/94 p-3 backdrop-blur-xl sm:p-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-2 shadow-inner shadow-black/40 focus-within:border-cyan-200/60">
        <textarea
          rows={1}
          maxLength={500}
          className="max-h-36 min-h-12 w-full resize-none bg-transparent px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500"
          placeholder="Type a message for Assista AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <div className="flex flex-col gap-3 border-t border-white/10 px-2 py-2 sm:flex-row sm:items-center sm:justify-between">
          <p
            className={`text-xs ${
              remainingChars < 50 ? "text-amber-300" : "text-slate-500"
            }`}
          >
            Enter to send, Shift + Enter for a new line
            <span className="ml-2">{remainingChars} left</span>
          </p>

          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="inline-flex items-center justify-center rounded-xl bg-cyan-300 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Input;
