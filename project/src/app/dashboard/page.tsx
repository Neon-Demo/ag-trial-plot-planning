"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for demonstration
  const [dashboardData, setDashboardData] = useState({
    activeTrials: 3,
    upcomingObservations: 12,
    recentObservations: [
      { id: 1, trialName: "Corn Variety Trial 2024", plotNumber: "A101", date: "2024-03-15", status: "completed" },
      { id: 2, trialName: "Wheat Disease Resistance", plotNumber: "B205", date: "2024-03-14", status: "completed" },
      { id: 3, trialName: "Soybean Fertilizer Trial", plotNumber: "C310", date: "2024-03-12", status: "completed" },
    ],
    weatherAlert: {
      condition: "Rain expected",
      forecast: "70% chance of precipitation in the next 24 hours",
      alert: "Consider delaying scheduled observations"
    }
  });

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Welcome message */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold">Welcome back, {session?.user?.name || "User"}!</h2>
        <p className="text-gray-600">Here's what's happening with your agricultural trials today.</p>
      </div>

      {isLoading ? (
        // Loading skeleton
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        // Dashboard cards
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Active Trials</h3>
            <p className="text-3xl font-bold text-primary">{dashboardData.activeTrials}</p>
            <Link href="/trials" className="text-primary-dark hover:underline text-sm inline-block mt-2">
              View all trials →
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Upcoming Observations</h3>
            <p className="text-3xl font-bold text-secondary-dark">{dashboardData.upcomingObservations}</p>
            <Link href="/observations" className="text-secondary-dark hover:underline text-sm inline-block mt-2">
              View observation schedule →
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Weather Alert</h3>
            <p className="font-semibold text-accent">{dashboardData.weatherAlert.condition}</p>
            <p className="text-gray-600 text-sm mt-1">{dashboardData.weatherAlert.alert}</p>
          </div>
        </div>
      )}

      {/* Recent observations */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold">Recent Observations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trial
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plot
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                // Loading skeleton
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="h-4 bg-gray-200 rounded w-1/2 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : (
                dashboardData.recentObservations.map((observation) => (
                  <tr key={observation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{observation.trialName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{observation.plotNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{observation.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {observation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-primary hover:text-primary-dark">View</a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-200 px-6 py-4">
          <Link href="/observations" className="text-primary hover:text-primary-dark text-sm font-medium">
            View all observations →
          </Link>
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/trials"
            className="bg-primary bg-opacity-10 hover:bg-opacity-20 p-4 rounded-lg flex flex-col items-center justify-center transition text-center"
          >
            <svg className="w-8 h-8 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-medium text-gray-900">New Trial</span>
          </Link>

          <Link 
            href="/observations"
            className="bg-secondary bg-opacity-10 hover:bg-opacity-20 p-4 rounded-lg flex flex-col items-center justify-center transition text-center"
          >
            <svg className="w-8 h-8 text-secondary-dark mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="font-medium text-gray-900">Record Observation</span>
          </Link>

          <Link 
            href="/navigation"
            className="bg-accent bg-opacity-10 hover:bg-opacity-20 p-4 rounded-lg flex flex-col items-center justify-center transition text-center"
          >
            <svg className="w-8 h-8 text-accent mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="font-medium text-gray-900">Plot Navigation</span>
          </Link>

          <Link 
            href="/settings"
            className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg flex flex-col items-center justify-center transition text-center"
          >
            <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium text-gray-900">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}