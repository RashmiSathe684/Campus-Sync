import { useState } from "react";
import AdminMenu from "./AdminMenu";
import { userAPI } from "./apiService";

function AddUser() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await userAPI.registerUser(form);
      setSuccess("User registered successfully!");
      setForm({ username: "", password: "", email: "", role: "", firstName: "", lastName: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Aurora Gradients */}
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <AdminMenu />

      <div className="flex-1 flex justify-center items-center py-12 px-6 relative z-10">
        <form
          className="glass-panel border border-slate-800 rounded-3xl p-8 w-full max-w-2xl flex flex-col gap-6 shadow-2xl animate-scale-up"
          onSubmit={submitHandler}
        >
          <div className="text-center">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Register User
            </h2>
            <p className="text-slate-400 text-sm mt-1">Create a new faculty or admin account</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-sm font-semibold text-slate-300">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={inputHandler}
                className="glass-input rounded-xl px-4 py-3 text-sm"
                placeholder="e.g. jsmith"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-300">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={inputHandler}
                className="glass-input rounded-xl px-4 py-3 text-sm"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={inputHandler}
                className="glass-input rounded-xl px-4 py-3 text-sm"
                placeholder="jsmith@university.edu"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="role" className="text-sm font-semibold text-slate-300">System Role</label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={inputHandler}
                className="glass-input rounded-xl px-4 py-3 text-sm cursor-pointer"
                required
              >
                <option value="" disabled>Select role</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName" className="text-sm font-semibold text-slate-300">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={inputHandler}
                className="glass-input rounded-xl px-4 py-3 text-sm"
                placeholder="John"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="lastName" className="text-sm font-semibold text-slate-300">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={inputHandler}
                className="glass-input rounded-xl px-4 py-3 text-sm"
                placeholder="Smith"
                required
              />
            </div>
          </div>

          {success && (
            <div className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-xl py-3 px-4 text-xs font-semibold text-center">
              ✅ {success}
            </div>
          )}
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
            {loading ? "Registering..." : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;