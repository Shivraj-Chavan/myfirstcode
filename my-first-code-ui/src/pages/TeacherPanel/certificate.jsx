
import axios from "axios";
import { useEffect, useState } from "react";
import ENDPOINT from "../../lib/endpoints";

export default function TeacherCertificates() {
  const [filter, setFilter] = useState("All");
  const [certificates, setCertificates] = useState([]);
const [loading, setLoading] = useState(false);
const [search, setSearch] = useState("");
const [students, setStudents] = useState([]);
const [teachers, setTeachers] = useState([]);

const [showIssueModal, setShowIssueModal] = useState(false);

const [selectedCertificate, setSelectedCertificate] =
  useState(null);

const [form, setForm] = useState({
  student: "",
  studentId: "",
  std: "",
  teacher: "",
  course: "",
  type: "",
  grade: "",
  status: "Active",
  message: "",
});

const fetchCertificates = async () => {
  try {
    setLoading(true);

    const res = await axios.get(
      ENDPOINT.GET_CERTIFICATES
    );

    setCertificates(
      Array.isArray(res.data.certificates)
        ? res.data.certificates
        : []
    );

  } catch (error) {
    console.log(error);

    alert("Failed to load certificates");
  } finally {
    setLoading(false);
  }
};

const fetchStudents = async () => {
  try {

    const res = await axios.get(
      ENDPOINT.GET_ALL_STUDENTS
    );

    setStudents(
      Array.isArray(res.data)
        ? res.data
        : res.data.students || []
    );

  } catch (error) {
    console.log(error);
    setStudents([]);
  }
};

const fetchTeachers = async () => {
  try {

    const res = await axios.get(
      ENDPOINT.GET_TEACHERS
    );

    setTeachers(
      Array.isArray(res.data?.data)
        ? res.data.data
        : []
    );

  } catch (error) {
    console.log(error);
    setTeachers([]);
  }
};

useEffect(() => {
  fetchCertificates();
  fetchStudents();
  fetchTeachers();
}, []);

const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
};

const filteredCertificates =
  certificates.filter((item) => {

    const matchesFilter =
      filter === "All" ||
      item.status === filter;

    const matchesSearch =
      item.student
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      item.course
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      item.certificateId
        ?.toLowerCase()
        .includes(search.toLowerCase());

    return (
      matchesFilter &&
      matchesSearch
    );
  });

const handleIssueCertificate = async () => {
  try {

    if (
      !form.student ||
      !form.course ||
      !form.teacher ||
      !form.type ||
      !form.grade
    ) {
      alert("Please fill required fields");
      return;
    }

    const payload = {
      student: form.student,
      studentId: form.studentId,
      std: form.std,
      teacher: form.teacher,
      course: form.course,
      type: form.type,
      grade: form.grade,
      status: form.status,
      message: form.message,
    };

    const res = await axios.post(
      ENDPOINT.ISSUE_CERTIFICATE,
      payload
    );

    if (res.data.success) {

      alert("Certificate Issued");

      setCertificates((prev) => [
        res.data.certificate,
        ...prev,
      ]);

      setShowIssueModal(false);

      setForm({
        student: "",
        studentId: "",
        std: "",
        teacher: "",
        course: "",
        type: "",
        grade: "",
        status: "Active",
        message: "",
      });
    }

  } catch (error) {
    console.log(error);

    alert(
      error?.response?.data?.message ||
      "Issue failed"
    );
  }
};


const handleDeleteCertificate = async (id) => {

  const confirmDelete =
    window.confirm(
      "Delete this certificate?"
    );

  if (!confirmDelete) return;

  try {

    const res = await axios.delete(
      `${ENDPOINT.DELETE_CERTIFICATE}/${id}`
    );

    if (res.data.success) {

      setCertificates((prev) =>
        prev.filter((item) => item.id !== id)
      );

      alert("Certificate Deleted");
    }

  } catch (error) {
    console.log(error);

    alert("Delete failed");
  }
};

const handleViewCertificate = (id) => {
  const certificate = certificates.find(
    (c) => c.id === id
  );

  console.log(certificate);

  setSelectedCertificate(certificate);
};

const handleDownload = (certificate) => {
  const html = `
  <html>
    <head>
      <title>Certificate</title>

      <style>
        body{
          font-family:Arial,sans-serif;
          display:flex;
          justify-content:center;
          align-items:center;
          height:100vh;
          margin:0;
          background:#f8fafc;
        }

        .certificate{
          width:900px;
          padding:50px;
          border:10px solid #2563eb;
          border-radius:20px;
          text-align:center;
        }

        h1{
          color:#2563eb;
          margin-bottom:20px;
        }

        .student{
          font-size:40px;
          font-weight:bold;
          margin:20px 0;
        }

        .course{
          font-size:22px;
        }
      </style>
    </head>

    <body>

      <div class="certificate">

        <h1>
          CERTIFICATE OF ACHIEVEMENT
        </h1>

        <p>
          This certificate is proudly awarded to
        </p>

        <div class="student">
          ${certificate.student}
        </div>

        <p class="course">
          For successfully completing
          <strong>
            ${certificate.course}
          </strong>
        </p>

        <p>
          Grade :
          <strong>
            ${certificate.grade}
          </strong>
        </p>

        <br/>

        <p>
          Issued By :
          ${certificate.teacher}
        </p>

      </div>

    </body>
  </html>
  `;

  const printWindow = window.open(
    "",
    "_blank"
  );

  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.print();
  };
};


  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return {
          background: "rgba(16,185,129,.12)",
          color: "#34d399",
        };

      case "Pending":
        return {
          background: "rgba(245,158,11,.12)",
          color: "#fbbf24",
        };

      default:
        return {
          background: "rgba(255,255,255,.08)",
          color: "#fff",
        };
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        padding: "28px",
        color: "white",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "28px",
          padding: "28px",
          borderRadius: "24px",
          background:
            "linear-gradient(180deg, rgba(17,24,39,.95), rgba(15,23,42,.95))",
          border: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: 800,
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                background:
                  "linear-gradient(135deg,#8b5cf6,#06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Teacher
            </span>{" "}
            Certificates
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            Manage and issue certificates to your students
          </p>
        </div>

        <button onClick={() => setShowIssueModal(true)}
          style={{
            border: "none",
            cursor: "pointer",
            padding: "14px 22px",
            borderRadius: "14px",
            background:
              "linear-gradient(135deg,#7c3aed,#8b5cf6)",
            color: "white",
            fontWeight: 700,
            fontSize: "14px",
          }}
        >
          + Issue Certificate
        </button>
      </div>

      {/* STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "18px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            title: "My Certificates",
            value: "248",
            sub: "Certificates issued",
          },
          {
            title: "Active",
            value: "180",
            sub: "Currently valid",
          },
          {
            title: "Pending",
            value: "14",
            sub: "Awaiting review",
          },
          {
            title: "Top Grade",
            value: "92%",
            sub: "Students scored A+",
          },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              background:
                "linear-gradient(180deg, rgba(17,24,39,.95), rgba(15,23,42,.95))",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: "22px",
              padding: "24px",
            }}
          >
            <div
              style={{
                color: "#94a3b8",
                fontSize: "13px",
                marginBottom: "14px",
              }}
            >
              {item.title}
            </div>

            <div
              style={{
                fontSize: "34px",
                fontWeight: 800,
                marginBottom: "8px",
              }}
            >
              {item.value}
            </div>

            <div
              style={{
                color: "#94a3b8",
                fontSize: "13px",
              }}
            >
              {item.sub}
            </div>
          </div>
        ))}
      </div>

      {/* TABLE SECTION */}

      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(17,24,39,.95), rgba(15,23,42,.95))",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: "24px",
          padding: "24px",
        }}
      >
        {/* TOP BAR */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search certificate..."
            style={{
              width: "320px",
              maxWidth: "100%",
              padding: "14px 16px",
              borderRadius: "14px",
              border:
                "1px solid rgba(255,255,255,.08)",
              background: "rgba(255,255,255,.04)",
              color: "white",
              outline: "none",
              fontSize: "14px",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {["All", "Active", "Pending"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                style={{
                  border: "none",
                  cursor: "pointer",
                  padding: "12px 18px",
                  borderRadius: "14px",
                  fontWeight: "600",
                  color: "white",
                  background:
                    filter === item
                      ? "linear-gradient(135deg,#7c3aed,#8b5cf6)"
                      : "rgba(255,255,255,.04)",
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                {[
                  "Certificate ID",
                  "Student",
                  "Course",
                  "Grade",
                  "Status",
                  "Issued Date",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    style={{
                      textAlign: "left",
                      padding: "16px",
                      color: "#94a3b8",
                      fontSize: "12px",
                      borderBottom:
                        "1px solid rgba(255,255,255,.08)",
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredCertificates.map((item) => (
                <tr key={item.id}>
                  <td
                    style={{
                      padding: "18px 16px",
                      borderBottom:
                        "1px solid rgba(255,255,255,.05)",
                    }}
                  >
                    {item.certificateId}
                  </td>

                  <td
                    style={{
                      padding: "18px 16px",
                      borderBottom:
                        "1px solid rgba(255,255,255,.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg,#8b5cf6,#06b6d4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                        }}
                      >
                        {
                        (item.student || "")
                        .split(" ")
                        .map((x) => x[0])
                        .join("")
                        .slice(0, 2)}
                      </div>

                      <div>{item.student}</div>
                    </div>
                  </td>

                  <td
                    style={{
                      padding: "18px 16px",
                      borderBottom:
                        "1px solid rgba(255,255,255,.05)",
                    }}
                  >
                    {item.course}
                  </td>

                  <td
                    style={{
                      padding: "18px 16px",
                      borderBottom:
                        "1px solid rgba(255,255,255,.05)",
                      color: "#fbbf24",
                      fontWeight: 700,
                    }}
                  >
                    {item.grade}
                  </td>

                  <td
                    style={{
                      padding: "18px 16px",
                      borderBottom:
                        "1px solid rgba(255,255,255,.05)",
                    }}
                  >
                    <span
                      style={{
                        ...getStatusStyle(item.status),
                        padding: "6px 12px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td
                    style={{
                      padding: "18px 16px",
                      borderBottom:
                        "1px solid rgba(255,255,255,.05)",
                    }}
                  >
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>

                  <td
                    style={{
                      padding: "18px 16px",
                      borderBottom:
                        "1px solid rgba(255,255,255,.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <button 
                      onClick={() =>handleViewCertificate(item.id)}
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "10px",
                          border:
                            "1px solid rgba(255,255,255,.08)",
                          background:
                            "rgba(255,255,255,.04)",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        👁
                      </button>

                      <button onClick={() =>handleDownload(item)}
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "10px",
                          border:
                            "1px solid rgba(255,255,255,.08)",
                          background:
                            "rgba(255,255,255,.04)",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        ⬇
                      </button>

                      {/* <button  
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "10px",
                          border:
                            "1px solid rgba(255,255,255,.08)",
                          background:
                            "rgba(255,255,255,.04)",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        ✉
                      </button> */}

                      <button onClick={() =>handleDeleteCertificate(item.id)}
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "10px",
                          border:
                            "1px solid rgba(244,63,94,.2)",
                          background:
                            "rgba(244,63,94,.08)",
                          color: "#fb7185",
                          cursor: "pointer",
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ISSUE CERTIFICATE MODAL */}

{showIssueModal && (
  <div
    onClick={(e) =>
      e.target === e.currentTarget &&
      setShowIssueModal(false)
    }
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,10,.75)",
      backdropFilter: "blur(4px)",
      zIndex: 200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}
  >
    <div
      style={{
        background: "#0f1a2e",
        border: "1px solid rgba(255,255,255,.1)",
        borderRadius: 22,
        padding: 28,
        width: "100%",
        maxWidth: 640,
        maxHeight: "90vh",
        overflowY: "auto",
        position: "relative",
      }}
    >
      {/* CLOSE BUTTON */}

      <button
        onClick={() =>
          setShowIssueModal(false)
        }
        style={{
          position: "absolute",
          top: 16,
          right: 18,
          background:
            "rgba(255,255,255,.07)",
          border:
            "1px solid rgba(255,255,255,.1)",
          color: "#94a3b8",
          borderRadius: 8,
          width: 30,
          height: 30,
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        ✕
      </button>

      {/* TITLE */}

      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          marginBottom: 6,
        }}
      >
        Issue Certificate
      </h2>

      <p
        style={{
          color: "#64748b",
          fontSize: 13,
          marginBottom: 24,
        }}
      >
        Create and issue verified student
        certificates instantly
      </p>

      {/* FORM GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "14px",
          marginBottom: "18px",
        }}
      >
        {[
          {
            label: "Student *",
            key: "student",
            options: students?.map(
              (s) =>
                s.name ||
                s.student_name
            ),
          },

          {
            label: "Teacher *",
            key: "teacher",
            options: teachers?.map(
              (t) =>
                t.name ||
                t.teacher_name
            ),
          },

          {
            label: "Standard",
            key: "std",
            options: [
              "6th",
              "7th",
              "8th",
              "9th",
              "10th",
            ],
          },

          {
            label: "Course *",
            key: "course",
            options: [
              "React Mastery",
              "Python Bootcamp",
              "Machine Learning",
              "UI UX Design",
              "Data Science",
            ],
          },

          {
            label: "Certificate Type *",
            key: "type",
            options: [
              "Course Completion",
              "Skill Certification",
              "Workshop",
              "Internship",
              "Excellence Award",
            ],
          },

          {
            label: "Grade *",
            key: "grade",
            options: [
              "A+",
              "A",
              "B+",
              "B",
              "C",
            ],
          },

          {
            label: "Status",
            key: "status",
            options: [
              "Active",
              "Pending",
            ],
          },
        ].map(
          ({
            label,
            key,
            options,
          }) => (
            <div key={key}>
              <div
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                {label}
              </div>

              <select
                name={key}
                value={form[key]}
                onChange={handleChange}
                style={{
                  background:
                    "rgba(255,255,255,.05)",
                  border:
                    "1px solid rgba(255,255,255,.09)",
                  borderRadius: "11px",
                  color: "#f0f4ff",
                  fontSize: "13px",
                  padding:
                    "11px 13px",
                  outline: "none",
                  width: "100%",
                  appearance:
                    "none",
                }}
              >
                <option value="">
                  Select...
                </option>

                {options?.map(
                  (o, i) => (
                    <option
                      key={i}
                      value={o}
                      style={{
                        background:
                          "#0f1a2e",
                      }}
                    >
                      {o}
                    </option>
                  )
                )}
              </select>
            </div>
          )
        )}
      </div>

      {/* STUDENT ID */}

      <div
        style={{
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#64748b",
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          STUDENT ID
        </div>

        <input
          type="text"
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
          placeholder="Enter Student ID"
          style={{
            background:
              "rgba(255,255,255,.05)",
            border:
              "1px solid rgba(255,255,255,.09)",
            borderRadius: 11,
            color: "#f0f4ff",
            fontSize: 13,
            padding: "11px 13px",
            outline: "none",
            width: "100%",
          }}
        />
      </div>

      {/* MESSAGE */}

      <div
        style={{
          marginBottom: 18,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#64748b",
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          CUSTOM MESSAGE
        </div>

        <textarea
          rows={3}
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Add a custom message..."
          style={{
            background:
              "rgba(255,255,255,.05)",
            border:
              "1px solid rgba(255,255,255,.09)",
            borderRadius: 11,
            color: "#f0f4ff",
            fontSize: 13,
            padding: "11px 13px",
            outline: "none",
            width: "100%",
            resize: "vertical",
          }}
        />
      </div>

      {/* LIVE PREVIEW */}

      <div
        style={{
          borderRadius: 16,
          background:
            "linear-gradient(135deg,rgba(124,58,237,.14),rgba(59,130,246,.08))",
          border:
            "1px solid rgba(124,58,237,.25)",
          padding: "18px",
          marginBottom: 22,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 17,
            fontWeight: 800,
            marginBottom: 6,
            background:
              "linear-gradient(135deg,#8b5cf6,#06b6d4)",
            WebkitBackgroundClip:
              "text",
            WebkitTextFillColor:
              "transparent",
          }}
        >
          {form.course ||
            "Certificate Title"}
        </div>

        <div
          style={{
            fontSize: 13,
            color: "#94a3b8",
          }}
        >
          Awarded to{" "}
          <strong
            style={{
              color: "#fff",
            }}
          >
            {form.student ||
              "Student Name"}
          </strong>
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            color: "#64748b",
          }}
        >
          {form.type || "Type"} • Grade{" "}
          <span
            style={{
              color: "#fbbf24",
              fontWeight: 700,
            }}
          >
            {form.grade || "—"}
          </span>
        </div>
      </div>

      {/* ACTIONS */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
        }}
      >
        <button
          onClick={() =>
            setShowIssueModal(false)
          }
          style={{
            background:
              "rgba(255,255,255,.05)",
            border:
              "1px solid rgba(255,255,255,.1)",
            color: "#e2e8f0",
            padding: "10px 18px",
            borderRadius: 12,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          Cancel
        </button>

        <button
          onClick={
            handleIssueCertificate
          }
          style={{
            background:
              "linear-gradient(135deg,#7c3aed,#8b5cf6)",
            border: "none",
            color: "#fff",
            padding: "10px 22px",
            borderRadius: 12,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          Issue Certificate
        </button>
      </div>
    </div>
  </div>
)}


{/* STUDENT DETAIL MODAL */}
{/* CERTIFICATE DETAIL MODAL */}
{selectedCertificate && (
  <div
    onClick={(e) =>
      e.target === e.currentTarget &&
      setSelectedCertificate(null)
    }
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,10,.75)",
      backdropFilter: "blur(4px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}
  >
    <div
      style={{
        background: "#0f1a2e",
        border: "1px solid rgba(255,255,255,.1)",
        borderRadius: 22,
        padding: 28,
        width: "100%",
        maxWidth: 520,
        position: "relative",
        color: "#fff",
      }}
    >
      <button
        onClick={() => setSelectedCertificate(null)}
        style={{
          position: "absolute",
          top: 16,
          right: 18,
          background: "rgba(255,255,255,.07)",
          border: "1px solid rgba(255,255,255,.1)",
          color: "#94a3b8",
          borderRadius: 8,
          width: 30,
          height: 30,
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        ✕
      </button>

      <h2
        style={{
          fontSize: 20,
          fontWeight: 800,
          marginBottom: 18,
        }}
      >
        Certificate Details
      </h2>

      <div
        style={{
          display: "flex",
          gap: 14,
          alignItems: "center",
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom:
            "1px solid rgba(255,255,255,.07)",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg,#7c3aed,#06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 18,
          }}
        >
          {(selectedCertificate.student || "")
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)}
        </div>

        <div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 800,
              marginBottom: 4,
            }}
          >
            {selectedCertificate.student}
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#64748b",
            }}
          >
            {selectedCertificate.course}
          </div>
        </div>
      </div>

      {[
        {
          label: "Certificate ID",
          value:
            selectedCertificate.certificateId,
        },
        {
          label: "Course",
          value: selectedCertificate.course,
        },
        {
          label: "Type",
          value: selectedCertificate.type,
        },
        {
          label: "Grade",
          value: selectedCertificate.grade,
        },
        {
          label: "Teacher",
          value: selectedCertificate.teacher,
        },
        {
          label: "Status",
          value: selectedCertificate.status,
        },
        {
          label: "Student ID",
          value: selectedCertificate.studentId,
        },
      ].map(({ label, value }) => (
        <div
          key={label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom:
              "1px solid rgba(255,255,255,.05)",
            fontSize: 13,
          }}
        >
          <span
            style={{
              color: "#64748b",
            }}
          >
            {label}
          </span>

          <span
            style={{
              fontWeight: 600,
            }}
          >
            {value || "-"}
          </span>
        </div>
      ))}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 20,
        }}
      >
        <button
          onClick={() =>
            setSelectedCertificate(null)
          }
          style={{
            background:
              "linear-gradient(135deg,#7c3aed,#8b5cf6)",
            border: "none",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 11,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}


