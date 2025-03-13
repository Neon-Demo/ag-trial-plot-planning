import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Get user role - defaulting to researcher if not specified
  const userRole = (session.user as any).role || "researcher";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            AG Trial Plot Planning
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {session.user?.name || session.user?.email}
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </span>
            <Link
              href="/api/auth/signout"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Welcome to your Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300">
            You are logged in using {session.user?.email ? 'your email account' : 'a demo account'}.
            {session.user?.email ? ` (${session.user.email})` : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard 
            title="Active Trials" 
            count={3} 
            href="/trials"
            description="View and manage your active agricultural trials"
          />
          <DashboardCard 
            title="Scheduled Observations" 
            count={12} 
            href="/observations"
            description="Upcoming observations that need to be collected"
          />
          <DashboardCard 
            title="Recent Activity" 
            count={8} 
            href="/activity"
            description="View recent changes and updates to your trials"
          />
          
          {userRole === "admin" && (
            <DashboardCard 
              title="User Management" 
              count={15} 
              href="/admin/users"
              description="Manage users and permissions"
            />
          )}
          
          {(userRole === "admin" || userRole === "researcher") && (
            <DashboardCard 
              title="Create New Trial" 
              count={null} 
              href="/trials/new"
              description="Set up a new agricultural trial"
              actionLabel="Create Trial"
            />
          )}
          
          {(userRole === "field-technician" || userRole === "researcher") && (
            <DashboardCard 
              title="Field Navigation" 
              count={null} 
              href="/navigation"
              description="Navigate to plots for data collection"
              actionLabel="Start Navigation"
            />
          )}
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ 
  title, 
  count, 
  href, 
  description,
  actionLabel
}: { 
  title: string; 
  count: number | null; 
  href: string;
  description: string;
  actionLabel?: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {count !== null && (
          <span className="px-2 py-1 text-sm rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
            {count}
          </span>
        )}
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">
        {description}
      </p>
      <Link
        href={href}
        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
      >
        {actionLabel || "View Details"} →
      </Link>
    </div>
  );
}