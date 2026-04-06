import { Package, Search, MapPin, Calendar, ExternalLink } from "lucide-react";
import connectDB from "@/lib/mongodb";
import Item from "@/models/Item";
import Link from "next/link";
import Image from "next/image";

async function getItems() {
  try {
    await connectDB();
    const items = await Item.find({}).sort({ createdAt: -1 }).lean();
    return items;
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return [];
  }
}

export default async function AllItemsPage() {
  const items = await getItems();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Package className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Items (Lost & Found)</h1>
          <p className="text-sm text-gray-500">Manage all lost and found items in the system</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-64 bg-gray-50">
            <Package className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">No items to display</h3>
            <p className="text-sm text-gray-500">There are currently no items in the database.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item._id.toString()} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden shrink-0 relative">
                          {item.imageUrl ? (
                            <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {new Date(item.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        item.type === "Lost" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{item.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span className="line-clamp-1">{item.location}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'Resolved' || item.status === 'Claimed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status} ({item.approvalStatus})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link 
                        href={`/items/${item._id.toString()}`}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md inline-flex items-center transition-colors"
                        title="View Details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
