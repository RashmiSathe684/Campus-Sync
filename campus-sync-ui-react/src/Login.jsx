import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "./apiService";

function Login() {
  const navigate = useNavigate();
  const [loginRequest, setLoginRequest] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setLoginRequest((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await userAPI.loginUser(loginRequest);
      const user = response.data;

      if (user && user.username) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", user.username);
        localStorage.setItem("role", user.role);
        if (user.token) {
          localStorage.setItem("token", user.token);
        }

        if (user.role === "admin") {
          navigate("/admin-dashboard", { replace: true });
        } else if (user.role === "faculty") {
          navigate("/faculty-dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Aurora Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Floating Panel wrapper */}
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Back Link */}
        <div className="text-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="text-slate-400 hover:text-indigo-400 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer transition"
          >
            ← Back to Home
          </button>
        </div>

        {/* Card */}
        <form
          className="glass-panel rounded-3xl p-8 shadow-2xl flex flex-col gap-6"
          onSubmit={submitHandler}
        >
          <div className="text-center">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Access Portal
            </h2>
            <p className="text-slate-400 text-sm mt-2">Sign in to your Campus Sync account</p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm font-semibold text-slate-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={loginRequest.username}
              onChange={inputHandler}
              className="glass-input rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50"
              placeholder="admin"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold text-slate-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginRequest.password}
              onChange={inputHandler}
              className="glass-input rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-xl py-3 px-4 text-xs font-semibold text-center animate-shake">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all duration-200 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;