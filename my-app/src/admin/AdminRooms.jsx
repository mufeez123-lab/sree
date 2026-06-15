import React, { useState } from "react";
import {
  Edit,
  Trash,
  Plus,
  X,
  Upload,
  Users,
  Maximize,
  BedDouble,
} from "lucide-react";

const dummyRooms = [
  {
    id: 1,
    name: "Royal Suite",
    roomNumber: "101",
    price: 8000,
    capacity: 2,
    area: "500 sqft",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
  },
  {
    id: 2,
    name: "Deluxe Room",
    roomNumber: "102",
    price: 5000,
    capacity: 3,
    area: "350 sqft",
    status: "booked",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427",
  },
];

const AdminRooms = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rooms] = useState(dummyRooms);

  return (
    <div className="space-y-6 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Rooms Management</h1>
          <p className="text-white/50 text-sm">
            Manage hotel rooms & inventory
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-[#C8A64D] text-black px-4 py-2 rounded-lg flex items-center gap-2 font-bold"
        >
          <Plus size={16} /> Add Room
        </button>
      </div>

      {/* FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-[#081A2F] w-full max-w-3xl rounded-xl p-6 space-y-4 border border-white/10">

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Add Room</h2>
              <button onClick={() => setIsFormOpen(false)}>
                <X />
              </button>
            </div>

            {/* FORM UI */}
            <div className="grid grid-cols-2 gap-4">

              <input placeholder="Room Name" className="input" />
              <input placeholder="Room Number" className="input" />
              <input placeholder="Price" className="input" />
              <input placeholder="Capacity" className="input" />

            </div>

            <textarea
              placeholder="Description"
              className="w-full bg-[#071524] p-3 rounded-lg border border-white/10"
              rows={3}
            />

            {/* IMAGE UPLOAD UI */}
            <div className="border border-dashed border-white/20 p-6 rounded-lg text-center">
              <Upload className="mx-auto mb-2 text-[#C8A64D]" />
              <p className="text-white/60 text-sm">
                Click or drag image to upload
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-white/10 rounded-lg"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#C8A64D] text-black font-bold rounded-lg">
                Save Room
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ROOM GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-[#081A2F] border border-white/10 rounded-xl overflow-hidden hover:scale-[1.02] transition"
          >

            {/* IMAGE */}
            <img
              src={room.image}
              className="h-44 w-full object-cover"
            />

            {/* CONTENT */}
            <div className="p-4 space-y-3">

              <div className="flex justify-between">
                <h2 className="font-bold">{room.name}</h2>
                <span className="text-xs text-green-400">
                  {room.status}
                </span>
              </div>

              <p className="text-white/50 text-sm">
                Room {room.roomNumber}
              </p>

              <p className="text-[#C8A64D] font-bold">
                ₹{room.price} / night
              </p>

              {/* INFO */}
              <div className="flex justify-between text-xs text-white/60">
                <span>
                  <Users className="inline w-4 h-4 mr-1" />
                  {room.capacity}
                </span>

                <span>
                  <Maximize className="inline w-4 h-4 mr-1" />
                  {room.area}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 pt-2">

                <button className="flex-1 bg-white/10 py-2 rounded-lg flex items-center justify-center">
                  <Edit size={14} />
                </button>

                <button className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg flex items-center justify-center">
                  <Trash size={14} />
                </button>

              </div>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
};

export default AdminRooms;