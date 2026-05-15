import BrandLogo from "./BrandLogo";

function Message({ text, sender = "bot", time, status }) {
  const isUser = sender === "user";
  const isError = status === "error";
  const isWarning = status === "warning";

  const bubbleClass = isUser
    ? "rounded-br-md bg-cyan-300 text-slate-950 shadow-cyan-950/20"
    : isError
      ? "rounded-bl-md border border-red-300/30 bg-red-400/10 text-red-50 shadow-red-950/20"
      : isWarning
        ? "rounded-bl-md border border-amber-300/30 bg-amber-300/10 text-amber-50 shadow-amber-950/20"
        : "rounded-bl-md border border-white/10 bg-white/[0.07] text-slate-100 shadow-black/20";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <BrandLogo className="mt-1 h-9 w-9 rounded-xl" />
      )}

      <div className={`flex max-w-[min(88%,46rem)] flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-lg ${bubbleClass}`}>
          <p className="whitespace-pre-wrap break-words">{text}</p>
        </div>
        {time && (
          <span className="mt-1 px-1 text-[11px] font-medium text-slate-500">
            {isUser ? "You" : "Assistant"} at {time}
          </span>
        )}
      </div>

      {isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-300 text-xs font-bold text-slate-950">
          You
        </div>
      )}
    </div>
  );
}

export default Message;
