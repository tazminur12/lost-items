"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  User,
  Trash2,
  Search,
  Loader2,
  AlertTriangle,
  ChevronDown,
  Mail,
  Calendar,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import Swal from "sweetalert2";

export default function UserManagementPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Moderator",
  });

  const isAdmin = session?.user?.role === "Admin";

  useEffect(() => {
    if (session && isAdmin) {
      fetchUsers();
    }
  }, [session, roleFilter, searchQuery]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter !== "all") params.set("role", roleFilter);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/users?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser(e) {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      Swal.fire({ icon: "warning", title: "Missing Fields", text: "Please fill in all fields." });
      return;
    }

    if (formData.password.length < 6) {
      Swal.fire({ icon: "warning", title: "Weak Password", text: "Password must be at least 6 characters." });
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create user");

      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: `${formData.role} account for ${formData.name} created successfully.`,
        timer: 2500,
        showConfirmButton: false,
      });

      setFormData({ name: "", email: "", password: "", role: "Moderator" });
      setShowCreateForm(false);
      fetchUsers();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    } finally {
      setCreating(false);
    }
  }

  async function handleRoleChange(userId, userName, newRole) {
    const result = await Swal.fire({
      title: "Change Role?",
      html: `Change <strong>${userName}</strong>'s role to <strong>${newRole}</strong>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Change",
      confirmButtonColor: "#2563eb",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update role");

      Swal.fire({
        icon: "success",
        title: "Role Updated",
        text: data.message,
        timer: 2000,
        showConfirmButton: false,
      });

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  }

  async function handleDeleteUser(userId, userName) {
    const result = await Swal.fire({
      title: "Delete User?",
      html: `Are you sure you want to permanently delete <strong>${userName}</strong>? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete user");

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "User has been deleted.",
        timer: 2000,
        showConfirmButton: false,
      });

      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
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

  if (!isAdmin) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900">Access Denied</h2>
        <p className="text-sm text-gray-500 mt-1">Only Admins can manage users.</p>
      </div>
    );
  }

  const roleIcon = (role) => {
    if (role === "Admin") return <Shield className="w-3.5 h-3.5" />;
    if (role === "Moderator") return <ShieldCheck className="w-3.5 h-3.5" />;
    return <User className="w-3.5 h-3.5" />;
  };

  const roleBadge = (role) => {
    const colors = {
      Admin: "bg-purple-100 text-purple-700",
      Moderator: "bg-blue-100 text-blue-700",
      User: "bg-gray-100 text-gray-700",
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${colors[role] || colors.User}`}>
        {roleIcon(role)}
        {role}
      </span>
    );
  };

  const totalAdmins = users.filter((u) => u.role === "Admin").length;
  const totalMods = users.filter((u) => u.role === "Moderator").length;
  const totalUsers = users.filter((u) => u.role === "User").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create accounts, manage roles, and oversee all users.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showCreateForm ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          {showCreateForm ? "Cancel" : "Create Account"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalAdmins}</p>
              <p className="text-xs text-gray-500">Admins</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalMods}</p>
              <p className="text-xs text-gray-500">Moderators</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              <p className="text-xs text-gray-500">Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Account Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            Create New Account
          </h2>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="User">User</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                {creating ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Moderator">Moderator</option>
            <option value="User">User</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-500">Loading users...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No users found.</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => {
                  const isSelf = user.email === session?.user?.email;
                  return (
                    <tr key={user._id} className={`${isSelf ? "bg-blue-50/30" : ""} hover:bg-gray-50 transition-colors`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                            {user.image ? (
                              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm font-semibold text-gray-600">
                                {user.name?.charAt(0)?.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.name}
                              {isSelf && <span className="ml-1.5 text-xs text-blue-600 font-normal">(You)</span>}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {roleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isSelf ? (
                          <span className="text-xs text-gray-400">N/A</span>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, user.name, e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            <option value="User">User</option>
                            <option value="Moderator">Moderator</option>
                            <option value="Admin">Admin</option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {isSelf ? (
                          <span className="text-xs text-gray-400">-</span>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Showing {users.length} user{users.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
