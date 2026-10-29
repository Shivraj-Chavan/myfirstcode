import { useEffect, useState, useCallback, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

import {
  Plus,
  CalendarDays,
  Search,
  X,
  Video,
  Trash2,
  Pencil,
  BookOpen,
  FileText,
  Users,
  Bell,
  Radio,
  Mic,
  AlertCircle,
} from "lucide-react";

import ENDPOINT from "../../lib/endpoints";
import axios from "axios";
const getToken = () => {
  return localStorage.getItem("token");
};


const EVENT_TYPES = [
  {
    value: "LIVE_CLASS",
    label: "Live Class",
    color: "#2563eb",
    icon: Radio,
  },

  {
    value: "RECORDED_SESSION",
    label: "Recorded",
    color: "#9333ea",
    icon: Mic,
  },

  {
    value: "ASSIGNMENT",
    label: "Assignment",
    color: "#16a34a",
    icon: FileText,
  },

  {
    value: "QUIZ",
    label: "Quiz",
    color: "#f59e0b",
    icon: BookOpen,
  },

  {
    value: "EXAM",
    label: "Exam",
    color: "#dc2626",
    icon: AlertCircle,
  },

  {
    value: "PARENT_MEETING",
    label: "Meeting",
    color: "#db2777",
    icon: Users,
  },

  {
    value: "NOTICE",
    label: "Notice",
    color: "#4b5563",
    icon: Bell,
  },
];

const EVENT_MAP = Object.fromEntries(
  EVENT_TYPES.map((e) => [e.value, e])
);

// ─────────────────────────────────────────────
// EMPTY FORM
// ─────────────────────────────────────────────

const EMPTY_FORM = {
  title: "",
  description: "",
  event_type: "LIVE_CLASS",

  start_datetime: "",
  end_datetime: "",

  standard: "",

  meeting_link: "",
  recording_url: "",

  visibility: "ALL",

  status: "SCHEDULED",
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const formatDateTimeLocal = (date) => {
  if (!date) return "";

  const d = new Date(date);

  const pad = (n) =>
    String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(
    d.getMonth() + 1
  )}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString(
    [],
    {
      weekday: "short",
      day: "numeric",
      month: "short",
    }
  );
};

const formatTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────

const showToast = (
  message,
  type = "success"
) => {
  const toast =
    document.createElement("div");

  toast.className =
    "fixed bottom-5 right-5 z-[9999] px-4 py-3 rounded-xl text-sm font-semibold shadow-xl text-white";

  toast.style.background =
    type === "error"
      ? "#dc2626"
      : type === "warn"
      ? "#d97706"
      : "#16a34a";

  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};

// ─────────────────────────────────────────────
// FETCH API
// ─────────────────────────────────────────────

const apiRequest = async (
  url,
  method = "GET",
  body = null
) => {
  const response = await fetch(url, {
    method,

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },

    body: body
      ? JSON.stringify(body)
      : null,
  });

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Something went wrong"
    );
  }

  return data;
};

// ─────────────────────────────────────────────
// EVENT FORM MODAL
// ─────────────────────────────────────────────

function EventFormModal({
  open,
  onClose,
  onSave,
  editData,
}) {

  const [form, setForm] =
  useState(EMPTY_FORM);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        ...EMPTY_FORM,
        ...editData,

        start_datetime:
          formatDateTimeLocal(
            editData.start_datetime
          ),

        end_datetime:
          formatDateTimeLocal(
            editData.end_datetime
          ),
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async () => {
      try {
        setSaving(true);

        if (
          !form.title ||
          !form.start_datetime ||
          !form.end_datetime
        ) {
          showToast(
            "Please fill all required fields",
            "warn"
          );

          return;
        }

        await onSave(form);

        onClose();

      } catch (error) {

        console.log(error);

        showToast(
          error.message,
          "error"
        );

      } finally {

        setSaving(false);
      }
    };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl">

        {/* HEADER */}

        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold text-slate-800">

              {editData
                ? "Edit Event"
                : "Create Event"}

            </h2>

            <p className="text-sm text-slate-500">

              Schedule classes & meetings

            </p>

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">

          {/* EVENT TYPE */}

          <div>

            <label className="text-xs font-semibold text-slate-500 block mb-2">

              Event Type

            </label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">

              {EVENT_TYPES.map(
                (item) => {

                  const Icon =
                    item.icon;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          event_type:
                            item.value,
                        })
                      }
                      className={`border rounded-2xl p-3 flex flex-col items-center gap-1 transition-all ${
                        form.event_type ===
                        item.value
                          ? "border-slate-900 bg-slate-100"
                          : "border-slate-200"
                      }`}
                    >
                      <Icon
                        size={18}
                        color={
                          item.color
                        }
                      />

                      <span className="text-[11px] font-medium text-slate-700">

                        {item.label}

                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* TITLE */}

          <div>

            <label className="text-xs font-semibold text-slate-500 block mb-2">

              Title

            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={
                handleChange
              }
              placeholder="Enter title"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-800"
            />
          </div>

          {/* DESCRIPTION */}

          <div>

            <label className="text-xs font-semibold text-slate-500 block mb-2">

              Description

            </label>

            <textarea
              rows={3}
              name="description"
              value={
                form.description
              }
              onChange={
                handleChange
              }
              placeholder="Description..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-800 resize-none"
            />
          </div>

          {/* DATETIME */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="text-xs font-semibold text-slate-500 block mb-2">

                Start Time

              </label>

              <input
                type="datetime-local"
                name="start_datetime"
                value={
                  form.start_datetime
                }
                onChange={
                  handleChange
                }
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-800"
              />
            </div>

            <div>

              <label className="text-xs font-semibold text-slate-500 block mb-2">

                End Time

              </label>

              <input
                type="datetime-local"
                name="end_datetime"
                value={
                  form.end_datetime
                }
                onChange={
                  handleChange
                }
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-800"
              />
            </div>
          </div>

          {/* STANDARD */}

          <div>

            <label className="text-xs font-semibold text-slate-500 block mb-2">

              Standard

            </label>

            <select
              name="standard"
              value={
                form.standard
              }
              onChange={
                handleChange
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-800"
            >
              <option value="">
                Select Standard
              </option>

              {[6,7,8,9,10,11,12].map(
                (std) => (
                  <option
                    key={std}
                    value={std}
                  >
                    Std {std}
                  </option>
                )
              )}
            </select>
          </div>

          {/* MEETING LINK */}

          {(form.event_type ===
            "LIVE_CLASS" ||
            form.event_type ===
              "PARENT_MEETING") && (
            <div>

              <label className="text-xs font-semibold text-slate-500 block mb-2">

                Meeting Link

              </label>

              <input
                type="text"
                name="meeting_link"
                value={
                  form.meeting_link
                }
                onChange={
                  handleChange
                }
                placeholder="https://meet.google.com/..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-800"
              />
            </div>
          )}

          {/* RECORDING */}

          {form.event_type ===
            "RECORDED_SESSION" && (
            <div>

              <label className="text-xs font-semibold text-slate-500 block mb-2">

                Recording URL

              </label>

              <input
                type="text"
                name="recording_url"
                value={
                  form.recording_url
                }
                onChange={
                  handleChange
                }
                placeholder="https://youtube.com/..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-800"
              />
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 font-medium hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-white font-semibold"
          >
            {saving
              ? "Saving..."
              : editData
              ? "Update Event"
              : "Create Event"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function ScheduleCalendar() {

  const calendarRef =
    useRef(null);

  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [
    typeFilter,
    setTypeFilter,
  ] = useState("all");

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    selectedEvent,
    setSelectedEvent,
  ] = useState(null);

  // LOAD EVENTS

 const loadEvents = useCallback(async () => {
  try {
    setLoading(true);

    const data = await apiRequest(ENDPOINT.GET_EVENTS);

    const eventsData = Array.isArray(data) ? data : [];

    // 🔥 FIX: ensure proper ISO format (FullCalendar needs this)
    const normalized = eventsData.map((e) => ({
      ...e,
      start_datetime: new Date(e.start_datetime).toISOString(),
      end_datetime: new Date(e.end_datetime).toISOString(),
    }));

    setEvents([]); // 🔥 force reset so FullCalendar re-renders cleanly
    setTimeout(() => {
      setEvents(normalized);
    }, 0);

  } catch (error) {
    console.log(error);

    showToast(
      error.message || "Failed to load events",
      "error"
    );
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // SAVE EVENT

const handleSave = async (form) => {

  try {

const payload = {

  title: form.title,

  description:
    form.description,

  event_type:
    form.event_type,

  start_datetime:
    form.start_datetime,

  end_datetime:
    form.end_datetime,

  standard:
    form.standard,

  meeting_link:
    form.meeting_link || null,

  recording_url:
    form.recording_url || null,

  visibility:
    form.visibility || "ALL",

  status:
    form.status || "SCHEDULED",
};

    console.log(payload);

    // ================= UPDATE =================

    if (selectedEvent?.id) {

      await axios.put(

        ENDPOINT.UPDATE_EVENT(
          selectedEvent.id
        ),

        payload,

        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      showToast(
        "Event updated successfully"
      );

    }

    // ================= CREATE =================

    else {

      await axios.post(

        ENDPOINT.CREATE_EVENT,

        payload,

        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      showToast(
        "Event created successfully"
      );
    }

    setShowModal(false);

    setSelectedEvent(null);

    loadEvents();

  } catch (error) {

    console.log(error);

    showToast(

      error?.response?.data?.message ||
      "Failed to save event",

      "error"
    );
  }
};

  // DELETE EVENT

  const handleDelete =
    async (id) => {

      if (
        !window.confirm(
          "Delete this event?"
        )
      )
        return;

      try {

        await apiRequest(
          ENDPOINT.DELETE_EVENT(
            id
          ),
          "DELETE"
        );

        showToast(
          "Event deleted"
        );

        loadEvents();

      } catch (error) {

        console.log(error);

        showToast(
          "Delete failed",
          "error"
        );
      }
    };

  // FILTERED EVENTS
const filteredEvents = events
  .filter((event) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      typeFilter === "all" || event.event_type === typeFilter;

    return matchesSearch && matchesType;
  })
  .map((event) => {
    const meta = EVENT_MAP[event.event_type];

    return {
      id: String(event.id),
      title: event.title,

      start: event.start_datetime,
      end: event.end_datetime,

      backgroundColor: meta?.color || "#2563eb",
      borderColor: meta?.color || "#2563eb",
      textColor: "#fff",

      extendedProps: event,
    };
  });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <div className="sticky top-0 z-20 bg-white border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center">

              <CalendarDays
                size={20}
                className="text-white"
              />
            </div>

            <div>

              <h1 className="text-2xl font-bold text-slate-800">

                Schedule Calendar

              </h1>

              <p className="text-sm text-slate-500">

                Manage classes,
                meetings &
                assignments

              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search events..."
                className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-slate-900 text-sm"
              />
            </div>

            {/* FILTER */}

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(
                  e.target.value
                )
              }
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="all">
                All Types
              </option>

              {EVENT_TYPES.map(
                (item) => (
                  <option
                    key={item.value}
                    value={
                      item.value
                    }
                  >
                    {item.label}
                  </option>
                )
              )}
            </select>

            {/* BUTTON */}

            <button
              onClick={() => {

                setSelectedEvent(
                  null
                );

                setShowModal(true);
              }}
              className="bg-slate-900 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2"
            >
              <Plus size={16} />

              New Event
            </button>
          </div>
        </div>
      </div>

      {/* CALENDAR */}

      <div className="max-w-7xl mx-auto p-4">

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4">

          {loading ? (

            <div className="h-[500px] flex items-center justify-center text-slate-400">

              Loading calendar...

            </div>

          ) : (

            <FullCalendar
              ref={calendarRef}
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                listPlugin,
                interactionPlugin,
              ]}
              initialView="dayGridMonth"
              height="auto"
              editable={true}
              selectable={true}
              events={
                filteredEvents
              }
              headerToolbar={{
                left:
                  "prev,next today",
                center: "title",
                right:
                  "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
              }}

              dateClick={(
                info
              ) => {

                const start =
                  info.dateStr.includes(
                    "T"
                  )
                    ? info.dateStr
                    : `${info.dateStr}T09:00`;

                const end =
                  info.dateStr.includes(
                    "T"
                  )
                    ? info.dateStr
                    : `${info.dateStr}T10:00`;

                setSelectedEvent({
                  ...EMPTY_FORM,

                  start_datetime:
                    start,

                  end_datetime:
                    end,
                });

                setShowModal(true);
              }}

              eventClick={(
                info
              ) => {

                setSelectedEvent({
                    id: info.event.id,
                    ...info.event.extendedProps,
                  });

                setShowModal(true);
              }}

              eventContent={(
                arg
              ) => (

                <div className="px-1 py-0.5 text-[11px] font-medium truncate">

                  {
                    arg.event.title
                  }

                </div>
              )}
            />
          )}
        </div>

        {/* EVENT LIST */}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {events.map(
            (event) => {

              const meta =
                EVENT_MAP[
                  event
                    .event_type
                ];

             const Icon =
  meta?.icon || CalendarDays;
              return (
                <div
                  key={event.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-start gap-3">

                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{
                          background:
                            meta?.color +
                            "20",
                        }}
                      >
                        <Icon
                          size={18}
                          color={
                            meta?.color
                          }
                        />
                      </div>

                      <div>

                        <h3 className="font-semibold text-slate-800 line-clamp-1">

                          {
                            event.title
                          }

                        </h3>

                        <p className="text-xs text-slate-500 mt-1">

                          {formatDate(
                            event.start_datetime
                          )}{" "}
                          •{" "}
                          {formatTime(
                            event.start_datetime
                          )}

                        </p>
                      </div>
                    </div>

                    <span
                      className="text-[10px] px-2 py-1 rounded-full font-semibold text-white"
                      style={{
                        background:
                          meta?.color,
                      }}
                    >
                      {meta?.label}
                    </span>
                  </div>

                  {event.description && (

                    <p className="text-sm text-slate-500 mt-3 line-clamp-2">

                      {
                        event.description
                      }

                    </p>
                  )}

                  {/* ACTIONS */}

                  <div className="mt-4 flex items-center justify-between">

                    <div>

                      {event.meeting_link && (

                        <a
                          href={
                            event.meeting_link
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center"
                        >
                          <Video
                            size={16}
                            className="text-blue-600"
                          />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">

                      <button
                        onClick={() => {

                          setSelectedEvent(
                            event
                          );

                          setShowModal(
                            true
                          );
                        }}
                        className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                      >
                        <Pencil
                          size={16}
                          className="text-slate-700"
                        />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            event.id
                          )
                        }
                        className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center"
                      >
                        <Trash2
                          size={16}
                          className="text-red-600"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* MODAL */}

      <EventFormModal
        open={showModal}
        onClose={() => {

          setShowModal(false);

          setSelectedEvent(
            null
          );
        }}
        onSave={handleSave}
        editData={
          selectedEvent
        }
      />
    </div>
  );
}