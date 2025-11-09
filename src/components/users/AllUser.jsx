'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { useState, useMemo } from "react";

// User data
const userData = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    subscription: "Active",
    joinDate: "15 Jan, 2024",
    lastLogin: "2 hours ago",
    avatar: "/images/user/user-01.jpg",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    subscription: "Trial",
    joinDate: "14 Jan, 2024",
    lastLogin: "1 day ago",
    avatar: "/images/user/user-02.jpg",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    subscription: "Active",
    joinDate: "10 Jan, 2024",
    lastLogin: "3 hours ago",
    avatar: "/images/user/user-03.jpg",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    subscription: "Expired",
    joinDate: "05 Jan, 2024",
    lastLogin: "5 days ago",
    avatar: "/images/user/user-04.jpg",
  },
  {
    id: 5,
    name: "Robert Wilson",
    email: "robert@example.com",
    subscription: "Canceled",
    joinDate: "02 Jan, 2024",
    lastLogin: "1 week ago",
    avatar: "/images/user/user-05.jpg",
  },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "lisa@example.com",
    subscription: "Active",
    joinDate: "28 Dec, 2023",
    lastLogin: "Just now",
    avatar: "/images/user/user-06.jpg",
  },
  {
    id: 7,
    name: "David Miller",
    email: "david@example.com",
    subscription: "Active",
    joinDate: "25 Dec, 2023",
    lastLogin: "30 minutes ago",
    avatar: "/images/user/user-07.jpg",
  },
  {
    id: 8,
    name: "Jennifer Taylor",
    email: "jennifer@example.com",
    subscription: "Trial",
    joinDate: "20 Dec, 2023",
    lastLogin: "2 days ago",
    avatar: "/images/user/user-08.jpg",
  },
];

const AllUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");

  // Filter users based on search term and subscription filter
  const filteredUsers = useMemo(() => {
    return userData.filter((user) => {
      const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        subscriptionFilter === "all" ||
        (subscriptionFilter === "subscribed" && (user.subscription === "Active" || user.subscription === "Trial")) ||
        (subscriptionFilter === "not-subscribed" && (user.subscription === "Expired" || user.subscription === "Canceled"));

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, subscriptionFilter]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            All Users
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage and view all user accounts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-theme-sm font-medium text-gray-800 shadow-theme-xs hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#FFD700' }}
          >
            Add User
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 rounded-lg  bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 placeholder-gray-400 shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:placeholder-gray-500 dark:focus:ring-blue-600"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Subscription Filter */}
          <div className="flex items-center gap-2">
            <select
              value={subscriptionFilter}
              onChange={(e) => setSubscriptionFilter(e.target.value)}
              className="rounded-lg  bg-white px-3 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-blue-600"
            >
              <option value="all">All Users</option>
              <option value="subscribed">Subscribed</option>
              <option value="not-subscribed">Not Subscribed</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredUsers.length} of {userData.length} users
        </div>
      </div>
      
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                User
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Subscription
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Join Date
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Last Login
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        width={40}
                        height={40}
                        src={user.avatar}
                        className="h-10 w-10 object-cover"
                        alt={user.name}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {user.name}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {user.email}
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    size="sm"
                    color={
                      user.subscription === "Active"
                        ? "success"
                        : user.subscription === "Trial"
                        ? "warning"
                        : user.subscription === "Expired"
                        ? "error"
                        : "gray"
                    }
                  >
                    {user.subscription}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {user.joinDate}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {user.lastLogin}
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                 
                    <button 
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-theme-xs font-medium text-gray-800 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#FFD700' }}
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No users found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 items-center justify-between mt-4 sm:flex-row">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredUsers.length} of {userData.length} results
        </p>
        <div className="flex items-center gap-2">
          <button 
            className="inline-flex items-center gap-2 rounded-lg  px-3 py-2 text-theme-sm font-medium text-gray-700 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#FFD700' }}
          >
            Previous
          </button>
          <button 
            className="inline-flex items-center gap-2 rounded-lg border border-gray-800 px-3 py-2 text-theme-sm font-medium text-gray-800 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#FFD700' }}
          >
            1
          </button>
          <button 
            className="inline-flex items-center gap-2 rounded-lg  px-3 py-2 text-theme-sm font-medium text-gray-700 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#FFD700' }}
          >
            2
          </button>
          <button 
            className="inline-flex items-center gap-2 rounded-lg  px-3 py-2 text-theme-sm font-medium text-gray-700 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#FFD700' }}
          >
            3
          </button>
          <button 
            className="inline-flex items-center gap-2 rounded-lg  px-3 py-2 text-theme-sm font-medium text-gray-700 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#FFD700' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllUser;