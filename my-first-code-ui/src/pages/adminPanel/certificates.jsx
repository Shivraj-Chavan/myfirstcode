import axios from "axios";
import { useEffect, useState } from "react";
import ENDPOINT from "../../lib/endpoints";
import { LucideLogIn } from "lucide-react";

export default function CertificateManagement() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [certificates, setCertificates] = useState([])
  const [toast, setToast] = useState(null);
  const [teachers, setTeachers] = useState([]);
const [students, setStudents] = useState([]);
 const [form, setForm] = useState({
  student: "",
  studentId: "",
  std: "",
  teacher: "",
  course: "",
  type: "",
  grade: "",
  status: "Active",
  msg: "",
});

  const filteredData = certificates
  .filter(Boolean)
  .filter((item) => {
    if (!item) return false;
  
    const studentName = String(
      item.student || ""
    ).toLowerCase();
  
    const certificateId = String(
      item.id || ""
    ).toLowerCase();
  
    const searchText = search.toLowerCase();
  
    const matchSearch =
      studentName.includes(searchText) ||
      certificateId.includes(searchText);
  
    const matchFilter =
      filter === "All" ||
      item.status === filter;
  
    return matchSearch && matchFilter;
  });

  useEffect(() => {
    fetchCertificates();
    fetchTeachers();
    fetchStudents();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(
        ENDPOINT.GET_TEACHERS
      );
  
      console.log("Teacher API:", res.data);
  
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
  
  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        ENDPOINT.GET_ALL_STUDENTS
      );
  
      console.log(res.data);
  
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
  

  const fetchCertificates = async () => {
    try {
      const res = await axios.get(
        ENDPOINT.GET_CERTIFICATES
      );
  
      const data = Array.isArray(
        res.data.certificates
      )
        ? res.data.certificates
        : [];
  
      setCertificates(
        data.map((item) => ({
          id:
            item.certificateId ||
            item.id,
  
          student: item.student,
  
          std: item.std,
  
          teacher: item.teacher,
  
          course: item.course,
  
          type: item.type,
  
          grade: item.grade,
  
          status: item.status,
  
          msg: item.message,
        }))
      );
    } catch (error) {
      console.log(error);
  
      showToast(
        "Failed to load certificates",
        "#f43f5e"
      );
    }
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

  // =========================================
  // ISSUE CERTIFICATE API
  // =========================================

  const handleIssue = async () => {
    if (
      !form.student ||
      !form.teacher ||
      !form.course ||
      !form.type ||
      !form.grade
    ) {
      showToast(
        "Please fill all required fields",
        "#f43f5e"
      );
      return;
    }
  
    try {
      const payload = {
        student: form.student,
        studentId: form.studentId,
        std: form.std,
        teacher: form.teacher,
        course: form.course,
        type: form.type,
        grade: form.grade,
        status: form.status,
        message: form.msg,
      };
  
      console.log("Submitting:", payload);
  
      const res = await axios.post(
        ENDPOINT.ISSUE_CERTIFICATE,
        payload
      );
  
      console.log("Certificate Response:", res.data);
  
      // safer response handling
      const cert = res.data.certificate;
  
      // update table instantly
      setCertificates((prev) => [
        {
          id: cert.id,
  
          student: cert.student,
          std: cert.std,
          teacher: cert.teacher,
          course: cert.course,
          type: cert.type,
          msg: cert.message,
        },
        ...prev,
      ]);
  
      // SUCCESS TOAST
      showToast(
        `🎉 Certificate issued to ${form.student}`,
        "#10b981"
      );
  
      // CLOSE MODAL
      setShowIssueModal(false);
  
      // RESET FORM
      setForm({
        student: "",
        std: "",
        teacher: "",
        course: "",
        type: "",
        grade: "",
        status: "Active",
        msg: "",
      });
  
    } catch (error) {
      console.log("Issue Error:", error);
  
      showToast(
        error?.response?.data?.message ||
          "Failed to issue certificate",
        "#f43f5e"
      );
    }
  };


  const showToast = (msg, color = "#10b981") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  };
  
 
  
  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

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

      case "Expired":
        return {
          background: "rgba(244,63,94,.12)",
          color: "#fb7185",
        };

      default:
        return {};
    }
  };

  

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "28px",
        background: "#070b17",
        color: "white",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(17,24,39,.95), rgba(15,23,42,.95))",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: "24px",
          padding: "28px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "38px",
              fontWeight: "800",
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
              Certificate
            </span>{" "}
            Management
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            Manage student certificates and achievements
          </p>
        </div>

        <button
  onClick={() => setShowIssueModal(true)}
  style={{ border:"none",outline:"none",cursor:"pointer",padding:"14px 22px",borderRadius:"14px",background:"linear-gradient(135deg,#7c3aed,#8b5cf6)",color:"white",fontWeight:"700",fontSize:"14px" }}
>
  + Issue Certificate
</button>
      </div>

      {/* STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",
          gap: "18px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            title: "Total Issued",
            value: "2,847",
            sub: "↑ 12% this month",
          },
          {
            title: "Active",
            value: "1,923",
            sub: "67% certificates active",
          },
          {
            title: "Expired",
            value: "612",
            sub: "Need renewal",
          },
          {
            title: "Pending",
            value: "42",
            sub: "Awaiting approval",
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
                fontWeight: "800",
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
        {/* FILTER TOP */}

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
            placeholder="Search certificates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "320px",
              maxWidth: "100%",
              padding: "14px 16px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,.08)",
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
            {["All", "Active", "Pending", "Expired"].map(
              (item) => (
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
                    borderColor: "rgba(255,255,255,.08)",
                  }}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>

        {/* TABLE */}

        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                {[
                  "ID",
                  "Student",
                  "Course",
                  "Type",
                  "Grade",
                  "Status",
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
              {filteredData.map((item) => (
                <tr key={item?.id || Math.random()}>
                  <td
                    style={{
                      padding: "18px 16px",
                      borderBottom:
                        "1px solid rgba(255,255,255,.05)",
                    }}
                  >
                    {item?.id || "N/A"}
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
                          fontSize: "14px",
                        }}
                      >
                        {item?.student
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
                    }}
                  >
                    {item.type}
                  </td>

                  <td
                    style={{
                      padding: "18px 16px",
                      borderBottom:
                        "1px solid rgba(255,255,255,.05)",
                      color: "#fbbf24",
                      fontWeight: "700",
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
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                     <button
  onClick={() => setSelectedStudent(item)}
  style={{ width:"38px",height:"38px",borderRadius:"10px",border:"1px solid rgba(255,255,255,.08)",background:"rgba(255,255,255,.04)",color:"white",cursor:"pointer" }}
  title="View Student"
>👁</button>
<button
  onClick={() =>handleDownload(item)}
  style={{ width:"38px",height:"38px",borderRadius:"10px",border:"1px solid rgba(255,255,255,.08)",background:"rgba(255,255,255,.04)",color:"white",cursor:"pointer" }}
  title="Download"
>⬇</button>
<button
  onClick={() => showToast(`Resent to ${item.student}`, "#7c3aed")}
  style={{ width:"38px",height:"38px",borderRadius:"10px",border:"1px solid rgba(255,255,255,.08)",background:"rgba(255,255,255,.04)",color:"white",cursor:"pointer" }}
  title="Resend"
>✉</button>
<button
  onClick={() => { setCertificates(c => c.filter(x => x.id !== item.id)); showToast("Deleted", "#f43f5e"); }}
  style={{ width:"38px",height:"38px",borderRadius:"10px",border:"1px solid rgba(244,63,94,.2)",background:"rgba(244,63,94,.08)",color:"#fb7185",cursor:"pointer" }}
  title="Delete"
>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOAST */}
{toast && (
  <div style={{ position:"fixed",bottom:24,right:24,zIndex:999,background:toast.color,color:"#fff",padding:"12px 20px",borderRadius:"13px",fontWeight:"700",fontSize:"14px" }}>
    {toast.msg}
  </div>
)}

{/* ISSUE MODAL */}
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
      {/* CLOSE BTN */}
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

      <h2
        style={{
          fontSize: 20,
          fontWeight: 800,
          marginBottom: 4,
        }}
      >
        Issue Certificate
      </h2>

      <p
        style={{
          color: "#64748b",
          fontSize: 13,
          marginBottom: 22,
        }}
      >
        Fill in the details to generate a
        verified certificate
      </p>

      {/* FORM GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "13px",
          marginBottom: "16px",
        }}
      >
        <div>
  <div
    style={{
      fontSize: "11px",
      color: "#64748b",
      fontWeight: 600,
      marginBottom: "5px",
    }}
  >
    Student *
  </div>

  <select
    value={form.studentId}
    onChange={(e) => {
      const student = students.find(
        (s) =>
          String(s.id) === e.target.value ||
          String(s.student_id) === e.target.value
      );

      setForm((prev) => ({
        ...prev,
        studentId:
          student?.id || student?.student_id,
        student:
          student?.name ||
          student?.student_name ||
          "",
        std:
          student?.std ||
          student?.standard ||
          "",
      }));
    }}
    style={{
      border: "1px solid rgba(255,255,255,.09)",
      borderRadius: "11px",
      fontSize: "13px",
      padding: "10px 13px",
      width: "100%",
    }}
  >
    <option value="">Select Student</option>

    {students.map((s) => (
      <option
        key={s.id || s.student_id}
        value={s.id || s.student_id}
      >
        {s.name || s.student_name}
      </option>
    ))}
  </select>
</div>
        {[
        

          {
            label: "Teacher *",
            key: "teacher",
            options: Array.isArray(teachers)
              ? teachers.map(
                  (t) =>
                    t.name ||
                    t.teacher_name
                )
              : [],
          },

          {
            label: "STD",
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
              "ML Fundamentals",
              "Python Bootcamp",
              "UI/UX Design",
              "Data Science 101",
            ],
          },

          {
            label: "Type *",
            key: "type",
            options: [
              "Course Completion",
              "Skill Certification",
              "Assignment Excellence",
              "Workshop Completion",
              "Internship",
            ],
          },

          {
            label: "Grade *",
            key: "grade",
            options: [
              "A+",
              "A",
              "A-",
              "B+",
              "B",
              "B-",
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
                  fontSize: "11px",
                  color: "#64748b",
                  fontWeight: 600,
                  marginBottom: "5px",
                }}
              >
                {label}
              </div>

              <select
                value={form[key]}
                onChange={setF(key)}
                style={{
                  background:
                    "rgba(255,255,255,.05)",
                  border:
                    "1px solid rgba(255,255,255,.09)",
                  borderRadius: "11px",
                  color: "#f0f4ff",
                  fontFamily:
                    "inherit",
                  fontSize: "13px",
                  padding:
                    "10px 13px",
                  outline: "none",
                  width: "100%",
                  appearance:
                    "none",
                }}
              >
                <option value="">
                  Select...
                </option>

                {options.map(
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
      

      {/* MESSAGE */}
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
            marginBottom: 5,
          }}
        >
          CUSTOM MESSAGE
        </div>

        <textarea
          value={form.msg}
          onChange={setF("msg")}
          rows={3}
          placeholder="Add a personalised message…"
          style={{
            background:
              "rgba(255,255,255,.05)",
            border:
              "1px solid rgba(255,255,255,.09)",
            borderRadius: 11,
            color: "#f0f4ff",
            fontFamily: "inherit",
            fontSize: 13,
            padding: "10px 13px",
            outline: "none",
            width: "100%",
            resize: "vertical",
          }}
        />
      </div>

      {/* PREVIEW */}
      <div
        style={{
          borderRadius: 14,
          background:
            "linear-gradient(135deg,rgba(124,58,237,.12),rgba(59,130,246,.07))",
          border:
            "1px solid rgba(124,58,237,.2)",
          padding: "16px 18px",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            background:
              "linear-gradient(135deg,#8b5cf6,#06b6d4)",
            WebkitBackgroundClip:
              "text",
            WebkitTextFillColor:
              "transparent",
            marginBottom: 4,
          }}
        >
          {form.course ||
            "Certificate Title"}
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#64748b",
          }}
        >
          Awarded to{" "}
          <strong
            style={{
              color: "#f0f4ff",
            }}
          >
            {form.student ||
              "Student Name"}
          </strong>{" "}
          · {form.type || "Type"} ·
          Grade:{" "}
          <strong
            style={{
              color: "#fbbf24",
            }}
          >
            {form.grade || "—"}
          </strong>
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
          onClick={handleIssue}
          style={{
            background:
              "linear-gradient(135deg,#7c3aed,#8b5cf6)",
            border: "none",
            color: "#fff",
            padding: "10px 20px",
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
{selectedStudent && (
  <div onClick={(e) => e.target === e.currentTarget && setSelectedStudent(null)}
    style={{ position:"fixed",inset:0,background:"rgba(0,0,10,.75)",backdropFilter:"blur(4px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
    <div style={{ background:"#0f1a2e",border:"1px solid rgba(255,255,255,.1)",borderRadius:22,padding:28,width:"100%",maxWidth:520,position:"relative" }}>
      <button onClick={() => setSelectedStudent(null)}
        style={{ position:"absolute",top:16,right:18,background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.1)",color:"#94a3b8",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:16 }}>✕</button>
      <h2 style={{ fontSize:20,fontWeight:800,marginBottom:18 }}>Student Profile</h2>

      <div style={{ display:"flex",gap:14,alignItems:"center",marginBottom:20,paddingBottom:16,borderBottom:"1px solid rgba(255,255,255,.07)" }}>
        <div style={{ width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#06b6d4)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:18 }}>
          {selectedStudent.student.split(" ").map(p=>p[0]).join("").slice(0,2)}
        </div>
        <div>
          <div style={{ fontSize:17,fontWeight:800,marginBottom:4 }}>{selectedStudent.student}</div>
          <div style={{ fontSize:13,color:"#64748b",marginBottom:8 }}>{selectedStudent.course}</div>
          <div style={{ display:"flex",gap:8 }}>
            <span style={{ ...getStatusStyle(selectedStudent.status),padding:"4px 11px",borderRadius:99,fontSize:11,fontWeight:700 }}>{selectedStudent.status}</span>
            <span style={{ background:"rgba(59,130,246,.12)",color:"#60a5fa",padding:"4px 11px",borderRadius:99,fontSize:11,fontWeight:700 }}>Grade {selectedStudent.grade}</span>
          </div>
        </div>
      </div>

      {[
        { label:"Course",  value: selectedStudent.course },
        { label:"Type",    value: selectedStudent.type },
        { label:"Cert ID", value: selectedStudent.id },
        { label:"Status",  value: selectedStudent.status },
      ].map(({ label, value }) => (
        <div key={label} style={{ display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,.05)",fontSize:13 }}>
          <span style={{ color:"#64748b" }}>{label}</span>
          <span style={{ fontWeight:600 }}>{value}</span>
        </div>
      ))}

      <div style={{ display:"flex",justifyContent:"flex-end",gap:10,marginTop:20 }}>
        <button onClick={() => setSelectedStudent(null)}
          style={{ background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#e2e8f0",padding:"9px 16px",borderRadius:11,cursor:"pointer",fontWeight:600,fontSize:13 }}>Close</button>
        <button onClick={() => { setSelectedStudent(null); setShowIssueModal(true); }}
          style={{ background:"linear-gradient(135deg,#7c3aed,#8b5cf6)",border:"none",color:"#fff",padding:"9px 18px",borderRadius:11,cursor:"pointer",fontWeight:700,fontSize:13 }}>+ Issue New</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}