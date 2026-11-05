import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

export default function DashboardLayout({ items, roleLabel, title, streak, children }) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("mfc_sidebar_collapsed") === "1");

  const toggleSidebar = () =>
    setCollapsed((c) => {
      localStorage.setItem("mfc_sidebar_collapsed", c ? "0" : "1");
      return !c;
    });

  return (
    <div className="min-h-screen bg-cloud">
      <Sidebar items={items} roleLabel={roleLabel} collapsed={collapsed} onToggle={toggleSidebar} />
      <div className={`transition-[padding] duration-200 ${collapsed ? "lg:pl-20" : "lg:pl-64"}`}>
        <Topbar title={title} items={items} streak={streak} />
        <main className="px-5 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
