"use client";

import { useState, useEffect } from "react";
import { useDatabase } from "@/lib/db-provider";
import { User as PrismaUser, Organization as PrismaOrganization } from "@prisma/client";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  status: "active" | "inactive";
  lastLogin: string;
}

interface UserWithOrganization extends PrismaUser {
  organizations: {
    organization: PrismaOrganization;
  }[];
}

export default function UsersPage() {
  const { db } = useDatabase();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        // Fetch users with their organizations
        const dbUsers = await db.user.findMany({
          include: {
            organizations: {
              include: {
                organization: true
              }
            }
          }
        });

        // Transform the data for our UI
        const transformedUsers = dbUsers.map((user: UserWithOrganization) => ({
          id: user.id,
          name: user.name || "No Name",
          email: user.email || "No Email",
          role: user.role,
          organization: user.organizations[0]?.organization.name || "No Organization",
          status: user.isActive ? "active" : "inactive",
          lastLogin: user.lastLogin?.toISOString() || new Date().toISOString(),
        }));

        setUsers(transformedUsers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Using demo data instead.");
        setLoading(false);
        
        // Fallback to demo data in case of error
        setUsers([
          {
            id: "1",
            name: "Demo Admin",
            email: "admin@example.com",
            role: "ADMIN",
            organization: "AgriResearch Inc.",
            status: "active",
            lastLogin: "2024-03-19T10:30:00Z",
          },
          {
            id: "2",
            name: "Demo Researcher",
            email: "researcher@example.com",
            role: "RESEARCHER",
            organization: "AgriResearch Inc.",
            status: "active",
            lastLogin: "2024-03-18T15:45:00Z",
          },
          {
            id: "3",
            name: "Demo Field Tech",
            email: "fieldtech@example.com",
            role: "FIELD_TECHNICIAN",
            organization: "AgriResearch Inc.",
            status: "active",
            lastLogin: "2024-03-17T09:15:00Z",
          },
          {
            id: "4",
            name: "John Smith",
            email: "john.smith@example.com",
            role: "RESEARCHER",
            organization: "AgriResearch Inc.",
            status: "inactive",
            lastLogin: "2024-02-28T11:20:00Z",
          },
        ]);
      }
    }

    fetchUsers();
  }, [db]);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Handle adding a new user
  const handleAddUser = () => {
    // In a real implementation, this would open a modal or navigate to a form
    alert("This would open a form to add a new user");
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        // Delete user in the database
        await db.user.delete({
          where: { id: userId }
        });
        
        // Update local state
        setUsers(users.filter((user) => user.id !== userId));
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  // Handle user status toggle
  const handleToggleStatus = async (userId: string) => {
    try {
      // Find the user to toggle
      const userToUpdate = users.find(user => user.id === userId);
      if (!userToUpdate) return;
      
      // Determine the new status
      const newStatus = userToUpdate.status === "active" ? false : true;
      
      // Update user in the database
      await db.user.update({
        where: { id: userId },
        data: { isActive: newStatus }
      });
      
      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId
            ? { ...user, status: user.status === "active" ? "inactive" : "active" }
            : user
        )
      );
    } catch (err) {
      console.error("Error updating user status:", err);
      alert("Failed to update user status. Please try again.");
    }
  };

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRoleFilter = roleFilter === "all" || user.role === roleFilter;
    const matchesStatusFilter = statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRoleFilter && matchesStatusFilter;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={handleAddUser}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          disabled={loading}
        >
          Add User
        </button>
      </div>

      {/* Show error message if there's an error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Show loading indicator */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {!loading && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  className="w-full p-2 border rounded"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <select
                  className="p-2 border rounded w-full"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="RESEARCHER">Researcher</option>
                  <option value="FIELD_TECHNICIAN">Field Technician</option>
                </select>
              </div>
              <div>
                <select
                  className="p-2 border rounded w-full"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "RESEARCHER"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.organization}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            user.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.lastLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          {user.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}