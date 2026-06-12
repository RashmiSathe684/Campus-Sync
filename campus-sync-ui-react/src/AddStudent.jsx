import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FacultyMenu from "./FacultyMenu";
import { studentAPI } from "./apiService";

function AddStudent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    studentAPI.addStudent(formData)
      .then((response) => {
        setSuccess("Student added successfully!");
        setFormData({ name: "", email: "" });
      })
      .catch((err) => {
        console.error("Error:", err);
        setError("Failed to add student. Please try again.");
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

      <FacultyMenu />

      <div className="flex-1 flex justify-center items-center py-12 px-6 relative z-10 animate-fade-in">
        <form 
          onSubmit={handleSubmit} 
          className="glass-panel border border-slate-800 rounded-3xl p-8 w-full max-w-md flex flex-col gap-6 shadow-2xl animate-scale-up"
        >
          <div className="text-center">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Add Student
            </h2>
            <p className="text-slate-400 text-sm mt-1">Register a student in the active registry</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alice Johnson"
              required
              className="glass-input rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alice.j@university.edu"
              required
              className="glass-input rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50"
            />
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
              onClick={() => navigate("/faculty-dashboard")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;