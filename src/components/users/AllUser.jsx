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
import { useAllUserQuery } from "@/feature/SubscriptionApi";

// Define TypeScript interface for user data


const AllUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: allUsers, isLoading, error } = useAllUserQuery();

  console.log(allUsers?.data, "This is all users");

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getSubscriptionStatus = (user) => {
    if (user.isPremium) {
      return "Active";
    } else {
      return "Free";
    }
  };

  const getSubscriptionColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Free":
        return "gray";
      default:
        return "gray";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "success";
      case "user":
        return "primary";
      default:
        return "gray";
    }
  };

  // Use real data from API or fallback to empty array
  const usersData = allUsers?.data || [];

  // Filter users based on search term and subscription filter
  const filteredUsers = useMemo(() => {
    return usersData.filter((user) => {
      const matchesSearch = 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        subscriptionFilter === "all" ||
        (subscriptionFilter === "subscribed" && user.isPremium) ||
        (subscriptionFilter === "not-subscribed" && !user.isPremium);

      return matchesSearch && matchesFilter;
    });
  }, [usersData, searchTerm, subscriptionFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  if (isLoading) {
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
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading users...</div>
        </div>
      </div>
    );
  }

  if (error) {
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
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-red-500">Error loading users</div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            All Users
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage and view all user accounts - {filteredUsers.length} total users
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* <button 
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-theme-sm font-medium text-gray-800 shadow-theme-xs hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#FFD700' }}
          >
            Add User
          </button> */}
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
              className="w-full sm:w-64 rounded-lg bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 placeholder-gray-400 shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:placeholder-gray-500 dark:focus:ring-blue-600"
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
              className="rounded-lg bg-white px-3 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-blue-600"
            >
              <option value="all">All Users</option>
              <option value="subscribed">Premium Users</option>
              <option value="not-subscribed">Free Users</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {currentUsers.length} of {filteredUsers.length} users
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
                Role
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
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {currentUsers.map((user) => (
              <TableRow key={user._id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {user.firstName} {user.lastName}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {user.isVerified ? "Verified" : "Not Verified"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {user.email}
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    size="sm"
                    color={getRoleColor(user.role)}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    size="sm"
                    color={getSubscriptionColor(getSubscriptionStatus(user))}
                  >
                    {getSubscriptionStatus(user)}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {formatDate(user.createdAt)}
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

        {currentUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {usersData.length === 0 ? "No users found." : "No users found matching your criteria."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination - Only show if there are users */}
      {filteredUsers.length > 0 && (
        <div className="flex flex-col gap-4 items-center justify-between mt-4 sm:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} results
          </p>
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-theme-sm font-medium text-gray-700 hover:opacity-90 transition-opacity ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{ backgroundColor: '#FFD700' }}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-theme-sm font-medium hover:opacity-90 transition-opacity ${
                  currentPage === page
                    ? 'border-gray-800 text-gray-800'
                    : 'border-gray-300 text-gray-700'
                }`}
                style={{ backgroundColor: '#FFD700' }}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-theme-sm font-medium text-gray-700 hover:opacity-90 transition-opacity ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{ backgroundColor: '#FFD700' }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUser;