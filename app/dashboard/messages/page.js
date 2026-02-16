"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Placeholder: there is no messages API yet. Keep empty state and show CTA.
      setTimeout(() => {
        setMessages([]);
        setLoading(false);
      }, 400);
    }
    load();
  }, [session]);

  if (!session) return (
    <div className="text-center py-12">
      <h2 className="text-lg font-semibold">Please sign in</h2>
      <p className="text-sm text-gray-500">You need to sign in to view your messages.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500">Conversations with people who reached out about items.</p>
        </div>
        <Link href="/matches" className="text-sm px-3 py-2 bg-white border border-gray-200 rounded-full text-gray-700">Find Matches</Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-600 mb-4">You have no messages yet.</p>
          <Link href="/matches" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full">Find Matches</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{msg.subject}</p>
                <p className="text-xs text-gray-500">{msg.preview}</p>
              </div>
              <div className="text-xs text-gray-400">{msg.time}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
