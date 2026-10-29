import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://69.62.84.113:5010/api",
// });
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    // Prevent the browser from serving cached/304 responses for API
    // calls — list endpoints like referral partners/students need to
    // always reflect the latest DB state, not a stale cached body.
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mfc_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("mfc_token");
      localStorage.removeItem("mfc_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
