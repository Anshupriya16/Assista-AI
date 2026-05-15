import { useState } from "react";
import PageTemplate from "../Components/PageTemplate";
import { clearHistory, updateSettings } from "../Components/services/api";

function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState("Balanced");
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const settings = { darkMode, saveHistory, language, tone };

    if (!token) {
      setMessage("Please log in to save settings.");
      return;
    }

    try {
      await updateSettings(settings, token);
      setMessage("Settings saved successfully.");
    } catch {
      setMessage("Unable to save settings. Please try again.");
    }

    setTimeout(() => setMessage(""), 2500);
  };

  const handleClearHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please log in to clear history.");
      return;
    }

    try {
      await clearHistory(token);
      setMessage("Chat history cleared.");
    } catch {
      setMessage("Unable to clear chat history.");
    }
  };

  return (
    <PageTemplate
      eyebrow="Preferences"
      title="Settings"
      description="Tune the chatbot experience to match how you like to work."
      stats={[
        { label: "Language", value: language },
        { label: "Tone", value: tone },
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr] lg:gap-5">
        <section className="rounded-2xl border border-cyan-200/10 bg-[#0b1220]/84 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
          <h2 className="text-xl font-semibold">Chat preferences</h2>
          <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
            <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium">Dark mode</p>
                <p className="mt-1 text-sm text-slate-400">Keep the interface comfortable in low light.</p>
              </div>
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className={`relative h-7 w-12 rounded-full transition ${darkMode ? "bg-cyan-300 shadow-lg shadow-cyan-950/30" : "bg-slate-700"}`}
                aria-pressed={darkMode}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                    darkMode ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium">Save chat history</p>
                <p className="mt-1 text-sm text-slate-400">Store conversations for review later.</p>
              </div>
              <button
                type="button"
                onClick={() => setSaveHistory(!saveHistory)}
                className={`relative h-7 w-12 rounded-full transition ${saveHistory ? "bg-cyan-300 shadow-lg shadow-cyan-950/30" : "bg-slate-700"}`}
                aria-pressed={saveHistory}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                    saveHistory ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>

            <label className="block rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <span className="font-medium">Language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-3 w-full rounded-xl border border-white/10 bg-[#08111f] px-4 py-3 text-white outline-none focus:border-cyan-200/70"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>French</option>
              </select>
            </label>

            <label className="block rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <span className="font-medium">Assistant tone</span>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="mt-3 w-full rounded-xl border border-white/10 bg-[#08111f] px-4 py-3 text-white outline-none focus:border-cyan-200/70"
              >
                <option>Balanced</option>
                <option>Friendly</option>
                <option>Professional</option>
                <option>Concise</option>
              </select>
            </label>
          </div>
        </section>

        <aside className="rounded-2xl border border-violet-300/10 bg-[#0b1220]/84 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6">
          <h2 className="text-xl font-semibold">Account actions</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            These controls are ready for backend wiring when you add persistent preferences.
          </p>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleClearHistory}
              className="w-full rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 font-semibold text-red-100 transition hover:border-red-300/50 hover:bg-red-400/20"
            >
              Clear chat history
            </button>
            <button
              onClick={handleSave}
              className="w-full rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-950/25 transition hover:bg-cyan-200"
            >
              Save settings
            </button>
          </div>

          {message && (
            <p className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
              {message}
            </p>
          )}
        </aside>
      </div>
    </PageTemplate>
  );
}

export default Settings;
