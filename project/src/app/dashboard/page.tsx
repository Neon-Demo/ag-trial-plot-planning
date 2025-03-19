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

        {/* Trial Overview Dashboard */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Trial Overview</h2>
            <Link
              href="/trials"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
            >
              View All Trials →
            </Link>
          </div>
          
          {/* Quick view of trial details */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Trial Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {/* Mock trial data - first few rows */}
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Winter Wheat Variety Trial 2024</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">North Research Farm</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">45% complete</div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Corn Fertilizer Experiment</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">South Research Farm</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">30% complete</div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Soybean Disease Resistance Study</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Planned
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">East Research Farm</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Not started</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Scheduled Observations */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Scheduled Observations</h2>
            <Link
              href="/observations"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
            >
              View All Observations →
            </Link>
          </div>
          
          {/* Quick view of scheduled observations */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date/Time
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Trial
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {/* Mock observation data */}
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">Today, 10:00 AM</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Winter Wheat Variety Trial</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">North Farm, Block A</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">Today, 2:30 PM</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Corn Fertilizer Experiment</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">South Farm, Section 2</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">Tomorrow, 9:00 AM</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Winter Wheat Variety Trial</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">North Farm, Block B</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      Scheduled
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Link
              href="/activity"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
            >
              View All Activity →
            </Link>
          </div>
          
          {/* Quick view of recent activity */}
          <div className="space-y-4">
            <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex-shrink-0 p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Observation Completed</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Winter Wheat Variety Trial, Block A</div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">Today, 8:45 AM</div>
              </div>
            </div>
            
            <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex-shrink-0 p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Note Added</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Corn Fertilizer Experiment - Signs of leaf discoloration in plot C-12</div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">Yesterday, 3:20 PM</div>
              </div>
            </div>
            
            <div className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex-shrink-0 p-2 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Images Captured</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Soybean Disease Resistance Study - 8 new images added</div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">Yesterday, 11:15 AM</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">          
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