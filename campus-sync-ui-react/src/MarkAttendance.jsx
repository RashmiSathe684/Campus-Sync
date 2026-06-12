import { useEffect, useState } from "react";
import { studentAPI, subjectAPI, attendanceAPI } from "./apiService";
import FacultyMenu from "./FacultyMenu";

function MarkAttendance() {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [attendance, setAttendance] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const username = localStorage.getItem("username");

  // Fetch subjects
  useEffect(() => {
    subjectAPI.getAllSubjects()
      .then((response) => setSubjects(response.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch students
  useEffect(() => {
    studentAPI.getAllStudents()
      .then((response) => {
        const data = response.data;
        setStudents(data);
        const initialAttendance = {};
        data.forEach((stu) => {
          initialAttendance[stu.id] = false;
        });
        setAttendance(initialAttendance);
      })
      .catch((err) => console.error(err));
  }, []);

  // Handle select all
  const handleSelectAll = () => {
    const newStatus = !selectAll;
    const updated = {};
    students.forEach((stu) => {
      updated[stu.id] = newStatus;
    });
    setAttendance(updated);
    setSelectAll(newStatus);
  };

  // Handle individual checkbox
  const handleCheckboxChange = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Submit attendance with validation
  const handleSubmit = async () => {
    if (!selectedSubject || !date || !time) {
      setError("Please fill all fields: Subject, Date, and Time.");
      return;
    }
    
    setError("");
    setSuccess("");

    const selectedStudents = students
      .filter((stu) => attendance[stu.id])
      .map((stu) => ({ id: stu.id }));
      
    if (selectedStudents.length === 0) {
      setError("Please select at least one present student.");
      return;
    }

    const payload = {
      username: username,
      subjectId: Number(selectedSubject),
      date: date,
      time: time,
      students: selectedStudents,
    };

    setLoading(true);
    try {
      await attendanceAPI.takeAttendance(payload);
      setSuccess("Attendance submitted successfully!");
      // Reset selections
      const resetAttendance = {};
      students.forEach((stu) => {
        resetAttendance[stu.id] = false;
      });
      setAttendance(resetAttendance);
      setSelectAll(false);
    } catch (err) {
      console.error(err);
      setError("Failed to submit attendance logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Aurora Gradients */}
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <FacultyMenu />

      <div className="max-w-5xl mx-auto py-12 px-6 sm:px-12 flex-1 w-full z-10 animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Mark Session Attendance
          </h1>
          <p className="text-slate-400 text-sm mt-1">Select class parameters and checkpresent students</p>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Course</label>
            <select
              className="glass-input rounded-xl px-4 py-3 text-sm cursor-pointer"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">Choose Subject</option>
              {subjects.map((subj) => (
                <option key={subj.id} value={subj.id}>{subj.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lecture Date</label>
            <input
              type="date"
              className="glass-input rounded-xl px-4 py-3 text-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Start Time</label>
            <input
              type="time"
              className="glass-input rounded-xl px-4 py-3 text-sm"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        {/* Present Grid Box */}
        <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-2xl mb-8">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={handleSelectAll}>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500/50 focus:ring-offset-slate-900 cursor-pointer"
              />
              <span className="font-semibold text-sm text-slate-200">Select / Deselect All Students</span>
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total class size: {students.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {students.map((stu) => {
              const isChecked = attendance[stu.id] || false;
              return (
                <div 
                  key={stu.id} 
                  onClick={() => handleCheckboxChange(stu.id)}
                  className={`flex items-center gap-3 border rounded-2xl p-4 cursor-pointer select-none transition-all duration-200 ${
                    isChecked
                      ? "bg-indigo-600/10 border-indigo-500/40 text-indigo-300 shadow-md shadow-indigo-500/5"
                      : "bg-slate-900/40 border-slate-800/80 text-slate-300 hover:bg-slate-900/60 hover:border-slate-700/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // handled by parent div onClick
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800 focus:ring-indigo-500/50 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">ID #{stu.id}</span>
                    <span className="font-semibold text-sm leading-relaxed">{stu.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
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

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Submitting Logs..." : "Submit Session Logs"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MarkAttendance;