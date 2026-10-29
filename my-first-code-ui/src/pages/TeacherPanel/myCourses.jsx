// import { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   Plus,
//   Pencil,
//   Trash2,
//   BookOpen,
//   Layers,
// } from "lucide-react";

// import ENDPOINT from "../../lib/endpoints";

// const MyCourse = () => {

//   // ================= STATES =================

//   const [courses, setCourses] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [showModal, setShowModal] =
//     useState(false);

//   const [creating, setCreating] =
//     useState(false);

//   const [editingId, setEditingId] =
//     useState(null);

//   const [form, setForm] =
//     useState({
//       title: "",
//       description: "",
//       category: "",
//       standard: "",
//       status: "Draft",
//       chapters: "",
//       lessons: "",
//     });

//   // ================= USER =================

//   const user =
//     JSON.parse(
//       localStorage.getItem("user")
//     ) || {};

//   const token =
//     localStorage.getItem("token");

//   const authConfig = {

//     headers: {

//       Authorization:
//         `Bearer ${token}`,
//     },
//   };

//   // ================= FETCH COURSES =================

//   const fetchCourses =
//     async () => {

//       try {

//         setLoading(true);

//         const res =
//           await axios.get(

//             ENDPOINT.GET_LEVELS(
//               user.id
//             ),

//             authConfig
//           );

//         setCourses(
//           res.data.courses || []
//         );

//       } catch (error) {

//         console.log(error);

//         setCourses([]);

//       } finally {

//         setLoading(false);
//       }
//     };

//   // ================= RESET FORM =================

//   const resetForm = () => {

//     setForm({
//       title: "",
//       description: "",
//       category: "",
//       standard: "",
//       status: "Draft",
//       chapters: "",
//       lessons: "",
//     });

//     setEditingId(null);
//   };

//   // ================= SAVE COURSE =================

//   const saveCourse =
//     async () => {

//       if (
//         !form.title ||
//         !form.category ||
//         !form.standard
//       ) {

//         return alert(
//           "Please fill all fields"
//         );
//       }

//       try {

//         setCreating(true);

//         const payload = {

//           title:
//             form.title,

//           description:
//             form.description,

//           category:
//             form.category,

//           standard:
//             form.standard,

//           chapters:
//             form.chapters,

//           lessons:
//             form.lessons,

//           status:
//             form.status,

//           thumbnail: "",

//           teacher_id:
//             user.id,
//         };

//         if (editingId) {

//           await axios.put(

//             ENDPOINT.UPDATE_COURSE(
//               editingId
//             ),

//             payload,

//             authConfig
//           );

//           alert(
//             "Course Updated Successfully"
//           );

//         } else {

//           await axios.post(

//             ENDPOINT.CREATE_COURSE,

//             payload,

//             authConfig
//           );

//           alert(
//             "Course Created Successfully"
//           );
//         }

//         resetForm();

//         setShowModal(false);

//         fetchCourses();

//       } catch (error) {

//         console.log(error);

//         alert(

//           error.response?.data
//             ?.message ||

//           "Operation Failed"
//         );

//       } finally {

//         setCreating(false);
//       }
//     };

//   // ================= DELETE COURSE =================

//   const deleteCourse =
//     async (id) => {

//       const confirmDelete =
//         window.confirm(
//           "Delete this course?"
//         );

//       if (!confirmDelete)
//         return;

//       try {

//         await axios.delete(

//           ENDPOINT.DELETE_COURSE(id),

//           authConfig
//         );

//         alert(
//           "Course Deleted Successfully"
//         );

//         fetchCourses();

//       } catch (error) {

//         console.log(error);

//         alert(
//           "Delete Failed"
//         );
//       }
//     };

//   // ================= EDIT COURSE =================

//   const editCourse =
//     (course) => {

//       setEditingId(
//         course.id
//       );

//       setForm({

//         title:
//           course.title,

//         description:
//           course.description || "",

//         category:
//           course.category,

//         standard:
//           course.standard,

//         status:
//           course.status,

//         chapters:
//           course.chapters || "",

//         lessons:
//           course.lessons || "",
//       });

//       setShowModal(true);
//     };

//   // ================= LOAD =================

//   useEffect(() => {

//     if (user?.id) {

//       fetchCourses();
//     }

//   }, []);

//   return (

//     <div className="p-5">

//       {/* ================= HEADER ================= */}

//       <div className="flex items-center justify-between mb-5">

//         <div>

//           <h1 className="text-3xl font-bold text-slate-800">

//             My Courses

//           </h1>

//           <p className="text-slate-500 text-sm mt-1">

//             Manage courses, chapters and lessons

//           </p>

//         </div>

//         <button

//           onClick={() => {

//             resetForm();

//             setShowModal(true);
//           }}

//           className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
//         >

//           <Plus size={18} />

//           Add Course

//         </button>

//       </div>

//       {/* ================= TABLE ================= */}

//       <div className="bg-white rounded-xl border overflow-hidden">

//         {loading ? (

//           <div className="p-10 text-center font-semibold">

//             Loading...

//           </div>

//         ) : courses.length === 0 ? (

//           <div className="p-10 text-center font-semibold">

//             No Courses Found

//           </div>

//         ) : (

//           <div className="overflow-x-auto">

//             <table className="w-full text-sm">

//               <thead className="bg-slate-100">

//                 <tr>

//                   <th className="text-left px-4 py-3">
//                     Course
//                   </th>

//                   <th className="text-left px-4 py-3">
//                     Category
//                   </th>

//                   <th className="text-left px-4 py-3">
//                     Std
//                   </th>

//                   <th className="text-left px-4 py-3">
//                     Chapters
//                   </th>

//                   <th className="text-left px-4 py-3">
//                     Lessons
//                   </th>

//                   <th className="text-left px-4 py-3">
//                     Status
//                   </th>

//                   <th className="text-center px-4 py-3">
//                     Actions
//                   </th>

//                 </tr>

//               </thead>

//               <tbody>

//                 {courses.map((course) => (

//                   <tr
//                     key={course.id}
//                     className="border-t hover:bg-slate-50"
//                   >

//                     {/* COURSE */}

//                     <td className="px-4 py-3">

//                       <div className="flex items-start gap-3">

//                         <div className="bg-indigo-100 p-2 rounded-lg">

//                           <BookOpen
//                             size={18}
//                             className="text-indigo-600"
//                           />

//                         </div>

//                         <div>

//                           <h2 className="font-semibold text-slate-800">

//                             {course.title}

//                           </h2>

//                           <p className="text-xs text-slate-500 mt-1 line-clamp-2">

//                             {course.description ||
//                               "No description"}

//                           </p>

//                         </div>

//                       </div>

//                     </td>

//                     {/* CATEGORY */}

//                     <td className="px-4 py-3">

//                       {course.category}

//                     </td>

//                     {/* STANDARD */}

//                     <td className="px-4 py-3">

//                       {course.standard}

//                     </td>

//                     {/* CHAPTERS */}

//                     <td className="px-4 py-3">

//                       <div className="flex items-center gap-2">

//                         <Layers
//                           size={16}
//                           className="text-indigo-600"
//                         />

//                         {course.chapters || 0}

//                       </div>

//                     </td>

//                     {/* LESSONS */}

//                     <td className="px-4 py-3">

//                       {course.lessons || 0}

//                     </td>

//                     {/* STATUS */}

//                     <td className="px-4 py-3">

//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium

//                         ${
//                           course.status ===
//                           "Published"

//                             ? "bg-green-100 text-green-700"

//                             : "bg-yellow-100 text-yellow-700"
//                         }`}
//                       >

//                         {course.status}

//                       </span>

//                     </td>

//                     {/* ACTIONS */}

//                     <td className="px-4 py-3">

//                       <div className="flex items-center justify-center gap-2">

//                         <button

//                           onClick={() =>
//                             editCourse(
//                               course
//                             )
//                           }

//                           className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-md"
//                         >

//                           <Pencil size={15} />

//                         </button>

//                         <button

//                           onClick={() =>
//                             deleteCourse(
//                               course.id
//                             )
//                           }

//                           className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
//                         >

//                           <Trash2 size={15} />

//                         </button>

//                       </div>

//                     </td>

//                   </tr>

//                 ))}

//               </tbody>

//             </table>

//           </div>

//         )}

//       </div>

//       {/* ================= MODAL ================= */}

//       {showModal && (

//         <div
//           className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
//           onClick={() =>
//             setShowModal(false)
//           }
//         >

//           <div

//             className="bg-white w-full max-w-lg rounded-2xl p-6 relative"

//             onClick={(e) =>
//               e.stopPropagation()
//             }
//           >

//             {/* CLOSE */}

//             <button

//               onClick={() =>
//                 setShowModal(false)
//               }

//               className="absolute top-4 right-4 text-slate-500 hover:text-red-500 text-xl"
//             >

//               ×

//             </button>

//             {/* TITLE */}

//             <h2 className="text-2xl font-bold mb-5">

//               {editingId
//                 ? "Edit Course"
//                 : "Add Course"}

//             </h2>

//             {/* TITLE */}

//             <input
//               type="text"
//               placeholder="Course Title"
//               value={form.title}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   title:
//                     e.target.value,
//                 })
//               }
//               className="w-full  p-3 rounded-lg mb-4 text-sm outline-none focus:border-indigo-500"
//             />

//             {/* DESCRIPTION */}

//             <textarea
//               placeholder="Course Description"
//               value={form.description}
//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   description:
//                     e.target.value,
//                 })
//               }
//               className="w-full p-3 rounded-lg mb-4 h-24 resize-none text-sm outline-none focus:border-indigo-500"
//             />

//             {/* GRID */}

//             <div className="grid grid-cols-2 gap-4">

//               {/* CATEGORY */}

//               <input
//                 type="text"
//                 placeholder="Category"
//                 value={form.category}
//                 onChange={(e) =>
//                   setForm({
//                     ...form,
//                     category:
//                       e.target.value,
//                   })
//                 }
//                 className=" p-3 rounded-lg text-sm outline-none focus:border-indigo-500"
//               />

//               {/* STANDARD */}

//               <input
//                 type="text"
//                 placeholder="Standard"
//                 value={form.standard}
//                 onChange={(e) =>
//                   setForm({
//                     ...form,
//                     standard:
//                       e.target.value,
//                   })
//                 }
//                 className=" p-3 rounded-lg text-sm outline-none focus:border-indigo-500"
//               />

//               {/* CHAPTERS */}

//               <input
//                 type="number"
//                 placeholder="Chapters"
//                 value={form.chapters}
//                 onChange={(e) =>
//                   setForm({
//                     ...form,
//                     chapters:
//                       e.target.value,
//                   })
//                 }
//                 className=" p-3 rounded-lg text-sm outline-none focus:border-indigo-500"
//               />

//               {/* LESSONS */}

//               <input
//                 type="number"
//                 placeholder="Lessons"
//                 value={form.lessons}
//                 onChange={(e) =>
//                   setForm({
//                     ...form,
//                     lessons:
//                       e.target.value,
//                   })
//                 }
//                 className=" p-3 rounded-lg text-sm outline-none focus:border-indigo-500"
//               />

//             </div>

//             {/* STATUS */}

//             <select

//               value={form.status}

//               onChange={(e) =>
//                 setForm({
//                   ...form,
//                   status:
//                     e.target.value,
//                 })
//               }

//               className="w-full  p-3 rounded-lg mt-4 text-sm outline-none focus:border-indigo-500"
//             >

//               <option value="Draft">

//                 Draft

//               </option>

//               <option value="Published">

//                 Published

//               </option>

//             </select>

//             {/* BUTTON */}

//             <button

//               onClick={saveCourse}

//               disabled={creating}

//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg mt-5 text-sm font-medium"
//             >

//               {creating
//                 ? editingId
//                   ? "Updating..."
//                   : "Creating..."
//                 : editingId
//                   ? "Update Course"
//                   : "Create Course"}

//             </button>

//           </div>

//         </div>

//       )}

//     </div>
//   );
// };

// export default MyCourse;


















import { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  Users,
  Layers,
  Clock,
  GraduationCap,
} from "lucide-react";

import ENDPOINT from "../../lib/endpoints";

export default function TeacherMyCourses() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLevels = async () => {
    try {
      const res = await axios.get(
        ENDPOINT.GET_LEVELS
      );

      setLevels(res.data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Loading Levels...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-left">Level</th>
            <th className="px-4 py-3 text-left">Level No.</th>
            <th className="px-4 py-3 text-left">Difficulty</th>
            <th className="px-4 py-3 text-left">Duration</th>
            <th className="px-4 py-3 text-left">Language</th>
            <th className="px-4 py-3 text-center">
              Assigned Students
            </th>
            <th className="px-4 py-3 text-left">
              Student Names
            </th>
          </tr>
        </thead>
  
        <tbody>
          {levels.map((level) => (
            <tr
              key={level.id}
              className=" hover:bg-slate-50"
            >
              {/* Level Name */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-violet-100 p-2 rounded-lg">
                    <BookOpen
                      size={18}
                      className="text-violet-600"
                    />
                  </div>
  
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {level.level_name}
                    </h3>
  
                    <p className="text-xs text-slate-500">
                      ID: {level.id}
                    </p>
                  </div>
                </div>
              </td>
  
              {/* Level Number */}
              <td className="px-4 py-4">
                {level.level_number}
              </td>
  
              {/* Difficulty */}
              <td className="px-4 py-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium
                  ${
                    level.difficulty === "Beginner"
                      ? "bg-green-100 text-green-700"
                      : level.difficulty ===
                        "Intermediate"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {level.difficulty}
                </span>
              </td>
  
              {/* Duration */}
              <td className="px-4 py-4">
                {level.duration
                  ? `${level.duration} ${level.duration_unit}`
                  : "-"}
              </td>
  
              {/* Language */}
              <td className="px-4 py-4">
                {level.language || "-"}
              </td>
  
              {/* Total Students */}
              <td className="px-4 py-4 text-center">
                <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-semibold">
                  {level.total_students}
                </span>
              </td>
  
              {/* Student Names */}
              <td className="px-4 py-4">
                {level.students ? (
                  <div className="flex flex-wrap gap-2">
                    {level.students
                      .split(",")
                      .map((student, index) => (
                        <span
                          key={index}
                          className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs"
                        >
                          {student.trim()}
                        </span>
                      ))}
                  </div>
                ) : (
                  <span className="text-gray-400">
                    No Students Assigned
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}