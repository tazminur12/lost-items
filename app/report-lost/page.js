"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { CheckCircle, Shield, Clock } from "lucide-react";
import Button from "@/components/Button";
import { uploadToCloudinary } from "@/lib/upload";

import { useSession } from "next-auth/react";

export default function ReportLost() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const validate = () => {
    if (!title.trim()) return "Please enter an item name.";
    if (!category) return "Please select a category.";
    if (!description.trim()) return "Please provide a description.";
    if (!location.trim()) return "Please enter the location where the item was lost.";
    if (!date) return "Please select the date the item was lost.";
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
        type: "Lost",
        category,
        location: location.trim(),
        date,
        imageUrl,
        contactInfo: contactInfo.trim(),
      };

      const res = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("You must be logged in to submit a report.");
        }
        throw new Error(data?.message || "Failed to submit report");
      }

      // Show success modal then redirect
      await Swal.fire({
        icon: "success",
        title: "Report submitted",
        text: "Your lost item has been reported successfully.",
        timer: 1400,
        showConfirmButton: false,
      });
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

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    <div className="relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40 animate-pulse" aria-hidden />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-30 animate-pulse delay-1000" aria-hidden />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">

          {/* Left: Intro / Benefits */}
          <motion.div
            className="lg:col-span-5"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-600/10 mb-4">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse" />
              Report with Confidence
            </motion.div>

            <motion.h2 variants={itemVariants} className="text-3xl font-extrabold leading-tight text-gray-900 mb-4">
              Report a Lost Item
            </motion.h2>

            <motion.p variants={itemVariants} className="text-gray-600 mb-6">
              Give us the details and a photo (optional). We’ll use our matching system to help reunite your item with you quickly and securely.
            </motion.p>

            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-50">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Fast Matching</p>
                  <p className="text-sm text-gray-500">We prioritize likely matches so you get notified sooner.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Secure Process</p>
                  <p className="text-sm text-gray-500">Claims and handoffs follow secure verification steps.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">24/7 Availability</p>
                  <p className="text-sm text-gray-500">Our platform keeps searching and notifying around the clock.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Form Card */}
          <motion.div
            className="mt-10 lg:mt-0 lg:col-span-7"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="text-sm text-red-700 bg-red-50 p-3 rounded">{error}</div>}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    placeholder="e.g. Blue Jansport Backpack"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    aria-label="Item name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Lost</label>
                    <input
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      type="date"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Color, brand, unique marks, contents, or anything that makes it identifiable"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lost Location</label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      type="text"
                      placeholder="e.g. Main Library, 2nd floor near stairs"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Info</label>
                    <input
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      type="text"
                      placeholder="Email or phone number to contact you"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
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
                  <p className="text-xs text-gray-500 mt-2">A clear photo helps others identify your item faster. Max file size: 5MB.</p>
                </div>

                <div className="pt-2">
                  {status === "authenticated" ? (
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit Report"}
                    </Button>
                  ) : (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
                      You must be logged in to submit a report.
                      <button 
                        type="button"
                        className="ml-2 underline font-semibold cursor-pointer"
                        onClick={() => router.push('/login?callbackUrl=/report-lost')}
                      >
                        Login here
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
