import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "../Components/BrandLogo";
import { loginUser } from "../Components/services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please fill all fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await loginUser(email, password);

      localStorage.setItem("token", res.token);
      if (res.user) localStorage.setItem("user", JSON.stringify(res.user));
      setMessage("Login successful. Redirecting to chat...");
      setTimeout(() => navigate("/"), 700);
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#080d17_0%,#0b1220_48%,#121426_100%)] px-4 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.07)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-2xl border border-cyan-200/10 bg-[#0b1220]/84 shadow-2xl shadow-black/35 backdrop-blur-xl lg:grid-cols-[1fr_0.9fr]">
        <section className="hidden border-r border-white/10 p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <BrandLogo className="h-12 w-12 rounded-2xl" />
            <h1 className="mt-8 text-4xl font-semibold leading-tight">
              Welcome back to Assista AI.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
              Continue your conversations, review answers, and get quick help with writing, learning, and planning.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            {["Fast", "Private", "Helpful"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm font-medium text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            Login
          </p>
          <h2 className="mt-2 text-3xl font-semibold">Access your account</h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter your details to continue chatting.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-200">Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/70 focus:ring-2 focus:ring-cyan-200/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">Password</span>
              <input
                type="password"
                placeholder="Enter password"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/70 focus:ring-2 focus:ring-cyan-200/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          {message && (
            <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-center text-sm text-slate-200">
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-slate-400">
            New here?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-semibold text-cyan-200 hover:text-cyan-100"
            >
              Create an account
            </button>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;
