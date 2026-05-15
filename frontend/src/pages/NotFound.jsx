import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-y-auto bg-[#080d17] px-4 py-10 text-center text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.07)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.22),transparent_30%),linear-gradient(135deg,#080d17,#121426)]" />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 w-full max-w-xl rounded-2xl border border-cyan-200/10 bg-[#0b1220]/84 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
          404
        </p>
        <h1 className="mt-3 text-5xl font-semibold">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-300">
          The page you are looking for does not exist or has moved.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-7 rounded-xl bg-cyan-300 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200"
        >
          Go back home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
