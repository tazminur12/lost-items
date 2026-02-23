"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Bell, CheckCheck, Loader2, Inbox } from "lucide-react";

export default function Notifications() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) fetchNotifications();
  }, [session]);

  async function fetchNotifications() {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function markAllRead() {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  }

  async function markOneRead(id) {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  const typeIcon = (type) => {
    const map = {
      claim_submitted: "📋",
      claim_verified: "✅",
      claim_approved: "🎉",
      claim_rejected: "❌",
      item_approved: "📦",
      system: "🔔",
    };
    return map[type] || "🔔";
  };

  function timeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return date.toLocaleDateString();
  }

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h2 className="text-lg font-semibold text-gray-900">Please sign in</h2>
        <p className="text-sm text-gray-500 mt-1">You need to be signed in to view notifications.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-500">Loading notifications...</span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
          <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No notifications yet</p>
          <p className="text-sm text-gray-400 mt-1">You'll be notified when something happens with your items or claims.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((note) => (
            <div
              key={note._id}
              onClick={() => !note.read && markOneRead(note._id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                note.read
                  ? "bg-white border-gray-100 hover:bg-gray-50"
                  : "bg-blue-50 border-blue-100 hover:bg-blue-100/70"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{typeIcon(note.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3
                      className={`text-sm font-semibold ${
                        note.read ? "text-gray-900" : "text-blue-900"
                      }`}
                    >
                      {note.title}
                    </h3>
                    <span className="text-xs text-gray-400 shrink-0">{timeAgo(note.createdAt)}</span>
                  </div>
                  <p
                    className={`text-sm mt-0.5 ${
                      note.read ? "text-gray-600" : "text-blue-700"
                    }`}
                  >
                    {note.message}
                  </p>
                </div>
                {!note.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
