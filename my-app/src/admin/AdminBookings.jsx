import React, { useState } from "react";
import {
  Edit,
  CheckCircle,
  XCircle,
  Trash,
  Plus,
  X,
  Search,
  Filter,
  Play,
  Check,
  Calendar as CalendarIcon,
  ArrowRight,
} from "lucide-react";

const dummyBookings = [
  {
    id: "BK001",
    guestName: "John Doe",
    roomName: "Royal Suite",
    checkIn: "2026-06-10",
    checkOut: "2026-06-12",
    amount: 12000,
    status: "confirmed",
  },
  {
    id: "BK002",
    guestName: "Sarah Khan",
    roomName: "Deluxe Room",
    checkIn: "2026-06-14",
    checkOut: "2026-06-16",
    amount: 8000,
    status: "pending",
  },
];

const AdminBookings = () => {
  const [bookings] = useState(dummyBookings);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="space-y-6 text-white">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bookings Manager</h1>
          <p className="text-white/50 text-sm">
            Manage reservations and guest stays
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-[#C8A64D] text-black px-4 py-2 rounded-lg flex items-center gap-2 font-bold"
        >
          <Plus size={16} /> New Booking
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-[#081A2F] border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-4">

        <div className="flex-1 flex items-center bg-[#071524] px-3 rounded-lg">
          <Search className="w-4 h-4 text-white/40" />
          <input
            placeholder="Search bookings..."
            className="w-full bg-transparent p-2 outline-none text-sm text-white"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="bg-[#071524] px-3 py-2 rounded-lg text-sm"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>pending</option>
          <option>confirmed</option>
          <option>checked_in</option>
          <option>cancelled</option>
        </select>

        <input
          type="date"
          className="bg-[#071524] px-3 py-2 rounded-lg text-sm"
        />
      </div>

      {/* TABLE */}
      <div className="bg-[#081A2F] border border-white/10 rounded-xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-[#071524] text-white/60 text-xs uppercase">
            <tr>
              <th className="p-4 text-left">Guest</th>
              <th className="p-4 text-left">Room</th>
              <th className="p-4 text-left">Dates</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>

            {dummyBookings.map((b) => (
              <tr
                key={b.id}
                className="border-t border-white/5 hover:bg-white/5"
              >

                {/* GUEST */}
                <td className="p-4">
                  <div className="font-semibold">{b.guestName}</div>
                  <div className="text-xs text-white/40">{b.id}</div>
                </td>

                {/* ROOM */}
                <td className="p-4 text-white/70">{b.roomName}</td>

                {/* DATES */}
                <td className="p-4 text-xs">
                  <div className="flex items-center gap-2">
                    {b.checkIn}
                    <ArrowRight className="w-3 h-3 text-white/30" />
                    {b.checkOut}
                  </div>
                </td>

                {/* AMOUNT */}
                <td className="p-4 text-[#C8A64D] font-bold">
                  ₹{b.amount}
                </td>

                {/* STATUS */}
                <td className="p-4">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      b.status === "confirmed"
                        ? "bg-green-500/10 text-green-400"
                        : b.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-4 text-right flex justify-end gap-2">

                  <button className="p-2 bg-white/10 rounded">
                    <Edit size={14} />
                  </button>

                  <button className="p-2 bg-green-500/10 text-green-400 rounded">
                    <CheckCircle size={14} />
                  </button>

                  <button className="p-2 bg-red-500/10 text-red-400 rounded">
                    <Trash size={14} />
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* MODAL UI ONLY */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

          <div className="bg-[#081A2F] w-full max-w-2xl p-6 rounded-xl border border-white/10 space-y-4">

            <div className="flex justify-between">
              <h2 className="text-xl font-bold">New Booking</h2>
              <button onClick={() => setIsFormOpen(false)}>
                <X />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <input placeholder="Guest Name" className="input" />
              <input placeholder="Email" className="input" />
              <input placeholder="Phone" className="input" />
              <input placeholder="Room" className="input" />

              <input type="date" className="input" />
              <input type="date" className="input" />

            </div>

            <textarea
              placeholder="Notes"
              className="w-full bg-[#071524] p-3 rounded-lg"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-white/10 rounded"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#C8A64D] text-black font-bold rounded">
                Save
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminBookings;