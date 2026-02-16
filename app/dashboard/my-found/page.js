"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyFoundPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!session) return setLoading(false);
      try {
        const res = await fetch('/api/items');
        const data = await res.json();
        const mine = data.filter(i => i.user?.email === session.user?.email && (i.type === 'Found' || i.type === 'found'));
        setItems(mine);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [session]);

  if (!session) return (
    <div className="text-center py-12">
      <h2 className="text-lg font-semibold">Please sign in</h2>
      <p className="text-sm text-gray-500">You need to be signed in to see your found items.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Found Items</h1>
        <p className="text-sm text-gray-500">Items you have posted as found or recovered.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading your items...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-600 mb-4">You have not posted any found items yet.</p>
          <Link href="/post-found" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full">Post Found Item</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.category} • {new Date(item.date).toLocaleDateString()}</p>
                  <p className="mt-2 text-sm text-gray-600">{item.description?.slice(0, 140)}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'Resolved' ? 'bg-green-100 text-green-800' : item.status === 'Claimed' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                    {item.status || 'Pending'}
                  </span>
                  <div className="mt-4">
                    <Link href={`/dashboard/items/${item._id}`} className="text-sm text-blue-600 hover:underline">View</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
