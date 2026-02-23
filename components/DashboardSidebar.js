"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Flag,
  Settings,
  LogOut,
  Search,
  Package,
  MessageSquare,
  ShieldCheck,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const role = session?.user?.role || "User";

  const commonLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const roleLinks = {
    Admin: [
      { name: "User Management", href: "/dashboard/users", icon: Users },
      { name: "Review Items", href: "/dashboard/review-items", icon: ShieldCheck },
      { name: "Review Claims", href: "/dashboard/claims", icon: Flag },
      { name: "All Items", href: "/dashboard/items", icon: Package },
      { name: "Reports", href: "/dashboard/reports", icon: FileText },
    ],
    Moderator: [
      { name: "Review Items", href: "/dashboard/review-items", icon: ShieldCheck },
      { name: "Review Claims", href: "/dashboard/claims", icon: Flag },
    ],
    User: [
      { name: "My Lost Items", href: "/dashboard/my-lost", icon: Search },
      { name: "My Found Items", href: "/dashboard/my-found", icon: Package },
      { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    ],
  };

  const links = [
    ...((roleLinks[role] || [])),
    ...commonLinks
  ];

  // Insert Dashboard at the beginning if not present in roleLinks (it's in common but usually first)
  // Actually, let's restructure: Dashboard first, then role specific, then settings.
  const finalLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ...(roleLinks[role] || []),
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Trigger */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-20 left-4 z-40 p-2 bg-white rounded-md shadow-md border border-gray-200"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out pt-20
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:h-[calc(100vh-4rem)] md:pt-0
        `}
      >
        <div className="h-full flex flex-col justify-between p-4">
          <div className="space-y-6">
            {/* User Info Snippet */}
            <div className="px-3 py-4 bg-blue-50 rounded-xl mb-6">
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
                {role} Account
              </p>
              <p className="text-sm font-bold text-gray-900 truncate">
                {session?.user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session?.user?.email}
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {finalLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    <link.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full mt-auto"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
