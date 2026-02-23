"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  MapPin,
  Calendar,
  Tag,
  User,
  Mail,
  Phone,
  ArrowLeft,
  Share2,
  ImageIcon,
  Loader2,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
} from "lucide-react";
import Button from "@/components/Button";

export default function ItemDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiMatches, setAiMatches] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    async function loadItem() {
      try {
        const res = await fetch(`/api/items/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadItem();
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: item.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      Swal.fire({ icon: "success", title: "Link Copied!", timer: 1200, showConfirmButton: false });
    }
  };

  const handleAiSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await fetch("/api/generate/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: item.description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      Swal.fire({ title: "AI Summary", html: `<p class="text-left text-gray-700">${data.result}</p>`, width: "550px", confirmButtonColor: "#2563eb" });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleFindMatches = async () => {
    setMatchLoading(true);
    try {
      const res = await fetch(`/api/items/matches/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAiMatches(data.matches || []);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    } finally {
      setMatchLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-xl mx-auto text-center py-24 px-4">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h1>
        <p className="text-gray-500 mb-6">This item may have been removed or doesn&apos;t exist.</p>
        <Button onClick={() => router.push("/matches")}>Browse Items</Button>
      </div>
    );
  }

  const statusConfig = {
    Pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock, label: "Pending" },
    Resolved: { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Resolved" },
    Claimed: { color: "bg-blue-100 text-blue-700", icon: Shield, label: "Claimed" },
  };

  const st = statusConfig[item.status] || statusConfig.Pending;
  const StatusIcon = st.icon;

  const scoreColor = (score) => {
    if (score >= 75) return "bg-green-100 text-green-700";
    if (score >= 50) return "bg-yellow-100 text-yellow-700";
    return "bg-orange-100 text-orange-700";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Image & Gallery */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Main Image */}
          <div className="relative w-full aspect-4/3 rounded-2xl bg-gray-100 overflow-hidden mb-6">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <ImageIcon className="w-16 h-16 mb-2" />
                <span className="text-sm">No image available</span>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <span
                className={`px-3 py-1.5 text-sm font-bold rounded-full shadow-sm ${
                  item.type === "Lost"
                    ? "bg-red-500 text-white"
                    : "bg-emerald-500 text-white"
                }`}
              >
                {item.type}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1.5 text-sm font-semibold rounded-full shadow-sm flex items-center gap-1 ${st.color}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {st.label}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{item.description}</p>
          </div>

          {/* AI Keywords */}
          {item.aiKeywords && item.aiKeywords.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                AI Extracted Keywords
              </h2>
              <div className="flex flex-wrap gap-2">
                {item.aiKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm bg-purple-50 text-purple-700 rounded-full border border-purple-100 font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI Summary */}
          {item.aiSummary && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                AI Generated Summary
              </h2>
              <p className="text-gray-600 leading-relaxed">{item.aiSummary}</p>
            </div>
          )}

          {/* AI Matches Section */}
          {aiMatches !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 mb-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                AI Matched Items ({aiMatches.length})
              </h2>
              {aiMatches.length === 0 ? (
                <p className="text-gray-500 text-sm py-4 text-center">No matching items found at this time.</p>
              ) : (
                <div className="space-y-3">
                  {aiMatches.map((match) => (
                    <div key={match._id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        {match.imageUrl ? (
                          <img src={match.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{match.title}</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {match.location}
                        </p>
                        {match.reason && (
                          <p className="text-xs text-purple-600 mt-1">{match.reason}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`px-2 py-1 text-xs font-bold rounded-lg ${scoreColor(match.score)}`}>
                          {match.score}%
                        </span>
                        <Link
                          href={`/claim?id=${match._id}`}
                          className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                        >
                          Claim
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Right: Info Sidebar */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Title & Meta */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h1>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Tag className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Category</p>
                  <p className="text-gray-900 font-medium capitalize">{item.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Location</p>
                  <p className="text-gray-900 font-medium">{item.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Date {item.type === "Lost" ? "Lost" : "Found"}</p>
                  <p className="text-gray-900 font-medium">{new Date(item.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Clock className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Posted</p>
                  <p className="text-gray-900 font-medium">{new Date(item.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reporter Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Reported By</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                {item.user?.image ? (
                  <img src={item.user.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.user?.name || "Anonymous"}</p>
                <p className="text-xs text-gray-500">{item.user?.email}</p>
              </div>
            </div>
            {item.contactInfo && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{item.contactInfo}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {item.status !== "Claimed" && (
              <Link href={`/claim?id=${item._id}`} className="block">
                <Button className="w-full">
                  <Shield className="w-4 h-4" />
                  Submit Claim
                </Button>
              </Link>
            )}

            <button
              onClick={handleFindMatches}
              disabled={matchLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors disabled:opacity-50"
            >
              {matchLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Finding Matches...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Find AI Matches</>
              )}
            </button>

            <button
              onClick={handleAiSummary}
              disabled={summaryLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              {summaryLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> AI Summary</>
              )}
            </button>

            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
