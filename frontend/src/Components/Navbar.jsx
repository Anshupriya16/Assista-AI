import { useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="flex w-full shrink-0 items-center justify-between border-b border-cyan-200/10 bg-[#0b1220]/94 px-4 py-3 text-white shadow-lg shadow-black/20 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        className="flex items-center gap-3"
        onClick={() => navigate("/")}
      >
        <BrandLogo />
        <span className="text-lg font-semibold">Assista AI</span>
      </button>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-200/60 hover:bg-cyan-300/10"
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200"
        >
          Signup
        </button>
      </div>
    </header>
  );
}

export default Navbar;
