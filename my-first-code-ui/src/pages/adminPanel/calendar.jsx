import { useEffect, useState, useCallback, useRef } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

import axios from "axios";

import {
  Plus,
  CalendarDays,
  Search,
  X,
  Trash2,
  Pencil,
  Video,
  BookOpen,
  FileText,
  Users,
  Bell,
  Radio,
  Mic,
  AlertCircle,
} from "lucide-react";

import ENDPOINT from "../../lib/endpoints";

// ─────────────────────────────────────────────
// TOKEN
// ─────────────────────────────────────────────

const getToken = () =>
  localStorage.getItem("token");

// ─────────────────────────────────────────────
// EVENT TYPES
// ─────────────────────────────────────────────

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

const formatDateTimeLocal = (
  date
) => {
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
      : "#16a34a";

  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};

// ─────────────────────────────────────────────
// API REQUEST
// ─────────────────────────────────────────────

const apiRequest = async (
  url,
  method = "GET",
  body = null
) => {
  const response = await fetch(url, {
    method,

    headers: {
      "Content-Type":
        "application/json",

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
// MODAL
// ─────────────────────────────────────────────

function Calendar({
  open,
  onClose,
  onSave,
  editData,
}) {
  const [form, setForm] =
    useState(EMPTY_FORM);

  useEffect(() => {
    if (editData) {
      setForm({
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
      await onSave(form);

      onClose();
    };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}

        <div className="p-5 border-b flex items-center justify-between">

          <h2 className="text-xl font-bold">

            {editData
              ? "Edit Event"
              : "Create Event"}

          </h2>

          <button
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}

        <div className="p-5 space-y-4">

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border rounded-xl px-4 py-3"
          />

          <textarea
            rows={3}
            name="description"
            value={
              form.description
            }
            onChange={handleChange}
            placeholder="Description"
            className="w-full border rounded-xl px-4 py-3"
          />

          <select
            name="event_type"
            value={
              form.event_type
            }
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          >
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

          <div className="grid grid-cols-2 gap-4">

            <input
              type="datetime-local"
              name="start_datetime"
              value={
                form.start_datetime
              }
              onChange={
                handleChange
              }
              className="border rounded-xl px-4 py-3"
            />

            <input
              type="datetime-local"
              name="end_datetime"
              value={
                form.end_datetime
              }
              onChange={
                handleChange
              }
              className="border rounded-xl px-4 py-3"
            />
          </div>

          <select
            name="standard"
            value={
              form.standard
            }
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
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

          <input
            type="text"
            name="meeting_link"
            value={
              form.meeting_link
            }
            onChange={handleChange}
            placeholder="Meeting Link"
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>

        {/* FOOTER */}

        <div className="p-5 border-t flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={
              handleSubmit
            }
            className="px-5 py-2 bg-slate-900 text-white rounded-xl"
          >
            Save Event
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function AdminCalendar() {

  const calendarRef =
    useRef(null);

  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    selectedEvent,
    setSelectedEvent,
  ] = useState(null);

  // ─────────────────────────────────────────
  // LOAD EVENTS
  // ─────────────────────────────────────────

  const loadEvents =
    useCallback(async () => {

      try {

        setLoading(true);

        const data =
          await apiRequest(
            ENDPOINT.GET_ALL_EVENTS_ADMIN
          );

        const eventsData =
          data.data || [];

        setEvents(eventsData);

      } catch (error) {

        console.log(error);

        showToast(
          error.message,
          "error"
        );

      } finally {

        setLoading(false);
      }

    }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // ─────────────────────────────────────────
  // SAVE EVENT
  // ─────────────────────────────────────────

  const handleSave =
    async (form) => {

      try {

        if (
          selectedEvent?.id
        ) {

          await axios.put(

            ENDPOINT.UPDATE_EVENT(
              selectedEvent.id
            ),

            form,

            {
              headers: {
                Authorization:
                  `Bearer ${getToken()}`,
              },
            }
          );

          showToast(
            "Event updated"
          );

        } else {

          await axios.post(

            ENDPOINT.CREATE_EVENT,

            form,

            {
              headers: {
                Authorization:
                  `Bearer ${getToken()}`,
              },
            }
          );

          showToast(
            "Event created"
          );
        }

        loadEvents();

      } catch (error) {

        console.log(error);

        showToast(
          error?.response?.data
            ?.message ||
            "Save failed",
          "error"
        );
      }
    };

  // ─────────────────────────────────────────
  // DELETE EVENT
  // ─────────────────────────────────────────

  const handleDelete =
    async (id) => {

      if (
        !window.confirm(
          "Delete event?"
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
          "Deleted successfully"
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

  // ─────────────────────────────────────────
  // FILTER EVENTS
  // ─────────────────────────────────────────

  const filteredEvents =
    events
      .filter((event) =>
        event.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      )
      .map((event) => {

        const meta =
          EVENT_MAP[
            event.event_type
          ];

        return {
          id: event.id,

          title: event.title,

          start:
            event.start_datetime,

          end:
            event.end_datetime,

          backgroundColor:
            meta?.color,

          borderColor:
            meta?.color,

          textColor: "#fff",

          extendedProps:
            event,
        };
      });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <div className="bg-white border-b sticky top-0 z-20">

        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center">

              <CalendarDays
                size={20}
                className="text-white"
              />
            </div>

            <div>

              <h1 className="text-2xl font-bold">

                Admin Calendar

              </h1>

              <p className="text-sm text-slate-500">

                Manage all events

              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">

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
                placeholder="Search..."
                className="pl-10 pr-4 py-2.5 border rounded-xl"
              />
            </div>

            <button
              onClick={() => {
                setSelectedEvent(
                  null
                );

                setShowModal(true);
              }}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2"
            >
              <Plus size={16} />

              New Event
            </button>
          </div>
        </div>
      </div>

      {/* CALENDAR */}

      <div className="max-w-7xl mx-auto p-4">

        <div className="bg-white rounded-3xl border p-4 shadow-sm">

          {loading ? (

            <div className="h-[600px] flex items-center justify-center">

              Loading...

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
              selectable
              editable
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

                setSelectedEvent({
                  ...EMPTY_FORM,

                  start_datetime:
                    `${info.dateStr}T09:00`,

                  end_datetime:
                    `${info.dateStr}T10:00`,
                });

                setShowModal(true);
              }}

              eventClick={(
                info
              ) => {

                setSelectedEvent({
                  id: info.event.id,

                  ...info.event
                    .extendedProps,
                });

                setShowModal(true);
              }}
            />
          )}
        </div>

        {/* EVENT LIST */}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {events.map((event) => {

            const meta =
              EVENT_MAP[
                event.event_type
              ];

            const Icon =
              meta?.icon ||
              CalendarDays;

            return (
              <div
                key={event.id}
                className="bg-white border rounded-2xl p-4"
              >

                <div className="flex items-start justify-between">

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

                      <h3 className="font-semibold">

                        {
                          event.title
                        }

                      </h3>

                      <p className="text-xs text-slate-500 mt-1">

                        {
                          event.standard
                        }

                      </p>
                    </div>
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
                      className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center"
                    >
                      <Pencil
                        size={16}
                      />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          event.id
                        )
                      }
                      className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center"
                    >
                      <Trash2
                        size={16}
                        className="text-red-600"
                      />
                    </button>
                  </div>
                </div>

                {event.meeting_link && (

                  <a
                    href={
                      event.meeting_link
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-blue-600 text-sm"
                  >
                    <Video
                      size={16}
                    />

                    Join Meeting
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}

      <Calendar
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