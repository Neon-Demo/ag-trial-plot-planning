"use client";

import { useState } from "react";
import Link from "next/link";

interface Trial {
  id: string;
  name: string;
  status: "PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  location: string;
  startDate: string;
  endDate?: string;
  cropType: string;
  plotCount: number;
  completedObservations: number;
  totalObservations: number;
}

export default function Trials() {
  // Mock data
  const [trials, setTrials] = useState<Trial[]>([
    {
      id: "1",
      name: "Corn Variety Trial 2024",
      status: "ACTIVE",
      location: "North Field Station",
      startDate: "2024-04-15",
      endDate: "2024-10-30",
      cropType: "Corn",
      plotCount: 120,
      completedObservations: 45,
      totalObservations: 480,
    },
    {
      id: "2",
      name: "Wheat Disease Resistance",
      status: "ACTIVE",
      location: "East Research Farm",
      startDate: "2024-03-10",
      endDate: "2024-09-15",
      cropType: "Wheat",
      plotCount: 90,
      completedObservations: 60,
      totalObservations: 360,
    },
    {
      id: "3",
      name: "Soybean Fertilizer Trial",
      status: "PLANNED",
      location: "South Field",
      startDate: "2024-05-20",
      cropType: "Soybean",
      plotCount: 60,
      completedObservations: 0,
      totalObservations: 240,
    },
    {
      id: "4",
      name: "Rice Irrigation Study",
      status: "COMPLETED",
      location: "West Research Station",
      startDate: "2023-06-10",
      endDate: "2023-11-30",
      cropType: "Rice",
      plotCount: 48,
      completedObservations: 192,
      totalObservations: 192,
    },
  ]);

  const [filter, setFilter] = useState({
    status: "all",
    searchQuery: "",
  });

  const filteredTrials = trials.filter((trial) => {
    // Filter by status
    if (filter.status !== "all" && trial.status !== filter.status) {
      return false;
    }
    
    // Filter by search query
    if (
      filter.searchQuery &&
      !trial.name.toLowerCase().includes(filter.searchQuery.toLowerCase()) &&
      !trial.location.toLowerCase().includes(filter.searchQuery.toLowerCase()) &&
      !trial.cropType.toLowerCase().includes(filter.searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "PLANNED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
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

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">Trials</h1>
        <Link
          href="/trials/new"
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
          New Trial
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={filter.searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by name, location, or crop type..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="md:w-64">
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
                <option value="PLANNED">Planned</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
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
                  Trial Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Crop Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Plots
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Progress
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
              {filteredTrials.length > 0 ? (
                filteredTrials.map((trial) => (
                  <tr key={trial.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{trial.name}</div>
                          <div className="text-sm text-gray-500">
                            {trial.startDate} {trial.endDate ? `to ${trial.endDate}` : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          trial.status
                        )}`}
                      >
                        {trial.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {trial.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {trial.cropType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {trial.plotCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700">
                            {Math.round((trial.completedObservations / trial.totalObservations) * 100)}%
                            ({trial.completedObservations}/{trial.totalObservations})
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2"
                            style={{
                              width: `${Math.round(
                                (trial.completedObservations / trial.totalObservations) * 100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/trials/${trial.id}`}
                        className="text-primary hover:text-primary-dark"
                      >
                        View
                      </Link>
                      <span className="mx-2 text-gray-300">|</span>
                      <Link
                        href={`/trials/${trial.id}/edit`}
                        className="text-primary hover:text-primary-dark"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                    No trials found. Create a new trial to get started.
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