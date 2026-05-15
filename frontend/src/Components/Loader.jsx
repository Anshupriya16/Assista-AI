import BrandLogo from "./BrandLogo";

function Loader() {
  return (
    <div className="flex justify-start gap-3">
      <BrandLogo className="mt-1 h-9 w-9 rounded-xl" />

      <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.07] px-4 py-3 text-slate-200 shadow-lg shadow-slate-950/20">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-200"></span>
            <span className="h-2 w-2 animate-bounce rounded-full bg-blue-300 [animation-delay:150ms]"></span>
            <span className="h-2 w-2 animate-bounce rounded-full bg-violet-300 [animation-delay:300ms]"></span>
          </div>
          <span className="text-sm font-medium text-slate-300">Assistant is typing</span>
        </div>
      </div>
    </div>
  );
}

export default Loader;
