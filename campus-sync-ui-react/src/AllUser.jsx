import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "./apiService";
import AdminMenu from "./AdminMenu";

function AllUser() {
  const [users, setUsers] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch all users
  const fetchUsers = () => {
    userAPI.getAllUsers()
      .then((response) => setUsers(response.data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const triggerDelete = (username) => {
    setUserToDelete(username);
    setShowConfirm(true);
  };

  // Delete user
  const handleDeleteUser = () => {
    setLoading(true);
    setError("");
    setSuccess("");
    userAPI.deleteUserByUsername(userToDelete)
      .then(() => {
        setShowConfirm(false);
        setUserToDelete("");
        setSuccess("User deleted successfully!");
        fetchUsers();
      })
      .catch((err) => {
        setShowConfirm(false);
        setUserToDelete("");
        setError("Error deleting user. Details: User may be associated with attendance records.");
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

      <div className="max-w-6xl mx-auto py-12 px-6 sm:px-12 flex-1 w-full z-10 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Registered Users
            </h1>
            <p className="text-slate-400 text-sm mt-1">Configure user accounts and access levels</p>
          </div>
          <button
            onClick={() => navigate("/add-user")}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
          >
            + Add User
          </button>
        </div>

        {error && (
          <div className="text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-xl py-3 px-4 text-xs font-semibold text-center mb-6 animate-shake">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 rounded-xl py-3 px-4 text-xs font-semibold text-center mb-6">
            ✅ {success}
          </div>
        )}

        <div className="glass-panel border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">First Name</th>
                  <th className="px-6 py-4">Last Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-sm">
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr
                      key={user.username || index}
                      className="hover:bg-slate-900/20 transition-all duration-150"
                    >
                      <td className="px-6 py-4 font-semibold text-white">{user.username}</td>
                      <td className="px-6 py-4 text-slate-300">{user.firstName}</td>
                      <td className="px-6 py-4 text-slate-300">{user.lastName}</td>
                      <td className="px-6 py-4 text-slate-400">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                          user.role === 'admin' 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {user.role ? user.role : "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() => navigate(`/update-user/${user.username}`)}
                          className="bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-indigo-600 hover:text-white transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => triggerDelete(user.username)}
                          className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-rose-500 hover:text-white transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-500 font-medium">
                      No registered users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CUSTOM CONFIRM DELETE DIALOG BOX */}
      {showConfirm && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setShowConfirm(false)}></div>
          
          <div className="glass-panel border border-slate-800 rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl flex flex-col gap-5 animate-scale-up">
            <div>
              <h3 className="text-2xl font-bold text-rose-400">
                Confirm Delete
              </h3>
              <p className="text-slate-400 text-sm mt-2">
                Are you sure you want to delete user <span className="font-semibold text-white">@{userToDelete}</span>? This action is permanent.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-rose-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllUser;