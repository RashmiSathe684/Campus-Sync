import { useEffect, useState } from "react";
import { userAPI } from "./apiService";
import AdminMenu from "./AdminMenu";
import FacultyMenu from "./FacultyMenu";

function Profile() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  // Fetch user data
  useEffect(() => {
    userAPI.getUserByUsername(username)
      .then((response) => {
        setUser(response.data);
        setFormData(response.data);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError("Failed to load profile details.");
      });
  }, [username]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    setError("");
    setSuccess("");
    setLoading(true);
    userAPI.updateUser(formData)
      .then((response) => {
        setSuccess("Profile updated successfully!");
        setUser(response.data);
        setIsEditing(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error updating profile. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center relative overflow-hidden">
        {/* Background Aurora Gradients */}
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="text-slate-400 font-semibold flex items-center gap-2 z-10">
          <svg className="animate-spin h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading Profile Details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Aurora Gradients */}
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      {role === "admin" ? <AdminMenu /> : <FacultyMenu />}

      <div className="max-w-4xl mx-auto py-12 px-6 sm:px-12 flex-1 w-full z-10 animate-fade-in flex flex-col justify-center">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage your credentials, contact information, and security preferences</p>
        </div>

        <div className="glass-panel border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled
                className="glass-input rounded-xl px-4 py-3 text-sm opacity-60 cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</label>
              <input
                type="text"
                name="role"
                value={formData.role.toUpperCase()}
                disabled
                className="glass-input rounded-xl px-4 py-3 text-sm opacity-60 cursor-not-allowed font-semibold text-indigo-400"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`glass-input rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                  isEditing 
                    ? "focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/25" 
                    : "opacity-60 cursor-not-allowed"
                }`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`glass-input rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                  isEditing 
                    ? "focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/25" 
                    : "opacity-60 cursor-not-allowed"
                }`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`glass-input rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                  isEditing 
                    ? "focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/25" 
                    : "opacity-60 cursor-not-allowed"
                }`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="••••••••"
                onChange={handleChange}
                disabled={!isEditing}
                className={`glass-input rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                  isEditing 
                    ? "focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/25" 
                    : "opacity-60 cursor-not-allowed"
                }`}
              />
            </div>
          </div>

          {error && (
            <div className="text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-xl py-3 px-4 text-xs font-semibold text-center mt-2 animate-shake">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-xl py-3 px-4 text-xs font-semibold text-center mt-2">
              ✅ {success}
            </div>
          )}

          <div className="flex justify-end gap-4 mt-4">
            {!isEditing ? (
              <button
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setIsEditing(true);
                }}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(user);
                    setError("");
                    setSuccess("");
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-xl text-sm font-bold hover:text-white transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;