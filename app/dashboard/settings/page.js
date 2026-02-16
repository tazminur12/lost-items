"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { uploadToCloudinary } from "@/lib/upload";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      setName(session.user?.name || "");
      setBio(session.user?.bio || "");
    }
  }, [session]);

  const handleImageChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    const r = new FileReader();
    r.onload = (ev) => setImagePreview(ev.target.result);
    r.readAsDataURL(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      let image = session.user?.image || null;
      if (imageFile) {
        const uploaded = await uploadToCloudinary(imageFile);
        if (uploaded) image = uploaded;
      }

      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, phone, address, image }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to update profile');
      setMessage('Profile updated successfully.');
      await Swal.fire({ icon: 'success', title: 'Saved', text: 'Profile updated successfully.', timer: 1300, showConfirmButton: false });
    } catch (err) {
      console.error(err);
      const msg = err.message || 'Failed to update';
      setError(msg);
      await Swal.fire({ icon: 'error', title: 'Error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  if (!session) return (
    <div className="text-center py-12">
      <h2 className="text-lg font-semibold">Please sign in</h2>
      <p className="text-sm text-gray-500">You need to sign in to manage your settings.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Update your profile and contact information.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4 max-w-3xl">
        {error && <div className="text-sm text-red-700 bg-red-50 p-3 rounded">{error}</div>}
        {message && <div className="text-sm text-green-700 bg-green-50 p-3 rounded">{message}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full px-4 py-2 border rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
          <div className="flex items-center gap-4">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {(imagePreview || session.user?.image) && (
              <img src={imagePreview || session.user?.image} alt="preview" className="w-20 h-20 object-cover rounded" />
            )}
          </div>
        </div>

        <div className="pt-2">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
