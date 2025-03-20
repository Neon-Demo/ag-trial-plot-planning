"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  role?: string | string[];
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  // Show loading spinner during auth check
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Redirect to signin if not authenticated
  if (status === "unauthenticated") {
    console.log("User is not authenticated, redirecting to signin page");
    
    // Using window.location.href which is more reliable than router
    if (typeof window !== 'undefined') {
      const basePath = window.location.origin;
      window.location.href = `${basePath}/auth/signin`;
      // Return null or loading indicator while redirecting
      return (
        <div className="flex items-center justify-center h-screen">
          <div>Redirecting to sign in...</div>
        </div>
      );
    }
    
    // This is for server-side rendering
    return <div>Redirecting to sign in...</div>;
  }
  
  const userRole = session?.user?.role || "FIELD_TECHNICIAN";

  const hasAccess = (requiredRole?: string | string[]) => {
    if (!requiredRole) return true;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }
    
    return requiredRole === userRole;
  };

  const sidebarLinks: SidebarLink[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: "/trials",
      label: "Trials",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      href: "/observations",
      label: "Observations",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      href: "/navigation",
      label: "Navigation",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      href: "/admin/users",
      label: "User Management",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      role: "ADMIN",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const filteredLinks = sidebarLinks.filter(link => hasAccess(link.role));

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-primary">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-shrink-0 flex items-center px-4">
            <div className="h-8 w-8 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 50 L40 70 L80 30" stroke="white" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="20" cy="30" r="8" fill="white" />
                <circle cx="80" cy="70" r="8" fill="white" />
              </svg>
            </div>
            <span className="ml-2 text-xl font-bold text-white">AgTrial</span>
          </div>

          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {filteredLinks.map((link) => (
                <Link
                  href={link.href}
                  key={link.href}
                  className={`${
                    pathname.startsWith(link.href)
                      ? "bg-primary-dark text-white"
                      : "text-white hover:bg-primary-dark"
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                >
                  <div className="mr-4 h-6 w-6">{link.icon}</div>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-shrink-0 flex border-t border-primary-dark p-4">
            <div className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div className="relative">
                  {session?.user?.image ? (
                    <Image
                      className="inline-block h-10 w-10 rounded-full"
                      src={session.user.image}
                      alt=""
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="inline-block h-10 w-10 rounded-full bg-primary-light flex items-center justify-center">
                      <span className="text-primary-dark font-medium text-lg">
                        {session?.user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-white">
                    {session?.user?.name || "User"}
                  </p>
                  <button
                    onClick={() => signOut({ callbackUrl: `${window.location.origin}/` })}
                    className="text-sm font-medium text-primary-light hover:text-white"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary">
              <div className="h-8 w-8 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 50 L40 70 L80 30" stroke="white" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="30" r="8" fill="white" />
                  <circle cx="80" cy="70" r="8" fill="white" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold text-white">AgTrial</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto bg-primary">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {filteredLinks.map((link) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    className={`${
                      pathname.startsWith(link.href)
                        ? "bg-primary-dark text-white"
                        : "text-white hover:bg-primary-dark"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <div className="mr-3 h-6 w-6">{link.icon}</div>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-primary-dark p-4 bg-primary">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div className="relative">
                    {session?.user?.image ? (
                      <Image
                        className="inline-block h-9 w-9 rounded-full"
                        src={session.user.image}
                        alt=""
                        width={36}
                        height={36}
                      />
                    ) : (
                      <div className="inline-block h-9 w-9 rounded-full bg-primary-light flex items-center justify-center">
                        <span className="text-primary-dark font-medium text-lg">
                          {session?.user?.name?.charAt(0) || "U"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">
                      {session?.user?.name || "User"}
                    </p>
                    <button
                      onClick={() => signOut({ callbackUrl: `${window.location.origin}/` })}
                      className="text-xs font-medium text-primary-light hover:text-white"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow md:hidden">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex items-center">
                <div className="text-xl font-semibold text-gray-900">
                  {pathname === "/dashboard"
                    ? "Dashboard"
                    : pathname.split("/").pop() 
                      ? pathname.split("/").pop()!.charAt(0).toUpperCase() + 
                        pathname.split("/").pop()!.slice(1)
                      : "Page"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}