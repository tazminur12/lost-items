"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Shield, Upload, Loader2, MapPin, Calendar, Tag, ImageIcon } from "lucide-react";
import { uploadToCloudinary } from "@/lib/upload";
import Swal from "sweetalert2";
import Button from "@/components/Button";

export default function ClaimItem() {
  const searchParams = useSearchParams();
  const itemId = searchParams.get("id");
  const router = useRouter();
  const { data: session } = useSession();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [identifyingFeatures, setIdentifyingFeatures] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);

  useEffect(() => {
    if (!itemId) {
      setLoading(false);
      return;
    }
    async function loadItem() {
      try {
        const res = await fetch("/api/items");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        const found = data.find((i) => i._id === itemId);
        setItem(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [itemId]);

  const handleProofChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setProofPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      Swal.fire({ icon: "warning", title: "Login Required", text: "Please log in to submit a claim." });
      return router.push("/login");
    }

    if (!identifyingFeatures.trim()) {
      Swal.fire({ icon: "warning", title: "Missing Info", text: "Please describe the identifying features of the item." });
      return;
    }

    setSubmitting(true);
    try {
      let proofImageUrl = null;
      if (proofFile) {
        proofImageUrl = await uploadToCloudinary(proofFile);
      }

      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          identifyingFeatures: identifyingFeatures.trim(),
          proofImageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to submit claim");

      await Swal.fire({
        icon: "success",
        title: "Claim Submitted!",
        text: "Your claim has been submitted. A moderator will review it and you'll be notified of the outcome.",
        confirmButtonColor: "#2563eb",
      });

      router.push("/dashboard");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
        <span className="text-gray-500">Loading item details...</span>
      </div>
    );
  }

  if (!itemId || !item) {
    return (
      <div className="max-w-xl mx-auto text-center py-24">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h1>
        <p className="text-gray-500 mb-6">The item you're trying to claim doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/matches")}>Browse Items</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Claim Item</h1>
      <p className="text-gray-500 mb-8">Submit a claim to verify your ownership of this item.</p>

      {/* Item Details Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h2>
        <div className="flex gap-5">
          <div className="w-28 h-28 rounded-lg bg-gray-100 overflow-hidden shrink-0">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${item.type === "Lost" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                {item.type}
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-500">
              <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {item.location}</p>
              <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(item.date).toLocaleDateString()}</p>
              <p className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> {item.category}</p>
            </div>
            <p className="mt-3 text-sm text-gray-600">{item.description}</p>
          </div>
        </div>
      </div>

      {/* Verification Info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-900">Secure Verification Process</p>
            <p className="text-sm text-blue-700 mt-1">
              To prevent theft, describe unique details about the item that aren't visible in photos.
              A moderator will verify your claim, then an admin will give final approval.
            </p>
          </div>
        </div>
      </div>

      {/* Claim Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Verification Form</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Identifying Features <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">
            E.g., "Contains a library card with name John Doe" or "Has a small scratch on the back corner"
          </p>
          <textarea
            rows={5}
            value={identifyingFeatures}
            onChange={(e) => setIdentifyingFeatures(e.target.value)}
            placeholder="Describe unique features that prove this is yours..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Proof of Ownership (Optional)</label>
          <p className="text-xs text-gray-500 mb-2">Old photos of you with the item, purchase receipt, etc.</p>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer">
              <Upload className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Upload proof</span>
              <input type="file" accept="image/*" onChange={handleProofChange} className="hidden" />
            </label>
            {proofPreview && (
              <div className="relative">
                <img src={proofPreview} alt="Proof" className="w-24 h-20 object-cover rounded-lg border" />
                <button
                  type="button"
                  onClick={() => { setProofFile(null); setProofPreview(null); }}
                  className="absolute -top-2 -right-2 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs border shadow-sm"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting Claim...
              </span>
            ) : (
              "Submit Claim for Review"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
