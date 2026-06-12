import { useEffect, useState } from "react";
import { userAPI, subjectAPI, attendanceAPI } from "./apiService";
import AdminMenu from "./AdminMenu";
import FacultyMenu from "./FacultyMenu";

function ViewAttendance() {
  const role = localStorage.getItem("role");

  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [error, setError] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    userAPI.getAllFaculty()
      .then((response) => setFaculties(response.data))
      .catch((err) => console.error("Error fetching faculties:", err));

    subjectAPI.getAllSubjects()
      .then((response) => setSubjects(response.data))
      .catch((err) => console.error("Error fetching subjects:", err));
  }, []);

  const fetchAllAttendance = () => {
    setError("");
    attendanceAPI.getAllAttendanceRecords()
      .then((response) => {
        setAttendance(response.data);
      })
      .catch((err) => {
        console.error("Error fetching all attendance:", err);
        setError("Error fetching attendance data.");
        setAttendance([]);
      });
  };

  const fetchFilteredAttendance = () => {
    setError("");
    if (role === "admin") {
      if (!selectedFaculty || !selectedSubject || !selectedDate) {
        setError("Please select faculty, subject, and date.");
        return;
      }
      
      attendanceAPI.getAttendance(selectedFaculty, selectedSubject, selectedDate)
        .then((response) => {
          setAttendance(response.data);
        })
        .catch((err) => {
          console.error("Error fetching filtered attendance:", err);
          setError("Error fetching attendance data.");
          setAttendance([]);
        });
    } else {
      if (!selectedSubject || !selectedDate) {
        setError("Please select subject and date.");
        return;
      }
      
      const username = localStorage.getItem("username");
      
      attendanceAPI.getAttendance(username, selectedSubject, selectedDate)
        .then((response) => {
          setAttendance(response.data);
        })
        .catch((err) => {
          console.error("Error fetching filtered attendance:", err);
          setError("Error fetching attendance data.");
          setAttendance([]);
        });
    }
  };

  // Show modal with students
  const handleShowStudents = (studentsList) => {
    setStudents(studentsList);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Aurora Gradients */}
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      {role === "admin" ? <AdminMenu /> : <FacultyMenu />}

      <div className="max-w-6xl mx-auto py-12 px-6 sm:px-12 flex-1 w-full z-10 animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Attendance Logs
          </h1>
          <p className="text-slate-400 text-sm mt-1">Review, filter, and inspect present student registers</p>
        </div>

        {/* Filters Panel */}
        <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-2xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="flex flex-col gap-2">
              {role === "admin" ? (
                <>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Faculty</label>
                  <select
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    className="glass-input rounded-xl px-4 py-3 text-sm cursor-pointer w-full"
                    required
                  >
                    <option value="">Choose Faculty</option>
                    {faculties.map((f, i) => (
                      <option key={i} value={f.username}>
                        {f.firstName} {f.lastName}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <div className="h-[52px] md:flex items-center text-slate-500 text-xs font-semibold italic hidden">
                  Filters restricted to your lectures
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="glass-input rounded-xl px-4 py-3 text-sm cursor-pointer w-full"
                required
              >
                <option value="">Choose Subject</option>
                {subjects.map((s, i) => (
                  <option key={i} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="glass-input rounded-xl px-4 py-3 text-sm w-full"
                required
              />
            </div>

            <div className="flex items-center gap-3">
              {role === "admin" && (
                <button
                  onClick={fetchAllAttendance}
                  className="flex-1 bg-slate-900 border border-slate-800 text-slate-300 py-3 rounded-xl text-sm font-semibold hover:bg-slate-800 hover:text-white transition cursor-pointer"
                >
                  Show All
                </button>
              )}
              <button
                onClick={fetchFilteredAttendance}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                Filter Logs
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-rose-400 bg-rose-500/10 border border-rose-500/25 rounded-xl py-3 px-4 text-xs font-semibold text-center mb-6 animate-shake">
            ⚠️ {error}
          </div>
        )}

        {/* Attendance Table Panel */}
        <div className="glass-panel border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Faculty Advisor</th>
                  <th className="px-6 py-4">Subject Name</th>
                  <th className="px-6 py-4">Session Date</th>
                  <th className="px-6 py-4">Start Time</th>
                  <th className="px-6 py-4">Students Present</th>
                  <th className="px-6 py-4 text-center">Roster List</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-sm">
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-slate-500 font-medium">
                      No matching attendance records found.
                    </td>
                  </tr>
                ) : (
                  attendance.map((a, index) => (
                    <tr key={a.id} className="hover:bg-slate-900/20 transition duration-150">
                      <td className="px-6 py-4 font-semibold text-slate-500">{index + 1}</td>
                      <td className="px-6 py-4 font-semibold text-white">
                        {a.user?.firstName} {a.user?.lastName}
                      </td>
                      <td className="px-6 py-4 text-slate-200">{a.subject?.name}</td>
                      <td className="px-6 py-4 text-slate-300">{a.date}</td>
                      <td className="px-6 py-4 text-slate-400">{a.time}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          {a.numberOfStudents} Present
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleShowStudents(a.students)}
                          className="bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition cursor-pointer"
                        >
                          View List
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* PREMIUM STUDENT LIST DIALOG OVERLAY MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="glass-panel border border-slate-800 rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl flex flex-col gap-5 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Present Students
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">Attendee list for this session</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-lg p-1.5 transition text-xs font-semibold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            
            <div className="max-h-60 overflow-y-auto pr-1">
              <div className="flex flex-wrap gap-2.5">
                {students && students.length > 0 ? (
                  students.map((student) => (
                    <span
                      key={student.id}
                      className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 shadow hover:border-slate-700 hover:text-white transition duration-150"
                    >
                      👤 {student.name}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm font-medium py-4">No students logged as present.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAttendance;