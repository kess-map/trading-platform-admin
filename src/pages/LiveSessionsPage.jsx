import React, { useState, useEffect } from "react";
import { Trash2, Plus } from "lucide-react";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

export default function LiveSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axiosInstance.get("/admin/livesessions");
      setSessions(res.data.data);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    }
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    if (!startTime || !duration) return;

    const formattedTime = startTime;

    try {
      await axiosInstance.post("/admin/livesessions/create", {
        startTime: formattedTime,
        durationInMinutes: Number(duration),
      });
      toast.success('Live Session Added')
      fetchSessions();
      setShowModal(false);
      setStartTime("");
      setDuration("");
    } catch (err) {
      console.error("Failed to add session", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/admin/livesessions/${id}`);
      toast.success('Live Session Deleted Successfully')
      fetchSessions();
    } catch (err) {
      console.error("Failed to delete session", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Live Sessions</h1>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} /> Add Session
        </button>
      </div>

      <div className="bg-gray-900 bg-opacity-80 rounded shadow p-4 space-y-4">
        {sessions.map((session) => (
          <div
            key={session._id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <p className="font-medium text-white">Start: {session.startTime}</p>
              <p className="text-sm text-white">
                Duration: {session.durationInMinutes} mins
              </p>
            </div>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(session._id)}
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 bg-opacity-80 p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">Add Live Session</h2>
            <form onSubmit={handleAddSession} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-white">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2 bg-gray-900 bg-opacity-80 text-white"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-white">Duration (minutes)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2 bg-gray-900 bg-opacity-80 text-white"
                  min={1}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>{ setShowModal(false) 
                    setStartTime('')
                    setDuration('')}}
                  className="px-4 py-2 border rounded text-white bg-red-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
