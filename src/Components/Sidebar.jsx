import { useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo";

const navItems = [
  { label: "Chat", path: "/", icon: "+" },
  { label: "Dashboard", path: "/dashboard", icon: "D" },
  { label: "History", path: "/history", icon: "H" },
  { label: "Profile", path: "/profile", icon: "P" },
  { label: "Settings", path: "/settings", icon: "S" },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <aside className="hidden w-72 shrink-0 border-r border-cyan-200/10 bg-[#0b1220]/90 text-white shadow-2xl shadow-black/20 backdrop-blur-xl md:flex md:h-full md:flex-col">
        <div className="px-5 py-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
          <BrandLogo className="mb-4 h-12 w-12 rounded-2xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            Workspace
          </p>
          <h2 className="mt-2 text-lg font-semibold">Assista AI</h2>
          <p className="mt-1 text-sm leading-5 text-slate-400">
            Chat, history, profile, and preferences in one focused workspace.
          </p>
        </div>
      </div>

        <nav className="flex flex-1 flex-col gap-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={`flex min-w-fit items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition md:w-full ${
                isActive
                  ? "bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-950/30"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  isActive ? "bg-slate-950/10" : "bg-white/10 text-violet-200"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

        <div className="p-4">
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="w-full rounded-xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-100 transition hover:border-red-300/50 hover:bg-red-400/20"
        >
          Logout
        </button>
      </div>
      </aside>

      <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 gap-1 rounded-2xl border border-cyan-200/10 bg-[#0b1220]/94 p-2 shadow-2xl shadow-black/35 backdrop-blur-xl md:hidden">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-semibold transition ${
                isActive
                  ? "bg-cyan-300 text-slate-950"
                  : "text-slate-300 hover:bg-white/10"
              }`}
            >
              <span className="text-sm leading-none">{item.icon}</span>
              <span className="max-w-full truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

export default Sidebar;
