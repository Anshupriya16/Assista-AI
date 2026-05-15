import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "../Components/BrandLogo";
import { signupUser } from "../Components/services/api";
import pageBg from "../images/chatbot images6.png";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setMessage("Please fill all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await signupUser(formData.name, formData.email, formData.password);
      setMessage("Signup successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen w-screen items-center justify-center overflow-y-auto bg-[#080d17] px-4 py-8 text-white"
      style={{
        backgroundImage: `url(${pageBg}), radial-gradient(circle at top left, rgba(34,211,238,0.22), transparent 28%), radial-gradient(circle at bottom right, rgba(168,85,247,0.2), transparent 26%), linear-gradient(to bottom right, #080d17, #121426)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/62" />

      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-2xl border border-cyan-200/10 bg-[#0b1220]/84 shadow-2xl shadow-black/35 backdrop-blur-xl lg:grid-cols-[0.9fr_1fr]">
        <section className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            Signup
          </p>
          <h2 className="mt-2 text-3xl font-semibold">Create your account</h2>
          <p className="mt-2 text-sm text-slate-400">
            Start a workspace for helpful AI conversations.
          </p>

          <form onSubmit={handleSignup} className="mt-8 grid gap-4">
            {[
              { label: "Name", name: "name", type: "text", placeholder: "Your name" },
              { label: "Email", name: "email", type: "email", placeholder: "you@example.com" },
              { label: "Password", name: "password", type: "password", placeholder: "Create password" },
              { label: "Confirm Password", name: "confirmPassword", type: "password", placeholder: "Confirm password" },
            ].map((field) => (
              <label key={field.name} className="block">
                <span className="text-sm font-medium text-slate-200">{field.label}</span>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200/70 focus:ring-2 focus:ring-cyan-200/20"
                  value={formData[field.name]}
                  onChange={handleChange}
                />
              </label>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {message && (
            <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-center text-sm text-slate-200">
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-cyan-200 hover:text-cyan-100"
            >
              Login
            </button>
          </p>
        </section>

        <section className="hidden border-l border-white/10 p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <BrandLogo className="h-12 w-12 rounded-2xl" />
            <h1 className="mt-8 text-4xl font-semibold leading-tight">
              Build a calmer way to get things done.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Save your chats, revisit useful answers, and keep your assistant ready for everyday work.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
            <p className="text-sm font-semibold text-white">What you get</p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>Personal chat history</p>
              <p>Clean dashboard controls</p>
              <p>Responsive experience on every screen</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Signup;
