// Renders any value safely as text — used anywhere level/module data
// might not match the expected shape (e.g. a field saved as {id, name}
// instead of a plain string during earlier testing).
export const toText = (value, fallback = "") => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string" || typeof value === "number") return value;
  if (typeof value === "object") return value.name ?? value.title ?? value.label ?? JSON.stringify(value);
  return String(value);
};

// Always returns an array of renderable strings — guards against a
// topics/practiceTasks field that isn't actually an array.
export const toTextArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((v) => toText(v));
};