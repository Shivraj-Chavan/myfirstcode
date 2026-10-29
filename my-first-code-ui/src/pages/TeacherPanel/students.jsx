import { useEffect, useState } from "react";
import axios from "axios";
import ENDPOINT from "../../lib/endpoints";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    standard: "",
    course: "",
    batch_name: "",
    teacher_id: "",
  });

  // ================= FETCH STUDENTS =================

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token =
  localStorage.getItem("token");

const res = await axios.get(
  ENDPOINT.GET_TEACHER_STUDENTS,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
      const studentData = Array.isArray(res.data)
        ? res.data
        : res.data.students || [];

      const filtered = studentData.filter(
        (s) => s.batch_name && s.batch_name.trim() !== "" && s.batch_name.trim().toLowerCase() !== "unassigned"
      );

      setStudents(filtered);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH TEACHERS =================

// ================= FETCH TEACHERS =================

const fetchTeachers = async () => {

  try {

    const token =
      localStorage.getItem("token");

    const res = await axios.get(
      ENDPOINT.GET_TEACHERS,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(
      "Teachers Response:",
      res.data
    );

    const teacherData =
      res.data?.teachers ||
      res.data?.users ||
      res.data?.data ||
      [];

    setTeachers(
      Array.isArray(teacherData)
        ? teacherData
        : []
    );

  } catch (error) {

    console.log(
      "FETCH TEACHERS ERROR:",
      error
    );

    setTeachers([]);

  }
};

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
  }, []);

  // ================= GROUP (FIXED - TYPO SAFE) =================
  // Extract trailing number from batch name e.g. "BTACH 1" → "1", "Batch 2" → "2"
  // Then group by just the number so typos like "BTACH 1" and "BATCH 1" merge together.
  // If no number found, fall back to sorted letters of the word part only.

  const normalizeBatchKey = (name) => {
    const cleaned = name.trim().toLowerCase().replace(/\s+/g, " ");
    // Extract the number at the end (e.g. "batch 1" → "1", "btach 2" → "2")
    const match = cleaned.match(/(\d+)$/);
    if (match) {
      return `batch_${match[1]}`; // group purely by number
    }
    // Fallback: sort the letters so anagrams match
    return cleaned.split("").sort().join("");
  };

  const groupedStudents = students.reduce((acc, student) => {
    const key = normalizeBatchKey(student.batch_name);

    if (!key) return acc;

    if (!acc[key]) {
      // Pick the most "correct looking" display name (longest, most vowels = less typo)
      acc[key] = {
        displayName: student.batch_name.trim(),
        list: [],
      };
    } else {
      // If this name has more vowels than the stored one, prefer it (likely less typo)
      const vowels = (s) => (s.match(/[aeiou]/gi) || []).length;
      if (vowels(student.batch_name) > vowels(acc[key].displayName)) {
        acc[key].displayName = student.batch_name.trim();
      }
    }

    acc[key].list.push(student);
    return acc;
  }, {});

  // Sort batches by the trailing number, then alphabetically
  const sortedBatches = Object.entries(groupedStudents).sort(([a], [b]) =>
    a.localeCompare(b, undefined, { numeric: true })
  );

  // ================= INPUT =================

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================= ADD / UPDATE =================

 // ================= ADD / UPDATE =================

const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const token =
      localStorage.getItem("token");

    if (editId) {

      await axios.put(
        ENDPOINT.UPDATE_STUDENT(editId),
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    } else {

      await axios.post(
        ENDPOINT.CREATE_STUDENT,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    }

    setShowModal(false);

    setEditId(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      standard: "",
      course: "",
      batch_name: "",
      teacher_id: "",
    });

    fetchStudents();

  } catch (error) {

    console.log(
      "SUBMIT ERROR:",
      error.response?.data || error
    );

  }

};

  // ================= EDIT =================

  const handleEdit = (student) => {
    setEditId(student.id);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      standard: student.standard,
      course: student.course,
      batch_name: student.batch_name,
      teacher_id: student.teacher_id || "",
    });
    setShowModal(true);
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    try {
      const token =
      localStorage.getItem("token");
    
    await axios.delete(
      ENDPOINT.DELETE_STUDENT(id),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
      fetchStudents();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= ASSIGN =================

  const handleAssign = async (
    studentId,
    teacherId,
    batchName
  ) => {
  
    try {
  
      const token =
        localStorage.getItem("token");
  
      await axios.put(
        ENDPOINT.ASSIGN_STUDENT(studentId),
        {
          teacher_id: teacherId,
          batch_name: batchName,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );
  
      fetchStudents();
  
    } catch (error) {
  
      console.log(error);
  
    }
  };
  
  return (
    <div className="p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Students</h1>
          <p className="text-slate-400 text-xs mt-0.5">Students assigned by admin</p>
        </div>
        <button
          onClick={() => { setEditId(null); setShowModal(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          + Add Student
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center mt-20 text-slate-400 text-sm">Loading students...</div>
      ) : sortedBatches.length === 0 ? (
        <div className="text-center mt-20 text-slate-400 text-sm">No students found.</div>
      ) : (
        sortedBatches.map(([batchKey, { displayName, list }]) => (
          <div key={batchKey} className="mb-6">

            {/* BATCH HEADER */}
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">
                {displayName}
              </h2>
              <span className="bg-indigo-50 text-indigo-500 border border-indigo-100 px-2 py-0.5 rounded-full text-xs">
                {list.length} {list.length === 1 ? "Student" : "Students"}
              </span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Std</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Course</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Teacher</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-2 font-medium text-slate-800">{student.name}</td>
                      <td className="px-3 py-2 text-slate-500">{student.email}</td>
                      <td className="px-3 py-2 text-slate-500">{student.phone}</td>
                      <td className="px-3 py-2 text-slate-600">{student.standard}</td>
                      <td className="px-3 py-2 text-slate-600">{student.course}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            student.status === "Active"
                              ? "bg-green-50 text-green-600 border border-green-100"
                              : "bg-red-50 text-red-500 border border-red-100"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1 ${student.status === "Active" ? "bg-green-500" : "bg-red-400"}`} />
                          {student.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">
  <div className="flex gap-2">

    <select
      value={student.teacher_id || ""}
      onChange={(e) =>
        handleAssign(
          student.id,
          e.target.value,
          student.batch_name
        )
      }
      className="border border-slate-200 rounded-md px-2 py-1 text-xs"
    >
      <option value="">
        Assign Teacher
      </option>

      {teachers.map((teacher) => (
        <option
          key={teacher.id}
          value={teacher.id}
        >
          {teacher.name}
        </option>
      ))}
    </select>

    <input
      type="text"
      value={student.batch_name || ""}
      onChange={(e) => {
        const updated = students.map((s) =>
          s.id === student.id
            ? {
                ...s,
                batch_name: e.target.value,
              }
            : s
        );

        setStudents(updated);
      }}
      placeholder="Batch"
      className="border border-slate-200 rounded-md px-2 py-1 text-xs w-24"
    />

  </div>
</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleEdit(student)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-md text-xs font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 px-2.5 py-1 rounded-md text-xs font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        ))
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">
                {editId ? "Edit Student" : "Add Student"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { name: "name", placeholder: "Full Name", type: "text" },
                { name: "email", placeholder: "Email Address", type: "email" },
                { name: "phone", placeholder: "Phone Number", type: "text" },
                { name: "standard", placeholder: "Standard (e.g. 10th)", type: "text" },
                { name: "course", placeholder: "Course", type: "text" },
                { name: "batch_name", placeholder: "Batch Name", type: "text" },
              ].map((field) => (
                <input
                  key={field.name}
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder:text-slate-400"
                />
              ))}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  {editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Students;