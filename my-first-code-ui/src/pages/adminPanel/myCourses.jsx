import { useEffect, useState } from "react";
import axios from "axios";

import ENDPOINT from "../../lib/endpoints";

const Courses = () => {

  // ================= STATES =================

  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [isEdit, setIsEdit] =
    useState(false);

  const [selectedId, setSelectedId] =
    useState(null);

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      category: "",
      standard: "",
      teacher_name: "",
      thumbnail: "",
      status: "Draft",
    });

  // ================= FETCH COURSES =================

  const fetchCourses = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        ENDPOINT.GET_COURSES
      );

      console.log(
        "COURSES:",
        res.data
      );

      setCourses(
        Array.isArray(
          res.data.courses
        )
          ? res.data.courses
          : []
      );

    } catch (error) {

      console.log(error);

      setCourses([]);

    } finally {

      setLoading(false);

    }
  };

  // ================= CREATE COURSE =================

  const createCourse = async () => {

    try {

      await axios.post(
        ENDPOINT.CREATE_COURSE,
        {
          ...form,
          created_by: 1,
        }
      );

      alert(
        "Course Added Successfully"
      );

      setShowModal(false);

      resetForm();

      fetchCourses();

    } catch (error) {

      console.log(error);

      alert(
        "Create Course Failed"
      );
    }
  };

  // ================= UPDATE COURSE =================

  const updateCourse = async () => {

    try {

      await axios.put(
        ENDPOINT.UPDATE_COURSE(
          selectedId
        ),
        form
      );

      alert(
        "Course Updated Successfully"
      );

      setShowModal(false);

      resetForm();

      fetchCourses();

    } catch (error) {

      console.log(error);

      alert(
        "Update Failed"
      );
    }
  };

  // ================= DELETE COURSE =================

  const deleteCourse = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this course?"
      );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        ENDPOINT.DELETE_COURSE(id)
      );

      alert(
        "Course Deleted Successfully"
      );

      fetchCourses();

    } catch (error) {

      console.log(error);

      alert(
        "Delete Failed"
      );
    }
  };

  // ================= EDIT COURSE =================

  const handleEdit = (course) => {

    setIsEdit(true);

    setSelectedId(course.id);

    setForm({
      title:
        course.title || "",

      description:
        course.description || "",

      category:
        course.category || "",

      standard:
        course.standard || "",

      teacher_name:
        course.teacher_name || "",

      thumbnail:
        course.thumbnail || "",

      status:
        course.status || "Draft",
    });

    setShowModal(true);
  };

  // ================= RESET FORM =================

  const resetForm = () => {

    setIsEdit(false);

    setSelectedId(null);

    setForm({
      title: "",
      description: "",
      category: "",
      standard: "",
      teacher_name: "",
      thumbnail: "",
      status: "Draft",
    });
  };

  // ================= LOAD =================

  useEffect(() => {

    fetchCourses();

  }, []);

  return (

    <div className="p-6">

      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-4xl font-bold text-slate-800">

            Courses Management

          </h1>

          <p className="text-slate-500 mt-2">

            Manage all platform courses

          </p>

        </div>

        <button
          onClick={() => {

            resetForm();

            setShowModal(true);

          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl transition-all"
        >

          Add Course

        </button>

      </div>

      {/* ================= TABLE ================= */}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">

        {loading ? (

          <div className="p-10 text-center text-2xl font-bold text-slate-500">

            Loading Courses...

          </div>

        ) : courses.length === 0 ? (

          <div className="p-10 text-center text-2xl font-bold text-slate-500">

            No Courses Found

          </div>

        ) : (

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">

                  Course

                </th>

                <th className="p-4 text-left">

                  Teacher

                </th>

                <th className="p-4 text-left">

                  Category

                </th>

                <th className="p-4 text-left">

                  Standard

                </th>

                <th className="p-4 text-left">

                  Status

                </th>

                <th className="p-4 text-center">

                  Actions

                </th>

              </tr>

            </thead>

            <tbody>

              {courses.map((course) => (

                <tr
                  key={course.id}
                  className="border-b hover:bg-slate-50 transition"
                >

                  {/* COURSE */}

                  <td className="p-4">

                    <div className="flex items-center gap-4">

                      <img
                        src={
                          course.thumbnail ||
                          "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                        }
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />

                      <div>

                        <h2 className="font-bold text-slate-800">

                          {course.title}

                        </h2>

                        <p className="text-sm text-slate-500 line-clamp-1">

                          {course.description}

                        </p>

                      </div>

                    </div>

                  </td>

                  {/* TEACHER */}

                  <td className="p-4 font-medium">

                    {course.teacher_name}

                  </td>

                  {/* CATEGORY */}

                  <td className="p-4">

                    {course.category}

                  </td>

                  {/* STANDARD */}

                  <td className="p-4">

                    Std {course.standard}

                  </td>

                  {/* STATUS */}

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        course.status ===
                        "Published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >

                      {course.status}

                    </span>

                  </td>

                  {/* ACTIONS */}

                  <td className="p-4">

                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() =>
                          handleEdit(
                            course
                          )
                        }
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                      >

                        Edit

                      </button>

                      <button
                        onClick={() =>
                          deleteCourse(
                            course.id
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                      >

                        Delete

                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

      {/* ================= MODAL ================= */}

      {showModal && (

        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() =>
            setShowModal(false)
          }
        >

          <div
            className="bg-white w-[550px] rounded-2xl p-8 relative"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              onClick={() =>
                setShowModal(false)
              }
              className="absolute top-4 right-5 text-2xl text-slate-500 hover:text-red-500"
            >

              ×

            </button>

            {/* TITLE */}

            <h1 className="text-3xl font-bold mb-6">

              {isEdit
                ? "Edit Course"
                : "Add Course"}

            </h1>

            {/* TITLE */}

            <input
              type="text"
              placeholder="Course Title"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title:
                    e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl mb-4"
            />

            {/* DESCRIPTION */}

            <textarea
              placeholder="Description"
              value={
                form.description
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl mb-4 h-28"
            />

            {/* CATEGORY */}

            <input
              type="text"
              placeholder="Category"
              value={
                form.category
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  category:
                    e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl mb-4"
            />

            {/* STANDARD */}

            <input
              type="text"
              placeholder="Standard"
              value={
                form.standard
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  standard:
                    e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl mb-4"
            />

            {/* TEACHER */}

            <input
              type="text"
              placeholder="Teacher Name"
              value={
                form.teacher_name
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  teacher_name:
                    e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl mb-4"
            />

            {/* THUMBNAIL */}

            <input
              type="text"
              placeholder="Thumbnail URL"
              value={
                form.thumbnail
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  thumbnail:
                    e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl mb-4"
            />

            {/* STATUS */}

            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status:
                    e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl mb-6"
            >

              <option value="Draft">

                Draft

              </option>

              <option value="Published">

                Published

              </option>

            </select>

            {/* SUBMIT */}

            <button
              onClick={
                isEdit
                  ? updateCourse
                  : createCourse
              }
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl"
            >

              {isEdit
                ? "Update Course"
                : "Create Course"}

            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default Courses;