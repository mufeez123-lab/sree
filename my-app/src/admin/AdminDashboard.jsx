import React from "react";
import {
  Users,
  BedDouble,
  CalendarDays,
  DollarSign,
  Wallet,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Dummy stats (replace with API later)
  const stats = [
    { label: "Room Occupancy", value: "72%", icon: BedDouble, trend: "+2.1%", isPositive: true },
    { label: "Total Revenue", value: "₹1,25,000", icon: DollarSign, trend: "+12.5%", isPositive: true },
    { label: "Pending Payments", value: "₹18,500", icon: Wallet, trend: "-8.1%", isPositive: false },
    { label: "Active Users", value: "248", icon: Users, trend: "+4.3%", isPositive: true },
  ];

  const recentBookings = [
    { id: 1, name: "John Doe", room: "Deluxe", amount: 5000, date: "Today" },
    { id: 2, name: "Sara Khan", room: "Suite", amount: 8000, date: "Yesterday" },
    { id: 3, name: "Rahul", room: "Standard", amount: 3000, date: "2 days ago" },
  ];

  return (
    <div className="space-y-6">

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-[#081A2F] border border-white/5 p-5 rounded-xl hover:border-white/10 transition"
          >
            <div className="flex justify-between items-start">

              <div>
                <p className="text-white/60 text-xs">{stat.label}</p>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {stat.value}
                </h2>

                <div
                  className={`flex items-center gap-1 text-xs mt-2 ${
                    stat.isPositive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stat.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stat.trend} <span className="text-white/40 ml-1">vs last week</span>
                </div>
              </div>

              <div className="w-10 h-10 bg-[#071524] border border-white/5 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-[#C8A64D]" />
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* LEFT */}
        <div className="lg:col-span-2 bg-[#081A2F] border border-white/5 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white">Revenue Overview</h3>
          <p className="text-xs text-white/50 mb-6">
            Monthly performance analytics
          </p>

          <div className="h-[250px] flex items-center justify-center text-white/30">
            📊 Chart Area (Connect Recharts or Firebase here)
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-[#081A2F] border border-white/5 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-4">
            Room Occupancy
          </h3>

          <div className="flex flex-col items-center justify-center h-[250px] text-white/30">
            🥧 Pie Chart Area
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* RECENT BOOKINGS */}
        <div className="bg-[#081A2F] border border-white/5 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-4">
            Recent Bookings
          </h3>

          <div className="space-y-4">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg"
              >
                <div>
                  <p className="text-white text-sm">{b.name}</p>
                  <p className="text-white/50 text-xs">
                    {b.room} - ₹{b.amount}
                  </p>
                </div>

                <span className="text-white/40 text-xs">{b.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-[#081A2F] border border-white/5 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-4">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-4">

            <button
              onClick={() => navigate("/admin/bookings")}
              className="p-4 bg-[#071524] rounded-xl border border-white/5 hover:border-[#C8A64D]/30"
            >
              <BedDouble className="text-blue-400 mx-auto" />
              <p className="text-xs text-white/70 mt-2">Bookings</p>
            </button>

            <button
              onClick={() => navigate("/admin/users")}
              className="p-4 bg-[#071524] rounded-xl border border-white/5 hover:border-[#C8A64D]/30"
            >
              <Users className="text-teal-400 mx-auto" />
              <p className="text-xs text-white/70 mt-2">Users</p>
            </button>

            <button
              onClick={() => navigate("/admin/events")}
              className="p-4 bg-[#071524] rounded-xl border border-white/5 hover:border-[#C8A64D]/30"
            >
              <CalendarDays className="text-green-400 mx-auto" />
              <p className="text-xs text-white/70 mt-2">Events</p>
            </button>

            <button
              onClick={() => navigate("/admin")}
              className="p-4 bg-[#071524] rounded-xl border border-white/5 hover:border-[#C8A64D]/30"
            >
              <FileText className="text-[#C8A64D] mx-auto" />
              <p className="text-xs text-white/70 mt-2">Reports</p>
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;