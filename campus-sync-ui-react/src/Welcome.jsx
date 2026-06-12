import { useLocation, Link } from "react-router-dom";

const functionalities = [
  {
    title: "Mark Attendance",
    description: "Instantly record student attendance for any class or subject with a clean checkbox grid.",
    icon: "📋",
  },
  {
    title: "View Records",
    description: "Search, filter, and analyze historical attendance logs by faculty, subject, and date.",
    icon: "📑",
  },
  {
    title: "Manage Curriculum",
    description: "Easily register students, configure active courses, and control system subjects.",
    icon: "👨‍🎓",
  },
  {
    title: "Real-time Metrics",
    description: "Generate statistics and review overall student engagement percentages on the fly.",
    icon: "📊",
  },
];

const Welcome = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Aurora Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="w-full glass-panel border-b border-slate-900/80 sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Campus Sync
          </h1>
        </div>

        <Link
          to="/login"
          className="relative group overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <span className="relative z-10">Login Portal</span>
        </Link>
      </header>

      {/* Logout Message notification */}
      {location.state?.msg && (
        <div className="max-w-md mx-auto mt-6 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-center backdrop-blur-md animate-fade-in">
          {location.state.msg}
        </div>
      )}

      {/* Main Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <div className="text-center max-w-3xl mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Smart Attendance Management
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            A secure, automated system built for modern faculties and administrators to synchronize classes, student roles, and attendance tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {functionalities.map((func, idx) => (
            <div
              key={idx}
              className="glass-card hover:bg-slate-900/60 rounded-2xl p-6 flex flex-col items-center text-center hover:scale-[1.03] hover:border-slate-700/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                {func.icon}
              </div>
              <h3 className="text-lg font-semibold text-indigo-400 mb-2 group-hover:text-indigo-300 transition-colors">
                {func.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{func.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Welcome;