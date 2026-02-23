"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ItemCard from "@/components/ItemCard";
import Swal from "sweetalert2";
import Link from "next/link";
import { Sparkles, Loader2, X, MapPin, Calendar, Tag } from "lucide-react";

export default function Matches() {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [matchResults, setMatchResults] = useState(null);
  const [matchLoading, setMatchLoading] = useState(null);
  const [matchSourceTitle, setMatchSourceTitle] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/items");
        if (!res.ok) throw new Error("Failed to load items");
        const data = await res.json();
        if (mounted) setItems(data || []);
      } catch (err) {
        console.error(err);
        Swal.fire({ icon: "error", title: "Error", text: "Failed to load items" });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    let list = (items || []).slice();
    if (filterType !== "all") {
      list = list.filter((i) => (i.type || "").toLowerCase() === filterType);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          (i.title || "").toLowerCase().includes(q) ||
          (i.location || "").toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sortBy === "newest" ? db - da : da - db;
    });
    return list;
  }, [query, filterType, sortBy, items]);

  const handleSummarize = async (text) => {
    try {
      const res = await fetch("/api/generate/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to generate summary");
      await Swal.fire({
        title: "AI Summary",
        html: `<pre class="text-left whitespace-pre-wrap">${data.result}</pre>`,
        width: "600px",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: err.message || "Failed to generate summary" });
    }
  };

  const handleFindMatches = async (itemId, itemTitle) => {
    setMatchLoading(itemId);
    setMatchResults(null);
    setMatchSourceTitle(itemTitle);
    try {
      const res = await fetch(`/api/items/matches/${itemId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to find matches");
      setMatchResults(data.matches || []);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    } finally {
      setMatchLoading(null);
    }
  };

  const scoreColor = (score) => {
    if (score >= 75) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 50) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-orange-100 text-orange-700 border-orange-200";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Possible Matches</h1>
          <p className="text-gray-600 mt-1 max-w-2xl">
            Browse reported items. Use &ldquo;Find AI Matches&rdquo; to find similar items automatically.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by item or location"
            className="px-4 py-2 border border-gray-200 rounded-full w-64 focus:ring-2 focus:ring-blue-500 outline-none"
          />
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

      {/* AI Match Results Panel */}
      <AnimatePresence>
        {matchResults !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8 bg-linear-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">
                  AI Matches for &ldquo;{matchSourceTitle}&rdquo;
                </h2>
              </div>
              <button
                onClick={() => setMatchResults(null)}
                className="p-1.5 hover:bg-white/60 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {matchResults.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">
                No matching items found. Check back later as new items are posted.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchResults.map((match) => (
                  <div
                    key={match._id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        {match.imageUrl ? (
                          <img src={match.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                            📦
                          </div>
                        )}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{match.title}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Tag className="w-3 h-3" /> {match.category}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-bold rounded-lg border ${scoreColor(match.score)}`}>
                        {match.score}%
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1 mb-3">
                      <p className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {match.location}</p>
                      <p className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(match.date).toLocaleDateString()}</p>
                    </div>

                    {match.reason && (
                      <p className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded mb-3">
                        {match.reason}
                      </p>
                    )}

                    <Link
                      href={`/claim?id=${match._id}`}
                      className="block text-center text-xs px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Submit Claim
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading items...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-600 mb-4">No matches found. Try widening your search or check back later.</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {filtered.map((item) => (
            <motion.div
              key={item._id || item.id}
              variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
            >
              <ItemCard
                {...{
                  id: item._id || item.id,
                  title: item.title,
                  location: item.location,
                  date: new Date(item.date).toLocaleDateString(),
                  type: (item.type || "").toLowerCase(),
                  imageUrl: item.imageUrl,
                }}
              />
              <div className="mt-2 flex flex-col gap-2">
                <div className="flex gap-2">
                  <Link
                    href={`/claim?id=${item._id || item.id}`}
                    className="flex-1 text-center text-sm px-3 py-1.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                  >
                    Submit Claim
                  </Link>
                  <button
                    onClick={() => handleSummarize(item.description || item.title)}
                    className="text-sm px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    AI Summary
                  </button>
                </div>
                <button
                  onClick={() => handleFindMatches(item._id || item.id, item.title)}
                  disabled={matchLoading === (item._id || item.id)}
                  className="flex items-center justify-center gap-1.5 text-sm px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full hover:bg-purple-100 transition-colors font-medium disabled:opacity-50"
                >
                  {matchLoading === (item._id || item.id) ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Finding Matches...</>
                  ) : (
                    <><Sparkles className="w-3.5 h-3.5" /> Find AI Matches</>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
