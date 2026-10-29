// // src/pages/student/MyCourses.jsx

// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   BookOpen, PlayCircle, Layers,
//   GraduationCap, Search, Clock, User,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import ENDPOINT from "../../lib/endpoints";

// const diffColor = {
//   Beginner:     "bg-green-50 text-green-700 border-green-200",
//   Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
//   Advanced:     "bg-red-50 text-red-700 border-red-200",
// };

// export default function MyCourses() {

//   const navigate = useNavigate();
//   const [levels, setLevels] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");

//   let user = {};
//   try { user = JSON.parse(localStorage.getItem("user")) || {}; }
//   catch { user = {}; }

//   const fetchLevels = async () => {
//     try {
//       setLoading(true);
  
//       const res = await axios.get(
//         ENDPOINT.GET_MY_LEVELS(user.id)
//       );
  
//       setLevels(res.data.levels || []);
  
//     } catch (err) {
//       console.error(err);
//       setLevels([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLevels();
//   }, []);

//   // const fetchCourses = async () => {
//   //   try {
//   //     if (!user?.standard) { setCourses([]); setFilteredCourses([]); return; }
//   //     setLoading(true);
//   //     const res = await axios.get(ENDPOINT.GET_COURSE_BY_STANDARD(user.standard));
//   //     const data = Array.isArray(res.data?.courses) ? res.data.courses : [];
//   //     setCourses(data);
//   //     setFilteredCourses(data);
//   //   } catch (err) {
//   //     console.error(err);
//   //     setCourses([]); setFilteredCourses([]);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // useEffect(() => { fetchCourses(); }, []);

//   useEffect(() => {
//     const q = search.toLowerCase();
//     setFilteredCourses(
//       courses.filter((c) =>
//         c.title?.toLowerCase().includes(q) ||
//         c.category?.toLowerCase().includes(q)
//       )
//     );
//   }, [search, courses]);

//   // ── loading skeleton ──────────────────────────────
//   if (loading) {
//     return (
//       <div className="p-5">
//         <div className="h-7 w-40 bg-gray-200 rounded-lg mb-5 animate-pulse" />
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
//               <div className="h-40 bg-gray-100" />
//               <div className="p-4 space-y-2">
//                 <div className="h-4 bg-gray-100 rounded w-2/3" />
//                 <div className="h-3 bg-gray-100 rounded" />
//                 <div className="h-3 bg-gray-100 rounded w-4/5" />
//                 <div className="h-9 bg-gray-100 rounded-xl mt-4" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-5">

//       {/* ── Header ── */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
//         <div>
//           <h1 className="text-xl font-bold text-gray-900">My Learning</h1>
//           <p className="text-xs text-gray-400 mt-0.5">  Assigned Learning Levels</p>
//         </div>

//         <div className="relative w-full sm:w-64">
//           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search levels..."
//             className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400"
//           />
//         </div>
//       </div>

//       {/* ── Empty ── */}
//       {filteredLevels.length === 0 && (
//         <div className="bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-12 min-h-64">
//           <GraduationCap size={48} className="text-gray-200 mb-4" />
//           <h2 className="text-base font-semibold text-gray-700">No Levels Available</h2>
//           <p className="text-sm text-gray-400 mt-1 max-w-sm">
//             {search ? "No courses match your search." : "Your teacher hasn't published any courses yet."}
//           </p>
//         </div>
//       )}

//       {/* ── Grid ── */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//   {filteredLevels.map((level) => (
//     <div
//       key={level.id}
//       className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all"
//     >
//       <div className="p-5">

//         <div className="flex justify-between items-center mb-3">
//           <span className="font-bold text-violet-600">
//             Level {level.level_number}
//           </span>

//           <span
//             className={`px-2 py-1 rounded text-xs border ${
//               diffColor[level.difficulty]
//             }`}
//           >
//             {level.difficulty}
//           </span>
//         </div>

//         <h2 className="text-lg font-semibold text-gray-900">
//           {level.level_name}
//         </h2>

//         <p className="text-sm text-gray-500 mt-2 line-clamp-3">
//           {level.objective}
//         </p>

//         <div className="mt-4 space-y-2 text-sm text-gray-600">
//           <div>
//             💰 ₹{level.price}
//           </div>

//           <div>
//             📚 {level.modules?.length || 0} Modules
//           </div>

//           <div>
//             ⏳ {level.duration} {level.duration_unit}
//           </div>

//           <div>
//             🌐 {level.language}
//           </div>
//         </div>

//         <button
//           onClick={() =>
//             navigate(`/student/level/${level.id}`)
//           }
//           className="w-full mt-5 bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-xl"
//         >
//           Start Learning
//         </button>

//       </div>
//     </div>
//   ))}
// </div>

//       {levels.map((level) => (
//   <div
//     key={level.id}
//     className="bg-white rounded-2xl border p-5"
//   >
//     <div className="flex justify-between mb-3">
//       <span className="font-bold">
//         Level {level.level_number}
//       </span>

//       <span
//         className={`px-2 py-1 rounded text-xs ${
//           diffColor[level.difficulty]
//         }`}
//       >
//         {level.difficulty}
//       </span>
//     </div>

//     <h2 className="text-lg font-semibold">
//       {level.level_name}
//     </h2>

//     <p className="text-gray-500 text-sm mt-2">
//       {level.objective}
//     </p>

//     <div className="mt-4 flex justify-between">
//       <span>
//         ₹{level.price}
//       </span>

//       <span>
//         {level.modules?.length || 0} Modules
//       </span>
//     </div>

//     <button
//       onClick={() =>
//         navigate(`/student/level/${level.id}`)
//       }
//       className="w-full mt-4 bg-violet-600 text-white py-2 rounded-lg"
//     >
//       Start Learning
//     </button>
//   </div>
// ))}

//             </div>
//           );
//         }











// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   GraduationCap,
//   Search,
//   Layers,
//   PlayCircle,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import ENDPOINT from "../../lib/endpoints";

// const diffColor = {
//   Beginner: "bg-green-50 text-green-700 border-green-200",
//   Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
//   Advanced: "bg-red-50 text-red-700 border-red-200",
// };

// export default function MyCourses() {
//   const navigate = useNavigate();

//   const [levels, setLevels] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");

//   let user = {};

//   try {
//     user = JSON.parse(localStorage.getItem("user")) || {};
//   } catch {
//     user = {};
//   }

//   const fetchLevels = async () => {
//     try {
//       setLoading(true);
  
//       const storedUser = JSON.parse(
//         localStorage.getItem("user") || "{}"
//       );
  
//       console.log("USER:", storedUser);
  
//       if (!storedUser?.id) {
//         console.error("Student ID missing");
//         setLevels([]);
//         return;
//       }
  
//       const url = ENDPOINT.GET_MY_LEVELS(
//         storedUser.id
//       );
  
//       console.log("API URL:", url);
  
//       const res = await axios.get(url);
  
//       console.log(
//         "FULL RESPONSE:",
//         JSON.stringify(res.data, null, 2)
//       );
  
//       const levelData =
//         res.data?.levels ||
//         res.data?.data ||
//         [];
  
//       console.log("LEVEL DATA:", levelData);
  
//       setLevels(Array.isArray(levelData) ? levelData : []);
//       console.log("LEVEL DATA:", levelData);
// console.log("IS ARRAY:", Array.isArray(levelData));
  
//     } catch (err) {
//       console.error("FETCH ERROR:", err);
//       setLevels([]);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchLevels();
//   }, []);

//   const filteredLevels = levels.filter((level) =>
//     (
//       level.level_name ||
//       level.title ||
//       ""
//     )
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="p-5">
//         <div className="bg-white rounded-2xl border p-10 text-center">
//           Loading Levels...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-5">

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold">
//             My Learning
//           </h1>

//           <p className="text-sm text-gray-500">
//             Assigned Levels
//           </p>
//         </div>

//         <div className="relative w-full sm:w-72">
//           <Search
//             size={16}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//           />

//           <input
//             value={search}
//             onChange={(e) =>
//               setSearch(e.target.value)
//             }
//             placeholder="Search levels..."
//             className="w-full border rounded-xl pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-violet-200"
//           />
//         </div>
//       </div>

//       {/* Empty State */}
//       {filteredLevels.length === 0 ? (
//         <div className="bg-white rounded-2xl border p-10 text-center">
//           <GraduationCap
//             size={50}
//             className="mx-auto text-gray-300 mb-4"
//           />

//           <h2 className="font-semibold text-lg">
//             No Assigned Levels
//           </h2>

//           <p className="text-gray-500 mt-2">
//             Your admin has not assigned any levels yet.
//           </p>
//         </div>
//       ) : (
//         <>
//           {/* Stats */}
//           <div className="mb-6">
//             <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 px-4 py-2 rounded-xl">
//               <Layers size={18} />
//               <span className="font-medium">
//                 {filteredLevels.length} Assigned Levels
//               </span>
//             </div>
//           </div>

//           {/* Level Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
//             {filteredLevels.map((level) => (
//               <div
//                 key={level.id}
//                 className="bg-white border rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
//               >
//                 {/* Top */}
//                 <div className="flex justify-between items-center mb-4">
//                   <span className="font-bold text-violet-600">
//                     Level {level.level_number || level.id}
//                   </span>

//                   {level.difficulty && (
//                     <span
//                       className={`px-2 py-1 text-xs rounded border ${
//                         diffColor[level.difficulty] ||
//                         "bg-gray-50 text-gray-700 border-gray-200"
//                       }`}
//                     >
//                       {level.difficulty}
//                     </span>
//                   )}
//                 </div>

//                 {/* Title */}
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   {level.level_name ||
//                     level.title ||
//                     "Untitled Level"}
//                 </h2>

//                 {/* Description */}
//                 <p className="text-sm text-gray-500 mt-2 min-h-[60px]">
//                   {level.objective ||
//                     level.description ||
//                     "No description available"}
//                 </p>

//                 {/* Details */}
//                 <div className="mt-4 space-y-2 text-sm text-gray-700">

//                   {level.price && (
//                     <div>
//                       💰 ₹{level.price}
//                     </div>
//                   )}

//                   <div className="flex items-center gap-2">
//                     <Layers size={14} />
//                     {level.modules?.length || 0} Modules
//                   </div>

//                   {level.duration && (
//                     <div>
//                       ⏳ {level.duration}{" "}
//                       {level.duration_unit}
//                     </div>
//                   )}

//                   {level.language && (
//                     <div>
//                       🌐 {level.language}
//                     </div>
//                   )}
//                 </div>

//                 {/* Action */}
//                 <button
//                   onClick={() =>
//                     navigate(
//                       `/student/level/${level.id}`
//                     )
//                   }
//                   className="w-full mt-5 bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
//                 >
//                   <PlayCircle size={16} />
//                   View Course
//                 </button>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }





// src/pages/student/MyCourses.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpen, PlayCircle, Layers,
  GraduationCap, Search, Clock, User,
} from "lucide-react";
import ENDPOINT from "../../lib/endpoints";
import LevelLearning from "../../components/levelLearning";
import { useNavigate } from "react-router-dom";

const diffColor = {
  Beginner:     "bg-green-50 text-green-700 border-green-200",
  Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  Advanced:     "bg-red-50 text-red-700 border-red-200",
};

export default function MyCourses() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  let user = {};
  try { user = JSON.parse(localStorage.getItem("user")) || {}; }
  catch { user = {}; }

  const fetchLevels = async () => {
    try {
      setLoading(true);

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      console.log("USER:", storedUser);

      if (!storedUser?.id) {
        console.error("Student ID missing");
        setLevels([]);
        return;
      }

      const url = ENDPOINT.GET_MY_LEVELS(storedUser.id);
      console.log("API URL:", url);

      const res = await axios.get(url);
      console.log("FULL RESPONSE:", JSON.stringify(res.data, null, 2));

      const levelData = res.data?.levels || res.data?.data || [];
      console.log("LEVEL DATA:", levelData);
      console.log("IS ARRAY:", Array.isArray(levelData));

      setLevels(Array.isArray(levelData) ? levelData : []);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setLevels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLevels(); }, []);

  const filteredLevels = levels.filter((level) =>
    (level.level_name || level.title || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-5">
        <div className="h-7 w-40 bg-gray-200 rounded-lg mb-5 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded" />
                <div className="h-3 bg-gray-100 rounded w-4/5" />
                <div className="h-9 bg-gray-100 rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Learning</h1>
          <p className="text-xs text-gray-400 mt-0.5">Assigned Learning Levels</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search levels..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400"
          />
        </div>
      </div>

      {/* ── Empty state ── */}
      {filteredLevels.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-12 min-h-64">
          <GraduationCap size={48} className="text-gray-200 mb-4" />
          <h2 className="text-base font-semibold text-gray-700">No Levels Available</h2>
          <p className="text-sm text-gray-400 mt-1 max-w-sm">
            {search
              ? "No levels match your search."
              : "Your admin hasn't assigned any levels yet."}
          </p>
        </div>
      )}

      {/* ── Cards grid ── */}
      {filteredLevels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredLevels.map((level) => (
            <div
              key={level.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all flex flex-col"
            >
              {/* Thumbnail / banner */}
              <div className="relative h-40 bg-gradient-to-br from-violet-50 to-indigo-100 flex items-center justify-center flex-shrink-0">
                <BookOpen size={40} className="text-violet-300" />

                {/* Difficulty badge — top-right */}
                {level.difficulty && (
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      diffColor[level.difficulty] || "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    {level.difficulty}
                  </span>
                )}

                {/* Level number — top-left */}
                <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-violet-700 text-xs font-bold px-2.5 py-1 rounded-full border border-violet-100">
                  Level {level.level_number || level.id}
                </span>
              </div>

              {/* Card body */}
              <div className="p-4 flex flex-col flex-1">

                {/* Category tag */}
                {level.category && (
                  <span className="text-xs text-violet-500 font-medium mb-1">
                    {level.category}
                  </span>
                )}

                {/* Title */}
                <h2 className="text-base font-semibold text-gray-900 line-clamp-2 leading-snug">
                  {level.level_name || level.title || "Untitled Level"}
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 flex-1">
                  {level.objective || level.description || "No description available."}
                </p>

                {/* Meta row */}
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  {level.duration && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {level.duration} {level.duration_unit}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Layers size={12} />
                    {level.modules?.length || 0} Modules
                  </span>
                  {level.language && (
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {level.language}
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-3" />

                {/* Footer row: price + button */}
                <div className="flex items-center justify-between gap-3">
                  {level.price ? (
                    <span className="text-sm font-bold text-gray-800">
                      ₹{level.price}
                    </span>
                  ) : (
                    <span className="text-sm text-green-600 font-medium">Free</span>
                  )}

                  <button
                    onClick={() => navigate(`/student/level/${level.id}`)}
                    className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                  >
                    <PlayCircle size={14} />
                    Start Learning
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}