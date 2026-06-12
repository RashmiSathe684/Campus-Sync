import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import { subjectAPI } from "./apiService";

function AdminDashboard() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Add new subject via custom dialog modal
  const handleAddSubject = (e) => {
    e.preventDefault();
    setError("");
    if (!subjectName || subjectName.trim() === "") {
      setError("Subject name cannot be empty!");
      return;
    }

    setLoading(true);
    subjectAPI.addSubject({ name: subjectName.trim() })
      .then(() => {
        setSubjectName("");
        setShowAddModal(false);
        navigate('/all-subject');
      })
      .catch((err) => {
        console.error("Error adding subject:", err);
        setError("Failed to add subject.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const adminFunctions = [
    {
      title: "Add User",
      description: "Register new system accounts for administrators or faculty staff.",
      href: "/add-user",
      icon: "👤",
      color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-400",
    },
    {
      title: "All Users",
      description: "Manage credentials, system roles, and view user profiles.",
      href: "/all-users",
      icon: "👥",
      color: "from-purple-500/10 to-indigo-500/10 border-purple-500/20 text-purple-400",
    },
    {
      title: "Manage Users",
      description: "Perform quick actions, remove, or modify user security privileges.",
      href: "/all-users",
      icon: "🛠️",
      color: "from-pink-500/10 to-rose-500/10 border-rose-500/20 text-rose-400",
    },
    {
      title: "Add Subject",
      description: "Inject new subjects and courses into the active academic roster.",
      onClick: () => setShowAddModal(true),
      icon: "📖",
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400",
    },
    {
      title: "All Subjects",
      description: "Edit subject identifiers and manage curriculums.",
      href: "/all-subject",
      icon: "📚",
      color: "from-cyan-500/10 to-blue-500/10 border-cyan-500/20 text-cyan-400",
    },
    {
      title: "View Attendance",
      description: "Generate charts and export attendance record sheets.",
      href: "/view-attendance",
      icon: "📊",
      color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Aurora Gradients */}
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <AdminMenu />

      <div className="max-w-6xl mx-auto py-12 px-6 sm:px-12 flex-1 w-full z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
            Admin Panel
          </h2>
          <p className="text-slate-400 text-sm mt-2">Manage the institution configurations and credentials</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFunctions.map((func, idx) => (
            <div
              key={idx}
              onClick={
                func.onClick
                  ? func.onClick
                  : () => navigate(func.href)
              }
              className={`cursor-pointer glass-card bg-gradient-to-br ${func.color} rounded-2xl p-6 flex flex-col items-center text-center hover:scale-[1.03] hover:border-slate-700/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group`}
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition duration-300">
                {func.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">
                {func.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{func.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CUSTOM ADD SUBJECT MODAL DIALOG BOX */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          {/* Backdrop Close Click */}
          <div className="absolute inset-0" onClick={() => setShowAddModal(false)}></div>
          
          <form 
            onSubmit={handleAddSubject}
            className="glass-panel border border-slate-800 rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl flex flex-col gap-5 animate-scale-up"
          >
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Add Subject
              </h3>
            </div>

            {error && (
              <div className="text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-xl py-2 px-3 text-xs font-semibold text-center animate-shake">
                ⚠️ {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="subjectName" className="text-sm font-semibold text-slate-300">
                Subject Name
              </label>
              <input
                type="text"
                id="subjectName"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="glass-input rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50"
                placeholder="e.g. Advanced Operating Systems"
                required
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Subject"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;