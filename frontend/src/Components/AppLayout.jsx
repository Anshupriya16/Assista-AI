import Sidebar from "./Sidebar";

function AppLayout({ children }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#080d17] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.07)_1px,transparent_1px)] bg-[size:34px_34px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(34,211,238,0.26),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(96,165,250,0.18),transparent_26%),radial-gradient(circle_at_52%_105%,rgba(168,85,247,0.18),transparent_30%),linear-gradient(135deg,#080d17_0%,#0b1220_45%,#121426_100%)]" />
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 flex h-full w-full flex-col md:flex-row">
        <Sidebar />
        <main className="min-h-0 flex-1 overflow-hidden pb-20 md:pb-0">{children}</main>
      </div>
    </div>
  );
}

export default AppLayout;
