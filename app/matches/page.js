"use client";

"use client";

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ItemCard from '@/components/ItemCard';
import Swal from 'sweetalert2';

export default function Matches() {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/items');
        if (!res.ok) throw new Error('Failed to load items');
        const data = await res.json();
        if (mounted) setItems(data || []);
      } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load items' });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    let list = (items || []).slice();

    if (filterType !== 'all') {
      list = list.filter((i) => (i.type || '').toLowerCase() === filterType);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((i) => (i.title || '').toLowerCase().includes(q) || (i.location || '').toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sortBy === 'newest' ? db - da : da - db;
    });

    return list;
  }, [query, filterType, sortBy, items]);

  const handleSummarize = async (text) => {
    try {
      const res = await fetch('/api/generate/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to generate summary');
      await Swal.fire({ title: 'AI Summary', html: `<pre class="text-left whitespace-pre-wrap">${data.result}</pre>`, width: '600px' });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Failed to generate summary' });
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Possible Matches</h1>
          <p className="text-gray-600 mt-1 max-w-2xl">These are candidate items matching recent lost reports. Click the View Details button to start a claim or contact the finder.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by item or location"
              className="px-4 py-2 border border-gray-200 rounded-full w-64 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-full outline-none">
            <option value="all">All</option>
            <option value="found">Found</option>
            <option value="lost">Lost</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-full outline-none">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading items...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-600 mb-4">No matches found. Try widening your search or check back later.</p>
        </div>
      ) : (
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}>
          {filtered.map((item) => (
            <motion.div key={item._id || item.id} variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
              <ItemCard {...{
                id: item._id || item.id,
                title: item.title,
                location: item.location,
                date: new Date(item.date).toLocaleDateString(),
                type: (item.type || '').toLowerCase(),
                imageUrl: item.imageUrl,
              }} />
              <div className="mt-2 flex gap-2">
                <button onClick={() => handleSummarize(item.description || item.title)} className="text-sm px-3 py-1 bg-white border rounded-full">AI Summary</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
