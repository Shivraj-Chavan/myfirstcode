import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

export default function DashboardLayout({ items, roleLabel, title, streak, children }) {
  return (
    <div className="min-h-screen bg-cloud">
      <Sidebar items={items} roleLabel={roleLabel} />
      <div className="lg:pl-64">
        <Topbar title={title} items={items} streak={streak} />
        <main className="px-5 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
