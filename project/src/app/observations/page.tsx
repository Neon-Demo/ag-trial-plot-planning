"use client";

import { useState } from "react";
import Link from "next/link";

interface Observation {
  id: string;
  trialName: string;
  plotNumber: string;
  date: string;
  protocol: string;
  observer: string;
  status: "completed" | "pending" | "missed";
}

export default function Observations() {
  // Mock data
  const [observations, setObservations] = useState<Observation[]>([
    {
      id: "1",
      trialName: "Corn Variety Trial 2024",
      plotNumber: "A101",
      date: "2024-03-15",
      protocol: "Vegetative Stage Assessment",
      observer: "John Doe",
      status: "completed",
    },
    {
      id: "2",
      trialName: "Wheat Disease Resistance",
      plotNumber: "B205",
      date: "2024-03-14",
      protocol: "Emergence Count",
      observer: "Jane Smith",
      status: "completed",
    },
    {
      id: "3",
      trialName: "Soybean Fertilizer Trial",
      plotNumber: "C310",
      date: "2024-03-12",
      protocol: "Soil Sampling",
      observer: "Mike Johnson",
      status: "completed",
    },
    {
      id: "4",
      trialName: "Corn Variety Trial 2024",
      plotNumber: "A102",
      date: "2024-03-22",
      protocol: "Vegetative Stage Assessment",
      observer: "Unassigned",
      status: "pending",
    },
    {
      id: "5",
      trialName: "Wheat Disease Resistance",
      plotNumber: "B206",
      date: "2024-03-10",
      protocol: "Disease Rating",
      observer: "Jane Smith",
      status: "missed",
    },
  ]);

  const [filter, setFilter] = useState({
    searchQuery: "",
    status: "all",
    dateRange: "all",
  });

  const getDateRangeFilter = (dateRange: string, date: string) => {
    if (dateRange === "all") return true;
    
    const today = new Date();
    const observationDate = new Date(date);
    const diffDays = Math.floor((today.getTime() - observationDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (dateRange) {
      case "today":
        return diffDays === 0;
      case "yesterday":
        return diffDays === 1;
      case "thisWeek":
        return diffDays <= 7;
      case "thisMonth":
        return diffDays <= 30;
      default:
        return true;
    }
  };

  const filteredObservations = observations.filter((observation) => {
    // Filter by search query
    if (
      filter.searchQuery &&
      !observation.trialName.toLowerCase().includes(filter.searchQuery.toLowerCase()) &&
      !observation.plotNumber.toLowerCase().includes(filter.searchQuery.toLowerCase()) &&
      !observation.protocol.toLowerCase().includes(filter.searchQuery.toLowerCase()) &&
      !observation.observer.toLowerCase().includes(filter.searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    // Filter by status
    if (filter.status !== "all" && observation.status !== filter.status) {
      return false;
    }
    
    // Filter by date range
    if (!getDateRangeFilter(filter.dateRange, observation.date)) {
      return false;
    }
    
    return true;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "missed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, searchQuery: e.target.value });
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({ ...filter, status: e.target.value });
  };

  const handleDateRangeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({ ...filter, dateRange: e.target.value });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">Observations</h1>
        <Link
          href="/observations/new"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          New Observation
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={filter.searchQuery}
                onChange={handleSearchChange}
                placeholder="Search observations..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={filter.status}
                onChange={handleStatusFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="missed">Missed</option>
              </select>
            </div>
            <div>
              <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select
                id="dateRange"
                value={filter.dateRange}
                onChange={handleDateRangeFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trial & Plot
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Protocol
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Observer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredObservations.length > 0 ? (
                filteredObservations.map((observation) => (
                  <tr key={observation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{observation.trialName}</div>
                      <div className="text-sm text-gray-500">Plot: {observation.plotNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {observation.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {observation.protocol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {observation.observer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          observation.status
                        )}`}
                      >
                        {observation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/observations/${observation.id}`}
                        className="text-primary hover:text-primary-dark mr-3"
                      >
                        View
                      </Link>
                      {observation.status === "pending" && (
                        <Link
                          href={`/observations/${observation.id}/collect`}
                          className="text-primary hover:text-primary-dark"
                        >
                          Collect
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                    No observations found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}