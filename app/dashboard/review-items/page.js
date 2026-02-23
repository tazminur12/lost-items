"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Filter,
  MapPin,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Loader2,
  ImageIcon,
} from "lucide-react";
import Swal from "sweetalert2";

export default function ReviewItemsPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [expandedItem, setExpandedItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const role = session?.user?.role;
  const isAuthorized = role === "Moderator" || role === "Admin";

  useEffect(() => {
    if (session && isAuthorized) {
      fetchItems();
    }
  }, [session, activeTab]);

  async function fetchItems() {
    setLoading(true);
    try {
      const approval = activeTab === "pending" ? "pending" : activeTab === "rejected" ? "rejected" : "all";
      const res = await fetch(`/api/items?approval=${approval}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(itemId) {
    const result = await Swal.fire({
      title: "Approve this item?",
      text: "This post will become visible to all users.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setActionLoading(itemId);
    try {
      const res = await fetch(`/api/items/${itemId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      if (!res.ok) throw new Error("Failed to approve");

      Swal.fire({
        icon: "success",
        title: "Approved!",
        text: "The item has been approved and is now visible.",
        timer: 2000,
        showConfirmButton: false,
      });

      setItems((prev) => prev.filter((i) => i._id !== itemId));
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to approve item." });
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(itemId) {
    const { value: reason, isConfirmed } = await Swal.fire({
      title: "Reject this item?",
      input: "textarea",
      inputLabel: "Rejection Reason (optional)",
      inputPlaceholder: "Enter reason for rejection...",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
    });

    if (!isConfirmed) return;

    setActionLoading(itemId);
    try {
      const res = await fetch(`/api/items/${itemId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", rejectionReason: reason || "" }),
      });
      if (!res.ok) throw new Error("Failed to reject");

      Swal.fire({
        icon: "success",
        title: "Rejected",
        text: "The item has been rejected.",
        timer: 2000,
        showConfirmButton: false,
      });

      setItems((prev) => prev.filter((i) => i._id !== itemId));
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to reject item." });
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReApprove(itemId) {
    setActionLoading(itemId);
    try {
      const res = await fetch(`/api/items/${itemId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      if (!res.ok) throw new Error("Failed to approve");

      Swal.fire({
        icon: "success",
        title: "Approved!",
        text: "The item has been re-approved.",
        timer: 2000,
        showConfirmButton: false,
      });

      setItems((prev) => prev.filter((i) => i._id !== itemId));
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to approve item." });
    } finally {
      setActionLoading(null);
    }
  }

  if (!session) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-semibold text-gray-900">Please sign in</h2>
        <p className="text-sm text-gray-500 mt-1">You need to be signed in to access this page.</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900">Access Denied</h2>
        <p className="text-sm text-gray-500 mt-1">Only Moderators and Admins can review items.</p>
      </div>
    );
  }

  const tabs = [
    { id: "pending", label: "Pending Review", icon: Clock, color: "yellow" },
    { id: "rejected", label: "Rejected", icon: XCircle, color: "red" },
    { id: "all", label: "All Items", icon: Filter, color: "blue" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Review Items</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and approve or reject lost & found posts before they become public.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-500">Loading items...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            {activeTab === "pending"
              ? "No items pending review!"
              : activeTab === "rejected"
              ? "No rejected items."
              : "No items found."}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {activeTab === "pending" && "All posts have been reviewed. Check back later."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const isExpanded = expandedItem === item._id;
            const isProcessing = actionLoading === item._id;

            return (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
              >
                {/* Card Header */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Thumbnail */}
                      <div className="shrink-0 w-16 h-16 rounded-lg bg-gray-100 overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-semibold text-gray-900 truncate">
                            {item.title}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              item.type === "Lost"
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {item.type}
                          </span>
                          {item.approvalStatus && (
                            <span
                              className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                item.approvalStatus === "Pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : item.approvalStatus === "Approved"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {item.approvalStatus}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {item.user?.name || "Unknown"}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {item.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                          Category: <span className="text-gray-700">{item.category}</span>
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {item.approvalStatus === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(item._id)}
                            disabled={isProcessing}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(item._id)}
                            disabled={isProcessing}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            Reject
                          </button>
                        </>
                      )}
                      {item.approvalStatus === "Rejected" && (
                        <button
                          onClick={() => handleReApprove(item._id)}
                          disabled={isProcessing}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Re-Approve
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedItem(isExpanded ? null : item._id)}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.description || "No description provided."}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {item.contactInfo && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">Contact Info</h4>
                            <p className="text-sm text-gray-600">{item.contactInfo}</p>
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Posted By</h4>
                          <p className="text-sm text-gray-600">
                            {item.user?.name} ({item.user?.email})
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Submitted</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {item.rejectionReason && (
                          <div>
                            <h4 className="text-sm font-semibold text-red-700 mb-1">
                              Rejection Reason
                            </h4>
                            <p className="text-sm text-red-600">{item.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {item.imageUrl && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Attached Image</h4>
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="rounded-lg max-h-64 object-cover border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
