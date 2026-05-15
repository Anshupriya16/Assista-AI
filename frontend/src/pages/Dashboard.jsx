import { useNavigate } from "react-router-dom";
import PageTemplate from "../Components/PageTemplate";

function Dashboard() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser.name || "there";

  const cards = [
    {
      title: "Start chat",
      description: "Open the assistant and get help instantly.",
      action: "Open chat",
      path: "/",
    },
    {
      title: "Chat history",
      description: "Review previous questions and useful replies.",
      action: "View history",
      path: "/history",
    },
    {
      title: "Settings",
      description: "Adjust language, tone, and chat preferences.",
      action: "Open settings",
      path: "/settings",
    },
  ];

  return (
    <PageTemplate
      eyebrow="Dashboard"
      title={`Welcome, ${userName}`}
      description="Manage your AI workspace, jump back into chats, and keep preferences organized."
      stats={[
        { label: "Status", value: "Online" },
        { label: "Plan", value: "Starter" },
      ]}
    >
      <section className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-cyan-200/10 bg-[#0b1220]/84 p-5 shadow-xl shadow-black/25 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-200/40 sm:p-6"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-300 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/30">
              {card.title.charAt(0)}
            </div>
            <h2 className="mt-5 text-xl font-semibold">{card.title}</h2>
            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">
              {card.description}
            </p>
            <button
              onClick={() => navigate(card.path)}
              className="mt-5 w-full rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-950/25 transition hover:bg-cyan-200"
            >
              {card.action}
            </button>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
        <div className="rounded-2xl border border-cyan-200/10 bg-[#0b1220]/84 p-6 shadow-xl shadow-black/25 backdrop-blur-xl">
          <h2 className="text-xl font-semibold">Project status</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Assista AI is connected to the React frontend and ready for backend profile, settings, and chat data.
          </p>
        </div>

        <div className="rounded-2xl border border-violet-300/10 bg-[#0b1220]/84 p-6 shadow-xl shadow-black/25 backdrop-blur-xl">
          <p className="text-sm font-medium text-slate-400">Current state</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">Online</p>
        </div>
      </section>
    </PageTemplate>
  );
}

export default Dashboard;
