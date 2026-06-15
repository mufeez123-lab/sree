import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <div style={{ width: 260, background: "#0f172a", color: "#fff", padding: 20 }}>
        <h2>Admin Panel</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/bookings">Bookings</Link>
          <Link to="/admin/rooms">Rooms</Link>
          <Link to="/admin/events">Events</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/billing">Billing</Link>
          <Link to="/admin/content">Content</Link>
          <Link to="/admin/settings">Settings</Link>
        </nav>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;