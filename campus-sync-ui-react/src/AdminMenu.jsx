import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

function AdminMenu() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/", {
      replace: true,
      state: { msg: "You are logged out!" }
    });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-slate-900/80 px-6 sm:px-12 py-4 flex items-center justify-between shadow-xl backdrop-blur-xl">
      {/* Brand Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/admin-dashboard")}>
        <span className="text-xl">⚡</span>
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Campus Sync
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          to="/admin-dashboard"
          className={`font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
            isActive("/admin-dashboard")
              ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/25"
              : "text-slate-300 hover:bg-slate-900 hover:text-slate-100 border border-transparent"
          }`}
        >
          Dashboard
        </Link>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`font-semibold px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              isActive("/add-user") || isActive("/all-users") || location.pathname.startsWith("/update-user/")
                ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/25"
                : "text-slate-300 hover:bg-slate-900 hover:text-slate-100 border border-transparent"
            }`}
          >
            Users <span className="text-xs transition-transform duration-200 group-hover:rotate-180">▼</span>
          </button>

          {userMenuOpen && (
            <>
              {/* Overlay backdrop to close dropdown on outside click */}
              <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)}></div>
              
              <div className="absolute right-0 sm:left-0 mt-2.5 w-44 glass-panel rounded-2xl shadow-2xl p-2 border border-slate-800 z-20 animate-fade-in">
                <Link
                  to="/add-user"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-indigo-600/10 hover:text-indigo-400 transition"
                >
                  Add User
                </Link>
                <Link
                  to="/all-users"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-indigo-600/10 hover:text-indigo-400 transition"
                >
                  All Users
                </Link>
              </div>
            </>
          )}
        </div>

        <Link
          to="/all-subject"
          className={`font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
            isActive("/all-subject")
              ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/25"
              : "text-slate-300 hover:bg-slate-900 hover:text-slate-100 border border-transparent"
          }`}
        >
          Subjects
        </Link>

        <Link
          to="/view-attendance"
          className={`font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
            isActive("/view-attendance")
              ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/25"
              : "text-slate-300 hover:bg-slate-900 hover:text-slate-100 border border-transparent"
          }`}
        >
          Attendance
        </Link>
      </div>

      {/* Right Profiles / Actions */}
      <div className="flex items-center gap-3">
        <Link
          to="/my-profile"
          className={`font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
            isActive("/my-profile")
              ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/25"
              : "text-slate-300 hover:bg-slate-900 hover:text-slate-100 border border-transparent"
          }`}
        >
          My Profile
        </Link>
        <button
          onClick={logout}
          className="bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-500/15 transition-all duration-200 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminMenu;