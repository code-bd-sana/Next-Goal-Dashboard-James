'use client'
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useAdminAllPaymentHistoryQuery, useMyAllPaymentHistoryQuery } from '@/feature/SubscriptionApi';
import { useSession } from 'next-auth/react';

// Define the TypeScript interface for payment data


const PaymentHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const userData = useSession();
  const email = userData?.data?.user?.email;
  const role = userData?.data?.user?.role;
  
  console.log(email, "This is user data");
  console.log(role, "User role");

  // User payment history query
  const { 
    data: paymentHistory, 
    isError, 
    error, 
    isLoading 
  } = useMyAllPaymentHistoryQuery(email, {
    skip: !email || role === "admin",
  });

  // Admin payment history query
  const {
    data: adminPaymentHistory, 
    isError: adminIsError, 
    error: adminError, 
    isLoading: adminIsLoading 
  } = useAdminAllPaymentHistoryQuery(undefined, {
    skip: role !== "admin",
  });
  
  if(isError){
    console.log(error, "error in payment history");
  }

  if(adminIsError){
    console.log(adminError, "error in admin payment history");
  }
  
  console.log(paymentHistory?.data, "my payment history");
  console.log(adminPaymentHistory?.data, "admin payment history");

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatAmount = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      case "refunded":
        return "gray";
      default:
        return "gray";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Completed";
      case "pending":
        return "Pending";
      case "failed":
        return "Failed";
      case "refunded":
        return "Refunded";
      default:
        return status;
    }
  };

  // Determine which data to use based on role
  const allPayments = role === "admin" 
    ? adminPaymentHistory?.data || [] 
    : paymentHistory?.data || [];

  const isLoadingData = role === "admin" ? adminIsLoading : isLoading;
  const isErrorData = role === "admin" ? adminIsError : isError;

  // Filter payments based on search term and status filter
  const filteredPayments = useMemo(() => {
    return allPayments.filter((payment) => {
      const matchesSearch = 
        payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.stripeSessionId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = statusFilter === "all" || payment.paymentStatus === statusFilter;

      return matchesSearch && matchesFilter;
    });
  }, [allPayments, searchTerm, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

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

  if (isLoadingData) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Payment History
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {role === "admin" ? "All Users Payment History" : "Your Payment History"}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading payment history...</div>
        </div>
      </div>
    );
  }

  if (isErrorData) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Payment History
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {role === "admin" ? "All Users Payment History" : "Your Payment History"}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-red-500">Error loading payment history</div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Payment History
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {role === "admin" ? "All Users Payment History" : "Your Payment History"} - {filteredPayments.length} total transactions
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder={role === "admin" ? "Search by user email, plan or transaction ID..." : "Search by plan or transaction ID..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 placeholder-gray-400 shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:placeholder-gray-500 dark:focus:ring-blue-600"
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

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-blue-600"
            >
              <option value="all">All Status</option>
              <option value="paid">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {currentPayments.length} of {filteredPayments.length} payments
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
                Transaction ID
              </TableCell>
              {role === "admin" && (
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User
                </TableCell>
              )}
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Plan
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Amount
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Date
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Payment Method
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {currentPayments.map((payment) => (
              <TableRow key={payment._id} className="">
                <TableCell className="py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {payment.stripeSessionId?.slice(0, 12)}...
                </TableCell>
                
                {/* User column only for admin */}
                {role === "admin" && (
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {payment.email?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {payment.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                )}
                
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {payment.plan?.charAt(0) || 'P'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {payment.plan}
                      </p>
                      {role !== "admin" && (
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {formatDate(payment.startDate)} - {formatDate(payment.endDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {formatAmount(payment.price)}
                </TableCell>
                
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {formatDate(payment.createdAt)}
                </TableCell>
                
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  Stripe
                </TableCell>
                
                <TableCell className="py-3">
                  <Badge
                    size="sm"
                    color={getStatusColor(payment.paymentStatus)}
                  >
                    {getStatusText(payment.paymentStatus)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {currentPayments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {allPayments.length === 0 
                ? (role === "admin" ? "No payment history found from any users." : "No payment history found.")
                : "No payments found matching your criteria."
              }
            </p>
          </div>
        )}
      </div>

      {/* Pagination - Only show if there are payments */}
      {filteredPayments.length > 0 && (
        <div className="flex flex-col gap-4 items-center justify-between mt-4 sm:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPayments.length)} of {filteredPayments.length} results
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

export default PaymentHistory;