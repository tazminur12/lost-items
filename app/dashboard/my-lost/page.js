"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Calendar, MapPin, ExternalLink, Activity } from "lucide-react";

export default function MyLostPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!session) return setLoading(false);
      try {
        const res = await fetch('/api/items?mine=true');
        const data = await res.json();
        const mine = data.filter(i => i.type === 'Lost' || i.type === 'lost');
        setItems(mine);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [session]);

  if (!session) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-semibold">Please sign in</h2>
        <p className="text-sm text-gray-500">You need to be signed in to see your lost items.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Package className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Lost Items</h1>
          <p className="text-sm text-gray-500">Manage items you have reported as lost.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-500">
          <div className="flex flex-col items-center gap-3">
            <Activity className="w-8 h-8 text-blue-500 animate-spin" />
            <p>Loading your lost items...</p>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
          <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items reported</h3>
          <p className="text-gray-500 mb-6">You haven&apos;t reported any lost items yet. Let the community help you find it!</p>
          <Link href="/report-lost" className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200">
            Report a Lost Item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition duration-200">
              {/* Image Section */}
              <div className="relative h-48 bg-gray-100">
                {item.imageUrl ? (
                  <Image 
                    src={item.imageUrl} 
                    alt={item.title} 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-md shadow-sm ${
                    item.status === 'Resolved' || item.status === 'Claimed' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white text-gray-800'
                  }`}>
                    {item.status || 'Pending'}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-md shadow-sm ${
                    item.approvalStatus === 'Approved' ? 'bg-green-100 text-green-800 border border-green-200' : 
                    item.approvalStatus === 'Rejected' ? 'bg-red-100 text-red-800 border border-red-200' : 
                    'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  }`}>
                    {item.approvalStatus === 'Approved' ? 'Approved' : 
                     item.approvalStatus === 'Rejected' ? 'Rejected' : 'Awaiting Review'}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col grow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded">
                    {item.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1" title={item.title}>
                  {item.title}
                </h3>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 grow">
                  {item.description}
                </p>

                <div className="space-y-2 mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500 gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(item.date).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="line-clamp-1">{item.location}</span>
                  </div>
                </div>

                {/* Footer/Action */}
                <div className="mt-5 pt-3 flex justify-between items-center bg-gray-50 -mx-5 -mb-5 p-4 rounded-b-xl border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    ID: {item._id.toString().slice(-6)}
                  </div>
                  <Link 
                    href={`/items/${item._id}`} 
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
                  >
                    View Details
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
