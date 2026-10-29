// import { useEffect, useState } from "react";

// import axios from "axios";

// import {
//   Calendar,
//   momentLocalizer,
// } from "react-big-calendar";

// import moment from "moment";

// import "react-big-calendar/lib/css/react-big-calendar.css";

// import ENDPOINT from "../../lib/endpoints";

// const localizer =
//   momentLocalizer(moment);

// const Calender = () => {

//   const [events, setEvents] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   // ================= USER =================

//   const user = JSON.parse(
//     localStorage.getItem("user") || "{}"
//   );

//   if (!user?.standard) {
//     setLoading(false);
//     return;
//   }

//   // ================= FETCH EVENTS =================

//   const fetchEvents = async () => {
//     try {
//       setLoading(true);
  
//       const res = await axios.get(
//         ENDPOINT.GET_EVENTS_BY_STANDARD(
//           user.standard
//         ),
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
  
//       const eventsArray =
//         res.data?.data || [];
  
//       const formattedEvents =
//         eventsArray.map((event) => ({
//           id: event.id,
//           title: event.title,
//           start: new Date(
//             event.start_datetime
//           ),
//           end: new Date(
//             event.end_datetime
//           ),
//           type: event.event_type,
//           description:
//             event.description,
//           meeting_link:
//             event.meeting_link,
//         }));
  
//       setEvents(formattedEvents);
  
//     } catch (error) {
  
//       console.log(
//         error?.response?.data ||
//         error
//       );
  
//     } finally {
  
//       setLoading(false);
//     }
//   };
//   // ================= EVENT COLORS =================

//   const eventStyleGetter = (
//   event
// ) => {

//   let backgroundColor =
//     "#4f46e5";

//   if (
//     event.type === "ASSIGNMENT"
//   ) {
//     backgroundColor = "#f59e0b";
//   }

//   if (
//     event.type === "QUIZ"
//   ) {
//     backgroundColor = "#ef4444";
//   }

//   if (
//     event.type === "RECORDED_SESSION"
//   ) {
//     backgroundColor = "#10b981";
//   }

//   if (
//     event.type === "LIVE_CLASS"
//   ) {
//     backgroundColor = "#06b6d4";
//   }

//   if (
//     event.type === "EXAM"
//   ) {
//     backgroundColor = "#dc2626";
//   }

//   return {
//     style: {
//       backgroundColor,
//       borderRadius: "10px",
//       border: "none",
//       color: "white",
//       padding: "5px",
//     },
//   };
// };

//   // ================= EVENT CLICK =================

//   const handleSelectEvent = (
//     event
//   ) => {

//     alert(`
// Title: ${event.title}

// Type: ${event.type}

// Description:
// ${event.description}

// Meeting Link:
// ${event.meeting_link || "N/A"}
//     `);
//   };

//   // ================= LOAD =================

//   useEffect(() => {
//     if (user?.standard) {
//       fetchEvents();
//     }
//   }, [user?.standard]);

//   return (
//     <div className="p-6">

//       {/* HEADER */}

//       <div className="mb-8">

//         <h1 className="text-4xl font-bold">

//           Calendar

//         </h1>

//         <p className="text-slate-500 mt-2">

//           View your lectures,
//           assignments, quizzes and
//           scheduled classes.

//         </p>

//       </div>

//       {/* LOADING */}

//       {loading ? (

//         <div className="text-center text-2xl font-bold mt-20">

//           Loading Calendar...

//         </div>

//       ) : (

//         <div className="bg-white p-5 rounded-2xl shadow-md h-[80vh]">

//           <Calendar
//             localizer={localizer}
//             events={events}
//             startAccessor="start"
//             endAccessor="end"
//             views={[
//               "month",
//               "week",
//               "day",
//               "agenda",
//             ]}
//             defaultView="month"
//             popup
//             eventPropGetter={
//               eventStyleGetter
//             }
//             onSelectEvent={
//               handleSelectEvent
//             }
//             style={{
//               height: "100%",
//             }}
//           />

//         </div>

//       )}

//     </div>
//   );
// };

// export default Calender;













import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ENDPOINT from "../../lib/endpoints";

const localizer = momentLocalizer(moment);

// ─── Event type config ────────────────────────────────────────────────────────
const EVENT_CONFIG = {
  ASSIGNMENT: { color: "#f59e0b", bg: "#fef3c7", label: "Assignment", icon: "📝" },
  QUIZ:       { color: "#ef4444", bg: "#fee2e2", label: "Quiz",       icon: "📋" },
  RECORDED_SESSION: { color: "#10b981", bg: "#d1fae5", label: "Recorded Session", icon: "🎥" },
  LIVE_CLASS: { color: "#06b6d4", bg: "#cffafe", label: "Live Class", icon: "📡" },
  EXAM:       { color: "#dc2626", bg: "#fee2e2", label: "Exam",       icon: "📄" },
  DEFAULT:    { color: "#4f46e5", bg: "#ede9fe", label: "Event",      icon: "📅" },
};

const getConfig = (type) => EVENT_CONFIG[type] || EVENT_CONFIG.DEFAULT;

// ─── Event Detail Modal ───────────────────────────────────────────────────────
const EventModal = ({ event, onClose }) => {
  if (!event) return null;
  const cfg = getConfig(event.type);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Colored header bar */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ backgroundColor: cfg.color }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{cfg.icon}</span>
            <span className="text-white font-semibold text-sm uppercase tracking-wider">
              {cfg.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:opacity-75 text-xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-gray-400 text-xs font-medium mb-1">START</p>
              <p className="text-gray-800 font-semibold">
                {moment(event.start).format("ddd, MMM D")}
              </p>
              <p className="text-gray-500">{moment(event.start).format("h:mm A")}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-gray-400 text-xs font-medium mb-1">END</p>
              <p className="text-gray-800 font-semibold">
                {moment(event.end).format("ddd, MMM D")}
              </p>
              <p className="text-gray-500">{moment(event.end).format("h:mm A")}</p>
            </div>
          </div>

          {event.description && (
            <div>
              <p className="text-gray-400 text-xs font-medium mb-1 uppercase tracking-wider">
                Description
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {event.meeting_link && (
            <a
              href={event.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2.5 rounded-xl w-full justify-center transition-opacity hover:opacity-90"
              style={{ backgroundColor: cfg.color }}
            >
              <span>🔗</span> Join Meeting
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Custom Event Tile ────────────────────────────────────────────────────────
const CustomEvent = ({ event }) => {
  const cfg = getConfig(event.type);
  return (
    <div className="flex items-center gap-1 text-xs font-medium truncate">
      <span>{cfg.icon}</span>
      <span className="truncate">{event.title}</span>
    </div>
  );
};

// ─── Legend ──────────────────────────────────────────────────────────────────
const Legend = () => (
  <div className="flex flex-wrap gap-3 mb-4">
    {Object.entries(EVENT_CONFIG)
      .filter(([key]) => key !== "DEFAULT")
      .map(([key, cfg]) => (
        <div key={key} className="flex items-center gap-1.5 text-xs text-gray-600">
          <span
            className="w-3 h-3 rounded-full inline-block flex-shrink-0"
            style={{ backgroundColor: cfg.color }}
          />
          {cfg.icon} {cfg.label}
        </div>
      ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Calender = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        ENDPOINT.GET_EVENTS_BY_STANDARD(user.standard),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const eventsArray = res.data?.data || [];

      const formattedEvents = eventsArray.map((event) => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start_datetime),
        end: new Date(event.end_datetime),
        // Ensure all-day events render if start == end
        allDay:
          event.start_datetime === event.end_datetime ||
          (!event.start_datetime.includes("T") && !event.end_datetime.includes("T")),
        type: event.event_type,
        description: event.description,
        meeting_link: event.meeting_link,
      }));

      setEvents(formattedEvents);
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user.standard]);

  useEffect(() => {
    if (user?.standard) {
      fetchEvents();
    } else {
      setLoading(false);
    }
  }, []);

  // Style each event chip by type
  const eventStyleGetter = (event) => {
    const cfg = getConfig(event.type);
    return {
      style: {
        backgroundColor: cfg.color,
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        padding: "2px 6px",
        fontSize: "12px",
        fontWeight: 500,
      },
    };
  };

  const handleSelectEvent = (event) => setSelectedEvent(event);

  // ── No standard guard ──
  if (!user?.standard) {
    return (
      <div className="p-6">
        <div className="bg-yellow-100 text-yellow-800 border border-yellow-200 p-4 rounded-xl text-sm font-medium">
          ⚠️ No standard assigned to this student account. Please contact your administrator.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-slate-500 mt-1 text-sm">
            View your lectures, assignments, quizzes and scheduled classes.
          </p>
        </div>
        <button
          onClick={fetchEvents}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button
            onClick={fetchEvents}
            className="ml-4 font-semibold underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Legend */}
      <Legend />

      {/* Calendar */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[65vh] gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading your schedule…</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-[75vh]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="month"
            views={["month", "week", "day", "agenda"]}
            popup
            popupOffset={{ x: 30, y: 20 }}
            selectable
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            components={{ event: CustomEvent }}
            style={{ height: "100%" }}
            messages={{
              noEventsInRange: "No events scheduled for this period.",
            }}
          />
        </div>
      )}

      {/* Modal */}
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />

      {/* Calendar override styles */}
      <style>{`
        .rbc-toolbar button {
          border-radius: 8px !important;
          font-size: 13px !important;
        }
        .rbc-toolbar button.rbc-active {
          background-color: #4f46e5 !important;
          border-color: #4f46e5 !important;
          color: #fff !important;
        }
        .rbc-today {
          background-color: #eef2ff !important;
        }
        .rbc-event:focus {
          outline: 2px solid #4f46e5 !important;
        }
        .rbc-show-more {
          color: #4f46e5 !important;
          font-weight: 600 !important;
          font-size: 11px !important;
        }
        .rbc-agenda-event-cell {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Calender;