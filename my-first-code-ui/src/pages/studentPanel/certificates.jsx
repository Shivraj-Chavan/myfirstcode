import { useEffect, useState } from "react";
import ENDPOINT from "../../lib/endpoints";
import axios from "axios";

export default function StudentCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [loading, setLoading] = useState(true);

const [confettiPieces, setConfettiPieces] =
  useState([]);

  useEffect(() => {
    if (showCongrats) {
      const pieces = Array.from(
        { length: 120 },
        (_, i) => ({
          id: i,
          left: Math.random() * 100,
          size: Math.random() * 10 + 6,
          delay: Math.random() * 1.5,
          duration: Math.random() * 3 + 3,
          rotate: Math.random() * 360,
          color: [
            "#ff4d6d",
            "#ffd60a",
            "#38bdf8",
            "#10b981",
            "#8b5cf6",
            "#f97316",
          ][Math.floor(Math.random() * 6)],
        })
      );
  
      setConfettiPieces(pieces);
  
      const timer = setTimeout(() => {
        setShowCongrats(false);
        setConfettiPieces([]);
      }, 5000);
  
      return () => clearTimeout(timer);
    }
  }, [showCongrats]);

 


  useEffect(() => {
    fetchCertificates();
  }, []);
  
  const fetchCertificates = async () => {
    try {
    
    
      const user = JSON.parse(
        localStorage.getItem("user")
      );
      
      console.log(user);

      if (!user) {
        console.error(
          "User not found in localStorage"
        );
        return;
      }
      
      
      const res = await axios.get(
        ENDPOINT.GET_CERTIFICATES_BY_STUDENT(
          user.id
        ),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
    
      console.log(res.data);
console.log(res.data.certificates);
console.log(typeof res.data.certificates);
      
  
const allCertificates = Array.isArray(
  res.data.certificates
)
  ? res.data.certificates
  : [];

  
      const formatted =
        allCertificates.map((item) => ({
          id:
            item.id ||
            item.certificate_id,
  
          certificateId:
            item.certificateId,
  
          student:
            item.student ||
            item.student_name,
  
          studentId:
            item.studentId,
          
          course:
            item.course ||
            item.course_name,
  
          type:
            item.type ||
            item.certificate_type,
  
          grade:
            item.grade || "N/A",
  
          status:
            item.status || "Active",
  
          issuedBy:
            item.teacher ||
            item.teacher_name ||
            item.issuedBy ||
            "Admin",

            issuedDate:
            (item.created_at || item.createdAt)
              ? new Date(
                  item.created_at || item.createdAt
                ).toLocaleDateString()
              : "N/A",
        }));
  
      setCertificates(formatted);
  
    } catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return {
          background: "rgba(16,185,129,.12)",
          color: "#10b981",
        };

      case "Pending":
        return {
          background: "rgba(245,158,11,.12)",
          color: "#f59e0b",
        };

      case "Expired":
        return {
          background: "rgba(239,68,68,.12)",
          color: "#ef4444",
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
        background: "#f1f5f9",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "28px",
          marginBottom: "28px",
          border: "1px solid #e2e8f0",
          boxShadow:
            "0 10px 30px rgba(15,23,42,.05)",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "800",
            marginBottom: "8px",
            color: "#0f172a",
          }}
        >
          My Certificates
        </h1>

        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          View all certificates issued by teachers
          and admins
        </p>
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
            title: "Total Certificates",
            value: certificates.length,
          },

          {
            title: "Active",
            value:
              certificates.filter(
                (x) => x.status === "Active"
              ).length,
          },

          {
            title: "Completed Courses",
            value:
              certificates.filter(
                (x) =>
                  x.type ===
                  "Course Completion"
              ).length,
          },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "22px",
              padding: "24px",
              boxShadow:
                "0 10px 25px rgba(15,23,42,.04)",
            }}
          >
            <div
              style={{
                color: "#64748b",
                fontSize: "13px",
                marginBottom: "12px",
              }}
            >
              {item.title}
            </div>

            <div
              style={{
                fontSize: "34px",
                fontWeight: "800",
                color: "#0f172a",
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* CERTIFICATE GRID */}

{certificates.length === 0 ? (

<div
  style={{
    background: "#fff",
    borderRadius: "28px",
    padding: "60px 30px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 10px 30px rgba(15,23,42,.05)",
  }}
>
  <div
    style={{
      fontSize: "70px",
      marginBottom: "18px",
    }}
  >
    🎓
  </div>

  <h2
    style={{
      fontSize: "28px",
      fontWeight: "800",
      color: "#0f172a",
      marginBottom: "10px",
    }}
  >
    No Certificates Yet
  </h2>
  

  <p
    style={{
      color: "#64748b",
      fontSize: "15px",
      maxWidth: "500px",
      margin: "0 auto",
      lineHeight: 1.7,
    }}
  >
    Your achievements are waiting to shine ✨
    Complete courses, attend workshops, and
    unlock certificates issued by your teachers.
  </p>

</div>

) : (

<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",
    gap: "20px",
  }}
>
  {certificates.map((item) => (

    <div
      key={item._id || item.id}
      style={{
        background: "#fff",
        borderRadius: "24px",
        padding: "24px",
        border: "1px solid #e2e8f0",
        boxShadow:
          "0 10px 30px rgba(15,23,42,.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "5px",
          background:
            "linear-gradient(135deg,#2563eb,#4f46e5)",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "18px",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "13px",
              color: "#64748b",
              marginBottom: "6px",
            }}
          >
            Certificate ID
          </div>

          <div
            style={{
              fontWeight: "700",
              color: "#0f172a",
            }}
          >
            {item.certificateId || item.id}
          </div>
        </div>

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
      </div>

      <h2
        style={{
          fontSize: "22px",
          fontWeight: "800",
          marginBottom: "8px",
          color: "#0f172a",
        }}
      >
        {item.course}
      </h2>

      <p
        style={{
          color: "#64748b",
          fontSize: "14px",
          marginBottom: "20px",
        }}
      >
        {item.type}
      </p>

      <div
        style={{
          display: "flex",
          gap: "12px",
        }}
      >
        <button onClick={() => {
  setSelectedCertificate(item);
  setShowCongrats(true);
}}
       
          style={{
            flex: 1,
            border: "none",
            cursor: "pointer",
            padding: "12px",
            borderRadius: "12px",
            background:
              "linear-gradient(135deg,#2563eb,#4f46e5)",
            color: "white",
            fontWeight: "700",
          }}
        >
          View
        </button>

 

        <button onClick={() =>
          window.open(
            item.certificate_url,
            "_blank"
          )
        }
          style={{
            flex: 1,
            border:
              "1px solid #e2e8f0",
            cursor: "pointer",
            padding: "12px",
            borderRadius: "12px",
            background: "#f8fafc",
            color: "#334155",
            fontWeight: "700",
          }}
        >
          Download
        </button>
      </div>
    </div>

  ))}
</div>

)}

      {/* MODAL */}

      {selectedCertificate && (
        <div
          onClick={(e) =>
            e.target === e.currentTarget &&
            setSelectedCertificate(null)
          }
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(15,23,42,.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "32px",
              width: "100%",
              maxWidth: "720px",
              position: "relative",
            }}
          >
            <button
              onClick={() =>
                setSelectedCertificate(null)
              }
              style={{
                position: "absolute",
                top: "18px",
                right: "18px",
                border: "none",
                background: "#f1f5f9",
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            <div
              style={{
                textAlign: "center",
                border:
                  "6px solid #eff6ff",
                borderRadius: "24px",
                padding: "40px 30px",
              }}
            >
              <div
                style={{
                  fontSize: "42px",
                  marginBottom: "16px",
                }}
              >
                🏆
              </div>

              <div
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  marginBottom: "10px",
                  letterSpacing: "3px",
                }}
              >
                CERTIFICATE OF ACHIEVEMENT
              </div>

              <h1
                style={{
                  fontSize: "36px",
                  fontWeight: "800",
                  color: "#0f172a",
                  marginBottom: "24px",
                }}
              >
                {selectedCertificate.course}
              </h1>

              <p
                style={{
                  fontSize: "15px",
                  color: "#64748b",
                  marginBottom: "10px",
                }}
              >
                This certificate is proudly awarded
                to
              </p>

              <h2
                style={{
                  fontSize: "30px",
                  fontWeight: "800",
                  color: "#2563eb",
                  marginBottom: "22px",
                }}
              >
                {selectedCertificate.student}
              </h2>

              <p
                style={{
                  color: "#475569",
                  lineHeight: 1.8,
                  marginBottom: "28px",
                }}
              >
                For successfully completing{" "}
                <strong>
                  {
                    selectedCertificate.course
                  }
                </strong>{" "}
                with grade{" "}
                <strong>
                  {
                    selectedCertificate.grade
                  }
                </strong>
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginTop: "40px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    {
                      selectedCertificate.issuedBy
                    }
                  </div>

                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                    }}
                  >
                    Authorized Signatory
                  </div>
                </div>

                <div
                  style={{
                    textAlign: "right",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    {
                      selectedCertificate.issuedDate
                    }
                  </div>

                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                    }}
                  >
                    Date Issued
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

{showCongrats &&
  confettiPieces.map((piece) => (
    <div
      key={piece.id}
      style={{
        position: "fixed",
        top: "-20px",
        left: `${piece.left}%`,
        width: `${piece.size}px`,
        height: `${piece.size * 1.8}px`,
        background: piece.color,
        borderRadius: "2px",
        zIndex: 99999,
        animation: `confettiFall ${piece.duration}s linear ${piece.delay}s forwards`,
        transform: `rotate(${piece.rotate}deg)`,
        pointerEvents: "none",
      }}
    />
))}
    </div>
  );
}