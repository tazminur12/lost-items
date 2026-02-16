"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Shield, Clock } from "lucide-react";
import Swal from "sweetalert2";
import Button from "@/components/Button";
import { uploadToCloudinary } from "@/lib/upload";

export default function PostFound() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const validate = () => {
    if (!title.trim()) return "Please enter an item name.";
    if (!category) return "Please select a category.";
    if (!description.trim()) return "Please provide a description.";
    if (!location.trim()) return "Please enter where the item was found.";
    if (!date) return "Please select the date the item was found.";
    if (!contactInfo.trim()) return "Please provide contact information (email or phone).";
    return null;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const invalid = validate();
    if (invalid) {
      setError(invalid);
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        type: "Found",
        category,
        location: location.trim(),
        date,
        imageUrl,
        contactInfo: contactInfo.trim(),
      };

      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to post found item");

      await Swal.fire({ icon: "success", title: "Posted", text: "Found item posted successfully.", timer: 1400, showConfirmButton: false });
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      const msg = err.message || "Something went wrong.";
      setError(msg);
      await Swal.fire({ icon: "error", title: "Error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40 animate-pulse" aria-hidden />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-30 animate-pulse delay-1000" aria-hidden />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">

          {/* Left: Intro / Benefits */}
          <motion.div className="lg:col-span-5" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12 } } }}>
            <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }} className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-600/10 mb-4">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse" />
              Trusted Community Matches
            </motion.div>

            <motion.h2 variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } }} className="text-3xl font-extrabold leading-tight text-gray-900 mb-4">
              Post Found Items
            </motion.h2>

            <motion.p variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }} className="text-gray-600 mb-6">
              Share details of an item you have found so it can be matched with the owner quickly and securely.
            </motion.p>

            <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-50">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Fast Matches</p>
                  <p className="text-sm text-gray-500">Our matching engine notifies likely owners immediately.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Secure Handoffs</p>
                  <p className="text-sm text-gray-500">We provide simple steps to verify ownership and exchange items safely.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">24/7 Availability</p>
                  <p className="text-sm text-gray-500">Listings remain discoverable around the clock.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Form Card */}
          <motion.div className="mt-10 lg:mt-0 lg:col-span-7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Post a Found Item</h1>
              <p className="text-sm text-gray-500 mb-6">Share details of an item you have found so it can be matched with the owner.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-sm text-red-700 bg-red-50 p-3 rounded">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="e.g. Silver iPhone 13" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                  <option value="">Select a category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="accessories">Accessories</option>
                  <option value="documents">Documents / ID</option>
                  <option value="keys">Keys</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Found</label>
                <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Describe the item: color, brand, unique marks..." className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Found Location</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" placeholder="e.g. Cafeteria Table 4" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Info</label>
                <input value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} type="text" placeholder="Email or phone so owner can contact you" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo (optional)</label>
              <div className="flex items-center gap-4">
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-32 h-24 object-cover rounded" />
                    <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-white rounded-full p-1 text-sm border">✕</button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">A clear photo increases the chance of a match. Max file size: 5MB.</p>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Posting...' : 'Post Found Item'}</Button>
            </div>
          </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
