'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiMenu, FiX, FiHome, FiClipboard, FiMap, FiBarChart2, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick?: () => void;
}

const NavItem = ({ href, label, icon, active, onClick }: NavItemProps) => (
  <Link
    href={href}
    className={`flex items-center px-4 py-2 my-1 rounded-lg transition-colors ${
      active
        ? 'bg-primary-600 text-white'
        : 'text-gray-700 dark:text-gray-200 hover:bg-primary-100 dark:hover:bg-primary-900'
    }`}
    onClick={onClick}
  >
    <div className="mr-3">{icon}</div>
    <span>{label}</span>
  </Link>
);

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const userRole = (session?.user as any)?.role || 'user';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="text-xl font-semibold text-primary-600 dark:text-primary-400">
            AG Trial Planning
          </div>
          <button
            onClick={closeSidebar}
            className="p-1 rounded-md lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
          <NavItem
            href="/dashboard"
            label="Dashboard"
            icon={<FiHome size={20} />}
            active={pathname === '/dashboard'}
            onClick={closeSidebar}
          />
          <NavItem
            href="/trials"
            label="Trials"
            icon={<FiClipboard size={20} />}
            active={pathname.startsWith('/trials')}
            onClick={closeSidebar}
          />
          <NavItem
            href="/observations"
            label="Observations"
            icon={<FiBarChart2 size={20} />}
            active={pathname.startsWith('/observations')}
            onClick={closeSidebar}
          />
          <NavItem
            href="/navigation"
            label="Field Navigation"
            icon={<FiMap size={20} />}
            active={pathname.startsWith('/navigation')}
            onClick={closeSidebar}
          />
          
          {userRole === 'admin' && (
            <NavItem
              href="/admin/users"
              label="User Management"
              icon={<FiUsers size={20} />}
              active={pathname.startsWith('/admin')}
              onClick={closeSidebar}
            />
          )}
          
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <NavItem
              href="/settings"
              label="Settings"
              icon={<FiSettings size={20} />}
              active={pathname === '/settings'}
              onClick={closeSidebar}
            />
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center w-full px-4 py-2 my-1 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
            >
              <div className="mr-3">
                <FiLogOut size={20} />
              </div>
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 rounded-md lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              <FiMenu size={24} />
            </button>
            <div className="flex items-center">
              <div className="text-sm mr-2">
                {session?.user?.name || session?.user?.email}
              </div>
              <div className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}