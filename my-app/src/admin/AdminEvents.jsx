import React, { useState } from "react";
import {
  Edit,
  Trash,
  Plus,
  X,
  Upload,
  Calendar,
  MapPin,
  Users,
  Ticket,
  RefreshCw,
} from "lucide-react";

const initialEvents = [
  {
    id: 1,
    title: "Luxury Wedding Night",
    venue: "Grand Hall",
    price: 50000,
    capacity: 300,
    eventDate: "2026-06-20",
    category: "Wedding",
    status: "published",
    image:
      "https://images.unsplash.com/photo-1529634899174-52d1a7f5f7b4?auto=format&fit=crop&w=800&q=80",
  },
];

const AdminEvents = () => {
  const [events, setEvents] = useState(initialEvents);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [loading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    venue: "",
    price: "",
    capacity: "",
    eventDate: "",
    category: "Wedding",
    status: "draft",
    image: "",
  });

  const openNewForm = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      venue: "",
      price: "",
      capacity: "",
      eventDate: "",
      category: "Wedding",
      status: "draft",
      image: "",
    });
    setIsFormOpen(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData(event);
    setIsFormOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (editingEvent) {
      setEvents((prev) =>
        prev.map((ev) => (ev.id === editingEvent.id ? formData : ev))
      );
    } else {
      setEvents([...events, { ...formData, id: Date.now() }]);
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id) => {
    setEvents(events.filter((e) => e.id !== id));
    setConfirmDeleteId(null);
  };

  // FORM UI
  if (isFormOpen) {
    return (
      <div className="max-w-4xl mx-auto text-white">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {editingEvent ? "Edit Event" : "Create Event"}
          </h1>
          <button onClick={() => setIsFormOpen(false)}>
            <X />
          </button>
        </div>

        <form
          onSubmit={handleSave}
          className="bg-[#081A2F] p-6 rounded-xl space-y-4"
        >
          <input
            className="w-full p-3 bg-[#071524] rounded"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <input
            className="w-full p-3 bg-[#071524] rounded"
            placeholder="Venue"
            value={formData.venue}
            onChange={(e) =>
              setFormData({ ...formData, venue: e.target.value })
            }
          />

          <input
            className="w-full p-3 bg-[#071524] rounded"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />

          <input
            className="w-full p-3 bg-[#071524] rounded"
            type="number"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({ ...formData, capacity: e.target.value })
            }
          />

          <input
            className="w-full p-3 bg-[#071524] rounded"
            type="date"
            value={formData.eventDate}
            onChange={(e) =>
              setFormData({ ...formData, eventDate: e.target.value })
            }
          />

          <button className="bg-[#C8A64D] px-6 py-3 rounded font-bold">
            Save Event
          </button>
        </form>
      </div>
    );
  }

  // LIST UI
  return (
    <div className="space-y-6 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Events</h1>

        <button
          onClick={openNewForm}
          className="bg-[#C8A64D] px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-white/60">
          <RefreshCw className="animate-spin w-4 h-4" />
          Loading...
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-[#081A2F] rounded-xl p-4 space-y-2"
            >
              <img
                src={ev.image}
                className="h-40 w-full object-cover rounded"
              />

              <h2 className="font-bold">{ev.title}</h2>
              <p className="text-white/60 text-sm">{ev.venue}</p>

              <div className="flex justify-between items-center pt-3">
                <button onClick={() => handleEdit(ev)}>
                  <Edit className="w-4 h-4" />
                </button>

                {confirmDeleteId === ev.id ? (
                  <div className="flex gap-2 text-sm">
                    <button onClick={() => handleDelete(ev.id)}>Yes</button>
                    <button onClick={() => setConfirmDeleteId(null)}>
                      No
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDeleteId(ev.id)}>
                    <Trash className="w-4 h-4 text-red-400" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEvents;