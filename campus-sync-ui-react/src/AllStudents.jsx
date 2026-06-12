import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentAPI } from "./apiService";
import FacultyMenu from "./FacultyMenu";

function AllStudents() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ id: "", name: "", email: "" });
  const [showConfirm, setShowConfirm] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch students
  const fetchStudents = () => {
    studentAPI.getAllStudents()
      .then((response) => setStudents(response.data))
      .catch((err) => console.error("Error fetching students:", err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const triggerDelete = (id) => {
    setStudentToDelete(id);
    setShowConfirm(true);
  };

  // Delete student
  const deleteStudent = () => {
    setDeleteLoading(true);
    setError("");
    setSuccess("");
    studentAPI.deleteStudent(studentToDelete)
      .then(() => {
        setStudents(students.filter((s) => s.id !== studentToDelete));
        setShowConfirm(false);
        setStudentToDelete(null);
        setSuccess("Student deleted successfully!");
      })
      .catch((err) => {
        console.error("Error deleting student:", err);
        setShowConfirm(false);
        setStudentToDelete(null);
        setError("Failed to delete student. They may be associated with attendance logs.");
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  // Handle edit click
  const startEditing = (student) => {
    setEditingStudent(student.id);
    setFormData({ id: student.id, name: student.name, email: student.email });
    setError("");
    setSuccess("");
  };

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save updated student
  const updateStudent = () => {
    setError("");
    setSuccess("");
    studentAPI.updateStudent(formData)
      .then(() => {
        setStudents(students.map((s) => (s.id === formData.id ? { ...s, ...formData } : s)));
        setEditingStudent(null);
        setSuccess("Student details updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating student:", err);
        setError("Failed to update student details.");
      });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Aurora Gradients */}
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <FacultyMenu />

      <div className="max-w-6xl mx-auto py-12 px-6 sm:px-12 flex-1 w-full z-10 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Student Directory
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage student list and personal information</p>
          </div>
          <button
            onClick={() => navigate("/add-student")}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
          >
            + Add Student
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
                  <th className="px-6 py-4">Student ID</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-sm">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-900/20 transition duration-150">
                    <td className="px-6 py-4 font-semibold text-white">#{student.id}</td>
                    <td className="px-6 py-4 text-slate-200">
                      {editingStudent === student.id ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="glass-input rounded-lg px-3 py-1.5 text-xs w-full max-w-xs focus:ring-1 focus:ring-indigo-500/30"
                        />
                      ) : (
                        student.name
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {editingStudent === student.id ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="glass-input rounded-lg px-3 py-1.5 text-xs w-full max-w-xs focus:ring-1 focus:ring-indigo-500/30"
                        />
                      ) : (
                        student.email
                      )}
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      {editingStudent === student.id ? (
                        <button
                          onClick={updateStudent}
                          className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-emerald-500 hover:text-white transition cursor-pointer"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => startEditing(student)}
                          className="bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-indigo-600 hover:text-white transition cursor-pointer"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => triggerDelete(student.id)}
                        className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-rose-500 hover:text-white transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-slate-500 font-medium">
                      No registered students found.
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
                Delete Student
              </h3>
              <p className="text-slate-400 text-sm mt-2">
                Are you sure you want to delete this student profile? Any associated attendance entries may be orphaned or deleted.
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
                onClick={deleteStudent}
                className="bg-rose-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllStudents;