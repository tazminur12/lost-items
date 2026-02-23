"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  User,
  Shield,
  ImageIcon,
} from "lucide-react";
import Swal from "sweetalert2";

export default function ClaimsReviewPage() {
  const { data: session } = useSession();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const [expandedClaim, setExpandedClaim] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const role = session?.user?.role;
  const isAuthorized = role === "Moderator" || role === "Admin";

  useEffect(() => {
    if (session && isAuthorized) fetchClaims();
  }, [session, activeTab]);

  async function fetchClaims() {
    setLoading(true);
    try {
      const res = await fetch(`/api/claims?status=${activeTab}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setClaims(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleModeratorAction(claimId, action) {
    const isApprove = action === "approve";

    const result = await Swal.fire({
      title: isApprove ? "Verify this claim?" : "Reject this claim?",
      input: "textarea",
      inputLabel: `${isApprove ? "Note (optional)" : "Rejection reason"}`,
      inputPlaceholder: isApprove ? "Optional note..." : "Why is this claim being rejected?",
      icon: isApprove ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: isApprove ? "#16a34a" : "#dc2626",
      confirmButtonText: isApprove ? "Verify & Forward to Admin" : "Reject",
    });

    if (!result.isConfirmed) return;

    setActionLoading(claimId);
    try {
      const res = await fetch(`/api/claims/${claimId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note: result.value || "" }),
      });
      if (!res.ok) throw new Error("Failed");

      Swal.fire({
        icon: "success",
        title: isApprove ? "Claim Verified" : "Claim Rejected",
        text: isApprove ? "Forwarded to admin for final approval." : "The claimant has been notified.",
        timer: 2000,
        showConfirmButton: false,
      });

      setClaims((prev) => prev.filter((c) => c._id !== claimId));
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Action failed." });
    } finally {
      setActionLoading(null);
    }
  }

  async function handleAdminAction(claimId, action) {
    const isApprove = action === "approve";

    const result = await Swal.fire({
      title: isApprove ? "Give final approval?" : "Reject this claim?",
      input: "textarea",
      inputLabel: `${isApprove ? "Note (optional)" : "Rejection reason"}`,
      inputPlaceholder: isApprove ? "Optional note..." : "Reason for rejection...",
      icon: isApprove ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: isApprove ? "#16a34a" : "#dc2626",
      confirmButtonText: isApprove ? "Approve (Final)" : "Reject",
    });

    if (!result.isConfirmed) return;

    setActionLoading(claimId);
    try {
      const res = await fetch(`/api/claims/${claimId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note: result.value || "" }),
      });
      if (!res.ok) throw new Error("Failed");

      Swal.fire({
        icon: "success",
        title: isApprove ? "Claim Approved!" : "Claim Rejected",
        text: isApprove ? "Item marked as claimed. The user has been notified." : "The claimant has been notified.",
        timer: 2000,
        showConfirmButton: false,
      });

      setClaims((prev) => prev.filter((c) => c._id !== claimId));
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Action failed." });
    } finally {
      setActionLoading(null);
    }
  }

  if (!session) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-semibold text-gray-900">Please sign in</h2>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900">Access Denied</h2>
      </div>
    );
  }

  const tabs = [
    { id: "Pending", label: "Pending Claims", icon: Clock },
    { id: "ModeratorApproved", label: "Awaiting Admin", icon: Shield },
    { id: "all", label: "All Claims", icon: Eye },
  ];

  const statusBadge = (status) => {
    const map = {
      Pending: "bg-yellow-100 text-yellow-700",
      ModeratorApproved: "bg-blue-100 text-blue-700",
      ModeratorRejected: "bg-red-100 text-red-700",
      AdminApproved: "bg-green-100 text-green-700",
      AdminRejected: "bg-red-100 text-red-700",
    };
    const labels = {
      Pending: "Pending Review",
      ModeratorApproved: "Moderator Verified",
      ModeratorRejected: "Moderator Rejected",
      AdminApproved: "Approved",
      AdminRejected: "Admin Rejected",
    };
    return (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${map[status] || "bg-gray-100 text-gray-700"}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Review Claims</h1>
        <p className="text-sm text-gray-500 mt-1">
          {role === "Admin"
            ? "Review moderator-verified claims and give final approval."
            : "Verify claims and forward to admin for final approval."}
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
                  : "border-transparent text-gray-500 hover:text-gray-700"
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
          <span className="text-gray-500">Loading claims...</span>
        </div>
      ) : claims.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No claims to review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => {
            const isExpanded = expandedClaim === claim._id;
            const isProcessing = actionLoading === claim._id;

            return (
              <div key={claim._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="shrink-0 w-14 h-14 rounded-lg bg-gray-100 overflow-hidden">
                        {claim.item?.imageUrl ? (
                          <img src={claim.item.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-semibold text-gray-900">{claim.item?.title || "Unknown Item"}</h3>
                          {statusBadge(claim.status)}
                        </div>
                        <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            Claimed by: {claim.claimant?.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(claim.createdAt).toLocaleDateString()}
                          </span>
                          {claim.item?.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {claim.item.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {claim.status === "Pending" && (role === "Moderator" || role === "Admin") && (
                        <>
                          <button
                            onClick={() => handleModeratorAction(claim._id, "approve")}
                            disabled={isProcessing}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            Verify
                          </button>
                          <button
                            onClick={() => handleModeratorAction(claim._id, "reject")}
                            disabled={isProcessing}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                      {claim.status === "ModeratorApproved" && role === "Admin" && (
                        <>
                          <button
                            onClick={() => handleAdminAction(claim._id, "approve")}
                            disabled={isProcessing}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            Final Approve
                          </button>
                          <button
                            onClick={() => handleAdminAction(claim._id, "reject")}
                            disabled={isProcessing}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setExpandedClaim(isExpanded ? null : claim._id)}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Identifying Features (by claimant)</h4>
                        <p className="text-sm text-gray-600 leading-relaxed bg-white p-3 rounded-lg border">
                          {claim.identifyingFeatures}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Item Description</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {claim.item?.description || "No description."}
                        </p>
                      </div>
                    </div>

                    {claim.proofImageUrl && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Proof of Ownership</h4>
                        <img src={claim.proofImageUrl} alt="Proof" className="rounded-lg max-h-48 object-cover border" />
                      </div>
                    )}

                    <div className="flex gap-6 text-sm text-gray-500">
                      <div>
                        <span className="font-medium text-gray-700">Claimant:</span> {claim.claimant?.name} ({claim.claimant?.email})
                      </div>
                    </div>

                    {claim.moderatorNote && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <span className="text-xs font-semibold text-blue-700">Moderator Note:</span>
                        <p className="text-sm text-blue-600 mt-1">{claim.moderatorNote}</p>
                        {claim.moderatorBy && (
                          <p className="text-xs text-blue-500 mt-1">By: {claim.moderatorBy.name} at {new Date(claim.moderatorAt).toLocaleString()}</p>
                        )}
                      </div>
                    )}

                    {claim.adminNote && (
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <span className="text-xs font-semibold text-purple-700">Admin Note:</span>
                        <p className="text-sm text-purple-600 mt-1">{claim.adminNote}</p>
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
