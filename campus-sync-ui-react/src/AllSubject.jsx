import { useEffect, useState } from "react";
import { subjectAPI } from "./apiService";
import AdminMenu from "./AdminMenu";

function AllSubject() {
  const [subjects, setSubjects] = useState([]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form states
  const [addName, setAddName] = useState("");
  const [editSubject, setEditSubject] = useState({ id: "", name: "" });
  const [deleteId, setDeleteId] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all subjects
  const fetchSubjects = () => {
    subjectAPI.getAllSubjects()
      .then((response) => setSubjects(response.data))
      .catch((err) => console.error("Error fetching subjects:", err));
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Add new subject
  const handleAddSubject = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!addName || addName.trim() === "") {
      setError("Subject name cannot be empty!");
      return;
    }

    setLoading(true);
    subjectAPI.addSubject({ name: addName.trim() })
      .then(() => {
        setAddName("");
        setShowAddModal(false);
        setSuccess("Subject added successfully!");
        fetchSubjects();
      })
      .catch((err) => {
        console.error("Error adding subject:", err);
        setError("Failed to add subject.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Edit subject
  const handleEditSubject = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!editSubject.name || editSubject.name.trim() === "") {
      setError("Subject name cannot be empty!");
      return;
    }

    setLoading(true);
    subjectAPI.updateSubject({ id: editSubject.id, name: editSubject.name.trim() })
      .then(() => {
        setEditSubject({ id: "", name: "" });
        setShowEditModal(false);
        setSuccess("Subject updated successfully!");
        fetchSubjects();
      })
      .catch((err) => {
        console.error("Error updating subject:", err);
        setError("Failed to update subject.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Trigger delete modal
  const triggerDelete = (id) => {
    setDeleteId(id);
    setError("");
    setSuccess("");
    setShowDeleteModal(true);
  };

  // Delete subject
  const handleDeleteSubject = () => {
    setLoading(true);
    setError("");
    setSuccess("");
    subjectAPI.deleteSubject(deleteId)
      .then(() => {
        setDeleteId(null);
        setShowDeleteModal(false);
        setSuccess("Subject deleted successfully!");
        fetchSubjects();
      })
      .catch((err) => {
        console.error("Error deleting subject:", err);
        setShowDeleteModal(false);
        setDeleteId(null);
        setError("Failed to delete subject. It may be associated with attendance logs.");
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
              Subjects Curriculum
            </h1>
            <p className="text-slate-400 text-sm mt-1">Configure study subjects and courses</p>
          </div>
          <button
            onClick={() => {
              setError("");
              setSuccess("");
              setShowAddModal(true);
            }}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
          >
            + Add Subject
          </button>
        </div>

        {error && !showAddModal && !showEditModal && (
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
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Subject ID</th>
                  <th className="px-6 py-4">Subject Name</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-sm">
                {subjects.length > 0 ? (
                  subjects.map((subject, index) => (
                    <tr
                      key={subject.id || index}
                      className="hover:bg-slate-900/20 transition duration-150"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-500">{index + 1}</td>
                      <td className="px-6 py-4 font-semibold text-white">#{subject.id}</td>
                      <td className="px-6 py-4 text-slate-200 font-medium">{subject.name}</td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() => {
                            setError("");
                            setSuccess("");
                            setEditSubject({ id: subject.id, name: subject.name });
                            setShowEditModal(true);
                          }}
                          className="bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-indigo-600 hover:text-white transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => triggerDelete(subject.id)}
                          className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-rose-500 hover:text-white transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-slate-500 font-medium">
                      No subjects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CUSTOM ADD SUBJECT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setShowAddModal(false)}></div>
          <form 
            onSubmit={handleAddSubject}
            className="glass-panel border border-slate-800 rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl flex flex-col gap-5 animate-scale-up"
          >
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Add Subject
              </h3>
              <p className="text-slate-400 text-xs mt-1">Configure a new course in the curriculum</p>
            </div>
            {error && (
              <div className="text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-xl py-2 px-3 text-xs font-semibold text-center animate-shake">
                ⚠️ {error}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label htmlFor="addSubjectName" className="text-sm font-semibold text-slate-300">
                Subject Name
              </label>
              <input
                type="text"
                id="addSubjectName"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                className="glass-input rounded-xl px-4 py-3 text-sm"
                placeholder="e.g. Computer Organization"
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

      {/* CUSTOM EDIT SUBJECT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setShowEditModal(false)}></div>
          <form 
            onSubmit={handleEditSubject}
            className="glass-panel border border-slate-800 rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl flex flex-col gap-5 animate-scale-up"
          >
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Edit Subject
              </h3>
              <p className="text-slate-400 text-xs mt-1">Modify the curriculum course details</p>
            </div>
            {error && (
              <div className="text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-xl py-2 px-3 text-xs font-semibold text-center animate-shake">
                ⚠️ {error}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label htmlFor="editSubjectName" className="text-sm font-semibold text-slate-300">
                Subject Name
              </label>
              <input
                type="text"
                id="editSubjectName"
                value={editSubject.name}
                onChange={(e) => setEditSubject({ ...editSubject, name: e.target.value })}
                className="glass-input rounded-xl px-4 py-3 text-sm"
                required
                autoFocus
              />
            </div>
            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CUSTOM CONFIRM DELETE DIALOG BOX */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setShowDeleteModal(false)}></div>
          <div className="glass-panel border border-slate-800 rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl flex flex-col gap-5 animate-scale-up">
            <div>
              <h3 className="text-2xl font-bold text-rose-400">
                Delete Subject
              </h3>
              <p className="text-slate-400 text-sm mt-2">
                Are you sure you want to delete this subject? This action will fail if the subject is currently linked to any historical attendance logs.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubject}
                className="bg-rose-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Subject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllSubject;