import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../Components/PageTemplate";
import { getProfile, updateProfile } from "../Components/services/api";

function Profile() {
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [user, setUser] = useState({
    name: savedUser.name || "Assista User",
    email: savedUser.email || "Not signed in",
    role: "AI Chatbot User",
  });
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getProfile(token)
      .then((data) => {
        const nextUser = { ...data, role: "AI Chatbot User" };
        setUser(nextUser);
        setName(nextUser.name);
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch(() => setMessage("Profile is using locally saved account data."));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token || !name.trim()) return;

    try {
      const data = await updateProfile(name.trim(), token);
      const nextUser = { ...data.user, role: "AI Chatbot User" };
      setUser(nextUser);
      localStorage.setItem("user", JSON.stringify(data.user));
      setEditing(false);
      setMessage("Profile updated.");
    } catch {
      setMessage("Unable to update profile. Please try again.");
    }
  };

  return (
    <PageTemplate
      eyebrow="Profile"
      title="Account overview"
      description="Your identity, plan, and recent Assista AI activity in one place."
      stats={[
        { label: "Plan", value: "Starter" },
        { label: "Status", value: "Online" },
      ]}
    >
      {message && (
        <div className="rounded-2xl border border-cyan-200/20 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
          {message}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:gap-5">
        <section className="rounded-2xl border border-cyan-200/10 bg-[#0b1220]/84 p-5 text-center shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-300 text-3xl font-bold text-slate-950 shadow-lg shadow-cyan-950/30 sm:h-24 sm:w-24 sm:text-4xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
          {editing ? (
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-5 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-center text-xl font-semibold text-white outline-none focus:border-cyan-200/70"
            />
          ) : (
            <h1 className="mt-4 text-2xl font-semibold sm:mt-5 sm:text-3xl">{user.name}</h1>
          )}
          <p className="mt-2 break-all text-sm text-slate-400 sm:text-base">{user.email}</p>
          <span className="mt-4 inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-medium text-emerald-100 sm:text-sm">
            {user.role}
          </span>

          <div className="mt-6 grid gap-3 sm:mt-8">
            <button
              onClick={editing ? handleSaveProfile : () => setEditing(true)}
              className="rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-950/25 transition hover:bg-cyan-200"
            >
              {editing ? "Save profile" : "Edit profile"}
            </button>
            <button
              onClick={handleLogout}
              className="rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 font-semibold text-red-100 transition hover:border-red-300/50 hover:bg-red-400/20"
            >
              Logout
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-200/10 bg-[#0b1220]/84 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
          <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
            {[
              ["Plan", "Starter"],
              ["Chats", "Active"],
              ["Status", "Online"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {label}
                </p>
                <p className="mt-2 text-lg font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.06] p-4 sm:mt-6 sm:p-5">
            <h3 className="font-semibold">Recent activity</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>Signed in to Assita AI</p>
              <p>Chat preferences synced locally</p>
              <p>Dashboard ready for backend profile data</p>
            </div>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
}

export default Profile;
