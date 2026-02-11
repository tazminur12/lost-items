"use client";

import { useSession, update } from "next-auth/react";
import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Camera,
  Shield,
  Package,
  Search,
  CheckCircle,
  X,
  Save,
  Loader2
} from "lucide-react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/upload";

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: "",
    address: "",
    image: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    async function fetchUserItems() {
      try {
        const res = await fetch("/api/items");
        if (res.ok) {
          const data = await res.json();
          const myItems = data.filter(item => item.user?._id === session?.user?._id || item.user === session?.user?._id);
          setUserItems(myItems);
        }
      } catch (error) {
        console.error("Failed to fetch user items", error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchUserItems();
      setFormData({
        name: session.user.name || "",
        bio: session.user.bio || "",
        phone: session.user.phone || "",
        address: session.user.address || "",
        image: session.user.image || ""
      });
      setPreviewImage(session.user.image || "");
    }
  }, [session]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      let imageUrl = formData.image;

      if (imageFile) {
        const uploadedUrl = await uploadToCloudinary(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const updatedData = { ...formData, image: imageUrl };

      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        await updateSession(updatedData);
        setIsEditing(false);
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const itemsReported = userItems.filter(item => item.type === "Lost").length;
  const itemsFound = userItems.filter(item => item.type === "Found").length;
  const itemsResolved = userItems.filter(item => item.status === "Resolved").length;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Please Log In</h2>
          <p className="text-gray-500 mt-2">You need to be authenticated to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Cover Image Section */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/10"></div>
        <button className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all">
          <Camera className="w-4 h-4" /> Change Cover
        </button>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Sidebar - Profile Card */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
              <div className="relative mb-4 group">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600 overflow-hidden relative">
                  {previewImage ? (
                    <Image 
                      src={previewImage} 
                      alt={formData.name} 
                      width={128} 
                      height={128} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    formData.name?.charAt(0) || "U"
                  )}
                  
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                      <label htmlFor="profile-upload" className="cursor-pointer text-white flex flex-col items-center">
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-xs">Change</span>
                      </label>
                      <input 
                        id="profile-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                  )}
                </div>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors border-2 border-white"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="w-full space-y-3 mb-4">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full text-center border-b border-gray-300 focus:border-blue-600 focus:outline-none text-xl font-bold text-gray-900 pb-1"
                    placeholder="Full Name"
                  />
                  <input
                    type="text"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full text-center border-b border-gray-300 focus:border-blue-600 focus:outline-none text-sm text-gray-500 pb-1"
                    placeholder="Short bio..."
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">{session.user?.name}</h2>
                  <p className="text-gray-500 mb-4">{session.user?.email}</p>
                </>
              )}

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
                <Shield className="w-3 h-3" />
                {session.user?.role || "Member"}
              </div>

              <div className="w-full space-y-4 border-t border-gray-100 pt-6 text-left">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm truncate">{session.user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="flex-1 border-b border-gray-300 focus:border-blue-600 focus:outline-none text-sm"
                      placeholder="Phone Number"
                    />
                  ) : (
                    <span className="text-sm">{session.user?.phone || "No phone added"}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="flex-1 border-b border-gray-300 focus:border-blue-600 focus:outline-none text-sm"
                      placeholder="Address"
                    />
                  ) : (
                    <span className="text-sm">{session.user?.address || "No address added"}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Joined Jan 2024</span>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2 w-full mt-6">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: session.user.name || "",
                        bio: session.user.bio || "",
                        phone: session.user.phone || "",
                        address: session.user.address || "",
                        image: session.user.image || ""
                      });
                      setPreviewImage(session.user.image || "");
                    }}
                    className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Tabs & Info */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-6 inline-flex gap-2">
              {["overview", "activity", "settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Overview Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <StatCard 
                    icon={Package} 
                    label="Items Reported" 
                    value={itemsReported} 
                    color="bg-blue-100 text-blue-600" 
                  />
                  <StatCard 
                    icon={Search} 
                    label="Items Found" 
                    value={itemsFound} 
                    color="bg-purple-100 text-purple-600" 
                  />
                  <StatCard 
                    icon={CheckCircle} 
                    label="Resolved" 
                    value={itemsResolved} 
                    color="bg-green-100 text-green-600" 
                  />
                </div>

                {/* Bio / About */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">About Me</h3>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-gray-600 leading-relaxed min-h-[100px]"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">
                      {session.user?.bio || "No bio provided yet. Click edit to add one!"}
                    </p>
                  )}
                </div>

                {/* Recent Items */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Reports</h3>
                  {loading ? (
                    <p className="text-gray-500">Loading items...</p>
                  ) : userItems.length === 0 ? (
                     <p className="text-gray-500">You haven't reported or found any items yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {userItems.slice(0, 5).map((item) => (
                        <div key={item._id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center text-xl shadow-sm">
                            {item.type === "Lost" ? "🎒" : "📦"}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-500">Reported on {new Date(item.date).toLocaleDateString()} • {item.location}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                            item.status === "Resolved" ? "bg-green-100 text-green-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Placeholder for other tabs */}
            {activeTab === "activity" && (
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
                 <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                   <Calendar className="w-8 h-8 text-gray-400" />
                 </div>
                 <h3 className="text-lg font-medium text-gray-900">No recent activity</h3>
                 <p>Your activity history will appear here.</p>
               </div>
            )}
            
            {activeTab === "settings" && (
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
                 <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                   <Edit3 className="w-8 h-8 text-gray-400" />
                 </div>
                 <h3 className="text-lg font-medium text-gray-900">Profile Settings</h3>
                 <p>Settings configuration coming soon.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
