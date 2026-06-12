import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userAPI } from "./apiService";
import AdminMenu from "./AdminMenu";

function UpdateUser() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
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

  // Fetch user details by username
  useEffect(() => {
    userAPI.getUserByUsername(username)
      .then((response) => setUser(response.data))
      .catch((err) => console.error("Error fetching user:", err));
  }, [username]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    userAPI.updateUser(user)
      .then(() => {
        setSuccess("User updated successfully!");
        setTimeout(() => {
          navigate("/all-users");
        }, 1500);
      })
      .catch((err) => {
        console.error("Error updating user:", err);
        setError("Failed to update user!");
      })
      .finally(() => {
        setLoading(false);
      });
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
          onSubmit={handleSubmit}
        >
          <div className="text-center">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Update User
            </h2>
            <p className="text-slate-400 text-sm mt-1">Modify account details and permissions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-sm font-semibold text-slate-300">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={user.username}
                disabled
                className="glass-input rounded-xl px-4 py-3 text-sm opacity-50 cursor-not-allowed bg-slate-900/60"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-300">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={user.password}
                onChange={handleChange}
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
                value={user.email}
                onChange={handleChange}
                className="glass-input rounded-xl px-4 py-3 text-sm"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="role" className="text-sm font-semibold text-slate-300">System Role</label>
              <select
                id="role"
                name="role"
                value={user.role}
                onChange={handleChange}
                className="glass-input rounded-xl px-4 py-3 text-sm cursor-pointer"
                required
              >
                <option value="" disabled>Select Role</option>
                <option value="admin">Administrator</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName" className="text-sm font-semibold text-slate-300">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                className="glass-input rounded-xl px-4 py-3 text-sm"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="lastName" className="text-sm font-semibold text-slate-300">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                className="glass-input rounded-xl px-4 py-3 text-sm"
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

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => navigate("/all-users")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;