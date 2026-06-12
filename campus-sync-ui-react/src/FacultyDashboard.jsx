import { Link } from "react-router-dom";
import FacultyMenu from "./FacultyMenu";

const facultyFunctions = [
  {
    title: "Add Students",
    description: "Register new students into the system database.",
    href: "/add-student",
    icon: "👨‍🎓",
    color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-400",
  },
  {
    title: "All Students",
    description: "Search and browse student details and profiles.",
    href: "/all-students",
    icon: "👥",
    color: "from-purple-500/10 to-indigo-500/10 border-purple-500/20 text-purple-400",
  },
  {
    title: "Manage Students",
    description: "Update student details, emails, or delete profiles.",
    href: "/all-students",
    icon: "🛠️",
    color: "from-pink-500/10 to-rose-500/10 border-rose-500/20 text-rose-400",
  },
  {
    title: "Mark Attendance",
    description: "Conduct attendance verification session for a lecture.",
    href: "/mark-attendance",
    icon: "✅",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400",
  },
  {
    title: "View Attendance",
    description: "Check course attendance metrics and faculty logs.",
    href: "/view-attendance",
    icon: "📊",
    color: "from-cyan-500/10 to-blue-500/10 border-cyan-500/20 text-cyan-400",
  },
  {
    title: "My Profile",
    description: "View and edit your faculty user account detail.",
    href: "/my-profile",
    icon: "🧑‍💼",
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400",
  },
];

function FacultyDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Aurora Gradients */}
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <FacultyMenu />

      <div className="max-w-6xl mx-auto py-12 px-6 sm:px-12 flex-1 w-full z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
            Faculty Panel
          </h2>
          <p className="text-slate-400 text-sm mt-2">Access quick student logs, registers, and records</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facultyFunctions.map((func, idx) => (
            <Link
              key={idx}
              to={func.href}
              className={`glass-card bg-gradient-to-br ${func.color} rounded-2xl p-6 flex flex-col items-center text-center hover:scale-[1.03] hover:border-slate-700/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group`}
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition duration-300">
                {func.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">
                {func.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{func.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard;